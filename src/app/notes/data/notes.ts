import { NoteModel } from './note.model';

declare function require(name: string): any;

// const draftNotes: NoteModel = require('./notes.json');
export const notes: NoteModel = require('./notes.json');

function flatten(group): NoteModel[] {
  const res: NoteModel[] = [];
  group.children.forEach(item => {
    if (item.type === 'file') {
      res.push(item);
    } else if (item.type === 'directory') {
      res.push(...flatten(item));
    }
  });
  return res;
}

function removeMacOSFile(origin: NoteModel): NoteModel {
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < origin.children.length; i++) {
    const item = origin.children[i];
    if (item.name === '.DS_Store') {
      origin.children = [...origin.children.splice(i, 1)];
    } else if (item.type === 'directory') {
      origin.children[i] = removeMacOSFile(item);
    }
  }
  return origin;
}

export const flattenNotes = flatten(notes);

export function findNoteByName(name: string): NoteModel {
  return flattenNotes.find(it => it.name === name);
}
