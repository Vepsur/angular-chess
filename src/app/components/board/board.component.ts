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
  @Input() board!: Board;
  @Input() currentPlayer!: Player | null;
  @Input() selectedCell: Cell | null = null;
  @Input() selected: boolean = false;
  @Input() gameEnd!: boolean;

  private _cellOldValue: Cell | null = this.selectedCell;
  private _gameEndOldValue: boolean = this.gameEnd;

  @Output() swapPlayer = new EventEmitter();
  swap() {
    this.swapPlayer.emit();
  }

  onSelect(cell: any) {
    if (!this.gameEnd) {
      if (this.selectedCell && this.selectedCell !== cell && this.selectedCell.figure && this.selectedCell.figure.canMove(cell)) {
        this.selectedCell.moveFigure(cell);
        this.swap();
        this.selectedCell = null;
      } else {
        if (cell.figure?.color === this.currentPlayer?.color) this.selectedCell = cell;
      }
    }
  }

  highlightCells() {
    this.board.highlightCells(this.selectedCell);
    this.updateBoard();
  }

  updateBoard() {
    const newBoard = this.board.getCopyBoard();
    this.board = newBoard;
  }

  constructor(private _changeRef: ChangeDetectorRef) { }

  ngOnInit(): void { }

  ngDoCheck() {
    if (this._cellOldValue !== this.selectedCell) {
      this._cellOldValue = this.selectedCell;
      this.highlightCells();
    }
    if (this._gameEndOldValue !== this.gameEnd) {
      this._gameEndOldValue = this.gameEnd;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }
}
