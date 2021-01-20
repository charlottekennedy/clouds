import { Component, OnInit } from '@angular/core';
import { DataCountry } from '../dataCountry.model';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import { ActivatedRoute } from '@angular/router';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-covid-data-country',
  templateUrl: './covid-data-country.component.html',
  styleUrls: ['./covid-data-country.component.css']
})
export class CovidDataCountryComponent implements OnInit {
    news : News[];
    private sub: any;
    name : String;
    dataC: DataCountry;


  constructor(private route: ActivatedRoute, public covidService : CovidService) { }

  ngOnInit(): void {
      
      this.sub = this.route.paramMap.subscribe(params => {
      this.name = params.get('name');
  })
  
  this.dataC = this.covidService.getDataOneCountry(this.name);
this.pieChart();
  }
  
  pieChart(){
      var canva = document.getElementById<HTMLCanvasElement>("pieChart");
  	  var ctxP = canva.getContext('2d');
      var myPieChart = new Chart(ctxP, {
      type: 'pie',
      data: {
        labels: ["Dead Cases", "Recovered Cases", "Active Cases"],
        datasets: [{
          data: [this.dataC.totalDeaths, this.dataC.totalRecovered, this.dataC.activeCases],
          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
          hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
        }]
      },
      options: {
        responsive: true
      }
    });
      
}
}
    
