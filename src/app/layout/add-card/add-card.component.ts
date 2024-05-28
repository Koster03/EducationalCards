import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlippedCard } from '../shared/flipped-card';
import { ClickOutsideDirective } from '../shared/outside-click';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Card, ICard } from '../shared/models/card';
import { AppStateService } from 'src/app/services/app-state.service';
import {MatChipsModule} from '@angular/material/chips';


@Component({
  selector: 'add-card',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    CKEditorModule,
    FormsModule,
    MatInputModule,
    MatChipsModule
  ],
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss', '../card/card.component.scss'],
})
export class AddCardComponent extends FlippedCard {
  public Editor = ClassicEditor;
  public appState = inject(AppStateService);

  // public isEven = computed(() => counter() % 2 === 0);
  @Input() lastResult = '';

  @Output()
  savedCard = new EventEmitter<ICard>();

  @Output() startTest = new EventEmitter<boolean>();

  public model = {
    editorData: '',
  };

  public toggleTestMode(flag: boolean) {
    // this.appState.isTestMode$.next(flag);
  }

  public frontSide = '';

  public saveCard() {
    // const data = editor.getData();

    console.log(this.model.editorData);
    this.savedCard.emit(new Card(this.frontSide, this.model.editorData));
  }

  public toggleMode() {
    this.appState.toggleTestMode();
  }

  public addCard($event: Event) {
    super.onCardClick($event);
  }

  onBodyyClick(event: any): void {
    if (this.cloneFlipped) {
      this.frontSide = '';
      this.model.editorData = '';
      super.onBodyClick(event);
    }
  }
}
