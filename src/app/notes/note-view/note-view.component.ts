import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NoteModel } from '../data/note.model';
import { findNoteByName } from '../data/notes';

@Component({
  selector: 'app-note-view',
  templateUrl: './note-view.component.html',
  styleUrls: ['./note-view.component.scss']
})
export class NoteViewComponent implements OnInit {

  noteUrl: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.noteUrl = findNoteByName(params.get('id')).path.replace('src/', '/');
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    });
  }

}
