import { GameDataService } from './../../services/game-data.service';
import { Player } from './../../models/Player';
import { Cell } from 'src/app/models/Cell';
import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Board } from 'src/app/models/Board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges, DoCheck {
  board!: Board;

  @Input() currentPlayer!: Player | null;
  selectedCell: Cell | null = null;

  private _cellOldValue: Cell | null = this.selectedCell;

  @Output() swapPlayer = new EventEmitter();
  swap() {
    this.swapPlayer.emit();
  }

  onSelect(cell: Cell) {
    if (!this.board.checkmate) {
      if (this.selectedCell && this.selectedCell !== cell && this.selectedCell.figure && this.selectedCell.figure.canMove(cell)) {
        const gameStatus = this.selectedCell.moveFigure(cell);

        if (gameStatus === 'Checkmate.') {
          this.gameDataService.unselectCell();
          this.gameDataService.checkmate(this.board);  
        } else if (gameStatus) {
          this.swap();
          this.gameDataService.unselectCell();
        }
      } else if (cell.figure && cell.figure.color === this.currentPlayer?.color) {
        this.gameDataService.selectCell(cell);
      }
    }
  }

  highlightCells() {
    this.board.highlightCells(this.selectedCell);
    this.gameDataService.updateBoard(this.board);
  }

  constructor(
    private gameDataService: GameDataService
  ) { }

  ngOnInit(): void {
    this.gameDataService.board.subscribe(val => this.board = val);
    this.gameDataService.selectedCell.subscribe(val => this.selectedCell = val);
  }

  ngDoCheck() {
    if (this._cellOldValue !== this.selectedCell) {
      this._cellOldValue = this.selectedCell;
      this.highlightCells();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
