import { Injectable } from '@angular/core';
import { HttpService, ParamBuilder } from '../../http-service';
import { ToastController, Toast } from 'ionic-angular';
import { AssetsUrl, FakeApiUrl, ResponseCode } from '../app-constant';
import 'rxjs/Rx';
import { Md5 } from 'ts-md5/dist/md5';
@Injectable()
export class FoodStaffHttpServiceProvider {
  serviceUrl = "http://125.212.192.94:8080/bistro_app/ws";
  isUseFakeData = true;

  constructor(private httpService: HttpService) {
  }

  requestGet(url: string, param: string) {
    return this.httpService.requestGet(url, param).catch(error => {
      console.log("Error in http request GET " + url, error.status);
      // if (error.status == 0) {
      //   if (!this.toast) {
      //     this.toast = this.toastCtrl.create({
      //       message: "No internet connection!",
      //       position: "top"
      //     })
      //     this.toast.present();
      //     setTimeout(() => {
      //       if (this.toast)
      //         this.toast.dismiss();
      //       this.toast = null;
      //     }, 2000)
      //   }
      // }
    });
  }

  requestPost(url: string, param: string) {
    return this.httpService.requestPost(url, param).catch(error => {
      console.log("Error in http request POST " + url, error.status);
      // if (error.status == 0) {
      //   if (!this.toast) {
      //     this.toast = this.toastCtrl.create({
      //       message: "No internet connection!",
      //       position: "top"
      //     })
      //     this.toast.present();
      //     setTimeout(() => {
      //       if (this.toast)
      //         this.toast.dismiss();
      //       this.toast = null;
      //     }, 2000)
      //   }
      // }
    });;
  }

  //Lấy danh sách menu
  getMenu(userId: number): Promise<any> {
    if (this.isUseFakeData) return this.requestGet(AssetsUrl.BASE_URL + FakeApiUrl.MENU, "");
    // return this.requestGet(this.serviceUrl + APIUrl.PROVINCE, "");
  }

  //Lấy danh sách các bàn cùng thông tin order
  getTableInOrder(restId: number): Promise<any> {
    if (this.isUseFakeData) return this.requestGet(AssetsUrl.BASE_URL + FakeApiUrl.TABLE_IN_ORDER, "");
  }

  //Lấy các Order hiện tại
  getCUrrentOrder(restId: number): Promise<any> {
    if (this.isUseFakeData) return this.requestGet(AssetsUrl.BASE_URL + FakeApiUrl.CURRENT_ORDER, "");
  }

}
