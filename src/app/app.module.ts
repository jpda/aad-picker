import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { LogLevel } from 'msal';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TenantListComponent } from './tenant-list/tenant-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material'

const CLIENT_ID = '0adf5f12-ebda-4adf-a3f1-475c4809a514';
const SMAPI_SCOPE = "https://management.azure.com/user_impersonation";

export function redirectUri(){
  return window.location.origin;
}

@NgModule({
  declarations: [
    AppComponent,
    TenantListComponent
  ],
  imports: [
    MsalModule.forRoot({
      clientID: CLIENT_ID,
      redirectUri: redirectUri(),
      cacheLocation: 'localStorage',
      consentScopes: [SMAPI_SCOPE, "User.Read"],
      protectedResourceMap: [["https://management.azure.com/", [SMAPI_SCOPE]]],
      level: LogLevel.Verbose,
      piiLoggingEnabled: true
    }),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
