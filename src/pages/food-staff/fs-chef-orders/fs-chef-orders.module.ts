import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefOrdersPage } from './fs-chef-orders';

@NgModule({
  declarations: [
    FsChefOrdersPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefOrdersPage),
  ],
})
export class FsChefOrdersPageModule {}
