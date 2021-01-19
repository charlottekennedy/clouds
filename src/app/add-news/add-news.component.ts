import { Component, OnInit } from '@angular/core';
import { News } from '../news.model';
import { CovidService } from '../covid.service';


@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  date: any;
  descrip: string;
  country: string;

  constructor(private covidService: CovidService) { }

  ngOnInit(): void {
  }
  
  addNews(){
    let news_item: News = {
      date: new Date(this.date),
      descrip: this.descrip,
      country: this.country
    };
    this.covidService.addNews(news_item);
    this.date = undefined;
    this.descrip = undefined;
    this.country= undefined;
  }


}
