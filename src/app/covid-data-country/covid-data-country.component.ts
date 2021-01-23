import { Component, OnInit } from '@angular/core';
import { DataCountry } from '../dataCountry.model';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import { ActivatedRoute } from '@angular/router';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { DataDaily } from '../dataDaily.model';

@Component({
    selector: 'app-covid-data-country',
    templateUrl: './covid-data-country.component.html',
    styleUrls: ['./covid-data-country.component.css']
})
export class CovidDataCountryComponent implements OnInit {
    news : News[];
private sub: any;
name : string;
dataC: DataCountry;
dataCountryDaily: DataDaily;
dataCountryDailyTotal: DataDaily;

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


constructor(private route: ActivatedRoute, public covidService : CovidService) { }

ngOnInit(): void {

    this.sub = this.route.paramMap.subscribe(params => {
    this.name = params.get('name');
})

this.covidService.getDataCountry(this.name).subscribe(
    (res: DataCountry) =>                                    
    {this.dataC = res;                         
     this.pieChartData =  [this.dataC.totalDeaths, this.dataC.totalRecovered, this.dataC.activeCases];
    });


this.dailyDataPlots();

}

async dailyDataPlots(){
    let dataCountryD = await this.covidService.getDataCountryDaily(this.name);
    this.dataCountryDaily = dataCountryD[0];
    this.barChartData= [

    { data: this.dataCountryDaily.deaths, label: 'Daily Deaths' }, { data: 
    this.dataCountryDaily.recovered, label: 'Daily Recovered' },{ data: this.dataCountryDaily.cases, label: 'Daily New Cases' }
];
     this.barChartLabels= this.dataCountryDaily.dates;
    
    this.dataCountryDailyTotal = dataCountryD[1];
    this.lineChartData = [
    { data: this.dataCountryDailyTotal.deaths, label: 'Total Deaths' },
    { data: this.dataCountryDailyTotal.recovered, label: 'Total Recovered' },
    { data: this.dataCountryDailyTotal.cases, label: 'Total Cases' }
];
    this.lineChartLabels = this.dataCountryDailyTotal.dates;   
} 



}

