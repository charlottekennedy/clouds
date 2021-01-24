import { Component, OnInit } from '@angular/core';
import { News } from '../news.model';
import { User } from '../user.model';
import { CovidService } from '../covid.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
    selector: 'app-add-news',
    templateUrl: './add-news.component.html',
    styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

descrip: string;
country: string;
countries: Array<string>;
user: User;


constructor(private covidService: CovidService,  public datepipe: DatePipe) { }

ngOnInit(): void {

    this.countries = this.covidService.getCountriesNames();
    this.countries.push("Worldwide");
    
}

addN(){
    let date = new Date();
    let latestDate= this.datepipe.transform(date, 'yyyy-MM-dd');
    this.user = this.covidService.getUser();
    let newsItem: News = {
        date: latestDate,
        writer : this.user.displayName,
        descrip: this.descrip,
        country: this.country,
    };
    this.covidService.addNews(newsItem);
    this.descrip = undefined;
    this.country= undefined;
}


}
