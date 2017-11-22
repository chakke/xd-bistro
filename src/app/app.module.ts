import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';

import { AppControllerProvider } from '../providers/food-staff/app-controller/app-controller';
import { FoodStaffHttpServiceProvider } from '../providers/food-staff/food-staff-http-service/food-staff-http-service';
import { HttpService } from "../providers/http-service";
import { ProgressControllerProvider } from "../providers/food-staff/progress-controller/progress-controller";

export const firebaseConfig = {
  apiKey: "AIzaSyDMEZoEtmor-T166lP9bGCR9FxqQP4eGik",
  authDomain: "bistrodancerapp.firebaseapp.com",
  databaseURL: "https://bistrodancerapp.firebaseio.com",
  projectId: "bistrodancerapp",
  storageBucket: "bistrodancerapp.appspot.com",
  messagingSenderId: "773087969883"
};

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppControllerProvider,
    Facebook,
    GooglePlus,
    FoodStaffHttpServiceProvider,
    HttpService,
    ProgressControllerProvider
  ]
})
export class AppModule { }
