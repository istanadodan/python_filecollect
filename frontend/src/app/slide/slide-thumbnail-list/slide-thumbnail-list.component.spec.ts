import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideThumbnailListComponent } from './slide-thumbnail-list.component';

describe('SlideThumbnailListComponent', () => {
  let component: SlideThumbnailListComponent;
  let fixture: ComponentFixture<SlideThumbnailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlideThumbnailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideThumbnailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
