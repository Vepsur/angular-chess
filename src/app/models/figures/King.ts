import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from './Figure';

const blackLogo = '/assets/black-king.png';
const whiteLogo = '/assets/white-king.png';


export class King extends Figure {

  castlingRook: Cell | null = null;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
  }

  override canMove(target: Cell): boolean {
    const hollowTarget = Object.assign({}, target);
    hollowTarget.figure = null;
    
    const checkAvaliableCells: boolean = (target.y === this.cell.y || target.y + 1 === this.cell.y || target.y - 1 === this.cell.y)
      && (target.x === this.cell.x || target.x + 1 === this.cell.x || target.x - 1 === this.cell.x);

    if (!super.canMove(target)) return false;

    if (checkAvaliableCells
      && (this.cell.board.getCell(target.x, target.y).isEmpty() || (this.cell.isEnemy(target) && !target.isProtected()))
      && (!target.isUnderAttack(target, this.cell))) {
      return true;
    }

    if (this.cell.isCastling(target)) return true;


    return false;
  }

  override moveFigure(target: Cell): void {
    super.moveFigure(target);

    if (this.cell.x - target.x > 1) {
      if (this.color === Colors.BLACK) {
        this.cell.board.getCell(0, 0).moveFigure(this.cell.board.getCell(2, 0));
      } else {
        this.cell.board.getCell(0, 7).moveFigure(this.cell.board.getCell(2, 7));
      }
    } else if (this.cell.x - target.x < -1) {
      if (this.color === Colors.BLACK) {
        this.cell.board.getCell(7, 0).moveFigure(this.cell.board.getCell(5, 0));
      } else {
        this.cell.board.getCell(7, 7).moveFigure(this.cell.board.getCell(5, 7));
      }
    }
  }
}