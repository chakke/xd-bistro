import { Component } from '@angular/core';
import { Platform, MenuController, NavController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppControllerProvider } from "../providers/food-staff/app-controller/app-controller";
import { User } from "../providers/food-staff/classes/user";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  user: User;
  // rootPage: any = "FsLoginPage";
  // rootPage: any = "FsOrdersPage";
  rootPage: any = "CreateOrderPage";
  rootPages = ["FsLoginPage"];

  menuItems = [
    {
      name: "Thông báo",
      icon: "fs-bell-o"
    },
    {
      name: "Cài đặt",
      icon: "ios-cog"
    }
  ]

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private menuCtrl: MenuController,
    private app: App,
    private appController: AppControllerProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.getMenu();
    this.getUser();
  }

  getMenu() {
    this.appController.menuSubject.asObservable().subscribe(data => {
      this.menuItems = data;
      console.log("subcrise menu", data);
    }, error => {
      console.log("menu subcrise error");
    })
  }

  getUser() {
    this.appController.userSubject.asObservable().subscribe(data => {
      this.user = data;
      console.log("subcrise user", data);
    }, error => {
      console.log("user subcries error");
    }) 
  }

  ngAfterViewInit(){   
    this.app.getActiveNav().viewWillEnter.subscribe(event => { 
      console.log("page name", event.id);
      if(this.rootPages.indexOf(event.id) == -1){
        if(!this.user){
          //Un-comment this for production
          // this.appController.setRootPage(this.rootPage);
        }
      }
    })
  }
  
  gotoMenu(item) {
    this.appController.setRootPage(item.page);
    this.menuCtrl.close();
  }
}

