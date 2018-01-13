import { Component,ViewChild } from '@angular/core';
import { Platform, MenuController, NavController, App,Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppControllerProvider } from "../providers/food-staff/app-controller/app-controller";
import { User } from "../providers/food-staff/classes/user";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  user: User;
  rootPage: any = "FsLoginPage";
  // rootPage: any = "FsServePage";
  // rootPage: any = "AddFoodToOrderPage";
  rootPages = ["FsLoginPage", "FsLoadingPage"];

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
  
    this.appController.menuChanel.asObservable().subscribe(data => {
      this.menuItems = data;
      console.log("subcrise menu", data);
    }, error => {
      console.log("menu subcrise error");
    })
  }

  getUser() {
    this.appController.userChanel.asObservable().subscribe(data => {
      this.user = data;
      this.user.userName = "Nguyen van D";
      console.log("subcrise user", data);
    }, error => {
      console.log("user subcries error");
    })
  }

  ngAfterViewInit() {
    this.app.getActiveNav().viewWillEnter.subscribe(event => {
      console.log("page name", event.id);
      if (this.rootPages.indexOf(event.id) == -1) {
        if (!this.user) {
          //Un-comment this for production
          this.appController.setRootPage(this.rootPage);
        }
      }
    })
  }

  gotoMenu(item) {
    this.appController.setRootPage(item.page);
    this.menuCtrl.close();
  }

  goToUserDetail(){
    console.log("CLick avartar");
    
  }

  logout() {
    this.menuCtrl.close().then(() => {
      this.appController.logout();
      this.appController.setRootPage("FsLoginPage");
    })
  }
}

