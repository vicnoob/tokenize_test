import { Component, EventEmitter, Output } from '@angular/core';
import { intervals } from '../chart.helper';

@Component({
  selector: 'app-resolution-selector',
  templateUrl: './resolution-selector.component.html',
  styleUrls: ['./resolution-selector.component.scss'],
})
export class ResolutionSelectorComponent {
  @Output() public resolutionChange: EventEmitter<string> = new EventEmitter();
  public currentResolution: string;
  public resolutions: string[] = [];
  public intervalsMap = intervals;
  public isDisplayPanel = false;

  public onResolutionClick(value: string): void {
    this.currentResolution = value;
    this.resolutionChange.emit(value);
  }

  public onResolutionListChange(resList: string[]): void {
    this.resolutions = resList;
  }

  public onClickOutSide(): void {
    this.isDisplayPanel = false;
  }

  public onArrowClick(): void {
    this.isDisplayPanel = !this.isDisplayPanel;
  }
}
