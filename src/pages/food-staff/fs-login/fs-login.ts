import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';


@IonicPage()
@Component({
  selector: 'page-fs-login',
  templateUrl: 'fs-login.html',
})
export class FsLoginPage {

  loginType: number = 2; //1 == Đăng nhập bằng tài khoản. 2 == Đăng nhập bằng mạng xã hội

  account = "xuanduannguyen@gmail.com";
  password = "123456";
  loginForm: FormGroup;
  isSubmitted = false;
  accountErrorMessage = "";
  passwordErrorMessage = "";

  rootPage = "FsHomePage";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private appController: AppControllerProvider,
  ) {
    this.loginForm = this.formBuilder.group({
      account: ["", Validators.compose([Validators.maxLength(100), Validators.minLength(6), Validators.required])],
      password: ["", Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  ionViewDidEnter() {
  }

  loginWithFacebook() {
    this.appController.loginWithFacebook().then(success => {
      this.appController.showToast(success);
      this.loginSuccess();
    }, error => {
      this.appController.showToast(error);
    })
  }

  loginWithGoogle() {
    this.appController.loginWithGoogle().then(success => {
      this.appController.showToast(success);
      this.loginSuccess();
    }, error => {
      this.appController.showToast(error);
    })
  }

  login() {
    this.isSubmitted = true;
    if (this.loginForm.valid) {
      this.appController.loginWithAccountPassword(this.account, this.password).then(success => {
        this.appController.showToast(success);
        this.loginSuccess();
      }, error => {
        this.appController.showToast(error);
      })
    } else {
      this.checkForm();
    }
  }

  loginSuccess() {
    this.appController.setRootPage(this.rootPage); 
  }

  checkForm() {
    let accountError = this.loginForm.controls.account.errors;
    if (accountError) {
      if (accountError.hasOwnProperty('required')) {
        this.accountErrorMessage = "Vui lòng điền tài khoản";
      } else {
        this.accountErrorMessage = "Tài khoản không hợp lệ";
      }
    }
    let passwordError = this.loginForm.controls.password.errors;
    if (passwordError) {
      if (passwordError.hasOwnProperty('required')) {
        this.passwordErrorMessage = "Vui lòng điền mật khẩu";
      } else {
        this.passwordErrorMessage = "Mật khẩu phải có độ dài tối thiểu 6 kí tự";
      }
    }
  }

  changeLoginForm() {
    this.loginType = 3 - this.loginType; 
  }
}
