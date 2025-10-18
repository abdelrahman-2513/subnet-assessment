import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IpListComponent } from '../components/ip-list/ip-list.component';
import { MainLayoutComponent } from '../../../libs/components/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: IpListComponent } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpRoutingModule { }
