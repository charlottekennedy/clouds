import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Router } from '@angular/router';
import { News } from './news.model';
import { DataDaily } from './dataDaily.model';
import { DataCountry } from './dataCountry.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataWorld } from './dataWorld.model';
import { DatePipe } from '@angular/common';



@Injectable({
    providedIn: 'root'
})
export class CovidService {

    private user: User;
public countries: Array<string>;
public dataWorld : DataWorld;
public dataWorldDaily : DataDaily;
public dataWorldDailyTotal : DataDaily;
public dataCountryDaily : DataDaily;
public dataCountryDailyTotal : DataDaily;



constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, protected http: HttpClient, public datepipe: DatePipe) { }

async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
        uid: credentials.user.uid,
        displayName : credentials.user.displayName,
        email : credentials.user.email
    };
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate(["news"]);
}

private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
        uid: this.user.uid,
        displayName: this.user.displayName,
        email: this.user.email
    }, {merge: true});
}

getUser(){
    if(this.user == null && this.userSignedIn()){
        this.user = JSON.parse(localStorage.getItem("user"));
    }
    return this.user;
}

userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
}

signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    this.router.navigate(["worldwide"]);
}

getNewsCountry(c: string){
    return this.firestore.collection("news")
        .doc(c).collection("newsC", ref => ref.orderBy('date', 'asc')).valueChanges();
}

getNewsUser(uid : string){
    let news = [];
    let countries = this.getCountriesNames();
    for (var c of countries){
        this.firestore.collection("news")
            .doc(c).collection("newsC").valueChanges().subscribe(responses => {
            for(var res of responses){
                if (res.nid == uid){
                    news.push(res);
                }
            }
        });}
    return news;
}


addNews(newsItem: News){
    this.firestore.collection("news").doc(newsItem.country).collection("newsC").add(newsItem);
}

async updateWorld(){
    let date = new Date();
    let latestDate= this.datepipe.transform(date, 'yyy-MM-dd');
    let summ = await this.getSummary();
    var global = summ["Global"];
    this.firestore.collection("dataWorld").doc("data").set({
        date : latestDate,
        totalCases: global["TotalConfirmed"],
        newCases: global["NewConfirmed"],
        activeCases: global["TotalConfirmed"] - global["TotalRecovered"] - global["TotalDeaths"],
        totalRecovered: global["TotalRecovered"],
        newRecovered: global["NewRecovered"],
        recoveryRate: Math.round( global["TotalRecovered"]/ global["TotalConfirmed"] *10000)/100,
        totalDeaths: global["TotalDeaths"],
        newDeaths: global["NewDeaths"],
        mortalityRate: Math.round(global["TotalDeaths"]/global["TotalConfirmed"] *10000)/100
    }, {merge: true});
}

getDataWorld(){
    let date = new Date();
    let latestDate= this.datepipe.transform(date, 'yyy-MM-dd');

    let dataW= this.firestore.collection("dataWorld").doc("data").get();

    dataW.subscribe(
        (res)=>{
            if (res.exists){
                if (res.data()["date"]!=latestDate){
                    this.updateWorld();
                }
            }
            else{
                this.updateWorld();
            }
        }
    );

    return this.firestore.collection("dataWorld").doc("data").valueChanges();

}


async getDataWorldDaily(){
    let summDaily = await this.getSummaryWorldDaily();

    this.dataWorldDailyTotal = {
        dates: Object.keys(summDaily["cases"]),
        cases: Object.values(summDaily["cases"]),
        deaths: Object.values(summDaily["deaths"]),
        recovered: Object.values(summDaily["recovered"])};

    let casesD = [];
    let deathsD = [];
    let recoveredD = [];
    let c = this.dataWorldDailyTotal.cases;
    let d = this.dataWorldDailyTotal.deaths;
    let r = this.dataWorldDailyTotal.recovered;
    let cptCases = this.dataWorldDailyTotal.cases[29];
    let cptDeaths = this.dataWorldDailyTotal.deaths[29];
    let cptRecovered = this.dataWorldDailyTotal.recovered[29];
    let cpt = 29;

    while (cpt >= 23){
        cptCases = c[cpt] - c[cpt-1];
        casesD.push(cptCases);
        cptDeaths = d[cpt] - d[cpt-1];
        deathsD.push(cptDeaths);
        cptRecovered = r[cpt] - r[cpt-1];
        recoveredD.push(cptRecovered);
        cpt-=1;
    }

    this.dataWorldDaily = { 
        dates: Object.keys(summDaily["cases"]).slice(23,30),
        cases: casesD,
        deaths: deathsD,
        recovered: recoveredD
    }
    return [this.dataWorldDaily, this.dataWorldDailyTotal];
}

async updateCountry(c: string){
    let date = new Date();
    let latestDate= this.datepipe.transform(date, 'yyy-MM-dd');
    let summ = await this.getSummary();
    var countries = summ["Countries"];
    for (var co of countries){
        if (co["Country"]==c){
            this.firestore.collection("dataCountry").doc(c).set({
                date: latestDate,
                country: c,
                totalCases:co["TotalConfirmed"],
                newCases: co["NewConfirmed"],
                activeCases: co["TotalConfirmed"] - co["TotalRecovered"] - co["TotalDeaths"],
                totalRecovered: co["TotalRecovered"],
                newRecovered: co["NewRecovered"],
                recoveryRate: Math.round(co["TotalRecovered"]/ co["TotalConfirmed"] *10000)/100,
                totalDeaths: co["TotalDeaths"],
                newDeaths: co["NewDeaths"],
                mortalityRate: Math.round(co["TotalDeaths"]/co["TotalConfirmed"] *10000)/100
            }, {merge: true});
        }   
    }
}

