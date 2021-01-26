import { Component } from '@angular/core';
import { CovidService } from './covid.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid';

signedIn : boolean;

constructor(public covidService : CovidService, public router: Router) { }

ngOnInit(): void {
    this.signedIn = this.covidService.userSignedIn();
}

async login(){
    this.signedIn = this.covidService.userSignedIn();
    if (this.signedIn){
        this.covidService.signOut();
        this.signedIn = false;
        this.router.navigate(["worldwide"]);
    }
    else {
        await this.covidService.signInWithGoogle();
        this.signedIn = true;
        this.router.navigate(["news"]);
    }
}

async goToNews(){
    this.signedIn = this.covidService.userSignedIn();
    if (this.signedIn){
        this.router.navigate(["news"]);
    }
    else {
        await this.covidService.signInWithGoogle();
        this.signedIn = true;
        this.router.navigate(["news"]);
    }
}

}
