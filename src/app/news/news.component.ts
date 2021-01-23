import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { User } from '../user.model';
import { News } from '../news.model';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

    user: User;
news: Array<News>;


constructor(public covidService : CovidService) { }

ngOnInit(): void {
    this.news=[];
    this.user = this.covidService.getUser();
    let newsC = this.covidService.getNewsUser(this.user.displayName);
    for (var newItem of newsC){
    newItem.subscribe(
    (res : News[]) => {
    for (var n of res){
    this.news.push(n);
}
});
}
}
}


