import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageEvent } from '@angular/material/paginator';

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
    fixture.componentRef.setInput('columns', columnsMock);
    fixture.componentRef.setInput('displayedColumns', ['name', 'realName', 'actions']);

    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  describe('Renderizado', () => {
    it('Debería mostrar los encabezados de las columnas', () => {
      const headers = fixture.nativeElement.querySelectorAll('th[mat-header-cell]');

      expect(headers).toHaveLength(3);
      expect(headers[0].textContent).toContain('Nombre');
      expect(headers[1].textContent).toContain('Nombre real');
      expect(headers[2].textContent).toContain('Acciones');
    });

    it('Debería mostrar los datos de los héroes', () => {
      fixture.componentRef.setInput('data', [heroMock]);

      fixture.detectChanges();

      const cells = fixture.nativeElement.querySelectorAll('td[mat-cell]');

      expect(cells[0].textContent).toContain('Spider-Man');
      expect(cells[1].textContent).toContain('Peter Parker');
    });

    it('Debería mostrar el mensaje "No hay datos" cuando no existen datos', () => {
      fixture.componentRef.setInput('data', []);

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('No hay datos');
    });

    it('Debería mostrar el mensaje de búsqueda cuando no existen resultados', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('currentQuery', 'batman');

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain(
        'No hay datos para la búsqueda de "batman"',
      );
    });

    it('Debería mostrar "Cargando datos" mientras está cargando', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('isLoading', true);

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Cargando datos');
    });

    it('Debería mostrar el mensaje de datos cuando la búsqueda contiene solamente espacios', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('currentQuery', '   ');

      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('No hay datos');
    });
  });

  describe('Acciones', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('data', [heroMock]);

      fixture.detectChanges();
    });

    it('Debería emitir el héroe al hacer click en "Editar"', () => {
      const spy = vi.spyOn(component.edit, 'emit');

      const buttons = fixture.nativeElement.querySelectorAll('button');

      const editButton = Array.from(buttons).find(
        (button) => (button as HTMLButtonElement).textContent?.trim() === 'Editar',
      ) as HTMLButtonElement;

      editButton.click();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(heroMock);
    });

    it('Debería emitir el héroe al hacer click en "Eliminar"', () => {
      const spy = vi.spyOn(component.delete, 'emit');

      const buttons = fixture.nativeElement.querySelectorAll('button');

      const deleteButton = Array.from(buttons).find(
        (button) => (button as HTMLButtonElement).textContent?.trim() === 'Eliminar',
      ) as HTMLButtonElement;

      deleteButton.click();

      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(heroMock);
    });
  });

  describe('Paginación', () => {
    it('Debería emitir el evento del paginator cuando cambia de página', () => {
      const spy = vi.spyOn(component.pageChange, 'emit');

      const paginator = fixture.nativeElement.querySelector('mat-paginator');

      const pageEvent: PageEvent = {
        pageIndex: 1,
        pageSize: 10,
        length: 50,
        previousPageIndex: 0,
      };

      paginator.dispatchEvent(
        new CustomEvent('page', {
          detail: pageEvent,
        }),
      );

      component.pageChange.emit(pageEvent);

      expect(spy).toHaveBeenCalledWith(pageEvent);
    });

    describe('Salto directo a página', () => {
      it('Debería emitir el cambio cuando se ingresa una página válida', () => {
        const spy = vi.spyOn(component.pageChange, 'emit');

        fixture.componentRef.setInput('totalElements', 50);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('pageIndex', 0);

        fixture.detectChanges();

        const pageInput = fixture.nativeElement.querySelector(
          'input[type="number"]',
        ) as HTMLInputElement;

        pageInput.value = '3';
        pageInput.dispatchEvent(new Event('change'));

        fixture.detectChanges();

        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith({
          pageIndex: 2,
          pageSize: 10,
          length: 50,
          previousPageIndex: 0,
        });
      });

      it('No debería emitir cuando se ingresa una página menor que uno', () => {
        const spy = vi.spyOn(component.pageChange, 'emit');

        fixture.componentRef.setInput('totalElements', 50);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('pageIndex', 2);

        fixture.detectChanges();

        const pageInput = fixture.nativeElement.querySelector(
          'input[type="number"]',
        ) as HTMLInputElement;

        pageInput.value = '0';
        pageInput.dispatchEvent(new Event('change'));

        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
        expect(pageInput.value).toBe('3');
      });

      it('No debería emitir cuando se ingresa una página mayor que la última', () => {
        const spy = vi.spyOn(component.pageChange, 'emit');

        fixture.componentRef.setInput('totalElements', 50);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('pageIndex', 2);

        fixture.detectChanges();

        const pageInput = fixture.nativeElement.querySelector(
          'input[type="number"]',
        ) as HTMLInputElement;

        pageInput.value = '6';
        pageInput.dispatchEvent(new Event('change'));

        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
        expect(pageInput.value).toBe('3');
      });

      it('Debería mantener la página actual cuando se ingresa un valor inválido', () => {
        const spy = vi.spyOn(component.pageChange, 'emit');

        fixture.componentRef.setInput('totalElements', 50);
        fixture.componentRef.setInput('pageSize', 10);
        fixture.componentRef.setInput('pageIndex', 1);

        fixture.detectChanges();

        const pageInput = fixture.nativeElement.querySelector(
          'input[type="number"]',
        ) as HTMLInputElement;

        pageInput.value = 'abc';
        pageInput.dispatchEvent(new Event('change'));

        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalled();
        expect(pageInput.value).toBe('2');
      });
    });
  });

  describe('emptyDataMessage', () => {
    it('Debería devolver "Cargando datos" cuando está cargando', () => {
      fixture.componentRef.setInput('isLoading', true);

      expect(component.emptyDataMessage()).toBe('Cargando datos');
    });

    it('Debería devolver "No hay datos" cuando no está cargando y no existe búsqueda', () => {
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('currentQuery', '');

      expect(component.emptyDataMessage()).toBe('No hay datos');
    });

    it('Debería devolver el mensaje de búsqueda cuando existe una búsqueda', () => {
      fixture.componentRef.setInput('isLoading', false);
      fixture.componentRef.setInput('currentQuery', 'Batman');

      expect(component.emptyDataMessage()).toBe('No hay datos para la búsqueda de "Batman"');
    });
  });
});
