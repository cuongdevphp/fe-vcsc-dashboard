import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core'
import { Chat } from '../../shared/interfaces/chat.type';
// import { AppsService } from '../../shared/services/apps.service';

@Component({
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    isContentOpen: boolean = false;
    chatId: string;
    msg: string;
    chatList: any = [];

    constructor( ) { }

    ngOnInit(){
        this.chatList = [
                            {
                                "name": "Erin Gonzales",
                                "avatar": "assets/images/avatars/thumb-1.jpg",
                                "msg": [
                                    {
                                        "avatar": "",
                                        "text": "",
                                        "from": "",
                                        "time": "7:57PM",
                                        "msgType": "date"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-1.jpg",
                                        "text": "Hey, let me show you something nice!",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Oh! What is it?",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-1.jpg",
                                        "text": "https://s3.envato.com/files/249796117/preview.__large_preview.png",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "image"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Applicator - Bootstrap 4 Admin Template",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "A creative, responsive and highly customizable admin template",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Wow, that was cool!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    }
                                ]
                                
                            },
                            {
                                "name": "Darryl Day",
                                "avatar": "assets/images/avatars/thumb-2.jpg",
                                "time": "7:57PM",
                                "msg": [
                                    {
                                        "avatar": "",
                                        "text": "",
                                        "from": "",
                                        "time": "7:57PM",
                                        "msgType": "date"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-2.jpg",
                                        "text": "Hello Jason ",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Hello, how are you ",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-2.jpg",
                                        "text": "Remember our previous discussion?",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Yeah, sure!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-2.jpg",
                                        "text": "This is the finalize version.",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Application-United.pdf",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "file"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Okay! Thank you",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    }
                                ]
                            },
                            {
                                "name": "Marshall Nichols",
                                "avatar": "assets/images/avatars/thumb-3.jpg",
                                "time": "7:57PM",
                                "msg": [
                                    {
                                        "avatar": "",
                                        "text": "",
                                        "from": "",
                                        "time": "7:57PM",
                                        "msgType": "date"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-3.jpg",
                                        "text": "Hey, what are you doing?",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Texting the most beautiful girl in the world.",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-3.jpg",
                                        "text": "Oh? How Cute",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Yup but she's not replying so texting you",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-3.jpg",
                                        "text": "Okay",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "",
                                        "from": "",
                                        "time": "7:59PM",
                                        "msgType": "date"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-3.jpg",
                                        "text": "Bye",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "I'm just kidding..!!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "It's me..can you hear me..!!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    }
                                ]
                            },
                            {
                                "name": "Virgil Gonzales",
                                "avatar": "assets/images/avatars/thumb-4.jpg",
                                "time": "7:57PM",
                                "msg": [
                                    {
                                        "avatar": "",
                                        "text": "",
                                        "from": "",
                                        "time": "8:08PM",
                                        "msgType": "date"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-4.jpg",
                                        "text": "Dude are you ready to party?",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Umm who are you",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-4.jpg",
                                        "text": "Oh sorry wrong chat",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-4.jpg",
                                        "text": "Bye",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "...but I wan to party",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    }
                                ]
                            },
                            {
                                "name": "Pamela Wanda",
                                "avatar": "assets/images/avatars/thumb-7.jpg",
                                "time": "7:57PM",
                                "msg": [
                                    {
                                        "avatar": "assets/images/avatars/thumb-7.jpg",
                                        "text": "Oh yeah? well I enjoy a nice steak. how about you?",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "We’ d have steak and ice cream three times every day!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-7.jpg",
                                        "text": "I eat all the steak and chicken too, even bacon",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "That was great!",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-7.jpg",
                                        "text": "yeah you said that already",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "Dynamic structure can absorb shock.",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "assets/images/avatars/thumb-7.jpg",
                                        "text": "yes it can. I know about that as a bodybuilder",
                                        "from": "opposite",
                                        "time": "",
                                        "msgType": "text"
                                    },
                                    {
                                        "avatar": "",
                                        "text": "The strongest man in the world is blowing up a hot water bottle.",
                                        "from": "me",
                                        "time": "",
                                        "msgType": "text"
                                    }
                                ]
                            }
                        ];
        // this.chatSvc.getChatJSON().subscribe(data => {
        //     this.chatList = data;
        // });
        this.chatId = 'Erin Gonzales'
        this.scrollToBottom();
    }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    selectChat(index: string){
        this.chatId = index;
        this.isContentOpen = true;
    };

    closeChatContent() {
        this.isContentOpen = false;
    }

    sendMsg(msg: string): void {
        for (let i = 0; i < this.chatList.length; i++) {
            if(this.chatId == this.chatList[i].name && this.msg.length > 1){
                this.chatList[i].msg.push(
                    {
                        avatar: '',
                        text: msg,
                        from: 'me',
                        time: '',
                        msgType: 'text'
                    }
                ) 
            }
        } 
        this.msg = '';   
    }

    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
}  