import {HttpClient, Options, UserOptions, LugathException, TranslateClientReqOptions, IIndexable} from "./types";
import {Https} from "./utils/https";
import {Fetch} from "./utils/fetch";
import { resolve } from "path";


export class Lugath {
    private readonly http: HttpClient;
    private options: Options;

    constructor(userOptions: UserOptions) {
        
        this.options = {
            API_URL:'api.lugath.com',
            AUTH_URL:'auth.lugath.com',
            AUTH_OPTIONS:{
                SCOPE:'email',
                CLIENT_ID:userOptions.API_KEY,
                CLIENT_SECRET: userOptions.API_SECRET,
                GRANT_TYPE:'client_credentials'
            }
        };
        
        const headers: any = {
            "clientID": userOptions.API_KEY,
            "clientSecret": userOptions.API_SECRET
        };

        this.http = (typeof fetch === 'function') ? new Fetch(
            this.options, 
            this.urlParser(this.options.API_URL, {}, true, 'https://'), 
            headers 
        ) : new Https(
            this.options, 
            this.options.API_URL, 
            headers
        );
    }

    getLanguage(languageID:string): Promise<string[]> {
        return this.http.dispatch( "GET", this.urlParser("/languages/{{languageID}}", {languageID:languageID}));
    }

    listGlossaries(): Promise<string[]> {
        return this.http.dispatch("GET", "/glossaries");
    }

    listSupportedLanguages(): Promise<string[]> {
        return this.http.dispatch("GET", "/languages");
    }

    translate(translateClientReqOptions:TranslateClientReqOptions): Promise<any> {
        if(this.isValidRequestData(translateClientReqOptions)){
            
            const res = this.http.dispatch("POST", "/translation-requests", this.checkTranslationReqIsMissingAttribute(translateClientReqOptions))
            return res.then((r) => this.handleResponseByType("translation-requests", r))
        
        } else {
            return Promise.resolve({
                status:400,
                type:"Error",
                code: 'C-26',
                reason:"Missing Attribute",
                messages:[  "from, to, text and category attributes can not be blank." ]
            });
        }
    }
   
    handleResponseByType(targetEndpoint:string, r:any){
        if(r.status === 400){
            return Promise.reject(r)
        } else if(r.status === 200) {
            return Promise.resolve(r)
        } else {
            return Promise.resolve(r)
        }
    }

    isValidRequestData(translateClientReqOptions:TranslateClientReqOptions){
        return (
            translateClientReqOptions.from && 
            translateClientReqOptions.to && 
            translateClientReqOptions.text && 
            translateClientReqOptions.category
        )
    }

    checkTranslationReqIsMissingAttribute(translateClientReqOptions:TranslateClientReqOptions){
         const mandatoryOptions =  {
            "title": this.options.AUTH_OPTIONS.CLIENT_ID+'req-from_nodejs-sdk',
            "description": "_from:"+translateClientReqOptions.from+"_to:"+translateClientReqOptions.to.join('-'),
            "sourceLanguageCode": translateClientReqOptions.from,
            "sourceContent": translateClientReqOptions.text,
            "targetLanguageCodeList": translateClientReqOptions.to,
            "industryName":translateClientReqOptions.category,
            "tierType": "AUTO"
        }

        return translateClientReqOptions.options ? {...mandatoryOptions, ...{
            "glossaryIdList":translateClientReqOptions.options.glossaryIDs || [],
            "translationRequestType": translateClientReqOptions.options.translationRequestType || "STRING",
            "useBestMatch":translateClientReqOptions.options.useBestMatch || true,
            "customMTEngineName":translateClientReqOptions.options.useBestMatch ? null : translateClientReqOptions.options.customMTEngineName,
            }
        } : mandatoryOptions;
    }

    
            
    urlParser(str:string, data:IIndexable, protocol?:boolean, layer?:string ){
        const url = str.replace(/\{\{(.*?)\}\}/g, function(match:string, token:string) {
            return data[token];
        });
        return protocol ? layer + url : url;
    }

}