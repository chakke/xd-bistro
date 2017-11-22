import { Injectable } from '@angular/core';
import { App, ToastController, Toast } from 'ionic-angular';

import { FoodStaffHttpServiceProvider } from "../food-staff-http-service/food-staff-http-service";

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { User, Bartender, Chef, Manager, Staff, Waiter } from '../classes/user';
import { Menu } from "../classes/menu";

import { UserPool } from "../object-pools/user-pool";

import { Subject } from 'rxjs/Subject';
import { UserContant } from '../app-constant';
@Injectable()
export class AppControllerProvider {
  toast: Toast;
  menuItems: Array<Menu> = [];
  user: User;
  userPool: UserPool;

  menuSubject: Subject<Array<Menu>> = new Subject<Array<Menu>>();
  userSubject: Subject<User> = new Subject<User>();
  constructor(private app: App,
    private facebook: Facebook,
    public afAuth: AngularFireAuth,
    public googlePlus: GooglePlus,
    private toastCtrl: ToastController,
    private httpService: FoodStaffHttpServiceProvider) {
    // initialize pools
    this.userPool = new UserPool();
  }

  pushPage(page: any) {
    if (this.setActivePage(page)) {
      this.app.getActiveNav().push(page);
    }
  }

  setRootPage(page: any) {
    if (this.setActivePage(page)) {
      this.app.getActiveNav().setRoot(page);
    }
  }

  setActivePage(page: any) {
    if (page && page != "") {
      let activeIndex = this.menuItems.findIndex(elm => {
        return elm.active;
      })
      if (activeIndex > -1) {
        if (this.menuItems[activeIndex].page == page || this.menuItems[activeIndex].link == page) {
          return false;
        } else {
          this.menuItems[activeIndex].active = false;
        }
      }
      for (let item of this.menuItems) {
        if (item.page == page || item.link == page) {
          item.active = true;
        }
      }
      return true;
    }
    return false;
  }


  loginWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.facebook.login(['public_profile', 'user_friends', 'email'])
        .then((res: FacebookLoginResponse) => {
          let facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(res.authResponse.accessToken);
          this.afAuth.auth.signInWithCredential(facebookCredential).then(success => {
            resolve("Đăng nhập thành công");
            console.log(success);
          }, error => {
            reject("Không thể đăng nhập vào firebase " + error.code);
            console.log(error);
          });
        })
        .catch(e => {
          reject("Không thể đăng nhập vào facebook");
        });
    })
  }

  loginWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googlePlus.login({}).then(res => {
        let googloeCredential = firebase.auth.GoogleAuthProvider
          .credential(null, res.accessToken);

        this.afAuth.auth.signInWithCredential(googloeCredential).then(success => {
          resolve("Đăng nhập thành công");
          console.log(success);
        }, error => {
          reject("Không thể đăng nhập vào firebase " + error.code);
          console.log(error);
        });
      }, error => {
        reject("Không thể đăng nhập vào google")
      })
    })
  }

  loginWithAccountPassword(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password).then(success => {
        resolve("Đăng nhập thành công");
        console.log(success);
        this.loginSuccess({ id: 1, type: UserContant.USER_TYPE.WAITER, isLoggedIn: true, loginMethod: UserContant.LOGIN_METHOD.ACCOUNT, firstName: "Trinh", lastName: "Ngọc" })
      }, error => {
        reject("Đăng nhập thất bại " + error.code);
        console.log(error);
      })
    })
  }

  logout() {
    this.user = null;
  }

  loginSuccess(userData: any) {
    if (userData.type) {
      this.user = this.userPool.getItemWithData(userData);
      this.userSubject.next(this.user);
      this.getMenu();
    }
  }

  getMenu() {
    if (this.user) {
      this.httpService.getMenu(this.user.id).then(data => {
        if (data && data.result == 1 && data.content) {
          this.menuItems = [];
          data.content.forEach(element => {
            let menu = new Menu(element.id, element.name, element.icon, false, element.page, element.link);
            this.menuItems.push(menu);
          });
          this.setRootPage(this.menuItems[0].page);
          this.menuSubject.next(this.menuItems);
        }
      })
    }
  }

  showToast(message: string, duration?: number, position?: string) {
    if (this.toast) this.hideToast();
    this.toast = this.toastCtrl.create({
      message: message,
      duration: (duration ? duration : 3000),
      position: (position ? position : "bottom")
    })
    this.toast.present();
  }

  hideToast() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }

}
