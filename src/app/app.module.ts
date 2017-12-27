import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
// import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestoreModule} from 'angularfire2/firestore';
import * as firebase from 'firebase';

import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { MyApp } from './app.component';

import { AppControllerProvider } from '../providers/food-staff/app-controller/app-controller';
import { FoodStaffHttpServiceProvider } from '../providers/food-staff/food-staff-http-service/food-staff-http-service';
import { HttpService } from "../providers/http-service";
import { ProgressControllerProvider } from "../providers/food-staff/progress-controller/progress-controller";
import { ResourceLoader } from '../providers/resource-loader/resource-loader';
import { File } from '@ionic-native/file';
import { FirebaseServiceProvider } from '../providers/food-staff/firebase-service/firebase-service';

export const firebaseConfig = {
  apiKey: "AIzaSyDMEZoEtmor-T166lP9bGCR9FxqQP4eGik",
  authDomain: "bistrodancerapp.firebaseapp.com",
  databaseURL: "https://bistrodancerapp.firebaseio.com",
  projectId: "bistrodancerapp",
  storageBucket: "bistrodancerapp.appspot.com",
  messagingSenderId: "773087969883"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp, {
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppControllerProvider,
    Facebook,
    GooglePlus,
    FoodStaffHttpServiceProvider,
    HttpService,
    ProgressControllerProvider,
    ResourceLoader,
    File,
    FirebaseServiceProvider
  ]
})
export class AppModule { }
