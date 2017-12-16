import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsLoadingPage } from './fs-loading';

@NgModule({
  declarations: [
    FsLoadingPage,
  ],
  imports: [
    IonicPageModule.forChild(FsLoadingPage),
  ],
})
export class FsLoadingPageModule {}
