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


@Injectable({
  providedIn: 'root'
})
export class CovidService {

  private user: User;
  private dataWorld : DataWorld;
  private dataCountry : DataCountry[];

  constructor(private afAuth: AngularFireAuth, private router: Router, private firestore: AngularFirestore, protected http: HttpClient) { }
  
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

APISummary(){
	var global;
	this.getSummary().subscribe(response =>{
  	global = response["Global"];});
  	this.dataWorld = {
  	 totalCases: global["TotalConfirmed"],
  	 newCases: global["NewConfirmed"],
	activeCases: global["TotalConfirmed"] - global["TotalRecovered"],
  	totalRecovered: global["TotalRecovered"],
  	newRecovered: global["NewRecovered"],
  	recoveryRate: global["TotalRecovered"]/ global["TotalConfirmed"] *100,
  	totalDeaths: global["TotalDeaths"],
  	newDeaths: global["NewDeaths"],
  	mortalityRate: global["TotalDeaths"]/global["TotalConfirmed"] *100
  	};
  	/*this.dataCountry = response["Countries"];
  	});*/
  	localStorage.setItem("worldData", JSON.stringify(this.dataWorld));
  	/*localStorage.setItem("countryData", JSON.stringify(this.dataCountry));*/
  	this.updateDataWorld();
  	/*this.updateCountryData();*/
  
  }
  
private updateDataWorld(){
  	this.firestore.collection("dataWorld").doc("data").set({
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
    return this.dataWorld;
  }
/*private updateCountryData(){	this.firestore.collection("dataWorld").doc(this.dataCountry.country).set({
	
	}, {merge: true});
}*/
    public getSummary(){
    return this.http.get<JSON>('https://api.covid19api.com/summary');
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
