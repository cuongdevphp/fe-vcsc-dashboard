// import { Component, OnInit } from '@angular/core';
// import { NavigationEnd, Router } from '@angular/router';

// import * as io from 'socket.io-client';
// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html'
// })

// export class AppComponent implements OnInit {
//     messageText: string;
//     messages: Array<any>;
//     socket: io.Socket;
//     constructor(router: Router) {
//         this.socket = io.connect('http://localhost:3001', { transports : ['websocket'] });
//         router.events.subscribe((val) => {
//             if (val instanceof NavigationEnd ) {
//                 console.log(val.url);
//             }
//         });
//     }

//     //socket: SocketIOClient.Socket;
//     ngOnInit(): void {
//         this.messages = new Array();
//         this.socket.emit('investorBuyBond', {
//             msg: 'Client to server, can you hear me server?'
//         });
//         this.socket.on('event2', (data: any) => {
//             console.log(data.msg, 'event2');
//             this.socket.emit('event3', {
//                 msg: 'Yes, its working for me!!'
//             });
//         });
//         this.socket.on('event4', (data: any) => {
//             console.log(data.msg, 'event4');
//         });
        
//         // this.socket.on('PC1', (data: any) => {
//         //     console.log(data, 'msg');
//         // });
//     }
// }


import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {}