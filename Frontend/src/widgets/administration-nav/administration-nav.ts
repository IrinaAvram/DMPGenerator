import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';

@Component({
  selector: "administration-nav",
  templateUrl: "administration-nav.html"
})

export class AdministrationNav {
  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController) {
  }
}
