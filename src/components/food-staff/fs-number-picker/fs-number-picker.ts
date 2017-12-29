import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@Component({
  selector: 'fs-number-picker',
  templateUrl: 'fs-number-picker.html'
})
export class FsNumberPickerComponent {
  @Input() number: number;
  @Input() amountOrder : number;
  @Output() numberChange: EventEmitter<number> = new EventEmitter<number>();

  numpads = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  isPicking = false;

  constructor(
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    console.log('Hello FsNumberPickerComponent Component');
    this.number = 1;
  }

  selectNumber() {
    let modal = this.modalCtrl.create("KeypadModalPage", { number: this.number });
    modal.present();
    this.isPicking = true;
    modal.onDidDismiss(data => {
      this.isPicking = false;
      if(this.amountOrder && data > this.amountOrder){
        this.appController.showToast("Số lượng trả lớn hơn đã order",3000);
      }
      if (data != null && data != undefined || (this.amountOrder && data <= this.amountOrder)) {
        this.number = data;
        this.numberChange.next(this.number);
      }
      
    })
  }

  keypadCloseCallBack(number) {
    this.number = number;
  }
}
