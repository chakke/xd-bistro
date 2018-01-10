import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsPaymentPage } from './fs-payment';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    FsPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(FsPaymentPage),
    ComponentsModule
  ],
})
export class FsPaymentPageModule {}
