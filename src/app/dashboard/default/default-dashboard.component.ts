import { Component, OnInit } from '@angular/core'
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import { StatisticService } from 'src/app/shared/services/statistic.service';

@Component({
    templateUrl: './default-dashboard.component.html'
})

export class DefaultDashboardComponent implements OnInit {
    customersChartData: number[] = [];
    webSession: number = 0;
    lotteSession: number = 0;
    vproSession: number = 0;
    androidSession: number = 0;
    isSpinningSessionLogin: boolean = false;
    maxSessionLogin: number = 0;
    dateFormat = 'dd/MM/yyyy';
    dateSessionLogin = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];

    themeColors = this.colorConfig.get().colors;
    blue = this.themeColors.blue;
    blueLight = this.themeColors.blueLight;
    cyan = this.themeColors.cyan;
    cyanLight = this.themeColors.cyanLight;
    gold = this.themeColors.gold;
    purple = this.themeColors.purple;
    purpleLight = this.themeColors.purpleLight;
    red = this.themeColors.red;

    taskListIndex: number = 0;

    constructor( 
        private colorConfig:ThemeConstantService,
        private statisticService: StatisticService,
    ) {}
    
    ngOnInit(): void {
        this.loadSessionLogin(this.dateSessionLogin[0], this.dateSessionLogin[1]);
    }

    onChangeSessionLogin(result: Date[]): void {
        console.log(result, 'result');
        if(result.length === 0) {
            result = [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()];
        }
        this.loadSessionLogin(result[0], result[1]);
    }


    loadSessionLogin( 
        startDate: Date | null,
        endDate: Date | null, 
    ): void {
        console.log(startDate, endDate);
        this.isSpinningSessionLogin = true;
        this.statisticService.getSessionLogin(startDate, endDate)
        .subscribe(result => {
            if(result.success) {
                const web = [];
                const ios = [];
                const android = [];
                const vpro = [];
                const techX = [];
                const date = [];
                for(const i of result.data.data) {
                    web.push(i.web);
                    ios.push(i.ios);
                    android.push(i.android);
                    vpro.push(i.vpro);
                    techX.push(i.techX);
                    date.push(i.dateChart);
                }
                this.lineChartData = [
                    { 
                        data: ios, 
                        label: 'iOS' 
                    },
                    { 
                        data: android, 
                        label: 'Android' 
                    },
                    { 
                        data: vpro, 
                        label: 'vPro' 
                    },
                    {
                        data: web, 
                        label: 'Web' 
                    },
                    { 
                        data: techX, 
                        label: 'techX' 
                    },
                ];
                this.lineChartLabels = date;
                const maxSessionLogin = [...ios, ...android, ...vpro, ...web];
                this.maxSessionLogin = Math.max(...maxSessionLogin);
                console.log(this.maxSessionLogin, 'maxSessionLogin');
                this.isSpinningSessionLogin = false;
            }
        });
    }

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
            label: 'TechX' 
        },
    ];

    currentLineChartLabelsIdx = 1;

    lineChartLabels:Array<any> = [];
    
    lineChartOptions: any = {
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
                    max: 8000,                            
                    stepSize: 1000,
                    fontColor: this.themeColors.grayLight,
                    fontSize: 13,
                    padding: 10
                }  
            }],
        }
    };
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
            borderColor: this.themeColors.magenta,
            pointBackgroundColor: this.themeColors.magenta,
            pointBorderColor: this.themeColors.white,
            pointHoverBackgroundColor: this.themeColors.magentaLight,
            pointHoverBorderColor: this.themeColors.magentaLight
        }
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

    customersChartLabels: string[] = ['Lotte', 'Web', 'Vpro', 'Android'];
    customersChartColors: Array<any> =  [{ 
        backgroundColor: [this.cyan, this.red, this.gold, this.blue],
        pointBackgroundColor : [this.cyan, this.red, this.gold, this.blue]
    }];
    customersChartOptions: any = {
        cutoutPercentage: 75,
        maintainAspectRatio: false
    }
    customersChartType = 'doughnut';

    //Bar Chart
    avgProfitChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                stacked: true,
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
                stacked: true,
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
                    stepSize: 40,
                    display: true,
                    beginAtZero: true,
                    fontSize: 13,
                    padding: 10
                }
            }]
        }
    };
    avgProfitChartLabels: string[] = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    avgProfitChartType = 'bar';
    avgProfitChartLegend = false;
    avgProfitChartColors: Array<any> = [
        { 
            backgroundColor: this.blue,
            borderWidth: 0
        },
        { 
            backgroundColor: this.blueLight,
            borderWidth: 0
        }
    ];
    avgProfitChartData: any[] = [
        { 
            data: [38, 38, 30, 19, 56, 55, 31],
            label: 'Series A',
            categoryPercentage: 0.35,
            barPercentage: 0.3,
        },
        { 
            data: [55, 69, 90, 81, 86, 27, 77],
            label: 'Series B',
            categoryPercentage: 0.35,
            barPercentage: 0.3,
        }
    ];

    productsList = [
        {
            name: 'Gray Sofa',
            avatar: 'assets/images/others/thumb-9.jpg',
            earn: 1912,
            sales: 81,
            stock: 82,
        },
        {
            name: 'Beat Headphone',
            avatar: 'assets/images/others/thumb-10.jpg',
            earn: 1377,
            sales: 26,
            stock: 61
        },
        {
            name: 'Wooden Rhino',
            avatar: 'assets/images/others/thumb-11.jpg',
            earn: 9212,
            sales: 71,
            stock: 23,
        },
        {
            name: 'Red Chair',
            avatar: 'assets/images/others/thumb-12.jpg',
            earn: 1298,
            sales: 79,
            stock: 54,
        },
        {
            name: 'Wristband',
            avatar: 'assets/images/others/thumb-13.jpg',
            earn: 7376,
            sales: 60,
            stock: 76,
        }
    ]    

    fileList = [
        {
            icon: "file-word",
            name: "Documentation.doc",
            color: this.blue,
            size: "1.2MB"
        },
        {
            icon: "file-excel",
            name: "Expensess.xls",
            color: this.cyan,
            size: "518KB"
        },
        {
            icon: "file-text",
            name: "Receipt.txt",
            color: this.purple,
            size: "355KB"
        },
        {
            icon: "file-word",
            name: "Project Requirement.doc",
            color: this.blue,
            size: "1.6MB"
        },
        {
            icon: "file-pdf",
            name: "App Flow.pdf",
            color: this.red,
            size: "19.8MB"
        },
        {
            icon: "file-ppt",
            name: "Presentation.ppt",
            color: this.gold,
            size: "2.7MB"
        },
    ]

    activityList = [
        {
            name: "Virgil Gonzales",
            avatar: this.blue,
            date: "10:44 PM",
            action: "Complete task",
            target: "Prototype Design",
            actionType: "completed"
        },
        {
            name: "Lilian Stone",
            avatar: this.cyan,
            date: "8:34 PM",
            action: "Attached file",
            target: "Mockup Zip",
            actionType: "upload"
        },
        {
            name: "Erin Gonzales",
            avatar: this.gold,
            date: "8:34 PM",
            action: "Commented",
            target: "'This is not our work!'",
            actionType: "comment"
        },
        {
            name: "Riley Newman",
            avatar: this.blue,
            date: "8:34 PM",
            action: "Commented",
            target: "'Hi, please done this before tommorow'",
            actionType: "comment"
        },
        {
            name: "Pamela Wanda",
            avatar: this.red,
            date: "8:34 PM",
            action: "Removed",
            target: "a file",
            actionType: "removed"
        },
        {
            name: "Marshall Nichols",
            avatar: this.purple,
            date: "5:21 PM",
            action: "Create",
            target: "this project",
            actionType: "created"
        }
    ]    

    taskListToday = [
        {
            title: "Define users and workflow",
            desc: "A cheeseburger is more than sandwich",
            checked: false
        },
        {
            title: "Schedule jobs",
            desc: "I'm gonna build me an airport",
            checked: true
        },
        {
            title: "Extend the data model",
            desc: "Let us wax poetic about cheeseburger.",
            checked: true
        },
        {
            title: "Change interface",
            desc: "Efficiently unleash cross-media information",
            checked: false
        },
        {
            title: "Create databases",
            desc: "Here's the story of a man named Brady",
            checked: false
        }
    ];
    
    taskListWeek = [
        {
            title: "Verify connectivity",
            desc: "Bugger bag egg's old boy willy jolly",
            checked: false
        },
        {
            title: "Order console machines",
            desc: "Value proposition alpha crowdsource",
            checked: false
        },
        {
            title: "Customize Template",
            desc: "Do you see any Teletubbies in here",
            checked: true
        },
        {
            title: "Batch schedule",
            desc: "Trillion a very small stage in a vast",
            checked: true
        },
        {
            title: "Prepare implementation",
            desc: "Drop in axle roll-in rail slide",
            checked: true
        }
    ];

    taskListMonth = [
        {
            title: "Create user groups",
            desc: "Nipperkin run a rig ballast chase",
            checked: false
        },
        {
            title: "Design Wireframe",
            desc: "Value proposition alpha crowdsource",
            checked: true
        },
        {
            title: "Project Launch",
            desc: "I'll be sure to note that",
            checked: false
        },
        {
            title: "Management meeting",
            desc: "Hand-crafted exclusive finest",
            checked: false
        },
        {
            title: "Extend data model",
            desc: "European minnow priapumfish mosshead",
            checked: true
        }
    ]
}  
