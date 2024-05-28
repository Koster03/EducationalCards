import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderService } from 'src/app/services/folder-service.service';
import { IFolder } from '../shared/models/folder';
import { AddFolderComponent } from '../add-folder/add-folder.component';
import { AppStateService } from 'src/app/services/app-state.service';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [CommonModule, AddFolderComponent],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss',
})
export class MainMenuComponent implements OnInit {
  private foldersService = inject(FolderService);
  public appState = inject(AppStateService);

  public folders!: Array<IFolder>;
  public activeClass = '';
  public isTestMode = false;

  async ngOnInit(): Promise<void> {
    this.folders = await this.foldersService.getAllFolders();
  }

  public async deleteFolder(id: string): Promise<void> {
    await this.foldersService.delete(id);
    this.folders = this.folders.filter(f => f._id !== id);
  }

  chooseFolder(id: string) {
    if (id === this.activeClass) {
      return;
    }
    this.appState.setFolderId(id);
    // this.appState.folderId$.next(id);
    this.activeClass = id;
  }

  public async createFolder(name: string): Promise<void> {
    const folder = await this.foldersService.create(name);
    if (folder._id) {
      this.folders.unshift(folder);
      
      // this.appState.folderId$.next(folder._id);
    }
  }
}
