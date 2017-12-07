import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-create-order',
  templateUrl: 'create-order.html',
})
export class CreateOrderPage {
  @ViewChild("backdrop") backdropRef: ElementRef;
  createOrderForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private formBuilder: FormBuilder) {
    this.createOrderForm = this.formBuilder.group({
      number: ["", Validators.required],
      name: [""],
      phone: [""]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderPage');
    this.backdropRef.nativeElement.addEventListener('click', () => {
      console.log("fucker click");
      this.viewCtrl.dismiss();
    })
  }

  checkForm(){

  }

}
