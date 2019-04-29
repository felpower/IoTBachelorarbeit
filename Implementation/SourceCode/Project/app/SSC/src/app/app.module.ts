import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home.component';
import {BackendProvider} from '../providers/backend/backend.provider';
import {EnvironmentPage} from "../pages/Environment/Environment.component";
import {SscPage} from "../pages/ssc/ssc.component";
import { Push } from '@ionic-native/push';
import {ColorUtil} from "../providers/colorUtil/colorUtil.provider";
import {SmartmirrorPage} from "../pages/smartmirror/smartmirror";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EnvironmentPage,
    SscPage,
    SmartmirrorPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EnvironmentPage,
    SscPage,
    SmartmirrorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BackendProvider,
    Push,
    ColorUtil
  ]
})

export class AppModule {
}
