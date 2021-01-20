import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CovidService } from '../covid.service';
import { User } from '../user.model';
import { News } from '../news.model';
import { DataCountry } from '../dataCountry.model';
import { DataWorld } from '../dataWorld.model';
import { Sort } from '@angular/material/sort';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

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
sortedData: Array<DataCountry>;


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
barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
barChartType: ChartType = 'bar';
barChartLegend = true;
barChartPlugins = [];
barChartData: ChartDataSets[];


lineChartData: ChartDataSets[]; 
lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June'];
lineChartOptions = {
    responsive: true,
};
lineChartLegend = true;
lineChartPlugins = [];
lineChartType = 'line';

constructor(public covidService : CovidService) { 
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

    this.dataWorld = this.covidService.getDataWorld();
    this.dataCountry = this.covidService.getDataCountry();
    this.sortedData = this.dataCountry;

    this.pieChartData =  [this.dataWorld.totalDeaths, this.dataWorld.totalRecovered, this.dataWorld.activeCases];

    this.barChartData= [
    { data: [45, 37, 60, 70, 46, 33], label: 'Daily Deaths' }, { data: [45, 37, 60, 70, 46, 33], label: 'Daily Recovered' },{ data: [45, 37, 60, 70, 46, 33], label: 'Daily New Cases' }
];

this.lineChartData = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Total Deaths' },
    { data: [85, 32, 78, 78, 77, 15], label: 'Total Recovered' },
    { data: [85, 72, 32, 40, 77, 75], label: 'Total Cases' }
];

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


