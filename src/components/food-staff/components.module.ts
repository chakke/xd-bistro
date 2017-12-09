import { NgModule } from '@angular/core';
import { FsHeaderComponent } from './fs-header/fs-header';
import { IonicPageModule } from 'ionic-angular';
import { FsNumberPickerComponent } from './fs-number-picker/fs-number-picker';
@NgModule({
	declarations: [FsHeaderComponent, FsNumberPickerComponent],
	imports: [IonicPageModule],
	exports: [FsHeaderComponent, FsNumberPickerComponent]
})
export class ComponentsModule {}
