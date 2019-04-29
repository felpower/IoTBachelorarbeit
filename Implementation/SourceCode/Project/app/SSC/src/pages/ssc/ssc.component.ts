import {Component, ViewChild} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import { AuthResponse, BackendProvider, ShowerStat, ToiletStat, User } from '../../providers/backend/backend.provider';
import {Chart} from 'chart.js';
import {LoadingController} from 'ionic-angular';
import {ColorUtil} from "../../providers/colorUtil/colorUtil.provider";
import {SmartmirrorPage} from "../smartmirror/smartmirror";

@Component({
  selector: 'page-ssc',
  templateUrl: 'ssc.html'
})

export class SscPage {
  // Member definition
  tStat: ToiletStat = null;
  users: User[] = null;
  sStat: ShowerStat[] = null;

  rolls: number[] = [];
  occupationState: String;

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

        this.backend.getToiletStats(email, secret).then((tStat) => {
          this.tStat = tStat;
          //console.log(tStat);
          this.rolls = Array(+this.tStat.toilet_paper);

          switch(this.tStat.toilet_occupation) {
            case "0": {
              this.occupationState = "free";
              break;
            }
            case "1": {
              this.occupationState = "occupied";
              break;
            }
            case "2": {
              this.occupationState = "The user before you, was recently on the toilet";
              break;
            }
            default: {
              this.occupationState = "loading...";
              break;
            }
          }
          console.log(this.occupationState);
        });

        this.backend.getShowerStats(email, secret).then((showerStats) => {
          this.sStat = showerStats;
          this.updateCharts()
        });
      } else if (result.authResponse == AuthResponse.DENIED) {
        console.log("Invalid Credentials");
      } else {
        console.log("An unknown error occurred during the authentication process.")
      }
    });
  }

  updateCharts() {
    // Check if all necessary data is available
    if (this.users != null && this.sStat != null && this.tStat != null) {
      // todo
      this.updateTimeChart(this.sStat);
      this.updateCountChart(this.sStat);
      //this.loader.dismiss();
    } else {
      /*
      console.log("not enough data ready for ui update:");
      console.log(this.users);
      console.log(this.sStat);
      console.log(this.counts);
      */
    }
  }

  updateTimeChart(showerStats: ShowerStat[]) {
    let averageShowerTimes: number[] = [];
    let flatMates: string[] = [];

    for(let i = 0; i < showerStats.length; i++) {
      flatMates.push(showerStats[i].name);
      averageShowerTimes.push(showerStats[i].showertime / showerStats[i].showercount / 60);
    }

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: flatMates,
        datasets: [{
          label: 'time in minutes',
          data: averageShowerTimes,
          backgroundColor: [
            this.colorUtil.getColor('graph_light_color_1'),
            this.colorUtil.getColor('graph_light_color_2'),
            this.colorUtil.getColor('graph_light_color_3')
          ],
          hoverBackgroundColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  updateCountChart(showerStats: ShowerStat[]) {
    let showerCounts: number[] = [];
    let flatMates: string[] = [];

    for(let i = 0; i < showerStats.length; i++) {
      flatMates.push(showerStats[i].name);
      showerCounts.push(showerStats[i].showercount);
    }


    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: flatMates,
        datasets: [{
          data: showerCounts,
          backgroundColor: [
            this.colorUtil.getColor('graph_light_color_1'),
            this.colorUtil.getColor('graph_light_color_2'),
            this.colorUtil.getColor('graph_light_color_3')
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ]
        }]
      }
    });
  }

  navigateToSmartMirror() {
    this.app.getRootNav().push(SmartmirrorPage);
  }
}
