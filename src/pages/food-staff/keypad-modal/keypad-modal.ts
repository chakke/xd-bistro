import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  selector: 'page-keypad-modal',
  templateUrl: 'keypad-modal.html',
})
export class KeypadModalPage {

  //keypad 
  numberInKeyboard = "";
  numpads = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
    for (let i = 1; i <= 9; i++) {
      this.numpads.push(i);
    }
    let number = this.navParams.get("number");
    if (number != null && number != undefined) {
      this.numberInKeyboard = number + "";
    }
  }

  ionViewDidLoad() { 
  }

  backdropClick() {
    this.viewCtrl.dismiss();
  }

  done() {
    this.viewCtrl.dismiss(+this.numberInKeyboard);     
  }


  numpadClick(numpad) { 
    this.numberInKeyboard += "" + numpad;
  }

  clear() {
    this.numberInKeyboard = "";
  }

  delete() {
    let length = this.numberInKeyboard.length;
    if (length && length > 0) {
      this.numberInKeyboard = this.numberInKeyboard.substr(0, length - 1);
    } 
  }

}
