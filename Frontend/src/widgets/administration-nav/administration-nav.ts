import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {HomePage} from "../../pages/home/home";

@Component({
  selector: "administration-nav",
  templateUrl: "administration-nav.html"
})

export class AdministrationNav {
  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public restProvider: RestProvider,) {
  }

  invalidateLicenseStatus() {
    console.log("CLICK", HomePage.isLicenseSelected)
    this.restProvider.callVoidGet("api/v1/dmp/invalidateLicenseStatus")
      .then(data => {
        console.log("licenseStatus", false);
        HomePage.isLicenseSelected = false;
        this.navCtrl.setRoot('Home');
      })
      .catch(error => {
        console.error("Failed to invalidate license: " + JSON.stringify(error));
        this.navCtrl.setRoot('Home');
      });
  }
}
