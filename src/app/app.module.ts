import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/shared/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AuthManager } from './layout/auth/auth-service-manager';
import { FileManagerModule } from '@syncfusion/ej2-angular-filemanager';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ClickOutsideModule } from 'ng-click-outside';
import { ClickOutsideDirective } from './layout/shared/outside-click';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    // ClickOutsideDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FileManagerModule,
    ClickOutsideModule,
    NgScrollbarModule,
  ],
  providers: [AuthManager],
  bootstrap: [AppComponent]
})
export class AppModule { }
