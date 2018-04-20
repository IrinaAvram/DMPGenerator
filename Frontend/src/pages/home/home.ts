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
  private pcreator;
  public ionicNamedColor: string = 'primary';
  private files;
  private inputSize = 0;
  private outputSize = 0;
  private finishedSpaceComputation:boolean = false;
  private country = "";
  private outputMimeTypes =[];
  private repositories =[];

  constructor(public restProvider: RestProvider,
              public formBuilder: FormBuilder,
              public navCtrl: NavController,
              public toastCtrl: ToastController) {
    this.dmpCreationStep = "basicInfo";
    this.getCountryForDOAR();
    this.foundOnTiss = false;
    this.users = [];
    this.files = [];
    this.pcreator = {person:{precedingTitles:"", firstname:"", lastname:"", postpositionedTitles:"", gender:"", mainEmail:"", employee:{employment:[]}}};

    this.setUpValidation(this.formBuilder);
  }

  getCountryForDOAR() {
    this.restProvider.getCurrentIpLocation().then(data => {
      console.log("response", data);
      let a = <any>data;
      this.country = a.country;
    })
      .catch(error => {
        console.error("Failed to get country: " + JSON.stringify(error));
      });
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

  setChosenRepo(event, repo) {
    console.log("selected repo", repo)
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

        this.pcreator = data;
        console.log("response", this.pcreator);
        this.foundOnTiss = true;
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
    let i = 0;
    while(i < fileList.length) {
      let file: File = fileList[i];
      i++;
      let formData: FormData = new FormData();
      formData.append('uploadedFile', file, file.name);
      this.restProvider.uploadFile(formData, "api/v1/dmp/analizeData").then(data => {
        console.log("response", data);
        let a = <any>data
        this.files.push({name:file.name, mimeType:a.mimeType, size:a.size, type:"input", number:1})
      })
        .catch(error => {
          console.error("Failed to analize file: " + JSON.stringify(error));
          this.toastCtrl.create({
            message: "Failed to to analize file"+file.name,
            duration: 3000
          }).present();
        });
    }
  }

  computeSpaceRequirements() {
    for(let i = 0; i < this.files.length; i++) {
      if(this.files[i].type === "input") {
        this.inputSize = this.inputSize + (this.files[i].size * this.files[i].number)
      } else {
        this.outputSize = this.outputSize + (this.files[i].size * this.files[i].number)
        if(this.outputMimeTypes.indexOf(this.files[i].mimeType)<0)
          this.outputMimeTypes.push(this.files[i].mimeType)
      }
    }
    this.finishedSpaceComputation = true;
  }

  findRepos() {
    this.restProvider.callGet("api/v1/dmp/getRepoList/" + this.country.toLowerCase())
      .then(data => {
        this.repositories = <any>data;
        console.log("response", data);
      })
      .catch(error => {
        console.error("Failed to get repo: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get list of repositories",
          duration: 3000
        }).present();
      });
  }

}
