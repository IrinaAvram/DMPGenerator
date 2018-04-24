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

  constructor(@Inject(DOCUMENT) private document: any,
              public restProvider: RestProvider,
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

    delete this.pcreator.person.employee.employment[0].organisationalUnit.tissId;
    delete this.pcreator.person.employee.employment[0].organisationalUnit.oid;
    delete this.pcreator.person.employee.employment[0].organisationalUnit.code;
    delete this.pcreator.person.employee.employment[0].organisationalUnit.number;

    delete this.pcreator.person.employee.employment[0].function;
    delete this.pcreator.person.employee.employment[0].functionCategory;
    delete this.pcreator.person.employee.employment[0].room.address;
    delete this.pcreator.person.employee.employment[0].addresses;
    delete this.pcreator.person.employee.employment[0].phoneNumbers;
    delete this.pcreator.person.employee.employment[0].faxNumbers;
    delete this.pcreator.person.employee.employment[0].emails;
    delete this.pcreator.person.employee.employment[0].websites.website[0].value;
    delete this.pcreator.person.employee.employment[0].additionalInfo;
    delete this.pcreator.person.tissId;
    delete this.pcreator.person.oid;
    delete this.pcreator.version;
  }

  createDMP() {
    // TODO
    this.dmpWasGenerated=true;
    delete this.pcreator.person.gender;
    this.sanitizeGeneratedDMP();
    this.generatedDmp = {project:this.projectName, author: this.pcreator, repository:this.selectedRepo, license: this.selectedLicense, files: this.files};
    /*this.gDmp = this.syntaxHighlight(this.generatedDmp);JSON.stringify({
      "@context": {
        "dmp": "http://purl.org/madmps#",
        "foaf": "http://xmlns.com/foaf/0.1/",
        "dc": "http://purl.org/dc/elements/1.1/",
        "dcterms": "http://purl.org/dc/terms/",
        "premis": "http://www.loc.gov/premis/rdf/v1#"
      },
      "@id": "http://example.org/dmps/mydmp",//TODO
      "@type": "dmp:DataManagementPlan",
      "dcterms": {"title": this.projectName,
        "description": "Pre-project plan for project " + this.projectName},
      "dc:creator": [
        {
          "@id": "https://tiss.tuwien.ac.at/api/person/v21/id/" + this.pcreator.person.tissId,
          "foaf:name": this.pcreator.person.precedingTitles + " " + this.pcreator.person.firstname + " " + this.pcreator.person.lastname + " " + this.pcreator.person.postpositionedTitles ,
          "foaf:mbox": this.pcreator.person.mainEmail,
          "foaf:employment": this.pcreator.employment
        }
      ],
      "dc:publisher": [
        {
          "@id": "https://tiss.tuwien.ac.at/api/person/v21/id/" + this.pcreator.person.tissId,
          "foaf:name": this.pcreator.person.precedingTitles + " " + this.pcreator.person.firstname + " " + this.pcreator.person.lastname + " " + this.pcreator.person.postpositionedTitles ,
          "foaf:mbox": this.pcreator.person.mainEmail,
          "foaf:employment": this.pcreator.employment
        }
      ],
      "dc:contributor": [
        {
          "@id": "https://tiss.tuwien.ac.at/api/person/v21/id/" + this.pcreator.person.tissId,
          "foaf:name": this.pcreator.person.precedingTitles + " " + this.pcreator.person.firstname + " " + this.pcreator.person.lastname + " " + this.pcreator.person.postpositionedTitles ,
          "foaf:mbox": this.pcreator.person.mainEmail,
          "foaf:employment": this.pcreator.employment
        }
      ],
      "dcterms:hasVersion": "v0.0.1",
      "dc:date": Date.now(),
      "dmp:hasDataObject": [
        {
          "@id": "https://doi.org/10.5281/zenodo.803326",
          "@type": "dmp:SourceCode",
          "dmp:hasIntelectualPropertyRights": {
            "dcterms:license": "https://opensource.org/licenses/MIT"
          },
          "dmp:hasMetadata": {
            "dcterms:description": "Bundle containing the source code (Jupyter notebook), input data and Dockerfile",
            "premis:hasObjectCharacteristics": {
              "premis:hasFormat": "premis:Format:zip",
              "premis:fixity": {
                "premis:hasMessageDigestAlgorithm": "premis:Fixity:SHA-256",
                "premis:messageDigest": "66798be94ce2de3d037c08b6297941678d308774b3912d74336c72c975fcf5b3"
              }
            },
            "dmp:hasDataVolume": "19.6 kB"
          },
          "dmp:hasDataRepository": this.selectedRepo.rUrl,
          "dmp:hasPreservation": "The JSON data source file and all files related to Docker should be preserved. The ability to recreate the two Docker images for mongoDB and Jupyter, as well as the availability of the data source file will allow the reproduction of the experiment.",
          "dmp:hasDataSharing": "All files required to run the experiment are published on GitHub under the MIT license. A Digital Object Identifier (DOI) was created to unambiguously identify the data and make citation possible. The DOI was generated with Zenodo integrated with GitHub. The DOI always links to the latest release made on GitHub. Zenodo is an established, publicly searchable repository for science data, which supports the findability of our data. In order to enforce the reproducibility of our experiment we provide a Dockerfile along with the data. By following the instructions on GitHub it should be easy to run the experiment. Additionally a web page will be created to inform about the project and all aspects of the Data Management Plan.",
          "dmp:hasEthicsAndPrivacy": "Ethical issues should not arise, since the data does not contain any sensible or inflicting data to individuals or groups. Our data does only contain aggregated numbers about divorces, without any detailled information. The input data which forms the basis for our experiment is also available on a publicly accessible open data platform.",
          "dmp:hasDocumentation": "The data is documented in a self-contained way. The Jupyter notebook contains data, code, plots and documentation all in one. The experiment conducted in the Jupyter notebook is documented in a structured way describing each step of the experiment. Additionally a web page is created informing about the project and the details of the Data Management Plan. Documentation about the reproducibility of our experiment is available on the publicly accessible project repository on GitHub.",
          "hasDocumentationLink": "https://github.com/oblassers/fair-data-science/blob/master/README.md",
          "dmp:hasDataCollection": "The data will be used in the self-contained, interactive computing environment Jupyter. For this reason, all generated data, including plotting results, will only be transient in the memory. The notebook itself - stored in the .ipynb file format (internally it is JSON) - contains textual descriptions and python code, that transforms and visualizes the data set. The Jupyter notebook can be further transformed into various formats (.py, .html, .md, .rst, .tex, .pdf). The size can be considered as rather small - in the range of 20-500KB. To support the reproducibility of our experiment Dockerfiles are created in order to establish a working environment.",
          "dmp:hasDataObject": [
            {
              "@type": "dmp:Container",
              "github": "https://github.com/oblassers/fair-data-science/blob/master/Dockerfile",
              "dc:title": "Dockerfile",
              "dmp:hasIntelectualPropertyRights": {
                "dcterms:license": "https://opensource.org/licenses/MIT"
              },
              "dmp:hasMetadata": {
                "dcterms:description": "Dockerfile",
                "premis:hasObjectCharacteristics": {
                  "premis:fixity": {
                    "premis:hasMessageDigestAlgorithm": "premis:Fixity:SHA-256",
                    "premis:messageDigest": "a16c7c70cccd3b706d0e64038675a0b302c6250a159fd27b4f069565e1464797"
                  }
                },
                "dmp:hasDataVolume": "103 bytes"
              }
            },
            {
              "@id": "https://www.salzburg.gv.at/ogd/7fa00c8b-6189-42b8-af93-cc1ebff0a818/divorce-szg-duration.json",
              "@type": "dmp:File",
              "dc:title": "JSON Data File",
              "dmp:hasIntelectualPropertyRights": {
                "dcterms:license": "https://creativecommons.org/licenses/by/3.0/"
              },
              "dmp:hasMetadata": {
                "dcterms:description": "Time series dataset of divorced marriages in Salzburg Land from 1985 to 2014",
                "premis:hasObjectCharacteristics": {
                  "premis:hasFormat": "premis:Format:json",
                  "premis:fixity": {
                    "premis:hasMessageDigestAlgorithm": "premis:Fixity:SHA-256",
                    "premis:messageDigest": "34c140deb5d56c02470741264cdd1e7326e19226cae9b8f050d1cdd95b8f83d9"
                  }
                },
                "dmp:hasDataVolume": "49 kB"
              }
            },
            {
              "@type": "dmp:File",
              "github": "https://github.com/oblassers/fair-data-science/blob/master/Task-3-Experiment.ipynb",
              "dc:title": "Jupyter Notebook",
              "dmp:hasMetadata": {
                "dcterms:description": "Jupyter notebook containing the experiment",
                "premis:hasObjectCharacteristics": {
                  "premis:hasFormat": "premis:Format:ipynb",
                  "premis:fixity": {
                    "premis:hasMessageDigestAlgorithm": "premis:Fixity:SHA-256",
                    "premis:messageDigest": "41739c49487f1dbaf4c4496b96a5b3c0c74d1a8849b3ef07778563cb2244bbb0"
                  }
                },
                "dmp:hasDataVolume": "21 kB"
              }
            }
          ]
        }
      ]
    }, null, 2);*/
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
