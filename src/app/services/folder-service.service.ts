import { Injectable, inject } from '@angular/core';
import { IFolder } from '../layout/shared/models/folder';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private api = inject(ApiService);

  updateCorrectsCount(folderId: string, correct: number) {
    return this.api.put(`folders/${folderId}/updateResult`, {newScore: correct}).then(data => data as IFolder);
  }

  getFolder(folderId: string): Promise<IFolder | null> {
    console.log(folderId);
    
    if (!folderId) {
      return Promise.resolve(null);
    }
    return this.api.get(`folders/${folderId}`).then(data => data as IFolder);
  }

  public delete(folderId: string) {
    return this.api.delete(`folders/${folderId}`);
  }

  public getAllFolders(): Promise<Array<IFolder>> {
    return this.api.get('folders').then((data) => data as Array<IFolder>);
  }

  public create(name: string): Promise<IFolder> {
    return this.api
      .post('folders', { name: name })
      .then((data) => data as IFolder);
  }
}
