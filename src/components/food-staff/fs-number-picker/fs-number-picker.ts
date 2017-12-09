import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { AppControllerProvider } from '../../../providers/food-staff/app-controller/app-controller';

@Component({
  selector: 'fs-number-picker',
  templateUrl: 'fs-number-picker.html'
})
export class FsNumberPickerComponent {
  @Input() number: number;
  @Output() numberChange: EventEmitter<number> = new EventEmitter<number>();

  numpads = [1, 2, 3, 4, 5, 6, 7, 8, 9];


  constructor(
    private appController: AppControllerProvider,
    private modalCtrl: ModalController) {
    console.log('Hello FsNumberPickerComponent Component');
    this.number = 1;
  }

    selectNumber() {
    let modal = this.modalCtrl.create("KeypadModalPage", {number: this.number});
    modal.present();
    modal.onDidDismiss(data=>{
      if(data != null && data != undefined){
        this.number = data;
      }
    })
  }

  keypadCloseCallBack(number) {
    console.log("hey fucker done", number);
    this.number = number;
  }
}
