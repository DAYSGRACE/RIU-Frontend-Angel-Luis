import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroTable } from './hero-table';
import { HeroDTO } from '../../interfaces/hero-dto.interface';
import { ColumnTableData } from '../../interfaces/column-table-data.interface';

describe('HeroTable', () => {
  let component: HeroTable;
  let fixture: ComponentFixture<HeroTable>;

  const heroMock: HeroDTO = {
    id: '1',
    name: 'Spider-Man',
    realName: 'Peter Parker',
    power: 100,
    intelligence: 90,
    universe: 'ULTIMATE',
  };

  const columnsMock: ColumnTableData[] = [
    {
      key: 'name',
      label: 'Nombre',
    },
    {
      key: 'realName',
      label: 'Nombre real',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroTable],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroTable);

    component = fixture.componentInstance;

    fixture.componentRef.setInput('data', []);

    fixture.componentRef.setInput('isLoading', false);

    fixture.componentRef.setInput('columns', []);

    fixture.componentRef.setInput('displayedColumns', []);

    fixture.detectChanges();
  });

  it('Debería crearse', () => {
    expect(component).toBeTruthy();
  });

  describe('render', () => {
    it('Debería mostrar los datos de los héroes', () => {
      fixture.componentRef.setInput('data', [heroMock]);

      fixture.componentRef.setInput('columns', columnsMock);

      fixture.componentRef.setInput('displayedColumns', ['name', 'realName']);

      fixture.detectChanges();

      const html = fixture.nativeElement as HTMLElement;

      expect(html.textContent).toContain('Spider-Man');

      expect(html.textContent).toContain('Peter Parker');
    });

    it('Debería mostrar mensaje de busqueda sin resultados', () => {
      fixture.componentRef.setInput('currentQuery', 'batman');

      expect(component.emptyDataMessage()).toBe('No hay datos para la búsqueda de "batman"');
    });
  });

  describe('actions', () => {
    it('Debería emitir evento de "editar"', () => {
      const spy = vi.spyOn(component.edit, 'emit');

      fixture.componentRef.setInput('data', [heroMock]);

      fixture.componentRef.setInput('columns', columnsMock);

      fixture.componentRef.setInput('displayedColumns', ['name', 'actions']);

      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');

      buttons[0].click();

      expect(spy).toHaveBeenCalledWith(heroMock);
    });

    it('Debería emitir evento de "eliminar"', () => {
      const spy = vi.spyOn(component.delete, 'emit');

      fixture.componentRef.setInput('data', [heroMock]);

      fixture.componentRef.setInput('columns', columnsMock);

      fixture.componentRef.setInput('displayedColumns', ['name', 'actions']);

      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');

      buttons[1].click();

      expect(spy).toHaveBeenCalledWith(heroMock);
    });
  });

  describe('pagination', () => {
    it('Debería emitir eventos al cambiar de página', () => {
      const spy = vi.spyOn(component.pageChange, 'emit');

      const event = {
        pageIndex: 1,
        pageSize: 10,
        length: 50,
      };

      component.pageChange.emit(event);

      expect(spy).toHaveBeenCalledWith(event);
    });
  });
});
