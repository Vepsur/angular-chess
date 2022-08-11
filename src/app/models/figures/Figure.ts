import { Cell } from '../Cell';
import { Colors } from "../Colors";

export enum FigureNames {
  FIGURE = "Figure",
  KING = "King",
  KNIGHT = "Knight",
  PAWN = "Pawn",
  QUEEN = "Queen",
  ROOK = "Rook",
  BISHOP = "Bishop",
}

export class Figure {
  color: Colors;
  logo: string | null;
  cell: Cell;
  name: FigureNames;
  id: number;
  isFirstStep: boolean;
  selected: boolean;

  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
    this.isFirstStep = true;
    this.selected = false;
  }

  canMove(target: Cell): boolean {
    if (target.figure?.color === this.color) return false;
    if (target.figure?.name === FigureNames.KING && target.figure.color === this.cell.color) return false;
    if (target === this.cell) return false;
    
    return true;
  }

  moveFigure(target: Cell) {
    this.isFirstStep = false;
    console.log(this.cell.board.check);
    this.cell.board.check = false;
    
  }
}