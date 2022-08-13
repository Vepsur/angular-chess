import { Figure, FigureNames } from './figures/Figure';
import { Cell } from "./Cell";
import { Colors } from "./Colors";
import { Bishop } from "./figures/Bishop";
import { King } from "./figures/King";
import { Knight } from "./figures/Knight";
import { Pawn } from "./figures/Pawn";
import { Queen } from "./figures/Queen";
import { Rook } from "./figures/Rook";

interface checkmateData {
  message: string;
  color: string;
}

export class Board {
  cells: Cell[][] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  selectedCell: Cell | null = null;
  check: boolean = false;
  checkmate: boolean = false;


  public initCells() {
    for (let i = 0; i < 8; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 !== 0) {
          row.push(new Cell(this, j, i, Colors.BLACK, null)); // black cells
        } else {
          row.push(new Cell(this, j, i, Colors.WHITE, null)); // white cells
        }
      }
      this.cells.push(row);
    }
  }

  public highlightCells(selectedCell: Cell | null, display: boolean = true) {
    let movePossibility: boolean = false;

    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const target = row[j];
        if (display) target.available = !!selectedCell?.figure?.canMove(target);

        if (!!selectedCell?.figure?.canMove(target)) {
          movePossibility = true;
        }
      }
    }

    return movePossibility;
  }

  isCheckmate(defendCheck: boolean): checkmateData | false {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        
        if (cell.isKing()) {
          const attackingFigure = cell.isAttacking();
          
          if (attackingFigure?.figure) {
            const underAttackPlayer = attackingFigure.figure.color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;

            if (this.highlightCells(cell, false) || attackingFigure.isAttacking() || (defendCheck && this.moveCanDefend(cell))) {
              this.check = true;
              return { message: 'Check.', color: underAttackPlayer };
            }
            
            switch (cell.figure?.color) {
              case Colors.BLACK:
                this.checkmate = true;
                return { message: 'Checkmate.', color: cell.figure.color };

              case Colors.WHITE:
                this.checkmate = true;
                return { message: 'Checkmate.', color: cell.figure.color };
            }
          }
        }
      }
    }
    // this.check = false;

    return false;
  }

  moveCauseCheck(figure: Figure): boolean {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        if (cell.figure?.name === FigureNames.KING && !cell.isEnemy(figure.cell) && cell.isAttacking()) {
          return true;
        }
      }
    }
    return false;
  }

  moveCanDefend(king: Cell): boolean {
    for (let i = 0; i < this.cells.length; i++) {
      const row = this.cells[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];

        if (cell.figure && !cell.isEnemy(king)) {
          for (let i = 0; i < this.cells.length; i++) {
            const row = this.cells[i];
            for (let j = 0; j < row.length; j++) {
              const target = row[j];

              if (cell.moveFigure(target, true)) {        
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    newBoard.cells = this.cells;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.checkmate = this.checkmate;
    newBoard.check = this.check;

    return newBoard;
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      new Pawn(Colors.BLACK, this.getCell(i, 1));
      new Pawn(Colors.WHITE, this.getCell(i, 6));
    }
  }

  private addKings() {
    new King(Colors.BLACK, this.getCell(4, 0));
    new King(Colors.WHITE, this.getCell(4, 7));
  }

  private addQueens() {
    new Queen(Colors.BLACK, this.getCell(3, 0));
    new Queen(Colors.WHITE, this.getCell(3, 7));
  }

  private addBishops() {
    new Bishop(Colors.BLACK, this.getCell(2, 0));
    new Bishop(Colors.BLACK, this.getCell(5, 0));
    new Bishop(Colors.WHITE, this.getCell(2, 7));
    new Bishop(Colors.WHITE, this.getCell(5, 7));
  }

  private addKnights() {
    new Knight(Colors.BLACK, this.getCell(1, 0));
    new Knight(Colors.BLACK, this.getCell(6, 0));
    new Knight(Colors.WHITE, this.getCell(1, 7));
    new Knight(Colors.WHITE, this.getCell(6, 7));
  }

  private addRooks() {
    new Rook(Colors.BLACK, this.getCell(0, 0));
    new Rook(Colors.BLACK, this.getCell(7, 0));
    new Rook(Colors.WHITE, this.getCell(0, 7));
    new Rook(Colors.WHITE, this.getCell(7, 7));
  }

  public addFigures() {
    // this.addBishops();
    this.addKings();
    // this.addKnights();
    // this.addPawns();
    this.addQueens();
    this.addRooks();
  }
}