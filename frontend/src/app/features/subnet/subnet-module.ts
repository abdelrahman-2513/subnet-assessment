import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubnetRoutingModule } from './routings/subnet-routing-module';
import { SubnetListComponent } from './components/subnet-list/subnet-list.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SubnetRoutingModule,
    SubnetListComponent
  ]
})
export class SubnetModule { }
