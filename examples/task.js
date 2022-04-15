const fs = require('fs');
const Lugath = require('lugath');


const OPTIONS = {
  API_KEY : "YOUR_CLIENT_ID",
  API_SECRET : "YOUR_CLIENT_SECRET",
}

const lugath = new Lugath(OPTIONS);
const languageFilesPath = './locales';
const sourceLanguage = "es";


const sendRequestToService = (from, to, text, field) => {
  const req = lugath.translate({
    "from":from,
    "to":[to],
    "text":text,
    "category":"Consumer Electronics"
  })
  return req.then((r) => handleResponseByType(r, field))
}

const handleResponseByType  = (r, field) => {
  if(r.status === 200 && r.translationList){
    return Promise.resolve({text:r.translationList[0].targetContent, field:field})
  } else if(r.status === 400) {
    return Promise.reject(r)
  } else {
    return Promise.resolve(r)
  }
}

const fileObjs = fs.readdirSync(languageFilesPath, { withFileTypes: true });

fileObjs.filter((f) => (! /^\..*/.test(f.name))).forEach((file) => {
    const targetLanguage = file.name;
    const sourceFilePath = `${languageFilesPath}/${sourceLanguage}/translation.json`;
    const targetLanguageFile = fs.readFileSync(sourceFilePath, {encoding:'utf8', flag:'r'});
    const targetLanguageFileData = JSON.parse(targetLanguageFile);
    
    if(targetLanguage !== sourceLanguage) {
      const keys = Object.keys(targetLanguageFileData);
      const values = Object.values(targetLanguageFileData);
      const chained =  values.map((t,i) => sendRequestToService(sourceLanguage, targetLanguage, t, keys[i]))
      
      Promise.all(chained).then((responses) => {

        responses.map((r) => {
          targetLanguageFileData[r.field] = r.text;
        })

        const targetFilePath = `${languageFilesPath}/${targetLanguage}/translation.json`;
        fs.writeFileSync(targetFilePath, JSON.stringify(targetLanguageFileData));
        console.log('targetLanguage : ' + targetLanguage + ' > ', JSON.parse(fs.readFileSync(targetFilePath, {encoding:'utf8', flag:'r'})));
      }).catch((err) => {
        console.log(err);
      })
    } 
});



