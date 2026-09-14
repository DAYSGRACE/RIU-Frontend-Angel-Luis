import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroNavbar } from './hero-navbar';
import { provideRouter, Router, RouterLink, Routes } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

@Component({ template: '' })
class DummyComponent {}

const routes: Routes = [
  {
    path: 'heroes',
    title: 'Listado de Héroes',
    component: DummyComponent,
    children: [
      {
        path: 'create',
        title: 'Crear Héroe',
        component: DummyComponent,
      },
    ],
  },
];

describe('HeroNavbar', () => {
  let component: HeroNavbar;
  let fixture: ComponentFixture<HeroNavbar>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroNavbar],
      providers: [provideRouter(routes), provideLocationMocks()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroNavbar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    // Inicializar la navegación inicial para resolver los enlaces del router
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe renderizar los enlaces de navegación configurados en la plantilla', () => {
    const linkDebugElements = fixture.debugElement.queryAll(By.directive(RouterLink));

    expect(linkDebugElements.length).toBe(component.routes.length);

    const firstLink = linkDebugElements[0].nativeElement as HTMLAnchorElement;
    const secondLink = linkDebugElements[1].nativeElement as HTMLAnchorElement;

    expect(firstLink.textContent?.trim()).toBe('Listado');
    expect(secondLink.textContent?.trim()).toBe('Crear');

    expect(firstLink.getAttribute('href')).toBe('/heroes');
    expect(secondLink.getAttribute('href')).toBe('/heroes/create');
  });

  it('debe actualizar el título del navbar dinámicamente según la ruta activa', async () => {
    await router.navigateByUrl('/heroes');
    fixture.detectChanges();

    let titleElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Listado de Héroes');

    await router.navigateByUrl('/heroes/create');
    fixture.detectChanges();

    titleElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Crear Héroe');
  });

  it('debe mostrar el título por defecto ("Héroes") cuando la ruta no tiene propiedad title', async () => {
    const routesWithoutTitle: Routes = [{ path: 'no-title', component: DummyComponent }];
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [HeroNavbar],
      providers: [provideRouter(routesWithoutTitle), provideLocationMocks()],
    }).compileComponents();

    const localFixture = TestBed.createComponent(HeroNavbar);
    const localRouter = TestBed.inject(Router);
    localRouter.initialNavigation();
    localFixture.detectChanges();

    await localRouter.navigateByUrl('/no-title');
    localFixture.detectChanges();

    const titleElement = localFixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Héroes');
  });
});
