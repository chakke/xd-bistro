import { Injectable } from '@angular/core';
import { App, ToastController, Toast } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';

import { User, Bartender, Chef, Manager, Staff, Waiter } from '../classes/user';
@Injectable()
export class AppControllerProvider {
  user: User;
  toast: Toast;

  constructor(private app: App,
    private facebook: Facebook,
    public afAuth: AngularFireAuth,
    public googlePlus: GooglePlus,
    private toastCtrl: ToastController) {
    console.log('Hello AppControllerProvider Provider');
  }

  setRootPage(page: any) {
    this.app.getActiveNav().setRoot(page);
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
      }, error => {
        reject("Đăng nhập thất bại " + error.code);
        console.log(error);
      })
    })
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
