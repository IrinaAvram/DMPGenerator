import {Component, Inject} from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import {RestProvider} from "../../providers/rest/rest";
import {FormBuilder, Validators} from "@angular/forms";
import { DOCUMENT } from '@angular/platform-browser';


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
  private files;
  private inputSize = 0;
  private outputSize = 0;
  private finishedSpaceComputation:boolean = false;
  private repoWasChosen:boolean = false;
  private licenseWasChosen:boolean = false;
  private dmpWasGenerated:boolean = false;
  private country = "";
  private selectedRepo = {rUrl:""};
  private selectedLicense = {};
  private generatedDmp = {};
  private gDmp = {};
  private outputMimeTypes =[];
  private repositories =[];
  private projectName = "";
  public static isLicenseSelected = false;

  constructor(@Inject(DOCUMENT) private document: any,
              public restProvider: RestProvider,
              public formBuilder: FormBuilder,
              public navCtrl: NavController,
              public toastCtrl: ToastController) {
    this.getLicenseStatus();
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
      project: [this.projectName, Validators.compose([Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-ZÄÖÜäöüß ]*'), Validators.required])],
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
    this.repoWasChosen = true;
    this.selectedRepo = repo;
    this.repositories = [];
  }

  findOnTiss() {
    this.users = [];
    let search = ""
    if(this.basicInfoForm.value.firstName)
      search = this.basicInfoForm.value.firstName + "+" + this.basicInfoForm.value.lastName;
    else
      search = this.basicInfoForm.value.lastName
    this.restProvider.callGet("api/v1/dmp/getBasicInfo/" + search)
      .then(data => {
        console.log("response", data);
        this.users = data;
        if(this.users.length > 0) {
          this.toastCtrl.create({
            message: "Successfully obtained basic info for " + this.basicInfoForm.value.firstName + " " + this.basicInfoForm.value.lastName,
            duration: 3000
          }).present();
        } else {
          this.toastCtrl.create({
            message: "No users found for " + this.basicInfoForm.value.firstName + " " + this.basicInfoForm.value.lastName,
            duration: 3000
          }).present();
        }

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

  sanitizeGeneratedDMP(){
    delete this.pcreator.person.gender;
    delete this.pcreator.person.pictureUri ;
    delete this.pcreator.person.mainPhoneNumber;
    delete this.pcreator.person.mainAddresses;
    delete this.pcreator.person.consultationHours;
    delete this.pcreator.person.consultationHourInfo;
    delete this.pcreator.person.additionalInfos;
    delete this.pcreator.person.student;
    delete this.pcreator.person.tissId;
    delete this.pcreator.person.oid;
    delete this.pcreator.version;

    if(this.pcreator.person.employee.employment[0] != null && typeof this.pcreator.person.employee.employment[0]  != 'undefined') {
      if(this.pcreator.person.employee.employment[0].organisationalUnit != null || typeof this.pcreator.person.employee.employment[0].organisationalUnit  === 'undefined') {
        delete this.pcreator.person.employee.employment[0].organisationalUnit.tissId;
        delete this.pcreator.person.employee.employment[0].organisationalUnit.oid;
        delete this.pcreator.person.employee.employment[0].organisationalUnit.code;
        delete this.pcreator.person.employee.employment[0].organisationalUnit.number;
      }
      delete this.pcreator.person.employee.employment[0].function;
      delete this.pcreator.person.employee.employment[0].functionCategory;
      if(this.pcreator.person.employee.employment[0].room != null && typeof this.pcreator.person.employee.employment[0].room  != 'undefined') {
        delete this.pcreator.person.employee.employment[0].room.address;
      }
      delete this.pcreator.person.employee.employment[0].addresses;
      delete this.pcreator.person.employee.employment[0].phoneNumbers;
      delete this.pcreator.person.employee.employment[0].faxNumbers;
      delete this.pcreator.person.employee.employment[0].emails;
      if(this.pcreator.person.employee.employment[0].websites != null && typeof this.pcreator.person.employee.employment[0].websites  != 'undefined') {
        if(this.pcreator.person.employee.employment[0].websites.website != null && typeof this.pcreator.person.employee.employment[0].websites.website  != 'undefined') {
          if(this.pcreator.person.employee.employment[0].websites.website.length > 0) {
            //delete this.pcreator.person.employee.employment[0].websites.website[0].value;
          }
        }
      }
      delete this.pcreator.person.employee.employment[0].additionalInfo;
    }
  }

  createDMP() {
    this.dmpWasGenerated=true;

    console.log("PCreator", this.pcreator)

    this.sanitizeGeneratedDMP();

    if(this.pcreator.person.precedingTitles == null) {
      this.pcreator.person.precedingTitles = "";
    }if(this.pcreator.person.postpositionedTitles == null) {
      this.pcreator.person.postpositionedTitles = "";
    }
    if(this.pcreator.person.employee.employment[0] == null || typeof this.pcreator.person.employee.employment[0]  == 'undefined') {
      this.pcreator.person.employee.employment[0] = {websites: {website: [{url: "unknown"}]}, room: {roomCode: "unknown"}, organisationalUnit: {value: "unknown"}};
    }
    if(this.pcreator.person.employee.employment[0].organisationalUnit == null || typeof this.pcreator.person.employee.employment[0].organisationalUnit == 'undefined') {
      this.pcreator.person.employee.employment[0].organisationalUnit = {value: "unknown"};
    }
    if(this.pcreator.person.employee.employment[0].room == null || typeof this.pcreator.person.employee.employment[0].room  == 'undefined') {
      this.pcreator.person.employee.employment[0].room = {roomCode: "unknown"};
    }
    if(this.pcreator.person.employee.employment[0].websites == null || typeof this.pcreator.person.employee.employment[0].websites  == 'undefined') {
      this.pcreator.person.employee.employment[0].websites = {website: [{url: "unknown"}]};
    }
    if(this.pcreator.person.employee.employment[0].websites.website == null || typeof this.pcreator.person.employee.employment[0].websites.website  == 'undefined') {
      this.pcreator.person.employee.employment[0].websites.website = [{url: "unknown"}];
    }
    if(this.pcreator.person.employee.employment[0].websites.website.length == 0) {
      this.pcreator.person.employee.employment[0].websites.website = [{url: "unknown"}];
    }

    this.generatedDmp = {project:this.projectName, author: this.pcreator, repository:this.selectedRepo, license: this.selectedLicense, files: this.files};
  }

  syntaxHighlight(json) {
    if (typeof json != 'string') {
      json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  fileChange(event) {
    console.log("projname", this.projectName)
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
    this.inputSize = 0;
    this.outputSize = 0;
    for(let i = 0; i < this.files.length; i++) {
      if(this.files[i].type === "input") {
        this.inputSize = this.inputSize + (this.files[i].size * this.files[i].number)
      } else {
        this.outputSize = this.outputSize + (this.files[i].size * this.files[i].number)
        this.getContentType(this.files[i].mimeType)
      }
    }
    this.finishedSpaceComputation = true;
  }

  /* Content Types
   * 1	 	Research papers (pre- and postprints)
   * 2	 	Research papers (preprints only)
   * 3	 	Research papers (postprints only)
   * 4	 	Bibliographic references
   * 5	 	Conference and workshop papers
   * 6	 	Theses and dissertations
   * 7	 	Unpublished reports and working papers
   * 8	 	Books   chapters and sections
   * 9	 	Datasets
   * 10	 	Learning Objects
   * 11	 	Multimedia and audio-visual materials
   * 12	 	Software
   * 13	 	Patents
   * 14	 	Other special item types
   */
  getContentType(mimeType) {
    console.log("MimeType", mimeType);

    if(mimeType === "text/plain; charset=US-ASCII") {
      if (this.outputMimeTypes.indexOf(9) < 0)
        this.outputMimeTypes.push(9)
      if (this.outputMimeTypes.indexOf(12) < 0)
        this.outputMimeTypes.push(12)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)
    } else if(mimeType === "image/gif") {
      if (this.outputMimeTypes.indexOf(10) < 0)
        this.outputMimeTypes.push(10)
      if (this.outputMimeTypes.indexOf(11) < 0)
        this.outputMimeTypes.push(11)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)
    } else if(mimeType === "image/tiff") {
      if (this.outputMimeTypes.indexOf(10) < 0)
        this.outputMimeTypes.push(10)
      if (this.outputMimeTypes.indexOf(11) < 0)
        this.outputMimeTypes.push(11)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)
    } else if(mimeType === "application/pdf") {
      let i = 1;
      // contentypes 1 to 8 could all be pdf
      for(i = 1; i <= 8; i++) {
        if (this.outputMimeTypes.indexOf(i) < 0)
          this.outputMimeTypes.push(i)
      }
      if (this.outputMimeTypes.indexOf(10) < 0)
        this.outputMimeTypes.push(10)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)

    } else if(mimeType === "image/jpeg") {
      if (this.outputMimeTypes.indexOf(10) < 0)
        this.outputMimeTypes.push(10)
      if (this.outputMimeTypes.indexOf(11) < 0)
        this.outputMimeTypes.push(11)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)

    } else if(mimeType === "application/octet-stream") {
      if (this.outputMimeTypes.indexOf(9) < 0)
        this.outputMimeTypes.push(9)
      if (this.outputMimeTypes.indexOf(11) < 0)
        this.outputMimeTypes.push(11)
      if (this.outputMimeTypes.indexOf(12) < 0)
        this.outputMimeTypes.push(12)
      if (this.outputMimeTypes.indexOf(13) < 0)
        this.outputMimeTypes.push(13)
      if (this.outputMimeTypes.indexOf(14) < 0)
        this.outputMimeTypes.push(14)
    }
  }

  findRepos() {

    console.log("contentTypes", this.outputMimeTypes);
    let search = "";
    search = search + this.country.toLowerCase()
    if(this.outputMimeTypes.length > 0) {
      search = search + "/" + this.outputMimeTypes[0]
      let i = 1;
      for(i = 1; i < this.outputMimeTypes.length; i++) {
        search=search + "," + this.outputMimeTypes[i];
      }
    }
    console.log("search", search);

    this.restProvider.callGet("api/v1/dmp/getRepoList/" + search)
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

  getLicense() {

    this.restProvider.callGet("api/v1/dmp/getLicense")
      .then(data => {
        console.log("response", data);
        this.licenseWasChosen = true;
        this.selectedLicense = data;
      })
      .catch(error => {
        console.error("Failed to get license: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get license",
          duration: 3000
        }).present();
      });
  }

  getLicenseStatus() {

    this.restProvider.callGet("api/v1/dmp/getLicenseStatus")
      .then(data => {
        console.log("licenseStatus", data);
        this.licenseWasChosen = true;
        let a = <any> data;
        this.selectedLicense = a.status;
      })
      .catch(error => {
        console.error("Failed to get license: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get license",
          duration: 3000
        }).present();
      });
  }

  invalidateLicenseStatus() {

    this.restProvider.callGet("api/v1/dmp/invalidateLicenseStatus")
      .then(data => {
        this.licenseWasChosen = false;
        console.log("licenseStatus", false);
      })
      .catch(error => {
        console.error("Failed to get license: " + JSON.stringify(error));
        this.toastCtrl.create({
          message: "Failed to get license",
          duration: 3000
        }).present();
      });
  }

  removeFile(event, file) {
    this.files = this.files.filter(item => item !== file);
    this.inputSize = 0;
    this.outputSize = 0;
    this.finishedSpaceComputation = false;
  }

  goToLicense() {
    this.document.location.href = 'http://localhost:63342/DMPGenerator/Frontend/src/public-license-selector-releases/index.html?_ijt=35koear2oos41tsavf2e0pl69k';
  }

}
