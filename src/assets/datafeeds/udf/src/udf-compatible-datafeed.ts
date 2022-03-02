import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';

export class UDFCompatibleDatafeed extends UDFCompatibleDatafeedBase {
	public constructor(datafeedURL: string, token : string, updateFrequency: number = 10 * 1000) {
		const requester = new Requester();
		const quotesProvider = new QuotesProvider(datafeedURL, token, requester);
		super(datafeedURL, token, quotesProvider, requester, updateFrequency);
	}
}
