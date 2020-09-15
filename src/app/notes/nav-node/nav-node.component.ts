import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NoteModel } from '../data/note.model';

@Component({
  selector: 'app-nav-node',
  templateUrl: './nav-node.component.html',
  styleUrls: ['./nav-node.component.scss']
})
export class NavNodeComponent implements OnInit {

  @Input() data: NoteModel;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  isActiveGroup(node: NoteModel): boolean {
    if (node.type === 'file') {
      return this.router.isActive('/notes/' + node.name, true);
    }
    if (node.type === 'directory') {
      return (node as NoteModel).children.some((subNode) => this.isActiveGroup(subNode));
    }
    return false;
  }

}
