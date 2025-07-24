# Lazy Stack Builder

> Un generador de proyectos backend moderno, interactivo y minimalista.

## ¿Qué es Lazy Stack Builder?

**Lazy Stack Builder** es un CLI que te permite crear proyectos backend de manera rápida y guiada, comenzando con soporte para NestJS. El asistente interactivo te ayuda a elegir el nombre del proyecto, gestor de paquetes, ORM y si deseas agregar herramientas de calidad como Biome.

## Características

- Generación interactiva de proyectos NestJS
- Selección de gestor de paquetes: npm, yarn o pnpm
- Soporte para ORMs populares: Sequelize, Drizzle, TypeORM, Prisma
- Opción de agregar Biome para linting y formateo
- Automatización de la estructura inicial del proyecto

## Instalación

Clona el repositorio y navega a la carpeta:

```sh
git clone <url-del-repo>
cd lazy-stack-builder
pnpm install
```

## Uso

Compila el proyecto:

```sh
pnpm run tsdown
```

Ejecuta el CLI:

```sh
node dist/index.js
```

O si lo tienes instalado globalmente:

```sh
first-cli
```

Sigue las instrucciones en pantalla para configurar tu nuevo proyecto backend.

## Scripts útiles

- `pnpm run tsdown` — Compila el proyecto TypeScript
- `pnpm run dev` — Compila en modo watch
- `pnpm run check-types` — Verifica los tipos TypeScript
- `pnpm run check` — Lint y formateo con Biome

### Como generador de proyectos en tu máquina o servidor

1. Compila el proyecto: `pnpm run tsdown`
2. Ejecuta: `node dist/index.js`

## Licencia

MIT

---

> Hecho con ❤️ para desarrolladores que quieren empezar rápido y bien. 