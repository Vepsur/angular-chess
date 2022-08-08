import { Colors } from "./Colors";
import { Figure, FigureNames } from "./figures/Figure";
import { Board } from "./Board";

export class Cell {
  readonly x: number;
  readonly y: number;
  readonly color: Colors;
  figure: Figure | null;
  board: Board;
  available: boolean;
  id: number;

  constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = Math.random();
  }

  isUnderAttack(target: Cell, selectedKing: Cell): boolean {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.board.getCell(x, y);

        if (cell.isEnemy(selectedKing)) {
          const hollowTarget = this.createHollowCell(target);

          if (cell.figure?.name === FigureNames.KING) {
            if ((target.y === cell.y || target.y === cell.y + 1 || target.y === cell.y - 1)
              && (target.x === cell.x || target.x === cell.x + 1 || target.x === cell.x - 1))
              return true;
          }

          if (cell.figure?.name === FigureNames.PAWN) {
            if (cell.figure.color === Colors.BLACK) {
              if ((target.x === cell.x + 1 || target.x === cell.x - 1) && (target.y === cell.y + 1)) return true;
            } else {
              if ((target.x === cell.x + 1 || target.x === cell.x - 1) && (target.y === cell.y - 1)) return true;
            }
          }

          if (cell.figure?.name !== FigureNames.PAWN && cell.figure?.canMove(target)) {
            return true;
          }

          if (selectedKing.isEnemy(target) && cell.figure?.name !== FigureNames.PAWN && cell.figure?.canMove(hollowTarget)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isProtected(): boolean {
    const hollowTarget = this.createHollowCell(this);

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.board.getCell(x, y);

        if (!cell.isEnemy(this) && (cell.x !== this.x || cell.y !== this.y) && cell.figure?.canMove(hollowTarget)) {
          return true;
        }
      }
    }
    return false;
  }

  isAttacking(): Cell | null {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.board.getCell(x, y);
        const hollowTarget = this.createHollowCell(this);

        if (cell.isEnemy(this) && cell.figure?.canMove(hollowTarget)) {
          return cell;
        }
      }
    }
    return null;
  }

  isCastling(target: Cell): boolean {
    const x = target.x;
    const y = target.y;

    const checkFigures = (): boolean => {
      switch (x) {
        case 1:
          return !!(this.board.getCell(x - 1, y).figure?.isFirstStep
            && this.board.getCell(x - 1, y).figure?.name === FigureNames.ROOK
            && !this.board.getCell(x - 1, y).isEnemy(this)
            && this.figure?.isFirstStep && !this.isCheckmate);

        case 6:
          return !!(this.board.getCell(x + 1, y).figure?.isFirstStep
            && this.board.getCell(x + 1, y).figure?.name === FigureNames.ROOK
            && !this.board.getCell(x + 1, y).isEnemy(this)
            && this.figure?.isFirstStep && !this.isCheckmate);
        default:
          return false;
      }
    }

    const checkLeftCastling = () => {
      let emptyCheck = true;
      for (let i = 0; i < 3; i++) {
        const target = this.board.getCell(x + i, y);
        emptyCheck = emptyCheck && target.isEmpty() && !this.isUnderAttack(target, this);
      }
      return emptyCheck;
    }

    const checkRightCastling = () => {
      let emptyCheck = true;
      for (let i = 0; i < 2; i++) {
        const target = this.board.getCell(x - i, y);
        emptyCheck = emptyCheck && target.isEmpty() && !this.isUnderAttack(target, this);
      }
      return emptyCheck;
    }

    switch (x) {
      case 1:
        if (checkFigures() && checkLeftCastling()) return true;
        break;

      case 6:
        if (checkFigures() && checkRightCastling()) return true;
        break;
    }

    return false;
  }

  isCheckmate(): boolean {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cell = this.board.getCell(x, y);

        if (cell.figure?.name === FigureNames.KING) {
          const hollowTarget = this.createHollowCell(cell);

          if (this.isUnderAttack(hollowTarget, cell)) {
            if (this.board.highlightCells(cell, false) || cell.isAttacking()?.isAttacking()) {
              alert('Check');
              return true;
            }

            switch (cell.figure.color) {
              case Colors.BLACK:
                this.board.gameEnd = true;
                alert('Checkmate. White wins!');
                break;

              case Colors.WHITE:
                this.board.gameEnd = true;
                alert('Checkmate. Black wins!');
                break;
            }
          }
        }
      }
    }
    return false;
  }

  isEmpty(target?: Cell): boolean {
    if (this.figure !== null && (this.figure?.name === FigureNames.KING && target?.isEnemy(this))) {
      return true;
    }

    return (this.figure === null);
  }

  isEnemy(target: Cell): boolean {
    if (target.figure) {
      return this.figure?.color !== target.figure.color;
    }
    return false;
  }

  isEmptyVertical(target: Cell): boolean {
    const figure = this;
    if (this.x !== target.x) {
      return false;
    }

    const min = Math.min(this.y, target.y);
    const max = Math.max(this.y, target.y);

    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty(figure)) {
        return false;
      }
    }
    return true;
  }

  createHollowCell(target: Cell) {
    const hollowCell = Object.assign({}, target);
    hollowCell.figure = null;

    return hollowCell;
  }

  isEmptyHorizontal(target: Cell): boolean {
    const figure = this;
    if (this.y !== target.y) {
      return false;
    }

    const min = Math.min(this.x, target.x);
    const max = Math.max(this.x, target.x);

    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty(figure)) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(target: Cell): boolean {
    const absX = Math.abs(target.x - this.x);
    const absY = Math.abs(target.y - this.y);

    if (absY !== absX) return false;

    const dy = this.y < target.y ? 1 : -1;
    const dx = this.x < target.x ? 1 : -1;

    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty(this)) return false;
    }

    return true;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }

  addLostFigure(figure: Figure) {
    figure.color === Colors.BLACK
      ? this.board.lostBlackFigures.push(figure)
      : this.board.lostWhiteFigures.push(figure);
  }

  moveFigure(target: Cell) {
    if (this.figure && this.figure.canMove(target)) {
      this.figure?.moveFigure(target);

      if (target.figure) this.addLostFigure(target.figure);

      target.setFigure(this.figure);
      this.figure = null;
      setTimeout(() => this.isCheckmate(), 80);
    }
  }
}