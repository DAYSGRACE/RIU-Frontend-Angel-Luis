import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog';
import { ConfirmDialogData } from '../../interfaces/dialog-data.interface';

describe('ConfirmDialog', () => {
  let component: ConfirmDialog;
  let fixture: ComponentFixture<ConfirmDialog>;

  const dialogData: ConfirmDialogData = {
    title: 'Eliminar héroe',
    message: '¿Está seguro de que desea eliminar este héroe?',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('creación', () => {
    it('debería crear el componente', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('datos', () => {
    it('debería recibir los datos del diálogo', () => {
      expect(component.data).toEqual(dialogData);
    });
  });

  describe('template', () => {
    it('debería mostrar el título', () => {
      const title = fixture.nativeElement.querySelector('[mat-dialog-title]');

      expect(title.textContent.trim()).toBe(dialogData.title);
    });

    it('debería mostrar el mensaje', () => {
      const content = fixture.nativeElement.querySelector('mat-dialog-content');

      expect(content.textContent.trim()).toBe(dialogData.message);
    });

    it('debería mostrar el botón Cancelar', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons[0].textContent.trim()).toBe('Cancelar');
    });

    it('debería mostrar el botón Confirmar', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');

      expect(buttons[1].textContent.trim()).toBe('Confirmar');
    });
  });
});
