import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsServePage } from './fs-serve';
import { ComponentsModule } from '../../../components/food-staff/components.module';

@NgModule({
  declarations: [
    FsServePage,
  ],
  imports: [
    IonicPageModule.forChild(FsServePage),
    ComponentsModule
  ],
})
export class FsServePageModule { }
