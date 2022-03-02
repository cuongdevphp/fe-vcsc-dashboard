import { RequestParams, UdfResponse, UdfErrorResponse, logMessage } from './helpers';

export class Requester {
	private _headers: HeadersInit | undefined;

	public constructor(headers?: HeadersInit) {
		if (headers) {
			this._headers = headers;
		}
	}

	// getToken(){
	// 	const res = fetch('https://trading.vcsc.com.vn/rest/api/v1/login', {
	// 		method: 'POST',
	// 		body: {
	// 			"grant_type": "client_credentials", 
	// 			"client_id": "vcsc-rest", 
	// 			"client_secret": "YRSfIzjbQgUaunSAolSjEWnaAAsRZUmzvzdcblbcrBqqzRGYyckXJKrEciCDWKTP",
	// 		}
	// 	})
	// 		.then((response: Response) => response.text())
	// 		.then((responseTest: string) => JSON.parse(responseTest));
	// }

	public sendRequest<T extends UdfResponse>(datafeedUrl: string, token: string, urlPath: string, params?: RequestParams): Promise<T | UdfErrorResponse>;
	public sendRequest<T>(datafeedUrl: string, token: string, urlPath: string, params?: RequestParams): Promise<T>;
	public sendRequest<T>(datafeedUrl: string, token: string, urlPath: string, params?: RequestParams): Promise<T> {
		if (params !== undefined) {
			const paramKeys = Object.keys(params);
			if (paramKeys.length !== 0) {
				urlPath += '?';
			}

			urlPath += paramKeys.map((key: string) => {
				return `${encodeURIComponent(key)}=${encodeURIComponent(params[key].toString())}`;
			}).join('&');
		}

		logMessage('New request: ' + urlPath);

		// Send user cookies if the URL is on the same origin as the calling script.
		const options: RequestInit = { credentials: 'same-origin' };

		if (this._headers !== undefined) {
			options.headers = {
				...this._headers,
				'Authorization': `jwt ${token}`,
				'Content-Type': 'application/json'
			}
		}else{
			options.headers = {
				'Authorization': `jwt ${token}`,
				'Content-Type': 'application/json'
			}
		}

		return fetch(`${datafeedUrl}/${urlPath}`, options)
			.then((response: Response) => response.text())
			.then((responseTest: string) => JSON.parse(responseTest));
	}
}
