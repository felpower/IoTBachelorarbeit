import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-Environment',
  templateUrl: 'Environment.html',
})
export class EnvironmentPage {
  eStat: environmeneStat = null;
  users: User[] = null;
  wgId: number = null;

  //Charts
  @ViewChild('barCanvas')
  barCanvas;
  @ViewChild('doughnutCanvas')
  doughnutCanvas;

  barChart: any;
  doughnutChart: any;

  // Loader
  loader: any;

  constructor(public navCtrl: NavController, private app: App, public navParams: NavParams, public backend: BackendProvider, public loadingCtrl: LoadingController, public colorUtil: ColorUtil) {
    // Variable definition
    let email = "patrick.felbauer@gmail.com";
    let secret = "ada";

    // Backend call example
    this.backend.authenticate(email, secret).then((result) => {
      if (result.authResponse == AuthResponse.SUCCESS) {
        // Authentication successful
        this.backend.getUsers(email, secret).then((users) => {
          this.users = users;
        });

        this.backend.getEnvironmentStats(email, secret).then((eStat) => {
          this.eStat = eStat;
          //console.log(eStat);
          this.rain = Array(+this.eStat.rain);
          this.humidity = Array(+this.eStat.humidity);
          this.temperature = Array(+this.eStat.temperature);
          this.temp_exact = Array(+this.eStat.temperature_exact);
        });
      } else if (result.authResponse == AuthResponse.DENIED) {
        console.log("Invalid Credentials");
      } else {
        console.log("An unknown error occurred during the authentication process.")
      }
    });
  }

  navigateToSmartMirror() {
    this.app.getRootNav().push(SmartmirrorPage);
  }
}
