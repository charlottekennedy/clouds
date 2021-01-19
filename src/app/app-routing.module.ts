import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { CovidDataComponent } from './covid-data/covid-data.component';
import { CovidDataCountryComponent } from './covid-data-country/covid-data-country.component';
import { NewsComponent } from './news/news.component';
import { AuthGuard } from './auth.guard';
import { SecurePagesGuard } from './secure-pages.guard';


const routes: Routes = [
   {path : "signin", component: SigninComponent, canActivate: [SecurePagesGuard]},
   {path : "worldwide", component : CovidDataComponent},
   {path : "country/:name", component : CovidDataCountryComponent},
   {path : "news", component : NewsComponent, canActivate: [AuthGuard]},
   {path : "", pathMatch: "full", redirectTo : "worldwide"},
   {path: "**", redirectTo : "worldwide"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
