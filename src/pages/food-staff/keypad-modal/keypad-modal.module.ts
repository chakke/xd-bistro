import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KeypadModalPage } from './keypad-modal';

@NgModule({
  declarations: [
    KeypadModalPage,
  ],
  imports: [
    IonicPageModule.forChild(KeypadModalPage),
  ],
})
export class KeypadModalPageModule {}
