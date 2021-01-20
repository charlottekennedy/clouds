import { Component, OnInit } from '@angular/core';
import { DataCountry } from '../dataCountry.model';
import { CovidService } from '../covid.service';
import { News } from '../news.model';
import { ActivatedRoute } from '@angular/router';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

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

this.dataC = this.covidService.getDataOneCountry(this.name);

this.pieChartData =  [this.dataC.totalDeaths, this.dataC.totalRecovered, this.dataC.activeCases];

this.barChartData= [
    { data: [45, 37, 60, 70, 46, 33], label: 'Daily Deaths' }, { data: [45, 37, 60, 70, 46, 33], label: 'Daily Recovered' },{ data: [45, 37, 60, 70, 46, 33], label: 'Daily New Cases' }
];

this.lineChartData = [
    { data: [85, 72, 78, 75, 77, 75], label: 'Total Deaths' },
    { data: [85, 32, 78, 78, 77, 15], label: 'Total Recovered' },
    { data: [85, 72, 32, 40, 77, 75], label: 'Total Cases' },
];

}


}

