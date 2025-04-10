# Pokemon API - NestJS Backend

Este es un proyecto backend desarrollado con NestJS que proporciona una API para consultar información sobre Pokémon utilizando la [PokéAPI](https://pokeapi.co/) como fuente de datos.

## Características

- Arquitectura limpia (Clean Architecture)
- Consulta de Pokémon por ID o nombre
- Sistema de caché para mejorar el rendimiento
- Manejo adecuado de errores
- Pruebas unitarias
- Configuración CORS para integración con frontend Angular

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts              # Módulo principal
├── domain/                    # Capa de dominio
│   └── entities/
│       └── pokemon.entity.ts  # Entidad Pokémon
├── infrastructure/            # Capa de infraestructura
│   └── adapters/
│       └── pokeapi.adapter.ts # Adaptador para PokéAPI
├── application/               # Capa de aplicación
│   └── services/
│       └── pokemon.service.ts # Servicio de negocio
└── presentation/              # Capa de presentación
    └── controllers/
        └── pokemon.controller.ts # Controlador REST
```

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/javiezapata/pokemon-api.git
   cd pokemon-api
   ```

2. Instalar las dependencias:
   ```bash
   npm install
   ```

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```
PORT=3000
NODE_ENV=development
```

## Ejecutar la Aplicación

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start
```

## Endpoints API

### Obtener información de un Pokémon

```
GET /pokemon/{idOrName}
```

Donde `{idOrName}` puede ser:
- El ID numérico del Pokémon (ej: 25)
- El nombre del Pokémon (ej: pikachu)

#### Respuesta exitosa:

```json
{
  "id": 25,
  "name": "pikachu",
  "types": ["electric"],
  "abilities": ["static", "lightning-rod"],
  "sprite_url": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
}
```

#### Respuesta de error (404):

```json
{
  "statusCode": 404,
  "message": "Pokemon not found"
}
```

## Pruebas

### Pruebas unitarias

```bash
npm run test
```

### Pruebas e2e

```bash
npm run test:e2e
```

## Despliegue

### Despliegue en Render

1. Crear una nueva aplicación web en [Render](https://render.com)
2. Conectar con el repositorio
3. Configurar:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
4. Añadir las variables de entorno necesarias

### Configuración CORS para Frontend Angular

La API ya viene configurada para aceptar peticiones desde:
- `http://localhost:4200` (desarrollo)
- La URL de tu aplicación Angular en producción

Si necesitas añadir más orígenes, modifica la configuración CORS en `src/main.ts`.

## Integración con Frontend

Esta API está diseñada para trabajar con un frontend Angular. Para conectar tu aplicación Angular:

1. Configura la URL de la API en tu entorno de Angular:
   ```typescript
   // environment.prod.ts
   export const environment = {
     production: true,
     apiUrl: 'https://pokemon-api-i36h.onrender.com'
   };
   ```

2. Crea un servicio para consumir la API:
   ```typescript
   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { environment } from '../environments/environment';

   @Injectable({
     providedIn: 'root'
   })
   export class PokemonService {
     private apiUrl = `${environment.apiUrl}/pokemon`;

     constructor(private http: HttpClient) { }

     getPokemon(idOrName: string | number): Observable<any> {
       return this.http.get(`${this.apiUrl}/${idOrName}`);
     }
   }
   ```


## Autor

Javier Zapata Montoya

## Agradecimientos

- [PokéAPI](https://pokeapi.co/) por proporcionar los datos de Pokémon
- [NestJS](https://nestjs.com/) por el framework
