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

const CLIENT_ID = 'a1ea64ac-fc16-460a-8ab6-209b989d6dae';
const SMAPI_SCOPE = "https://management.azure.com/user_impersonation";

@NgModule({
  declarations: [
    AppComponent,
    TenantListComponent
  ],
  imports: [
    MsalModule.forRoot({
      clientID: CLIENT_ID,
      redirectUri: window.location.origin,
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
