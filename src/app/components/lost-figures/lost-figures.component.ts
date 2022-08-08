import { Figure } from './../../models/figures/Figure';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lost-figures',
  templateUrl: './lost-figures.component.html',
  styleUrls: ['./lost-figures.component.scss']
})
export class LostFiguresComponent implements OnInit {
  @Input() title!: string;
  @Input() figures: Figure[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
