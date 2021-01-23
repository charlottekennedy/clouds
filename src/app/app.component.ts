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
}
