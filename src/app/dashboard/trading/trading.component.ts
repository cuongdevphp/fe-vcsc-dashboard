import { Component, OnInit, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { UsersService } from 'src/app/shared/services/users.service';

declare const TradingView: any;

@Component({
    templateUrl: './trading.component.html'
})

export class TradingDashboardComponent implements OnInit, AfterViewInit {
    ngOnInit() {

    }
    ngAfterViewInit() {
        
		// interval: 'D',
		// containerId: 'tv_chart_container',
		// // datafeedUrl: 'https://demo_feed.tradingview.com',
		// datafeedUrl: `${BASE_URL_CORE}/tradingview`,
		// libraryPath: '/charting_library/',
		// chartsStorageUrl: 'https://saveload.tradingview.com',
		// chartsStorageApiVersion: '1.1',
		// clientId: 'tradingview.com',
		// userId: 'public_user_id',
		// timezone: "Asia/Ho_Chi_Minh",
		// fullscreen: false,
		// autosize: true,
		// studiesOverrides: {}
        new TradingView.widget(
            {
                "interval": "D",
                "containerId": 'tv_chart_container',
                "datafeedUrl": 'https://demo_feed.tradingview.com',
                //"libraryPath": '/charting_library',
                "chartsStorageUrl": 'https://saveload.tradingview.com',
                "chartsStorageApiVersion": '1.1',
                "clientId": 'tradingview.com',
                "userId": 'public_user_id',
                "timezone": "Asia/Ho_Chi_Minh",
                "fullscreen": false,
                "studiesOverrides": {},

                "width": 980,
                "height": 610,
                "symbol": "BTCUSDT",
                "theme": "Dark",
                "style": "1",
                "locale": "vi",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "withdateranges": true,
                "range": "ytd",
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "show_popup_button": true,
                "popup_width": "1000",
                "popup_height": "650",
                "no_referral_id": true,
                "container_id": "tradingview_bac65"
            }
        );
    }
}