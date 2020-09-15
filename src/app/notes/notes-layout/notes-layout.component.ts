import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDrawer } from '@angular/material/sidenav';
import { notes } from '../data/notes';
import { NoteModel } from '../data/note.model';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-notes-layout',
  templateUrl: './notes-layout.component.html',
  styleUrls: ['./notes-layout.component.scss']
})
export class NotesLayoutComponent implements OnInit, OnDestroy {

  constructor(private breakpointObserver: BreakpointObserver) { }

  isHandset: boolean;
  sub: Subscription;
  notes: NoteModel;

  ngOnInit(): void {
    this.sub = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
    ).subscribe(result => this.isHandset = result);
    this.notes = cloneDeep(notes);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  tryToClose(drawer: MatDrawer): void {
    if (this.isHandset) {
      drawer.close();
    }
  }

}
