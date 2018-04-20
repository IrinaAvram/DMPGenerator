import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private basicInfoForm:any;
  private dmpCreationStep:any;
  private foundOnTiss:any;

  constructor(public restProvider: RestProvider,
              public formBuilder: FormBuilder,
              public navCtrl: NavController,
              public toastCtrl: ToastController) {
    this.dmpCreationStep = "basicInfo";
    this.foundOnTiss = false;
    this.setUpValidation(this.formBuilder);
  }

  setUpValidation(formBuilder) {

    this.basicInfoForm = formBuilder.group({
      project: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
      firstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
      lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
    });
  }

  findOnTiss() {
    this.restProvider.callGet("api/v1/dmp/getBasicInfo/" + this.basicInfoForm.value.firstName + "-" + this.basicInfoForm.value.lastName)
      .then(data => {
        console.log("response", data);
        this.foundOnTiss = true;
        this.toastCtrl.create({
          message: "Successfully obtained basic info for " + this.basicInfoForm.value.firstName + " " + this.basicInfoForm.value.lastName,
          duration: 3000
        }).present();

      })
      .catch(error => {
        console.error("Failed to get basic info: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get basic info",
          duration: 3000
        }).present();
      });
  }

  personalInfoInserted() {
    if(!this.foundOnTiss) {
      return false;
    }
    if(!this.basicInfoForm.controls['project'].valid) {
      return false;
    }
    return true
  }

  createDMP() {
    // TODO
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      formData.append('uploadedFile', file, file.name);
      this.restProvider.uploadFile(formData, "api/v1/dmp/analizeData")
    }
  }

}
