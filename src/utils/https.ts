import {LugathAuthException,LugathException, HttpClient, Options, AccessToken} from "../types";
import {request} from "https";
import FormData from "form-data";
import qs from "querystring";

/** @internal */
export class Https implements HttpClient {

    private readonly host: string;
    private readonly headers: any;
    private tokens: any;

    constructor(host: string, headers?: any) {
        this.host = host;
        this.headers = headers;
    }

    dispatch(options: Options, method: string, path: string, data?: any, files?: any): Promise<any> {
        
        if(this.tokens){
            console.log("exist");
           return this.send(this.tokens, "GET", "/api/languages");
        } else {
            console.log("not exist");
            const authenticate = this.authenticate(options);
            return authenticate.then((r) => {
                this.tokens = r;
                return this.send(this.tokens, "GET", "/api/languages");
            });

            
        }


    }

    send(tokens: AccessToken, method: string, path: string, data?: any, files?: any): Promise<any> {
        
        console.log('TOKENS', this.tokens);
        
        const options = {
            host: this.host,
            headers: {
                ...this.headers,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.tokens.access_token}`,
                "X-HTTP-Method-Override": method
            },
            method: method,
            path
        };

        console.log(options);

        let formData: FormData;
        if (files) {
            const form = {
                ...data,
                ...files
            };
            formData = new FormData();

            for (let [key, value] of Object.entries(form)) {
                if (value === undefined)
                    continue;
                if (Array.isArray(value))
                    value = value.join(",");

                formData.append(key, value);
            }

            delete options.headers["Content-Type"];
            options.headers = {
                ...options.headers,
                ...formData.getHeaders()
            };
        }

        return new Promise((resolve, reject) => {
            const req = request(options, (res) => {
                let chunks:any = [];

                res.on("data", (chunk:any) => {
                    chunks.push(chunk);
                });

                res.on("end", function (chunk:any) {
                    const body:any = Buffer.concat(chunks);
                    const json:AccessToken = JSON.parse(body);
                    if(json.error && json.error_description){
                        reject(new LugathException(json));
                    }
                    resolve(json);
                });

            });

            req.on("error", (e) => {
                reject(e);
            });

            if (data && !formData) {
                req.write(Buffer.from(JSON.stringify(data)));
                req.end();
            }
            else if (formData)
                formData.pipe(req);
            else
                req.end();
        });
    }

    authenticate(options:Options): Promise<any> {
        console.log("authenticate");

        const updatedOptions = {
            'method': 'POST',
            'hostname': 'keycloak.lugath.com',
            'path': '/auth/realms/translate/protocol/openid-connect/token',
            'headers': {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            'maxRedirects': 20
        };

        
        return new Promise((resolve, reject) => {
           

            const req = request(updatedOptions, (res:any) => {
                let chunks:any = [];
            
                res.on("data",(chunk:any) => {
                    chunks.push(chunk);
                });
            
                res.on("end", function (chunk:any) {
                const body:any = Buffer.concat(chunks);
                const json:AccessToken = JSON.parse(body);
                //console.log("response from auth", json);
                if(json.error && json.error_description){
                    reject(new LugathAuthException(json.error, json.error_description));
                }
                resolve(json);
                });
            
                res.on("error", function (error:any) {
                    console.log('error', error);
                    console.error(error);
                });

               
            });
  
            const postData = qs.stringify({
                'scope': 'email',
                'client_id': options.API_KEY,
                'client_secret': options.API_SECRET,
                'grant_type': 'client_credentials'
              });

            req.write(postData);

            req.end();



        });
    }

}
