import { GameDataService } from './services/game-data.service';
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
  board: Board = new Board;
  whitePlayer = new Player(Colors.WHITE);
  blackPlayer = new Player(Colors.BLACK);
  gameEnd = this.board.checkmate;
  selectedCell = this.board.selectedCell;

  currentPlayer: Player | null = null;

  onRestart() {
    this.gameDataService.restartBoard();
    this.board.initCells();
    this.board.addFigures();
    this.currentPlayer = this.whitePlayer;
    this.firstStep = true;
  }

  swapPlayer(): void {
    this.currentPlayer?.color === Colors.WHITE ? this.currentPlayer = this.blackPlayer : this.currentPlayer = this.whitePlayer;
    this.firstStep = false;
  }

  constructor(
    private gameDataService: GameDataService
  ) {

  }

  ngOnInit(): void {
    this.gameDataService.board.subscribe(val => this.board = val);
    this.onRestart();
  }
}
