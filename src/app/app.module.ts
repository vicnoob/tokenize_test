import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { HttpClientModule } from '@angular/common/http';
import { ResolutionSelectorComponent } from './chart-container/resolution-selector/resolution-selector.component';
import { ResolutionSelectorPanelComponent } from './chart-container/resolution-selector-panel/resolution-selector-panel.component';
import { OutsideClickDirective } from './directives/outside-click.directive';
import { IntervalNamePipe } from './chart-container/pipes/interval-name.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ChartContainerComponent,
    ResolutionSelectorComponent,
    ResolutionSelectorPanelComponent,
    OutsideClickDirective,
    IntervalNamePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
