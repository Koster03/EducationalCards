import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CardService } from './cards-service';
import { ICard } from '../shared/models/card';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { AddCardComponent } from '../add-card/add-card.component';
import { ClickOutsideDirective } from '../shared/outside-click';
import { MainMenuComponent } from '../main-menu/main-menu.component';
import { AppStateService } from 'src/app/services/app-state.service';
import {
  Observable,
  Subject,
  combineLatest,
  from,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { FolderService } from 'src/app/services/folder-service.service';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { IFolder } from '../shared/models/folder';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    AddCardComponent,
    ClickOutsideDirective,
    MainMenuComponent,
    NgScrollbarModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  @ViewChildren(CardComponent) cardElements!: QueryList<ElementRef>;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private cardsService: CardService,
    private foldersService: FolderService,
    public appState: AppStateService
  ) {}

  // public cards!: Array<ICard>;

  rotate = 'rotate(0deg)';
  private opened = false;
  public menuWidth = '0';
  public menuPadding = '0';

  // private currentFolderId = '';

  public isTestMode = false;

  // public folder$!: Observable<IFolder>;

  public folder!: IFolder | null;

  public cards!: Observable<Array<ICard>>;

  public currentFolderId: string = '';

  public lastResult = '';

  public answeredCards!: Array<ICard>;

  public shownCards: Array<ICard> = [];

  async ngOnInit() {
    const scrollDemo = document.querySelector('#scrollDemo');

    scrollDemo!.addEventListener(
      'scroll',
      (event) => {
        console.log(`scrollTop: ${scrollDemo!.scrollTop}`);
      },
      { passive: true }
    );

    this.cards = this.appState.folderId$.pipe(
      takeUntil(this.destroy$),
      switchMap((folderId) => {
        return combineLatest([
          from(this.foldersService.getFolder(folderId!)),
          this.appState.isTestMode$.pipe(startWith(false)),
        ]);
      }),
      tap(async ([folder, _]) => {
        if (folder) this.currentFolderId = folder._id;
        if (this.isTestMode || !folder) return;
        this.lastResult = folder.lastResult;

        if (folder.cards.every((x) => x.isCorrect == null)) return;


        const correct = folder.cards.filter((x) => x.isCorrect).length;
        const newFolder = await this.foldersService.updateCorrectsCount(
          folder._id,
          correct
        );

        this.lastResult = newFolder.lastResult;
        folder.lastResult = newFolder.lastResult;
      }),
      map(([folder, isTestMode]) => {
        if (isTestMode && folder && folder.cards) {
          this.currentCorrectAnswers = 0;
          this.shownCards = folder.cards
            .map((card) => ({ card, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ card }) => card);

          this.prevShownIndex = 0;
          this.shownCards[this.prevShownIndex++].inAnswer = true;
          return this.shownCards;
        } else if (folder && folder.cards) {
          folder.lastResult = this.lastResult;
          folder.cards.forEach((x) => (x.inAnswer = false));
          this.shownCards = folder.cards;
          return folder.cards;
        }
        return [];
      })
    );
  }

  private prevShownIndex!: number;
  private currentCorrectAnswers = 0;

  public onCardAnswer(isCorrect: boolean) {
    if (this.prevShownIndex > this.shownCards.length - 1) {
      // debugger
      this.appState.toggleTestMode();
      return;
    }

    if (isCorrect) {
      this.currentCorrectAnswers++;
      this.lastResult = `${this.currentCorrectAnswers} / ${this.shownCards.length}`;
    }

    setTimeout(() => {
      this.shownCards[this.prevShownIndex++].inAnswer = true;
    }, 800);
  }

  public async deleteCard(cardId: string): Promise<void> {
    await this.cardsService.delete(this.currentFolderId, cardId);
    const currentFolderId = this.currentFolderId;
    this.appState.setFolderId(currentFolderId);
  }

  public startTest() {
    this.isTestMode = true;
  }

  public async saveCard(card: ICard): Promise<void> {
    const newCard = await this.cardsService.save({
      card: card,
      folderId: this.currentFolderId,
    });
    console.log(newCard);

    if (this.folder) {
      this.folder.cards.unshift(newCard);
    }
  }

  public async updateCardBack(cardBack: string, cardId: string) {
    await this.cardsService.updateBack(cardId, this.currentFolderId, cardBack);
  }

  toggleHeader() {
    this.opened = !this.opened;
    this.toggle();
  }

  public hide(event: Event) {
    if ((event.target as HTMLElement).classList.contains('arrow')) {
      return;
    }

    this.opened = false;
    this.toggle();
  }

  private toggle() {
    this.rotate = this.opened ? 'rotate(180deg)' : 'rotate(0deg)';
    this.menuWidth = this.opened ? '400px' : '0';
    this.menuPadding = this.opened ? '20px' : '0';
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
