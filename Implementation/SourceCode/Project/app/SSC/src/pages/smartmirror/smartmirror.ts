import {Component, ViewChild} from '@angular/core';
import {App, IonicPage, NavController, NavParams} from 'ionic-angular';
import { AuthResponse, BackendProvider, ShowerStat, ToiletStat, User } from '../../providers/backend/backend.provider';
import {Chart} from 'chart.js';
import {LoadingController} from 'ionic-angular';
import {ColorUtil} from "../../providers/colorUtil/colorUtil.provider";
/**
 * Generated class for the SmartmirrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-smartmirror',
  templateUrl: 'smartmirror.html',
})
export class SmartmirrorPage {
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

  constructor(public navCtrl: NavController, private app: App, public navParams: NavParams, private backend: BackendProvider, public loadingCtrl: LoadingController, public colorUtil: ColorUtil) {
    this.timeRefresh();
    //window.setInterval(this.refresh, 5000);
  }

  timeRefresh() {
    this.refresh();
    this.delay(20000).then(() => {
      this.timeRefresh();
    })
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      responsive: false,
      type: 'bar',
      data: {
        labels: flatMates,
        datasets: [{
          label: 'time in minutes',
          data: averageShowerTimes,
          backgroundColor: [
            this.colorUtil.getColor('graph_dark_color_1'),
            this.colorUtil.getColor('graph_dark_color_2'),
            this.colorUtil.getColor('graph_dark_color_3')
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        legend: {
          labels: {
            fontColor: "white"
          }
        },
        scales: {
          yAxes: [{
            gridLines:{
              color:"white",
              zeroLineColor:"white"
            },
            ticks: {
              beginAtZero: true,
              fontColor: "white"
            }
          }],
          xAxes: [{
            gridLines:{
              color:"white",
              zeroLineColor:"white"
            },
            ticks: {
              fontColor: "white"
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
      responsive: true,
      type: 'doughnut',
      data: {
        labels: flatMates,
        datasets: [{
          data: showerCounts,
          backgroundColor: [
            this.colorUtil.getColor('graph_dark_color_1'),
            this.colorUtil.getColor('graph_dark_color_2'),
            this.colorUtil.getColor('graph_dark_color_3')
          ],
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ]
        }]
      }, options : {
        legend: {
          labels: {
            fontColor: "white"
          }
        }
      }
    });
  }

  refresh() {
    // Variable definition
    let email = "lorenz.graaf@gmail.com";
    let secret = "ada";

    // Backend call example
    console.log('refreshing view...');
    this.backend.authenticate(email, secret).then((result) => {
      if (result.authResponse == AuthResponse.SUCCESS) {
        // Authentication successful
        this.backend.getUsers(email, secret).then((users) => {
          this.users = users;
        });

        this.backend.getToiletStats(email, secret).then((tStat) => {
          this.tStat = tStat;
          console.log(tStat);
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
          console.log(this.tStat.toilet_paper)

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

  ionViewDidLoad() {
  }

  goBack() {
    this.navCtrl.pop();
  }

}
