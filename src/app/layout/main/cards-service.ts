import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ICard } from '../shared/models/card';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private api: ApiService) {}

  updateBack(cardId: string, currentFolderId: string, cardBack: string): Promise<ICard> {
    return this.api
      .put(`cards/${currentFolderId}/${cardId}/back`, { cardBack: cardBack })
      .then((data) => data as ICard);
  }

  public getAllCards(): Promise<Array<ICard>> {
    return this.api
      .getWithParams('cards', { skip: 0, limit: 100 })
      .then((data) => data as Array<ICard>);
  }

  public save(req: { card: ICard; folderId: string }): Promise<ICard> {
    return this.api
      .post('cards', { ...req.card, folderId: req.folderId })
      .then((data) => data as ICard);
  }

  public delete(folderId: string, cardId: string) {
    return this.api.delete(`cards/${folderId}/${cardId}`).then((data) => data as ICard);
  }
}
