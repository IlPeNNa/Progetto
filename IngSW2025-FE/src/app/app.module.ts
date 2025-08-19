import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { OfferteDashboardComponent } from './component/offerte-dashboard/offerte-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    OfferteDashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  FormsModule,
  CommonModule,
    RouterModule.forRoot([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
