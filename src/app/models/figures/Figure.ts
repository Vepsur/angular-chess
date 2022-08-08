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

  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
    this.isFirstStep = true;
  }

  canMove(target: Cell): boolean {
    if (target.figure?.color === this.color) return false;
    if (target.figure?.name === FigureNames.KING && target.figure.color === this.cell.color) return false;
    if (target.x === this.cell.x && target.y === this.cell.y) return false;
    return true;
  }

  moveFigure(target: Cell) {
    this.isFirstStep = false;
  }
}