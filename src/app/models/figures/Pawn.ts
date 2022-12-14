import { Cell } from '../Cell';
import { Colors } from '../Colors';
import { Figure, FigureNames } from './Figure';

const blackLogo = 'assets/black-pawn.png';
const whiteLogo = 'assets/white-pawn.png';

export class Pawn extends Figure {

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }

  override canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;

    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDireection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

    if ((target.y === this.cell.y + direction || this.isFirstStep
      && (target.y === this.cell.y + firstStepDireection))
      && target.x === this.cell.x
      && this.cell.board.getCell(target.x, target.y).isEmpty()) {
      return true;
    }

    if (target.y === this.cell.y + direction
      && (target.x === this.cell.x + 1 || target.x === this.cell.x - 1)
      && this.cell.isEnemy(target)) {
      return true;
    }

    return false;
  }
}