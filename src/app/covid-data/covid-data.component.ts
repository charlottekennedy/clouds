import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidService } from '../covid.service';
import { User } from '../user.model';
import { News } from '../news.model';
import { DataCountry } from '../dataCountry.model';
import { DataWorld } from '../dataWorld.model';
import { DataDaily } from '../dataDaily.model';
import { Sort } from '@angular/material/sort';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-covid-data',
    templateUrl: './covid-data.component.html',
    styleUrls: ['./covid-data.component.css']
})


export class CovidDataComponent implements OnInit {

    news: News[];
user: User;
dataCountry: DataCountry[];
dataWorld : DataWorld;
dataWorldDaily: DataDaily;
dataWorldDailyTotal: DataDaily;
sortedData: DataCountry[];
namesCountry: string[];
barChartLabels: Label[];
lineChartLabels: Label[];


public pieChartOptions: ChartOptions = {
    responsive: true,
};
public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
public pieChartData: SingleDataSet;
public pieChartType: ChartType = 'pie';
public pieChartLegend = true;
public pieChartPlugins = [];

barChartOptions: ChartOptions = {
    responsive: true,
};

barChartType: ChartType = 'bar';
barChartLegend = true;
barChartPlugins = [];
barChartData: ChartDataSets[];


lineChartData: ChartDataSets[]; 
lineChartOptions = {
    responsive: true,
};
lineChartLegend = true;
lineChartPlugins = [];
lineChartType = 'line';

constructor(public covidService : CovidService, public datepipe: DatePipe) { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
}

ngOnInit(): void {
    /*this.covidService.displayNews("worldwide").subscribe((news: News[])=>{
  		this.news = news;
  	}); */
    this.user = this.covidService.getUser();
    /*this.covidService.displayNews().subscribe((news: News[])=>{
  		this.news = news;
  	});*/

this.covidService.getDataWorld().subscribe((res: DataWorld) => {
    this.dataWorld = res;
    this.pieChartData =  [this.dataWorld.totalDeaths, this.dataWorld.totalRecovered, this.dataWorld.activeCases];
});

this.dailyDataPlots();
this.getDataC();


this.covidService.getNewsCountry("Worldwide").subscribe((news : News[]) => {this.news = news;} );
}

async dailyDataPlots(){
    let dataWorldD = await this.covidService.getDataWorldDaily();
    this.dataWorldDaily = dataWorldD[0];
    this.barChartData= [

    { data: this.dataWorldDaily.deaths, label: 'Daily Deaths' }, { data: 
    this.dataWorldDaily.recovered, label: 'Daily Recovered' },{ data: this.dataWorldDaily.cases, label: 'Daily New Cases' }
];
     this.barChartLabels= this.dataWorldDaily.dates;
    
    this.dataWorldDailyTotal = dataWorldD[1];
    this.lineChartData = [
    { data: this.dataWorldDailyTotal.deaths, label: 'Total Deaths' },
    { data: this.dataWorldDailyTotal.recovered, label: 'Total Recovered' },
    { data: this.dataWorldDailyTotal.cases, label: 'Total Cases' }
];
    this.lineChartLabels = this.dataWorldDailyTotal.dates;   
} 

async getDataC(){
    this.dataCountry = await this.covidService.getDataCountriesAPI();
    this.sortedData = this.dataCountry;
}


sortData(sort: Sort){
    this.sortedData = this.dataCountry.slice();
    const data = this.dataCountry.slice();
    if (!sort.active || sort.direction === ''){
        this.sortedData = data;
        return;
    }

    this.sortedData = data.sort((a,b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active){
            case 'country': return compare(a.country, b.country, isAsc);
            case 'newCases': return compare(a.totalCases, b.totalCases, isAsc);
            case 'totalCases': return compare(a.totalCases, b.totalCases, isAsc);
            case 'newRecovered': return compare(a.totalCases, b.totalCases, isAsc);
            case 'totalRecovered': return compare(a.totalCases, b.totalCases, isAsc);
            case 'newDeaths': return compare(a.totalCases, b.totalCases, isAsc);
            case 'totalDeaths': return compare(a.totalCases, b.totalCases, isAsc);
            default: return 0;
        }
    });
}
 
}

function compare(a: number | string, b: number | string, isAsc: boolean){
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

  



