import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { intervals } from '../chart-service.service';

@Component({
  selector: 'app-resolution-selector',
  templateUrl: './resolution-selector.component.html',
  styleUrls: ['./resolution-selector.component.scss'],
})
export class ResolutionSelectorComponent implements OnInit {
  public resolutions;
  public intervalsMap = intervals;
  @Output() public resolutionChange: EventEmitter<string> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onResolutionClick(value) {
    this.resolutionChange.emit(value);
  }

  onResolutionListChange(resList) {
    this.resolutions = resList;
  }

  onClickOutSide() {
    console.log('close');
  }
}
