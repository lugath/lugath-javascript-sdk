import {HttpClient, Options} from "./types";
import {Https} from "./utils/https";
import {Fetch} from "./utils/fetch";


export class Lugath {
    private readonly http: HttpClient;
    private options: Options;

    constructor(options: Options) {
        this.options = options;
        const headers: any = {
            "clientID": options.API_KEY,
            "clientSecret": options.API_SECRET
        };

        if (typeof fetch === "function"){
            this.http = new Fetch("https://api.lugath.com", headers);
        } else {
            this.http = new Https("api.lugath.com", headers);
        }
    }

    listSupportedLanguages(): Promise<string[]> {
        return this.http.dispatch(this.options, "get", "/api/languages");
    }

    fakeTest() {
        console.log(this);
        console.log("fakeTest called");
    }
}