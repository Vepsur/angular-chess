import { GameDataService } from './services/game-data.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { CellComponent } from './components/cell/cell.component';
import { LostFiguresComponent } from './components/lost-figures/lost-figures.component';
import { TimerComponent } from './components/timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CellComponent,
    LostFiguresComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [GameDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
