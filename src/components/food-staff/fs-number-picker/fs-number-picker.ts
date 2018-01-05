import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@Component({
  selector: 'fs-number-picker',
  templateUrl: 'fs-number-picker.html'
})
export class FsNumberPickerComponent {
  @Input() number: number;
  @Input() amountOrder: number;
  @Output() numberChange: EventEmitter<number> = new EventEmitter<number>();

  numpads = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  isPicking = false;

  constructor(
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    this.number = 9;
  }

  selectNumber() {
    console.log("select number", this.number);
    let modal = this.modalCtrl.create("KeypadModalPage", { number: this.number });
    modal.present();
    this.isPicking = true;
    modal.onDidDismiss(data => {
      this.isPicking = false;
      console.log("dismiss keyboard", data);
      // if (this.amountOrder && data > this.amountOrder) {
      //   this.appController.showToast("Số lượng trả lớn hơn đã order", 3000);
      // }
      // || (this.amountOrder && data <= this.amountOrder)
      this.number = data;
      this.numberChange.next(this.number);
    })
  }

  keypadCloseCallBack(number) {
    this.number = number;
    console.log("Close keyboard");

  }
}
