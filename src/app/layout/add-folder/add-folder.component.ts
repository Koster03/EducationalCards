import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'add-folder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-folder.component.html',
  styleUrl: './add-folder.component.scss',
})
export class AddFolderComponent {
  public inputHidden = true;

  @Output() createFolder = new EventEmitter<string>();

  public toggle() {
    this.inputHidden = !this.inputHidden;
  }
}
