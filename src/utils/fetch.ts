import {LugathException, Options,  HttpClient} from "../types";

/** @internal */
export class Fetch implements HttpClient {

    private readonly baseUrl: string;
    private readonly headers: any;
    private readonly options: any;
    private tokens: any;

    constructor(options:Options, baseUrl: string, headers?: any) {
        this.baseUrl = baseUrl;
        this.options = options;
        this.headers = headers;
    }

    async dispatch(method: string, path: string, data?: any, files?: any): Promise<any> {
        
        return this.tokens ? this.send(method, path) : this.authenticate().then((r) => {
            this.tokens = r;
            return this.send(method, path);
        })
    }


    async send(method: string, path: string, data?: any, files?: any): Promise<any> {
        const endpoint = `${this.baseUrl}${path}`;
        const options: any = {
            headers: {
                ...this.headers
            },
            method: method
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

                formData.append(key, <any>value);
            }

            options.body = formData;
        }
        else {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
        }

        const res = await fetch(endpoint, options);
        const json = await res.json();

        if (json.status >= 300 || json.status < 200)
            throw new LugathException(json);

        return json.data;
    }

    async authenticate(): Promise<any> {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("scope", "email");
        urlencoded.append("client_id", "61bb0eaa38271b6930b17b28");
        urlencoded.append("client_secret", "ac42424e-2a64-44fe-82d5-cc4cecc2669f");
        urlencoded.append("grant_type", "client_credentials");

        const requestOptions:any = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://auth.lugath.com/auth/realms/translate/protocol/openid-connect/token", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
}


