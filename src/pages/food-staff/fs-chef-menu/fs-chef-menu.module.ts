import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefMenuPage } from './fs-chef-menu';

@NgModule({
  declarations: [
    FsChefMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefMenuPage),
  ],
})
export class FsChefMenuPageModule {}
