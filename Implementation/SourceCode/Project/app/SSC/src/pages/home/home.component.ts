import {Component} from '@angular/core';
import {EnvironmentPage} from "../Environment/Environment.component";
import {SscPage} from "../ssc/ssc.component";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  tab1Root = EnvironmentPage;
  tab3Root = SscPage;

  constructor() {
  }
}
