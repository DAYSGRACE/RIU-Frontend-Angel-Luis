# RIUFrontendAngelLuis

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

# RIU Frontend – Angel Luis

Aplicación desarrollada con Angular 22 para la gestión de superhéroes (Prueba técnica).

## Tecnologías usadas

- Angular 22
- Angular Material
- Tailwind CSS 4
- Signals
- RxJS
- RxResource
- Json Server
- Vitest

---

## Requerimientos antes de iniciar instalar dependencias.

- Node.js 24 o superior
- npm 11 o superior

Puedes comprobar las versiones instaladas mediante:

```bash
node --version
npm --version
```

---

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/DAYSGRACE/RIU-Frontend-Angel-Luis.git
```

Accede al directorio del proyecto:

```bash
cd RIU-Frontend-Angel-Luis
```

Instala las dependencias:

```bash
npm install
```

---

## Ejecución del proyecto

La aplicación usa `json-server` como mini-backend para simular peticiones.

### 1. Iniciar la API

```bash
npm run db-server
```

El servicio quedará disponible en:

```text
http://localhost:8080
```

---

### 2. Iniciar la aplicación

En una nueva terminal ejecuta:

```bash
npm start
```

o

```bash
ng serve
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

---

## Estructura del proyecto

```text
src/
├── app/
│   ├── core/
│   ├── shared/
│   └── features/
│       └── superheroes/
│           ├── components/
│           ├── configs/
│           ├── interfaces/
│           ├── layout/
│           ├── mappers/
│           ├── pages/
│           └── services/
```

---

## Ejecución de pruebas

```bash
npm run test
```
o
```bash
ng t
```

La aplicación cuenta con pruebas unitarias para:

- Servicios.
- Componentes.
- Formularios.
- Páginas.
- Navegación.
- Paginación.
- Diálogos (lo s modales).

---

## Autor

Angel Luis

```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build
optimizes your application for performance and speed.

## Running unit tests

Solo considere los casos de prueba fundamentales a mi criterio.

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit
the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
