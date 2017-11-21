import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsHomePage } from './fs-home';

@NgModule({
  declarations: [
    FsHomePage,
  ],
  imports: [
    IonicPageModule.forChild(FsHomePage),
  ],
})
export class FsHomePageModule {}
