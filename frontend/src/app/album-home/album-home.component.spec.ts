import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumHomeComponent } from './album-home.component';

describe('AlbumHomeComponent', () => {
  let component: AlbumHomeComponent;
  let fixture: ComponentFixture<AlbumHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
