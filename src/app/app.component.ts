import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

// import * as io from 'socket.io-client';
import { AccountService } from './shared/services/account.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
    //socket: io.Socket;
    constructor(
        private accountService: AccountService,
        router: Router
    ) {
        // this.socket.on('connect', () => {
        //     this.socket.on('authenticate', (message) => {
        //         console.log(message, 'message');
        //         this.socket.emit('authenticate', message);
        //     });
        //     // this.socket.emit('authenticate', {token: this.accountService.userValue.token});
        //     // this.socket.on('authenticate', {token: this.accountService.userValue.token});
        //     // this.socket.on('authenticate', (message) => {
        //     //     console.log(message, 'message');
        //     //     io.emit('authenticate', message);
        //     // });
        // });
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd ) {
                // console.log(val.url);
            }
        });
    }

    ngOnInit(): void {
        // this.socket = io.connect('http://localhost:3001', {
        //     transports: ['websocket'],
        //     query: {"token": this.accountService.userValue.token }
        // });
        // this.socket.on('connect', function(){
        //     this.socket.emit('authenticate', {token: this.accountService.userValue.token});
        // });
          
        // this.messages = new Array();
        // this.socket.emit('investorBuyBond', {
        //     msg: 'Client to server, can you hear me server?'
        // });
    }
}


// import { Component } from '@angular/core';

// @Component({
//     selector: 'app-root',
//     templateUrl: './app.component.html'
// })
// export class AppComponent {}