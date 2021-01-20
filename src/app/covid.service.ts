import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Router } from '@angular/router';
import { News } from './news.model';
import { DataCountry } from './dataCountry.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataWorld } from './dataWorld.model';
import { DatePipe } from '@angular/common'


@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private user: User;
  private dataWorld : DataWorld;
  private dataCountry : Array<DataCountry>;

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
  
    getNews(){
    return this.firestore.collection("users")
    .doc(this.user.uid).collection("news", ref => ref.orderBy('date', 'asc')).valueChanges();
  }
  
  addNews(news_item: News){
    this.firestore.collection("users").doc(this.user.uid)
    .collection("news").add(news_item);
  }

async APISummary(){
	let summ = await this.getSummary();
  	var global = summ["Global"];
  	this.dataWorld = {
    date : summ["Date"].slice(0,10),
  	 totalCases: global["TotalConfirmed"],
  	 newCases: global["NewConfirmed"],
	activeCases: global["TotalConfirmed"] - global["TotalRecovered"] - global["TotalDeaths"],
  	totalRecovered: global["TotalRecovered"],
  	newRecovered: global["NewRecovered"],
  	recoveryRate: global["TotalRecovered"]/ global["TotalConfirmed"] *100,
  	totalDeaths: global["TotalDeaths"],
  	newDeaths: global["NewDeaths"],
  	mortalityRate: global["TotalDeaths"]/global["TotalConfirmed"] *100
  	};
    
    var countries = summ["Countries"];
  	this.dataCountry = [];
    for (var c of countries){
        this.dataCountry.push({
    country: c["Country"],
    totalCases: c["TotalConfirmed"],
    newCases: c["NewConfirmed"],
	activeCases: c["TotalConfirmed"] - c["TotalRecovered"] - c["TotalDeaths"],
  	totalRecovered: c["TotalRecovered"],
  	newRecovered: c["NewRecovered"],
  	recoveryRate: c["TotalRecovered"]/ c["TotalConfirmed"] *100,
  	totalDeaths: c["TotalDeaths"],
  	newDeaths: c["NewDeaths"],
  	mortalityRate: c["TotalDeaths"]/c["TotalConfirmed"] *100
        }
        )
    }
  	
  	localStorage.setItem("dataWorld", JSON.stringify(this.dataWorld));
  	localStorage.setItem("dataCountry", JSON.stringify(this.dataCountry));
  	this.updateDataWorld();
  	this.updateDataCountry();
  
  }
  
private updateDataWorld(){
this.firestore.collection("dataWorld").doc("data").set({
    date : this.dataWorld.date,
  	totalCases: this.dataWorld.totalCases,
  	newCases: this.dataWorld.newCases,
  	activeCases: this.dataWorld.activeCases,
  	totalRecovered: this.dataWorld.totalRecovered,
  	newRecovered: this.dataWorld.newRecovered,
  	recoveryRate: this.dataWorld.recoveryRate,
  	totalDeaths: this.dataWorld.totalDeaths,
  	newDeaths: this.dataWorld.newDeaths,
  	mortalityRate: this.dataWorld.mortalityRate
  	}, {merge: true});
  }
 
 
   getDataWorld(){
       let date = new Date();
       date.setDate(date.getDate() - 1);
       let latest_date= this.datepipe.transform(date, 'yyy-MM-dd');
       let dateUpdate = JSON.parse(localStorage.getItem("dataWorld")).date;
       if(dateUpdate != latest_date){
      this.APISummary();
    }
       this.dataWorld = JSON.parse(localStorage.getItem("dataWorld"));
    return this.dataWorld;
  }

private updateDataCountry(){
   for (var country of this.dataCountry){
       this.firestore.collection("dataCountry").doc(country["Country"]).set({  
    country: country.country,
  	totalCases: country.totalCases,
  	newCases: country.newCases,
  	activeCases: country.activeCases,
  	totalRecovered: country.totalRecovered,
  	newRecovered: country.newRecovered,
  	recoveryRate: country.recoveryRate,
  	totalDeaths: country.totalDeaths,
  	newDeaths: country.newDeaths,
  	mortalityRate: country.mortalityRate
  	}, {merge: true});
  }
}

   getDataCountry(){
       let date = new Date();
       date.setDate(date.getDate() - 1);
       let latest_date= this.datepipe.transform(date, 'yyy-MM-dd');
       let dateUpdate = JSON.parse(localStorage.getItem("dataWorld")).date;
       if(dateUpdate != latest_date){
      this.APISummary();
    }
       this.dataCountry = JSON.parse(localStorage.getItem("dataCountry"));
    return this.dataCountry;
  }

goToCountry(c : String){
        this.router.navigate(['country/', c], {queryParams: {name: c}});
        }


getDataOneCountry(c : String){
    this.dataCountry = this.getDataCountry();
        for (var data of this.dataCountry){
        if (c==data.country){
            return data;
        }
    }
}

getSummary(){
    return this.http.get<JSON>('https://api.covid19api.com/summary').toPromise();
  }

getSummaryCountryConfirmed(c : String){
    return this.http.get<JSON>('https://api.covid19api.com/dayone/country/france/status/confirmed').toPromise();
}
  
  /*displayNews(country: String){
  let news = [];
  const users = this.firestore.collection("users")
  users.get().then(snapshot => {
    snapshot.forEach(doc => {
      let news_item = doc.collection("news", ref => {
        ref.where("country", "==", country)});
      news.push(new News (news_item.date, news_item.descrip, news_item.country));
        })});
   return news;
  }*/

  /*public getCountryData(): Observable<DataCountry[]>{
    return this.http.get('https://api.covid19api.com/summary').pipe(
      map(
        (jsonArray: Object[]) => jsonArray.map(jsonItem => DataCountry.fromJson(jsonItem))
      )
    );
  }*/
  

  



}
