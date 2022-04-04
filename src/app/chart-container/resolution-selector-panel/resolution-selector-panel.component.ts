import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-resolution-selector-panel',
  templateUrl: './resolution-selector-panel.component.html',
  styleUrls: ['./resolution-selector-panel.component.scss']
})
export class ResolutionSelectorPanelComponent implements OnInit {
  @Output() public resolutionListChange: EventEmitter<string[]> = new EventEmitter();
  public resolutions: string[] =  ["1", "3", "5", "15", "30", "60", "120", "240", "360", "480", "720", "D", "3D", "1W", "1M"];
  public isEditMode = false;
  selectedResolutionMap: Record<string, boolean> = {
    "1": true,
    "3": true,
    "5": true,
    "15": true,
  }
  constructor() {
    this.resolutions.forEach(res => {
      if (!this.selectedResolutionMap[res]) {
        this.selectedResolutionMap[res] = false;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.calculateResolutionList();
    })
  }

  public onResolutionClick(res: string) {
    if (!this.isEditMode) {
      return;
    }
    this.selectedResolutionMap[res] = !this.selectedResolutionMap[res];
  }

  public onSave() {
    this.isEditMode = false;
    this.calculateResolutionList();
  }

  public calculateResolutionList() {
    const selectedResolutions = []
    Object.keys(this.selectedResolutionMap).forEach((res) => {
      if (this.selectedResolutionMap[res]) {
        selectedResolutions.push(res);
      }
    })
    this.resolutionListChange.emit(selectedResolutions);
  }

}
