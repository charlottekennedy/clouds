import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { User } from '../user.model';
import { News } from '../news.model';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

    user: User;
news: Array<News>;
isEligible : boolean;
isAsking : boolean;
askingUsers: Array<User>;
askingUid : string;


constructor(public covidService : CovidService, private router: Router) { }

ngOnInit(): void {
    this.news=[];
    this.user = this.covidService.getUser();
    let newsC = this.covidService.getNewsUser();
    for (var newItem of newsC){
    newItem.subscribe(
    (res : News[]) => {
    for (var n of res){
    if (n.writer == this.user.displayName){
        this.news.push(n);
}
}});
}

this.covidService.userEligible(this.user).subscribe((doc) => {
    if (doc.exists){this.isEligible = true;} 
    else {this.isEligible = false;}
console.log(this.isEligible);});


this.covidService.userAsking(this.user).subscribe((doc) => {
    if (doc.exists){this.isAsking = true;} 
    else {this.isAsking = false;}});


this.askingUsers=[];
if(this.user.uid =="sD85jg2ODNceWK54LHEKWIpIt0K3"){
    this.covidService.getAskingUsers().subscribe((responses: User[]) => {
            for (var res of responses){
                this.askingUsers.push(res);
            }
        });
    }

}

becomeEligible(){
 this.covidService.makeEligible(this.askingUid);
    this.askingUid= undefined;
}

async askEligible(){
    this.covidService.askEligible(this.user);
}
}


