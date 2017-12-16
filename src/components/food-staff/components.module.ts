import { NgModule } from '@angular/core';
import { FsHeaderComponent } from './fs-header/fs-header';
import { IonicPageModule } from 'ionic-angular';
import { FsNumberPickerComponent } from './fs-number-picker/fs-number-picker';
import { ScrollToTopComponent } from "./scroll-to-top/scroll-to-top";

@NgModule({
	declarations: [FsHeaderComponent, FsNumberPickerComponent, ScrollToTopComponent],
	imports: [IonicPageModule],
	exports: [FsHeaderComponent, FsNumberPickerComponent, ScrollToTopComponent]
})
export class ComponentsModule { }
