import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAgentApplication } from 'msal';
import { Observable } from 'rxjs';

// normal msal setup in app.module.ts with protected routes for normal authentication
const TENANT_URL = "https://management.azure.com/tenants?api-version=2019-06-01";
const SUBSCRIPTION_URL = "https://management.azure.com/subscriptions?api-version=2019-06-01";
const scopes = ["https://management.azure.com/user_impersonation"];
const CLIENT_ID = "0adf5f12-ebda-4adf-a3f1-475c4809a514";

@Component({
  selector: 'app-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss']
})
export class TenantListComponent {
  public tenantList = [];
  public subList = [];
  public subInfo = "";

  constructor(
    private http: HttpClient
  ) {
    this.fetchData();
  }
  async tenantChanged(tenantId: string) {
    this.subList = [];
    this.subInfo = "";
    console.log("entering tenant change event, got tenant " + tenantId);
    var authority = "https://login.microsoftonline.com/" + tenantId;

    // on tenant change, we need to create a new token client in msal with our selected tenant's context
    var tenantScopedTokenClient = new UserAgentApplication(CLIENT_ID, authority, function (errorDesc, token, error, tokenType, state) { });
    var token = "";

    try {
      token = await tenantScopedTokenClient.acquireTokenSilent(scopes, authority);
    } catch (e) {
      try {
        if (e.indexOf("interaction_required") > -1 || e.indexOf("consent_required") > -1) {
          token = await tenantScopedTokenClient.acquireTokenPopup(scopes, authority);
        } else {
          console.error(e);
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (token !== "") {
      console.debug("fetching subscriptions for " + tenantId + " with " + token)
      var subs = await this.getSubscriptions(token).toPromise();
      this.subList = subs.value;
    }
  }

  subscriptionChanged(subscriptionId: string) {
    console.log("chose " + subscriptionId);
    var selectedSubscription = this.subList.find(x => x.subscriptionId == subscriptionId);
    this.subInfo = JSON.stringify(selectedSubscription, null, 2);
  }

  fetchData() {
    this.getTenants().toPromise().then(x => this.tenantList = x.value);
  }

  // relies on default MsalInterceptor
  private getTenants(): Observable<any> {
    return this.http.get(TENANT_URL).pipe();
  }

  private getSubscriptions(token: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token);
    return this.http.get(SUBSCRIPTION_URL).pipe();
  }
}