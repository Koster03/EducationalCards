import { ICard } from './card';

export interface IFolder {
  _id: string;
  name: string;
  lastResult: string;
  cards: Array<ICard>;
}
