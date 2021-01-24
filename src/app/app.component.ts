import { Component } from '@angular/core';
import { CovidService } from './covid.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'covid';

signedIn : boolean = false;

constructor(public covidService : CovidService) { }

ngOnInit(): void {
    this.signedIn = this.covidService.userSignedIn();
}

async login(){
    this.signedIn = this.covidService.userSignedIn();
    if (this.signedIn){
        this.covidService.signOut();
        this.signedIn = false;
    }
    else {
        await this.covidService.signInWithGoogle();
        this.signedIn = true;
    }
}
}
