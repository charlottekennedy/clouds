import { Component, OnInit } from '@angular/core';
import { News } from '../news.model';
import { CovidService } from '../covid.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-add-news',
    templateUrl: './add-news.component.html',
    styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

descrip: String;
country: String;
countries: Array<String>;


constructor(private covidService: CovidService,  public datepipe: DatePipe) { }

ngOnInit(): void {
    this.countries = this.covidService.getCountriesNames();
    this.countries.push("Worldwide");
}

addN(){
    let date = new Date();
    let latest_date= this.datepipe.transform(date, 'yyyy-MM-dd');
    let news_item: News = {
        date: latest_date,
        descrip: this.descrip,
        country: this.country
    };
    this.covidService.addNews(news_item);
    this.descrip = undefined;
    this.country= undefined;
}


}
