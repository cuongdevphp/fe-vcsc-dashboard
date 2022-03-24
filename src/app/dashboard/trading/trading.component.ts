import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { TradingService } from 'src/app/shared/services/trading.service';
import { ChartingLibraryWidgetOptions, IChartingLibraryWidget, LanguageCode, ResolutionString, widget } from 'src/assets/charting_library/charting_library.min';
@Component({
    templateUrl: './trading.component.html',
    styleUrls: ['./trading.component.css']
})

export class TradingDashboardComponent implements OnInit, OnDestroy  {
    stockCode: any = 'VCI';

    private _symbol: ChartingLibraryWidgetOptions['symbol'] = this.stockCode;
    private _interval: ChartingLibraryWidgetOptions['interval'] = 'D' as ResolutionString;
    // BEWARE: no trailing slash is expected in feed URL
    private _datafeedUrl = 'https://rest.vcsc.com.vn/api/v1/tradingview';
    private _libraryPath: ChartingLibraryWidgetOptions['library_path'] = '/assets/charting_library/';
    private _chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'] = 'https://saveload.tradingview.com';
    private _chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'] = '1.1';
    private _clientId: ChartingLibraryWidgetOptions['client_id'] = 'tradingview.com';
    private _userId: ChartingLibraryWidgetOptions['user_id'] = 'public_user_id';
    private _fullscreen: ChartingLibraryWidgetOptions['fullscreen'] = false;
    private _autosize: ChartingLibraryWidgetOptions['autosize'] = true;
    private _containerId: ChartingLibraryWidgetOptions['container_id'] = 'tv_chart_container';
    private _tvWidget: IChartingLibraryWidget | null = null;

    
    constructor(
        private tradingService: TradingService,
    ) {

    }

    @Input()
    set symbol(symbol: ChartingLibraryWidgetOptions['symbol']) {
        this._symbol = symbol || this._symbol;
    }

    @Input()
    set interval(interval: ChartingLibraryWidgetOptions['interval']) {
        this._interval = interval || this._interval;
    }

    @Input()
    set datafeedUrl(datafeedUrl: string) {
        this._datafeedUrl = datafeedUrl || this._datafeedUrl;
    }

    @Input()
    set libraryPath(libraryPath: ChartingLibraryWidgetOptions['library_path']) {
        this._libraryPath = libraryPath || this._libraryPath;
    }

    @Input()
    set chartsStorageUrl(chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url']) {
        this._chartsStorageUrl = chartsStorageUrl || this._chartsStorageUrl;
    }

    @Input()
    set chartsStorageApiVersion(chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version']) {
        this._chartsStorageApiVersion = chartsStorageApiVersion || this._chartsStorageApiVersion;
    }

    @Input()
    set clientId(clientId: ChartingLibraryWidgetOptions['client_id']) {
        this._clientId = clientId || this._clientId;
    }

    @Input()
    set userId(userId: ChartingLibraryWidgetOptions['user_id']) {
        this._userId = userId || this._userId;
    }

    @Input()
    set fullscreen(fullscreen: ChartingLibraryWidgetOptions['fullscreen']) {
        this._fullscreen = fullscreen || this._fullscreen;
    }

    @Input()
    set autosize(autosize: ChartingLibraryWidgetOptions['autosize']) {
        this._autosize = autosize || this._autosize;
    }

    @Input()
    set containerId(containerId: ChartingLibraryWidgetOptions['container_id']) {
        this._containerId = containerId || this._containerId;
    }

    ngOnInit() {
        function getLanguageFromURL(): LanguageCode | null {
            const regex = new RegExp('[\\?&]lang=([^&#]*)');
            const results = regex.exec(location.search);

            return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode;
        }

        const widgetOptions: ChartingLibraryWidgetOptions = {
            symbol: this._symbol,
            datafeed: new (window as any).Datafeeds.UDFCompatibleDatafeed(this._datafeedUrl),
            interval: this._interval,
            container_id: this._containerId,
            library_path: this._libraryPath,
            locale: getLanguageFromURL() || 'vi',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: this._chartsStorageUrl,
            charts_storage_api_version: this._chartsStorageApiVersion,
            client_id: this._clientId,
            user_id: this._userId,
            theme: 'Light',
            fullscreen: this._fullscreen,
            autosize: this._autosize,
        };

        const tvWidget = new widget(widgetOptions);
        this._tvWidget = tvWidget;

        // tvWidget.onChartReady(() => {
        //     tvWidget.headerReady().then(() => {
        //         const button = tvWidget.createButton();
        //         button.setAttribute('title', 'Click to show a notification popup');
        //         button.classList.add('apply-common-tooltip');
        //         button.addEventListener('click', () => tvWidget.showNoticeDialog({
        //                 title: 'Notification',
        //                 body: 'TradingView Charting Library API works correctly',
        //                 callback: () => {
        //                     console.log('Noticed!');
        //                 },
        //             }));
        //         button.innerHTML = 'Check API';
        //     });
        // });
        this.loadStockList();
    }

    ngOnDestroy() {
        if (this._tvWidget !== null) {
            this._tvWidget.remove();
            this._tvWidget = null;
        }
    }

    typeOptionOrder: number = 0;
    optionOrder (value) {
        console.log(value, 'value');
        this.typeOptionOrder = value;
    }

    lstStockCode: any = [];
    loadStockList(): void {
        this.tradingService.getStockList()
        .subscribe(data => {
            this.lstStockCode = data;
            console.log(data, 'data');
        });
    }

    changeStock (e): void {
		if(this._tvWidget) {
			this._tvWidget.setSymbol(e, 'D', () => {
				//todo
			});
		}
        this.stockCode = e;
        console.log(e, 'e');
    }

    onChangTabs(args: any[]): void {
        console.log(args[0].index);
        switch (args[0].index) {
            case 0:
                console.log()
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                break;
        }
    }
}