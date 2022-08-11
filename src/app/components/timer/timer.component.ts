import { Board } from './../../models/Board';
import { Player } from './../../models/Player';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Colors } from 'src/app/models/Colors';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnChanges {
  @Input() currentPlayer: Player | null = null;
  @Input() firstStep: boolean = true;
  @Input() board!: Board;

  @Output() onRestart = new EventEmitter();
  restart() {
    this.blackTime = 300;
    this.whiteTime = 300;
    this.onRestart.emit();
  }

  timer: null | ReturnType<typeof setInterval> = null;
  blackTime: number = 300;
  whiteTime: number = 300;

  startTimer() {
    if (this.timer) {
      clearInterval(this.timer)
    }

    const callback = this.currentPlayer?.color === Colors.WHITE ? this.decrementWhiteTimer.bind(this) : this.decrementBlackTimer.bind(this);
    if (!this.firstStep) this.timer = setInterval(callback, 1000);
  }

  decrementBlackTimer() {
    if (this.blackTime === 0) {
      alert('Times out. White wins!');
      this.restart();
    } else {
      this.blackTime = this.blackTime - 1;
    }
  }

  decrementWhiteTimer() {
    if (this.whiteTime === 0) {
      alert('Times out. Black wins!');
      this.restart();
    } else {
      this.whiteTime = this.whiteTime - 1;
    }
  }

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.startTimer();
  }


  ngOnInit(): void {
  }

  ngDoCheck() {

  }
}

