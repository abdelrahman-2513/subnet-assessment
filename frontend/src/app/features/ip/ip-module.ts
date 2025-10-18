import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpRoutingModule } from './routings/ip-routing-module';
import { IpListComponent } from './components/ip-list/ip-list.component';
import { IpAddDialogComponent } from './components/dialogs/ip-add-dialog/ip-add-dialog.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IpRoutingModule,
    IpListComponent,
    IpAddDialogComponent
  ]
})
export class IpModule { }
