import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {Headers, Http, HttpModule} from '@angular/http';

import {MyApp} from './app.component';
import {HomePage} from '../pages/home/home';
import {RestProvider} from '../providers/rest/rest';
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {AdministrationNav} from "../widgets/administration-nav/administration-nav";
import {EnvironmentsModule} from "../env/environment-variables.module";

import {ElasticModule} from "angular2-elastic";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AdministrationNav,
  ],
  imports: [
    EnvironmentsModule,
    ElasticModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {locationStrategy: 'hash'}, {
      links: [
        {component: HomePage, name: 'Home', segment: ''},
        ]}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
  ]
})
export class AppModule {}
