import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialog } from './message-dialog';
import { ConfirmDialogData } from '../../interfaces/dialog-data.interface';

describe('MessageDialog', () => {
  let component: MessageDialog;
  let fixture: ComponentFixture<MessageDialog>;

  const dialogData: ConfirmDialogData = {
    title: 'Operación exitosa',
    message: 'El héroe fue eliminado correctamente.',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDialog],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageDialog);
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

    it('debería mostrar el botón Aceptar', () => {
      const button = fixture.nativeElement.querySelector('button');

      expect(button.textContent.trim()).toBe('Aceptar');
    });
  });
});
