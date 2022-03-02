import { UdfQuotesResponse, IQuotesProvider } from './iquotes-provider';
import { QuoteData } from '../../../charting_library/datafeed-api';

import {
	getErrorMessage,
	logMessage,
	UdfErrorResponse,
} from './helpers';
import { Requester } from './requester';

export class QuotesProvider implements IQuotesProvider {
	private readonly _datafeedUrl: string;
	private readonly _requester: Requester;
	private readonly _token: string;

	public constructor(datafeedUrl: string, token: string, requester: Requester) {
		this._datafeedUrl = datafeedUrl;
		this._requester = requester;
		this._token = token;
	}

	public getQuotes(symbols: string[]): Promise<QuoteData[]> {
		return new Promise((resolve: (data: QuoteData[]) => void, reject: (reason: string) => void) => {
			this._requester.sendRequest<UdfQuotesResponse>(this._datafeedUrl, this._token, 'quotes', { symbols: symbols })
				.then((response: UdfQuotesResponse | UdfErrorResponse) => {
					if (response.s === 'ok') {
						resolve(response.d);
					} else {
						reject(response.errmsg);
					}
				})
				.catch((error?: string | Error) => {
					const errorMessage = getErrorMessage(error);
					logMessage(`QuotesProvider: getQuotes failed, error=${errorMessage}`);
					reject(`network error: ${errorMessage}`);
				});
		});
	}
}
