import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MarkdownModule } from 'ngx-markdown';
import { MatTreeModule } from '@angular/material/tree';

import { SharedModule } from '../shared/shared.module';
import { NotesRoutingModule } from './notes-routing.module';
import { NotesLayoutComponent } from './notes-layout/notes-layout.component';
import { NoteViewComponent } from './note-view/note-view.component';
import { NoteHomeComponent } from './note-home/note-home.component';
import { NavNodeComponent } from './nav-node/nav-node.component';


@NgModule({
  declarations: [
    NotesLayoutComponent,
    NoteViewComponent,
    NoteHomeComponent,
    NavNodeComponent
  ],
  imports: [
    CommonModule,
    NotesRoutingModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTabsModule,
    MatToolbarModule,
    MatTreeModule,
    MarkdownModule.forChild(),
    SharedModule
  ]
})
export class NotesModule { }
