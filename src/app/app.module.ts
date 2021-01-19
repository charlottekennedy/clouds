import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { SigninComponent } from './signin/signin.component';
import { CovidDataComponent } from './covid-data/covid-data.component';
import { NewsComponent } from './news/news.component';
import { AddNewsComponent } from './add-news/add-news.component';
import { CovidDataCountryComponent } from './covid-data-country/covid-data-country.component';



@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    CovidDataComponent,
    NewsComponent,
    AddNewsComponent,
    CovidDataCountryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
 AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
