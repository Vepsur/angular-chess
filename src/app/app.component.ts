import { Board } from 'src/app/models/Board';
import { Colors } from 'src/app/models/Colors';
import { Player } from './models/Player';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-chess';
  firstStep: boolean = true;
  board = new Board();
  whitePlayer = new Player(Colors.WHITE);
  blackPlayer = new Player(Colors.BLACK);
  gameEnd = this.board.gameEnd;

  currentPlayer: Player | null = null;

  onRestart() {
    this.board = new Board();
    this.board.initCells();
    this.board.addFigures();
    console.log('restart ', this.board.gameEnd);
    this.currentPlayer = this.whitePlayer;
    this.firstStep = true;
  }

  swapPlayer(): void {
    this.currentPlayer?.color === Colors.WHITE ? this.currentPlayer = this.blackPlayer : this.currentPlayer = this.whitePlayer;
    this.firstStep = false;
  }

  ngOnInit(): void {
    this.onRestart();
  }
}
