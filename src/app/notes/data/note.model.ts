export class NoteModel {
  path: string;
  name: string;
  size: number;
  type: string;
  children: NoteModel[];
  extension: string;
}
