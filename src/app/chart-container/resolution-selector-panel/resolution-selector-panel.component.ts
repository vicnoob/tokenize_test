import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { supportedResolution } from '../chart.helper';

@Component({
  selector: 'app-resolution-selector-panel',
  templateUrl: './resolution-selector-panel.component.html',
  styleUrls: ['./resolution-selector-panel.component.scss'],
})
export class ResolutionSelectorPanelComponent implements OnInit {
  @Output() public resolutionListChange: EventEmitter<string[]> =
    new EventEmitter();
  public resolutions: string[] = supportedResolution;
  public isEditMode = false;
  selectedResolutionMap: Record<string, boolean> = {
    1: true,
    3: true,
    5: true,
    15: true,
  };
  constructor() {
    this.resolutions.forEach((res) => {
      if (!this.selectedResolutionMap[res]) {
        this.selectedResolutionMap[res] = false;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.calculateResolutionList();
    });
  }

  public onResolutionClick(res: string): void {
    if (!this.isEditMode) {
      return;
    }
    this.selectedResolutionMap[res] = !this.selectedResolutionMap[res];
  }

  public onSave(): void {
    this.isEditMode = false;
    this.calculateResolutionList();
  }

  public calculateResolutionList(): void {
    const selectedResolutions = [];
    Object.keys(this.selectedResolutionMap).forEach((res) => {
      if (this.selectedResolutionMap[res]) {
        selectedResolutions.push(res);
      }
    });
    this.resolutionListChange.emit(selectedResolutions);
  }
}
