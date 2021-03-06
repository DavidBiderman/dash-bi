import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ContainerComponent } from './shared/components/container/container.component';
import { TableComponent } from './shared/components/table/table.component';
import { MessageHostDirective } from './shared/directives/message-host.directive';
import { ModalComponent } from './shared/components/modal/modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DigitalClockComponent } from './shared/components/digital-clock/digital-clock.component';

@NgModule({ 
  declarations: [
    AppComponent,
    CanvasComponent,
    ContainerComponent,
    MessageHostDirective,
    TableComponent,
    ModalComponent,
    DigitalClockComponent
  ],
  entryComponents: [
    ContainerComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
