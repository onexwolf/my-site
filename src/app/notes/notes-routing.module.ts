import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotesLayoutComponent } from './notes-layout/notes-layout.component';
import { NoteViewComponent } from './note-view/note-view.component';
import { NoteHomeComponent } from './note-home/note-home.component';

const routes: Routes = [
  {
    path: '',
    component: NotesLayoutComponent,
    children: [
      {
        path: '',
        component: NoteHomeComponent
      },
      {
        path: ':id',
        component: NoteViewComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
