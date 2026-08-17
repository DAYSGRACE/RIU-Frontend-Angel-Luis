# RIU Frontend – Angel Luis

Aplicación desarrollada con Angular 22 para la gestión de superhéroes como parte de una prueba técnica.

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

## Requisitos.

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

La aplicación usa `json-server` como backend simulado para gestionar las peticiones HTTP.

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

## Pruebas

El proyecto utiliza **Vitest** para las pruebas unitarias.

Para ejecutar las pruebas:

```bash
npm run test
```

o

```bash
ng t
```

Las pruebas cubren principalmente:

- Servicios.
- Componentes.
- Formularios.
- Páginas.
- Navegación.
- Paginación.
- Diálogos de confirmación.
- Estados de carga y búsqueda.
---

### Build

Para generar una build de producción:

```
npm run build
```

Los archivos generados estarán disponibles en el directorio:

```
dist/
```
---


## Autor

Angel Luis