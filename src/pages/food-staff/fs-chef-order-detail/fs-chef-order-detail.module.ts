import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefOrderDetailPage } from './fs-chef-order-detail';

@NgModule({
  declarations: [
    FsChefOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefOrderDetailPage),
  ],
})
export class FsChefOrderDetailPageModule {}
