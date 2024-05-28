export interface ICard {
  _id: string;
  frontSide: string;
  backSide: string;
  inAnswer: boolean | null;

  isCorrect: boolean | null;
}

export class Card implements ICard {
  _id!: string;
  frontSide: string;
  backSide: string;
  isCorrect: boolean | null;
  inAnswer: boolean | null;

  constructor(frontSide: string, backSide: string) {
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.isCorrect = null;
    this.inAnswer = null;
  }
}
