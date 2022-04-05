import {LugathAuthException,LugathException, HttpClient, Options, AccessToken} from "../types";
import {request} from "https";
import FormData from "form-data";
import qs from "querystring";

/** @internal */
export class Https implements HttpClient {

    private readonly host: string;
    private readonly headers: any;
    private readonly options: any;
    private tokens: any;

    constructor(options:Options, host: string, headers?: any) {
        this.host = host;
        this.options = options;
        this.headers = headers;
    }

    dispatch(method: string, path: string, data?: any, files?: any): Promise<any> {
        return this.tokens ? this.send(method, path, data, files) : this.authenticate().then((r) => {
            this.tokens = r;
            return this.send(method, path, data, files);
        })
    }

    send(method: string, path: string, data?: any, files?: any): Promise<any> {
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

    authenticate(): Promise<any> {

        const updatedOptions = {
            'method': 'POST',
            'hostname': this.options.AUTH_URL,
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
                if(json.error && json.error_description){
                    reject(new LugathAuthException(json.error, json.error_description));
                }
                resolve(json);
                });
            
                res.on("error", function (error:any) {
                    return new LugathException(error)
                });

               
            });
  
            const postData = qs.stringify({
                'scope': this.options.AUTH_OPTIONS.SCOPE,
                'client_id': this.options.AUTH_OPTIONS.CLIENT_ID,
                'client_secret': this.options.AUTH_OPTIONS.CLIENT_SECRET,
                'grant_type': this.options.AUTH_OPTIONS.GRANT_TYPE
              });

            req.write(postData);

            req.end();



        });
    }

}
