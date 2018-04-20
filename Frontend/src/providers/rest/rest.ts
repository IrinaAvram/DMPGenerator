import {Inject, Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Env} from "../../env/environment-variables.token";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RestProvider {

  authHttp: Http;

  constructor(public http: Http, @Inject(Env) public env) {
    console.log('Hello RestProvider Provider');
    this.authHttp = http;
  }

  uploadFile(formData, address) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */
      headers.append('Content-Type', 'multipart/form-data');
      headers.append('Accept', 'application/json');
      console.log(`${this.env.apiEndpoint}/${address}`)
      this.http.post(`${this.env.apiEndpoint}/${address}`, formData, headers)
        .map(res => res.json())
        .subscribe(
          data => resolve(data),
          error => reject(error)
        )
    })
  }

  callGet(address) {
    return new Promise(resolve => {
      this.authHttp.get(`${this.env.apiEndpoint}/${address}`)
        .map(res => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            console.log("error during GET", err)
          }
        );

    });
  }

  callPost(address, body) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.env.apiEndpoint}/${address}`, body)
        .map(res => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            console.log("error during POST", err);
            reject(err);
          }
        );

    });
  }

  callPut(address, body) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.env.apiEndpoint}/${address}`, body)
        .map(res => res.json())
        .subscribe(
          (data) => {
            resolve(data);
          },
          (err) => {
            console.log("error during PUT", err);
            reject(err);
          }
        );

    });
  }

  callDelete(address) {
    return this.authHttp.delete(`${this.env.apiEndpoint}/${address}`).toPromise();
  }

}
