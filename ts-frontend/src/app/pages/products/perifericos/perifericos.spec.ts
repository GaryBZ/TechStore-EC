import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Perifericos } from './perifericos';

describe('Perifericos', () => {
  let component: Perifericos;
  let fixture: ComponentFixture<Perifericos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Perifericos],
    }).compileComponents();

    fixture = TestBed.createComponent(Perifericos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
