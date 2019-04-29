import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomePage} from '../pages/home/home.component';

import {AlertController} from "ionic-angular";
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {BackendProvider} from "../providers/backend/backend.provider";
import {SmartmirrorPage} from "../pages/smartmirror/smartmirror";

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = HomePage;

  // auth variables
  email: string = 'lorenz.graaf@gmail.com';
  secret: string = 'ada';

  constructor(public http: Http, platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen, private push: Push, public alertCtrl: AlertController, public backend: BackendProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('cordova')) {
        // You're on a device, call the native plugins. Example:
        this.initPushNotification();
      } else {
        // You're testing in browser, do nothing or mock the plugins' behaviour.
      }
    });
  }

  saveDeviceToken(t: string) {
    this.backend.setPushId(this.email, this.secret, t).then((result) => {
      console.log('Saved PushId to backend with result code: ' + result);
    }).catch((err) => {
      console.log(err);
    })
  }

  initPushNotification() {
    // to check if we have permission
    this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
        } else {
          console.log('We do not have permission to send push notifications');
        }

      });

    // to initialize push notifications
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);

      //Notification Display Section

      let confirmAlert = this.alertCtrl.create({
        title: 'New Notification',
        message: JSON.stringify(notification),
        buttons: [{
          text: 'Ignore',
          role: 'cancel'
        }, {
          text: 'View',
          handler: () => {
            //TODO: Your logic here
            //self.nav.push(DetailsPage, {message: data.message});
          }
        }]
      });
      confirmAlert.present();

    });


    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      //alert(JSON.stringify(registration));
      this.saveDeviceToken(registration.registrationId);
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
}
