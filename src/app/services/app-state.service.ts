import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private folderIdSubject = new BehaviorSubject<string | null>(null);
  private testModeSubject = new BehaviorSubject<boolean | null>(null);

  public folderId$ = this.folderIdSubject.asObservable();
  public isTestMode$ = this.testModeSubject.asObservable();

  public setFolderId(newFolderId: string) {
    this.folderIdSubject.next(newFolderId);
  }

  public toggleTestMode() {
    if (this.testModeSubject.getValue()) {
      this.testModeSubject.next(false);
    } else {
      this.testModeSubject.next(true);
    }
    
  }
  
  // Observable, доступный для подписки другими компонентами
  // folderId$ = this.folderIdSubject.asObservable();
  
  // public isTestMode$ = new Subject<boolean>();
  // public isTestMode$ = new Subject<boolean>();
}
