import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { TenantListComponent } from './tenant-list/tenant-list.component';


const routes: Routes = [
  { path: "", redirectTo: "tenants", pathMatch: "full" },
  { path: "tenants", component: TenantListComponent, canActivate: [MsalGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
