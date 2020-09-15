import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ToggleDirective } from './directives/toggle.directive';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ToggleDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    ToggleDirective
  ]
})
export class SharedModule { }
