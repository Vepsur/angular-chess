import { Board } from './../models/Board';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cell } from '../models/Cell';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {
  
  public board = new BehaviorSubject<Board>(new Board());
  public selectedCell = new BehaviorSubject<Cell | null>(null);
 
  constructor() { }

  unselectCell() {
    this.selectedCell.next(null);
  }

  selectCell(cell: Cell) {
    this.selectedCell.next(cell);
  }

  checkmate(board: Board) {
    const newBoard = board.getCopyBoard();
    newBoard.checkmate = true;
    this.board.next(newBoard); 
  }

  updateBoard(board: Board) {
    const newBoard = board.getCopyBoard();
    this.board.next(newBoard);   
  }

  restartBoard() {
    this.board.next(new Board());
  }
}
