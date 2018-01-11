import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsPaymentDetailPage } from './fs-payment-detail';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    FsPaymentDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FsPaymentDetailPage),
    ComponentsModule
  ],
})
export class FsPaymentDetailPageModule {}
