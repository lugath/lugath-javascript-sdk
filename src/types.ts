/** @internal */


export class AccessToken {
    public readonly status?: number;
    public readonly error?: string;
    public readonly error_description?: string;
    public readonly access_token: string;
    public readonly expires_in: number;
    public readonly refresh_expires_in: number;
    public readonly refresh_token: string;
    public readonly token_type: string;
    public readonly not_before_policy: number;
    public readonly session_state: string;
    public readonly scope: string;
    
    constructor(data: any) {
        if (data.status) this.status = data.status;
        if (data.error) this.error = data.error;
        if (data.error_description) this.error_description = data.error_description;
        this.status = data.status;
        this.access_token = data.access_token;
        this.expires_in = data.expires_in;
        this.refresh_expires_in = data.refresh_expires_in;
        this.refresh_token = data.refresh_token;
        this.token_type = data.token_type;
        this.not_before_policy = data.not_before_policy;
        this.session_state = data.session_state;
        this.scope = data.scope;
    }
}

export interface Options {
    API_KEY: string,
    API_SECRET: string
}

export interface HttpClient {
    send: (tokens: AccessToken, method: string, path: string, data?: any, files?: any) => Promise<any>,
    dispatch: (options: Options, method: string, path: string, data?: any, files?: any) => Promise<any>,
    authenticate:(options: Options) => Promise<any>
}

export class LugathException extends Error {

    public readonly response: any;

    constructor(response: any) {
        super(response);
        this.response = response;
    }
}

export class LugathAuthException extends Error {

    public readonly type?: string;
    public readonly description?: string;

    constructor(type: string, description: string) {
        super(description);
        if (type) this.type = type;
        if (description) this.description = description;
    }
}

