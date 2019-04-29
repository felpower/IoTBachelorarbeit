import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SmartmirrorPage } from './smartmirror';

@NgModule({
  declarations: [
    SmartmirrorPage,
  ],
  imports: [
    IonicPageModule.forChild(SmartmirrorPage),
  ],
})
export class SmartmirrorPageModule {}
