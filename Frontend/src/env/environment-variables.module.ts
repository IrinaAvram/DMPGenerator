import {NgModule} from '@angular/core';
import {Env} from './environment-variables.token';
import {devVariables} from './development';
import {prodVariables} from './production';

declare const process: any; // Typescript compiler will complain without this

export function environmentFactory() {
  return process.env.NODE_ENV === 'prod' ? prodVariables : devVariables;
}

@NgModule({
  providers: [
    {
      provide: Env,
      // useFactory instead of useValue so we can easily add more logic as needed.
      useFactory: environmentFactory
    }
  ]
})
export class EnvironmentsModule {
}
