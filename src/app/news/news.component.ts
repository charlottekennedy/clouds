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


constructor(public covidService : CovidService, private router: Router) { }

ngOnInit(): void {
    this.news=[];
    this.user = this.covidService.getUser();
    let newsC = this.covidService.getNewsUser(this.user.displayName);
    for (var newItem of newsC){
    newItem.subscribe(
    (res : News[]) => {
    for (var n of res){
    this.news.push(n);}});
}

this.covidService.userEligible(this.user).subscribe((doc) => {
    if (doc.exists){this.isEligible = true;} 
    else {this.isEligible = false;}});
console.log(this.isEligible);

this.covidService.userAsking(this.user).subscribe((doc) => {
    if (doc.exists){this.isAsking = true;} 
    else {this.isAsking = false;}});
console.log(this.isAsking);

}

async askEligible(){
    this.covidService.askEligible(this.user);
}
}


