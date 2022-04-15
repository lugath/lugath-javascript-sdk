const fs = require('fs');
const Lugath = require('lugath');


const OPTIONS = {
    API_KEY : "YOUR_CLIENT_ID",
    API_SECRET : "YOUR_CLIENT_SECRET",
  }

const lugath = new Lugath(OPTIONS);



const sendRequestToService = (from, to, text, field) => {
  const req = lugath.translate({
    "from":from,
    "to":[to],
    "text":text,
    "category":"Consumer Electronics"
  })
  return req.then((r) => handleResponse(r))
}

const handleResponse  = (r) => {
  if(r.status === 200 && r.translationList){
    return Promise.resolve({text:r.translationList[0].targetContent})
  } else if(r.status === 400) {
    return Promise.reject(r)
  } else {
    return Promise.resolve(r)
  }
}

sendRequestToService("en", "es", "hello world!").then((r) => console.log(r))