async getDataCountriesAPI(){
    let summ = await this.getSummary();
    let dataCountries : Array<DataCountry> = [];
    let countries = summ["Countries"];
    for (var co of countries){
        dataCountries.push({
            date: "date",
            country: co["Country"],
            totalCases:co["TotalConfirmed"],
            newCases: co["NewConfirmed"],
            activeCases: 0,
            totalRecovered: co["TotalRecovered"],
            newRecovered: co["NewRecovered"],
            recoveryRate: 0,
            totalDeaths: co["TotalDeaths"],
            newDeaths: co["NewDeaths"],
            mortalityRate:0
        }
                          );
    }
    return dataCountries;
}


getDataCountry(c: string){

    let date = new Date();
    let latestDate= this.datepipe.transform(date, 'yyy-MM-dd');

    let dataC= this.firestore.collection("dataCountry").doc(c).get();
    dataC.subscribe(
        (res)=>{
            if (res.exists){
                if (res.data()["date"]!=latestDate){
                    this.updateCountry(c);
                }
            }
            else{
                this.updateCountry(c);
            }
        }
    );
    return this.firestore.collection("dataCountry").doc(c).valueChanges();
}

async getDataCountryDaily(c: string){
    let summDaily = await this.getSummaryCountryDaily(c);
    
    let dates = [];
    let cases = [];
    let deaths = [];
    let recovered = [];

    for (let i of summDaily){
        dates.push(i["Date"].slice(0, 10));
        cases.push(i["Confirmed"]);
        deaths.push(i["Deaths"]);
        recovered.push(i["Recovered"]);
    }

    let dataCountryDaily = {
        dates: dates,
        cases: cases,
        deaths: deaths,
        recovered: recovered
    }


    let casesT = [];
    let deathsT = [];
    let recoveredT = [];
    let ca = dataCountryDaily.cases;
    let de = dataCountryDaily.deaths;
    let re = dataCountryDaily.recovered;
    let cptCases = 0;
    let cptDeaths = 0;
    let cptRecovered = 0;
    let index = dataCountryDaily.dates.indexOf("2020-04-20");
    let cpt = index;

    while(dataCountryDaily.dates[cpt]!= dataCountryDaily.dates[-1]){
        cptCases += ca[cpt];
        casesT.push(cptCases);
        cptDeaths += de[cpt];
        deathsT.push(cptDeaths);
        cptRecovered += re[cpt];
        recoveredT.push(cptRecovered);
        cpt+=1
    }

    this.dataCountryDailyTotal = {
        dates : dataCountryDaily.dates.slice(index ,cpt +1),
        cases: casesT,
        deaths: deathsT,
        recovered: recoveredT
    }

    this.dataCountryDaily = {
        dates: dataCountryDaily.dates.slice(Math.max(dataCountryDaily.dates.length - 7, 0)),
        cases: dataCountryDaily.cases.slice(Math.max(dataCountryDaily.cases.length - 7, 0)),
        deaths: dataCountryDaily.deaths.slice(Math.max(dataCountryDaily.deaths.length - 7, 0)),
        recovered: dataCountryDaily.recovered.slice(Math.max(dataCountryDaily.recovered.length - 7, 0))
    }

    return [this.dataCountryDaily, this.dataCountryDailyTotal];
}




/*async updateDailyCountry(c : String){
    let dailyData = await this.getSummaryCountryDaily(c);

    this.firestore.collection("dataCountryDaily").doc(c).collection("daily").doc("data").get()
    let mostRecentDate = ;
     this.firestore.collection("dataCountryDaily").doc(c).collection("daily").set({
         country: c,
         date: 

    this.firestore.collection("dataCountryDaily").doc(c).collection("sinceApril2020").set({
         country: c,
         date: 
})}*/

goToCountry(c : string){
    this.router.navigate(['country/', c], {queryParams: {name: c}});
}

async updateCountriesNames(){
    let countriesNames=[];
    let cAPI = await this.getCountriesAPI();
    for (var c of cAPI){
        countriesNames.push(c["Country"]);
    }
    this.countries = countriesNames;
    localStorage.setItem("countries", JSON.stringify(this.countries));
}


getCountriesNames(){
    if( !localStorage.hasOwnProperty("countries")){
        this.updateCountriesNames();
    }
    if (this.countries==null){
        this.countries = JSON.parse(localStorage.getItem("countries"));
    }
    return this.countries;
}

getSummary(){
    return this.http.get<JSON>('https://api.covid19api.com/summary').toPromise();
}

getSummaryCountryDaily(c : string){
    return this.http.get<JSON>('https://api.covid19api.com/dayone/country/'+c).toPromise();
}

getSummaryWorldDaily(){
    return this.http.get<JSON>('https://corona.lmao.ninja/v2/historical/all').toPromise();
}

getCountriesAPI(){
    return this.http.get<JSON[]>('https://api.covid19api.com/countries').toPromise();
}



}
