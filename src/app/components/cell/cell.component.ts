import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Cell } from 'src/app/models/Cell';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit, OnChanges {
  @Input() color!: string;
  @Input() logo: string | null | undefined;
  @Input() selectedCell!: boolean;
  @Input() cell: Cell | null = null;

  private _oldValue: boolean = this.selectedCell;

  @Output() onSelect = new EventEmitter();
  change() {
    this.onSelect.emit(this.cell);
  }

  constructor() { }
  

  ngOnInit(): void {
  }

  ngDoCheck() {
    if (this._oldValue !== this.selectedCell) {
      this._oldValue = this.selectedCell;
    }
    
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

}
