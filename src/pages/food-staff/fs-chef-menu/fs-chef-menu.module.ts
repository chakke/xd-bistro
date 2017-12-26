import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FsChefMenuPage } from './fs-chef-menu';
import { ComponentsModule } from "../../../components/food-staff/components.module";
import { PipesModule } from "../../../pipes/pipes.module";

@NgModule({
  declarations: [
    FsChefMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FsChefMenuPage),
    ComponentsModule,
    PipesModule
  ],
})
export class FsChefMenuPageModule {}
