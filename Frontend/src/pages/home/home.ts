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
  private users:any;
  private creator;
  public ionicNamedColor: string = 'primary';

  constructor(public restProvider: RestProvider,
              public formBuilder: FormBuilder,
              public navCtrl: NavController,
              public toastCtrl: ToastController) {
    this.dmpCreationStep = "basicInfo";
    this.foundOnTiss = false;
    this.users = [];
    this.setUpValidation(this.formBuilder);
  }

  setUpValidation(formBuilder) {

    this.basicInfoForm = formBuilder.group({
      project: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
      firstName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*')])],
      lastName: ['', Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
    });
  }

  setChosenUser(event, user) {
    this.creator = user;
    this.basicInfoForm.controls['firstName'].setValue(user.firstname);
    this.basicInfoForm.controls['lastName'].setValue(user.lastname);
    console.log("Selected user: ", user)
    this.users = [];
    this.getDetailedInfo();
  }

  findOnTiss() {
    let search = ""
    if(this.basicInfoForm.value.firstName)
      search = this.basicInfoForm.value.firstName + "-" + this.basicInfoForm.value.lastName;
    else
      search = this.basicInfoForm.value.lastName
    this.restProvider.callGet("api/v1/dmp/getBasicInfo/" + search)
      .then(data => {
        console.log("response", data);
        this.users = data;
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

  getDetailedInfo() {
    this.restProvider.callGet("api/v1/dmp/getDetailedInfo/" + this.creator.id)
      .then(data => {
        console.log("response", data);
        this.creator = data;
        this.toastCtrl.create({
          message: "Successfully selected user " + this.basicInfoForm.value.firstName + " " + this.basicInfoForm.value.lastName,
          duration: 3000
        }).present();

      })
      .catch(error => {
        console.error("Failed to get detailed info: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get detailed info",
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
