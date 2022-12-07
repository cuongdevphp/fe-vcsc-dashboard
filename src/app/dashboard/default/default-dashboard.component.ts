import { Component, OnInit } from '@angular/core'
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { StatisticService } from 'src/app/shared/services/statistic.service';
import { differenceInCalendarDays } from 'date-fns';
import * as moment from 'moment';

@Component({
    templateUrl: './default-dashboard.component.html',
})

export class DefaultDashboardComponent implements OnInit {
    doughnutWeb: number = 0;
    doughnutiOS: number = 0;
    doughnutiPad: number = 0;
    doughnutAndroid: number = 0;
    doughnutQuay: number = 0;
    doughnutvPro: number = 0;
    doughnutTechx: number = 0;
    
    total: number = 0;
    pluginsDoughnut: any = [{}];

    barMax: number = 0;

    webSession: number = 0;
    lotteSession: number = 0;
    vproSession: number = 0;
    androidSession: number = 0;
    isSpinningSessionLogin: boolean = false;
    maxSessionLogin: number = 0;
    dateFormat = 'dd/MM/yyyy';
    selectWeekSessionLoginWeek = new Date();
    dateRangeSessionLogin = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date(new Date().setDate(new Date().getDate() + 1))];


    today = new Date();
    disabledWeekSessionLoginWeek = (current: Date): boolean => differenceInCalendarDays(current, this.today) > 0;

    startWeekDate = moment(new Date()).startOf("week").toDate();
    dateWeekEnd = moment(new Date()).endOf("week").toDate();

    themeColors = this.colorConfig.get().colors;    
    blue = this.themeColors.blue;
    blueLight = this.themeColors.blueLight;

    cyan = this.themeColors.cyan;
    cyanLight = this.themeColors.cyanLight;

    gold = this.themeColors.gold;

    purple = this.themeColors.purple;
    purpleLight = this.themeColors.purpleLight;

    yellow = this.themeColors.yellow;
    yellowLight = this.themeColors.yellowLight;

    red = this.themeColors.red;

    volcano = this.themeColors.volcano;
    grayLight = this.themeColors.grayLight;

    lime = this.themeColors.lime;
    dark = this.themeColors.dark;

    taskListIndex: number = 0;

    constructor( 
        private colorConfig:ThemeConstantService,
        private statisticService: StatisticService,
    ) {}
    
    // Doughnut Chart
    customersChartLabels: string[] = ['iOS', 'Android', 'vPro', 'Web', 'Quầy', 'iPad', 'TechX'];
    customersChartData: number[] = [0, 0, 0, 0, 0, 0, 0];
    customersChartColors: Array<any> = [{ 
        backgroundColor: [this.blue, this.volcano, this.lime, this.cyan, this.dark, this.purple, this.yellow],
        pointBackgroundColor : [this.cyan, this.purple, this.gold, this.gold, this.gold, this.gold, this.gold]
    }];
    customersChartOptions: any = {
    }
    customersChartType = 'doughnut';

    ngOnInit(): void {
        this.loadSessionLogin(this.dateRangeSessionLogin[0], this.dateRangeSessionLogin[1], this.startWeekDate, this.dateWeekEnd);
        this.pluginsDoughnut = [{
            beforeDraw: async function(chart) {
                const width = chart.chart.width;
                const height = chart.chart.height;
                const ctx = chart.chart.ctx;
                ctx.restore();
                const fontSize = (height / 114).toFixed(2);
                ctx.font = `${fontSize}em sans-serif`;
                ctx.textBaseline = 'middle';
                const text = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
                const textX = Math.round((width - ctx.measureText(text).width) / 2);
                const textY = height / 2;
                ctx.fillText(text, textX, textY);
                ctx.save();
            }
        }];
    }

    // canDeactivate: NzTabsCanDeactivateFn = (fromIndex: number, toIndex: number) => {
    //     console.log(fromIndex,'fromindex');
    //     switch (fromIndex) {
    //       case 0:
    //         return toIndex === 1;
    //       case 1:
    //         return Promise.resolve(toIndex === 2);
    //       case 2:
    //         return false;
    //       default:
    //         return true;
    //     }
    // };

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
    
        
    refresh(): void {
        this.selectWeekSessionLoginWeek = new Date();
        this.loadSessionLogin(this.dateRangeSessionLogin[0], this.dateRangeSessionLogin[1], this.startWeekDate, this.dateWeekEnd);
    }
    
    onChangeDateRangeSessionLogin(result: Date[]): void {
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadSessionLogin(result[0], result[1], this.startWeekDate, this.dateWeekEnd);
    }

    onChangeWeekSessionLogin(result: Date): void {
        const startWeek = moment(result).startOf("week").toDate();
        const endWeek = moment(result).endOf("week").toDate();
        this.loadSessionLogin(this.dateRangeSessionLogin[0], this.dateRangeSessionLogin[1], startWeek, endWeek);
    }

    loadSessionLogin( 
        startDate: Date | null,
        endDate: Date | null, 
        startWeekDate: Date | null, 
        endWeekDate: Date | null, 
    ): void {
        this.isSpinningSessionLogin = true;
        this.statisticService.getSessionLogin(startDate, endDate, startWeekDate, endWeekDate)
        .subscribe(result => {
            if(result.success) {
                const webDateRange = [];
                const iosDateRange = [];
                const androidDateRange = [];
                const vproDateRange = [];
                const ipadDateRange = [];
                const quayDateRange = [];
                const dateDateRange = [];
                const totalDateRange = [];
                const techxDateRange = [];
                for(const i of result.data.dateRange) {
                    webDateRange.push(i.web);
                    iosDateRange.push(i.ios);
                    androidDateRange.push(i.android);
                    vproDateRange.push(i.vpro);
                    quayDateRange.push(i.quay);
                    ipadDateRange.push(i.ipad);
                    dateDateRange.push(i.dateChart);
                    techxDateRange.push(i.techx);
                    const t = i.web + i.ios + i.android + i.vpro + i.quay + i.ipad + i.techx;
                    totalDateRange.push(t);
                }
                this.lineChartData = [
                    { 
                        data: iosDateRange, 
                        label: 'iOS' 
                    },
                    { 
                        data: androidDateRange, 
                        label: 'Android' 
                    },
                    { 
                        data: vproDateRange, 
                        label: 'vPro' 
                    },
                    {
                        data: webDateRange, 
                        label: 'Web' 
                    },
                    { 
                        data: quayDateRange, 
                        label: 'Quầy' 
                    },
                    { 
                        data: ipadDateRange, 
                        label: 'iPad' 
                    },
                    { 
                        data: techxDateRange, 
                        label: 'TechX' 
                    },
                    {
                        label: "Total",
                        data: totalDateRange,
                        type: "line",
                        showLines: false,
                    }
                ];
                
                const webWeekRange = [];
                const iosWeekRange = [];
                const androidWeekRange = [];
                const vproWeekRange = [];
                const ipadWeekRange = [];
                const quayWeekRange = [];
                const techxWeekRange = [];
                const dateWeekRange = [];

                let monTotal = 0;
                let tueTotal = 0;
                let wedTotal = 0;
                let thuTotal = 0;
                let friTotal = 0;
                let staTotal = 0;
                let sunTotal = 0;

                if(result.data.week.length > 0) {
                    for(const i of result.data.week) {
                        webWeekRange.push(i.web);
                        iosWeekRange.push(i.ios);
                        androidWeekRange.push(i.android);
                        vproWeekRange.push(i.vpro);
                        quayWeekRange.push(i.quay);
                        ipadWeekRange.push(i.ipad);
                        techxWeekRange.push(i.techx);
                        dateWeekRange.push(i.dateChart);
                    }
                    monTotal = techxWeekRange[0] + webWeekRange[0] + iosWeekRange[0] + androidWeekRange[0] + vproWeekRange[0] + quayWeekRange[0] + ipadWeekRange[0];
                    tueTotal = techxWeekRange[1] + webWeekRange[1] + iosWeekRange[1] + androidWeekRange[1] + vproWeekRange[1] + quayWeekRange[1] + ipadWeekRange[1];
                    wedTotal = techxWeekRange[2] + webWeekRange[2] + iosWeekRange[2] + androidWeekRange[2] + vproWeekRange[2] + quayWeekRange[2] + ipadWeekRange[2];
                    thuTotal = techxWeekRange[3] + webWeekRange[3] + iosWeekRange[3] + androidWeekRange[3] + vproWeekRange[3] + quayWeekRange[3] + ipadWeekRange[3];
                    friTotal = techxWeekRange[4] + webWeekRange[4] + iosWeekRange[4] + androidWeekRange[4] + vproWeekRange[4] + quayWeekRange[4] + ipadWeekRange[4];
                    staTotal = techxWeekRange[5] + webWeekRange[5] + iosWeekRange[5] + androidWeekRange[5] + vproWeekRange[5] + quayWeekRange[5] + ipadWeekRange[5];
                    sunTotal = techxWeekRange[6] + webWeekRange[6] + iosWeekRange[6] + androidWeekRange[6] + vproWeekRange[6] + quayWeekRange[6] + ipadWeekRange[6];
                    
                }
                this.barChartData = [
                    {
                        data: iosWeekRange,
                        label: 'iOS',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: androidWeekRange,
                        label: 'Android',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: vproWeekRange,
                        label: 'vPro',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: webWeekRange,
                        label: 'Web',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: quayWeekRange,
                        label: 'Quầy',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: ipadWeekRange,
                        label: 'iPad',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        data: techxWeekRange,
                        label: 'TechX',
                        categoryPercentage: 0.45,
                        barPercentage: 0.70,
                    },
                    {
                        label: "Total",
                        data: [monTotal, tueTotal, wedTotal, thuTotal, friTotal, staTotal, sunTotal],
                        type: "line",
                        showLines: false,
                    }
                ];
                if(result.data.today.length > 0) {
                    this.doughnutWeb = result.data.today[0].web;
                    this.doughnutiOS = result.data.today[0].ios;
                    this.doughnutiPad = result.data.today[0].ipad;
                    this.doughnutAndroid = result.data.today[0].android;
                    this.doughnutQuay = result.data.today[0].quay;
                    this.doughnutvPro = result.data.today[0].vpro;
                    this.doughnutTechx = result.data.today[0].techx;
    
                    this.customersChartData = [
                        result.data.today[0].ios, 
                        result.data.today[0].android, 
                        result.data.today[0].vpro, 
                        result.data.today[0].web, 
                        result.data.today[0].quay, 
                        result.data.today[0].ipad,
                        result.data.today[0].techx,
                    ];
                }

                this.lineChartLabels = dateDateRange;
                this.barMax = 500;
                this.isSpinningSessionLogin = false;
                this.barChartOptions = {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Month'
                            },
                            gridLines: false,
                            ticks: {
                                display: true,
                                beginAtZero: true,
                                fontSize: 13,
                                padding: 10
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: false,
                                labelString: 'Value'
                            },
                            gridLines: {
                                drawBorder: false,
                                offsetGridLines: false,
                                drawTicks: false,
                                borderDash: [3, 4],
                                zeroLineWidth: 1,
                                zeroLineBorderDash: [3, 4]
                            },
                            ticks: {
                                max: 1400,                            
                                stepSize: 300,
                                display: true,
                                beginAtZero: true,
                                fontSize: 13,
                                padding: 10
                            }
                        }]
                    },
                };
                
                this.lineChartOptions = {
                    responsive: true,
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    },
                    tooltips: {
                        mode: 'index'
                    },
                    scales: {
                        xAxes: [{ 
                            gridLines: [{
                                display: false,
                            }],
                            ticks: {
                                display: true,
                                fontColor: this.themeColors.grayLight,
                                fontSize: 13,
                                padding: 10
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                drawBorder: false,
                                drawTicks: false,
                                borderDash: [3, 4],
                                zeroLineWidth: 1,
                                zeroLineBorderDash: [3, 4]  
                            },
                            ticks: {
                                display: true,
                                max: 1400,
                                stepSize: 300,
                                fontColor: this.themeColors.grayLight,
                                fontSize: 13,
                                padding: 10
                            }  
                        }],
                    }
                };
            }
        },
    )}
    lineChartData: Array<any> = [
        {
            data: [], 
            label: 'iOS' 
        },
        { 
            data: [], 
            label: 'Android' 
        },
        { 
            data: [], 
            label: 'vPro' 
        },
        {
            data: [], 
            label: 'Web' 
        },
        {
            data: [], 
            label: 'Quầy' 
        },
        {
            data: [], 
            label: 'TechX' 
        },
        {
            data: [], 
            label: 'iPad' 
        },
    ];

    currentLineChartLabelsIdx = 1;

    lineChartLabels:Array<any> = [];
    
    lineChartOptions: any = {};

    lineChartColors: Array<any> = [
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.blue,
            pointBackgroundColor: this.themeColors.blue,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.blueLight,
            pointHoverBorderColor: this.themeColors.blueLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.volcano,
            pointBackgroundColor: this.themeColors.volcano,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.volcanoLight,
            pointHoverBorderColor: this.themeColors.volcanoLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.lime,
            pointBackgroundColor: this.themeColors.lime,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.limeLight,
            pointHoverBorderColor: this.themeColors.limeLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.cyan,
            pointBackgroundColor: this.themeColors.cyan,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.cyanLight,
            pointHoverBorderColor: this.themeColors.cyanLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.dark,
            pointBackgroundColor: this.themeColors.dark,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.magentaLight,
            pointHoverBorderColor: this.themeColors.magentaLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.purple,
            pointBackgroundColor: this.themeColors.purple,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.purpleLight,
            pointHoverBorderColor: this.themeColors.purpleLight
        },
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.themeColors.yellow,
            pointBackgroundColor: this.themeColors.yellow,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.yellowLight,
            pointHoverBorderColor: this.themeColors.yellowLight
        },
    ];
    lineChartLegend = true;
    lineChartType = 'line';

    revenueChartFormat: string = 'revenueMonth';

    revenueChartData: Array<any> = [{ 
        data: [30, 60, 40, 50, 40, 55, 85, 65, 75, 50, 70],
        label: 'Series A' 
    }];
    currentrevenueChartLabelsIdx = 1;
    revenueChartLabels:Array<any> = ["16th", "17th", "18th", "19th", "20th", "21th", "22th", "23th", "24th", "25th", "26th"];
    revenueChartOptions: any = {
        maintainAspectRatio: false,
        responsive: true,
        hover: {
            mode: 'nearest',
            intersect: true
        },
        tooltips: {
            mode: 'index'
        },
        scales: {
            xAxes: [{ 
                gridLines: [{
                    display: false,
                }],
                ticks: {
                    display: true,
                    fontColor: this.themeColors.grayLight,
                    fontSize: 14,
                    padding: 10
                }
            }],
            yAxes: [{
                gridLines: {
                    drawBorder: false,
                    drawTicks: false,
                    borderDash: [3, 4],
                    zeroLineWidth: 1,
                    zeroLineBorderDash: [3, 4]  
                },
                ticks: {
                    display: true,
                    max: 100,                            
                    stepSize: 20,
                    fontColor: this.themeColors.grayLight,
                    fontSize: 13,
                    padding: 10
                }
            }],
        }
    };
    revenueChartColors: Array<any> = [
        { 
            backgroundColor: this.themeColors.transparent,
            borderColor: this.blue,
            pointBackgroundColor: this.blue,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.blueLight,
            pointHoverBorderColor: this.blueLight
        }
    ];
    revenueChartType = 'line';
    
    //Bar Chart
    barChartOptions: any = {};
    barChartLabels: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    barChartType = 'bar';
    barChartLegend = true;
    barChartColors: Array<any> = [
        { 
            backgroundColor: this.themeColors.blue,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.volcano,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.lime,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.cyan,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.dark,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.purple,
            borderWidth: 0
        },
        { 
            backgroundColor: this.themeColors.yellow,
            borderWidth: 0
        },
    ];

    barChartData: any[] = [
        {
            data: [],
            label: 'iOS',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'Android',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'vPro',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'Web',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'Quầy',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'iPad',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            data: [],
            label: 'TechX',
            categoryPercentage: 0.45,
            barPercentage: 0.70,
        },
        {
            label: "Total",
            data: [0, 0, 0, 0, 0, 0, 0],
            type: "line",
            showLines: false,
        }
    ];
}