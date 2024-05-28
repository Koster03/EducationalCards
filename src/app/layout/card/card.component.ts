import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ICard } from '../shared/models/card';
import { FlippedCard } from '../shared/flipped-card';
import { ClickOutsideDirective } from '../shared/outside-click';
import { CKEditorComponent, CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AppStateService } from 'src/app/services/app-state.service';
import { Subject, takeUntil } from 'rxjs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    ClickOutsideDirective,
    CKEditorModule,
    NgScrollbarModule,
    FormsModule
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent extends FlippedCard implements OnInit, OnDestroy {
  @Input() model!: ICard;

  public Editor = ClassicEditor;
  public appState = inject(AppStateService);

  public toolbar: string[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild( 'editor' ) editorComponent!: CKEditorComponent;

  public config = {
    toolbar: this.toolbar,
  };

  public ckModel = {
    editorData: '',
  };

  ngOnInit(): void {
    this.ckModel.editorData = this.model.backSide;
    this.model.isCorrect = null;
    this.appState.isTestMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isTestMode) => {
        if (!isTestMode) {
          this.model.isCorrect = null;
        }
      });
  }

  public canEdit = false;

  @Output() updateBack = new EventEmitter<string>();
  @Output() onAnswer = new EventEmitter<boolean>();

  public cancelEditing() {
    this.ckModel.editorData = this.model.backSide;
    this.canEdit = false;
  }

  public saveEditing() {
    this.updateBack.emit(this.ckModel.editorData);
    this.model.backSide = this.ckModel.editorData;
    this.canEdit = false;
  }

  public editCard() {
    this.canEdit = !this.canEdit;
    setTimeout(() => {
      this.editorComponent.editorInstance?.editing.view.focus();
    }, 10);
  }

  @Output() onDelete = new EventEmitter<string>();

  public deleteCard(event: Event) {
    this.onDelete.emit(this.model._id);
    this.onBodyyClick(event);
  }

  onBodyyClick(event: any): void {
    if (this.cloneFlipped) {
      super.onBodyClick(event);
    }
  }

  public onAnswered(event: Event, isCorrect: boolean) {
    this.model.isCorrect = isCorrect;
    this.onBodyClick(event);
    this.onAnswer.emit(isCorrect);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
