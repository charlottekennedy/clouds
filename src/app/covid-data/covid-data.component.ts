import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidService } from '../covid.service';
import { User } from '../user.model';
import { News } from '../news.model';
import { DataCountry } from '../dataCountry.model';
import { DataWorld } from '../dataWorld.model';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-covid-data',
  templateUrl: './covid-data.component.html',
  styleUrls: ['./covid-data.component.css']
})


export class CovidDataComponent implements OnInit {

  news: News[];
  user: User;
  dataCountry: Array<DataCountry>;
  dataWorld : DataWorld;

  
  constructor(public covidService : CovidService) { 
  }

  ngOnInit(): void {
  	/*this.covidService.displayNews("worldwide").subscribe((news: News[])=>{
  		this.news = news;
  	}); */
  	this.user = this.covidService.getUser();
  	/*this.covidService.displayNews().subscribe((news: News[])=>{
  		this.news = news;
  	});*/
  	
  	this.covidService.APISummary();
  	this.dataWorld = this.covidService.getDataWorld();
    this.dataCountry = this.covidService.getDataCountry();
    for (var c of this.dataCountry){
      console.log(c.country);
  }
	this.pieChart();
  	
  	/*this.covidService.getDataCountries().subscribe(
  	  dataCountry => this.dataCountry = dataCountry
  	);*/
  	
  }
  
  pieChart(){
  	
}

}
