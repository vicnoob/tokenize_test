import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionSelectorPanelComponent } from './resolution-selector-panel.component';

describe('ResolutionSelectorPanelComponent', () => {
  let component: ResolutionSelectorPanelComponent;
  let fixture: ComponentFixture<ResolutionSelectorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolutionSelectorPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionSelectorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
