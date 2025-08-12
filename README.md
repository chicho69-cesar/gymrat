# GymRat - Aplicación de Entrenamiento

GymRat es una aplicación móvil desarrollada con React Native y Expo que permite a los usuarios gestionar sus rutinas de ejercicio, días de entrenamiento y seguimiento de progreso. La aplicación está construida siguiendo los principios de **Clean Architecture** para mantener el código organizado, escalable y fácil de mantener.

## 📋 Tabla de Contenidos

- [GymRat - Aplicación de Entrenamiento](#gymrat---aplicación-de-entrenamiento)
  - [📋 Tabla de Contenidos](#-tabla-de-contenidos)
  - [✨ Características](#-características)
  - [🏗️ Arquitectura](#️-arquitectura)
    - [Principios Aplicados](#principios-aplicados)
  - [🛠️ Tecnologías](#️-tecnologías)
    - [Core](#core)
    - [UI/UX](#uiux)
    - [Base de Datos](#base-de-datos)
    - [Estado y Lógica](#estado-y-lógica)
    - [Herramientas de Desarrollo](#herramientas-de-desarrollo)
  - [📁 Estructura del Proyecto](#-estructura-del-proyecto)
  - [🚀 Instalación](#-instalación)
    - [Prerrequisitos](#prerrequisitos)
    - [Pasos de Instalación](#pasos-de-instalación)
  - [📜 Scripts Disponibles](#-scripts-disponibles)
    - [Migraciones](#migraciones)
  - [🎨 Componentes UI](#-componentes-ui)
    - [Sistema de Diseño](#sistema-de-diseño)
  - [🧭 Navegación](#-navegación)
  - [🔄 Flujo de Datos](#-flujo-de-datos)
    - [Ejemplo de Flujo Completo](#ejemplo-de-flujo-completo)
  - [🤝 Contribuir](#-contribuir)
    - [Guías de Contribución](#guías-de-contribución)
    - [Estándares de Código](#estándares-de-código)
    - [Convenciones de Naming](#convenciones-de-naming)
  - [📄 Licencia](#-licencia)
  - [👥 Equipo](#-equipo)
  - [📞 Soporte](#-soporte)

## ✨ Características

- **Gestión de Ejercicios**: Crear, editar y eliminar ejercicios personalizados
- **Rutinas de Entrenamiento**: Organizar ejercicios en rutinas específicas
- **Días de Entrenamiento**: Configurar días específicos con ejercicios y series
- **Seguimiento de Entrenamientos**: Registrar sets, repeticiones y pesos
- **Historial de Progreso**: Visualizar estadísticas y progreso a lo largo del tiempo
- **Interfaz Moderna**: Diseño atractivo con Tamagui y iconografía Lucide
- **Almacenamiento Local**: Base de datos SQLite para funcionar offline

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture** organizada en las siguientes capas:

```
┌─────────────────────────────────────┐
│           Presentation              │  ← UI Components, Screens, Hooks
├─────────────────────────────────────┤
│           Domain                    │  ← Entities, Use Cases, Repositories (Interfaces)
├─────────────────────────────────────┤
│         Infrastructure              │  ← Repository Implementations, Mappers
├─────────────────────────────────────┤
│             Data                    │  ← Models, Database, Migrations
└─────────────────────────────────────┘
```

### Principios Aplicados

- **Inversión de Dependencias**: Las capas superiores no dependen de las inferiores
- **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
- **Testabilidad**: Código fácil de testear mediante interfaces y mocks
- **Escalabilidad**: Estructura que permite crecer sin refactoring masivo

## 🛠️ Tecnologías

### Core

- **React Native** - Framework principal para desarrollo móvil
- **Expo** - Plataforma de desarrollo y despliegue
- **TypeScript** - Tipado estático para mayor robustez

### UI/UX

- **Tamagui** - Sistema de diseño y componentes UI
- **Lucide Icons** - Iconografía moderna y consistente
- **Expo Router** - Navegación basada en archivos

### Base de Datos

- **Expo SQLite** - Base de datos local para almacenamiento offline

### Estado y Lógica

- **Zustand** - Gestión de estado global ligera
- **Custom Hooks** - Lógica reutilizable encapsulada

### Herramientas de Desarrollo

- **Biome** - Linter y formateador de código
- **Metro** - Bundler para React Native
- **Babel** - Transpilador de JavaScript

## 📁 Estructura del Proyecto

```
gymrat/
├── app/                              # 📱 Pantallas y navegación (Expo Router)
│   ├── (tabs)/                      # Navegación por pestañas
│   │   ├── (home)/                  # Pestaña Home
│   │   │   ├── home/                # Pantalla principal
│   │   │   ├── routine/             # Visualización de rutinas
│   │   │   └── workout/             # Pantalla de entrenamiento
│   │   ├── (history)/               # Pestaña Historial
│   │   │   ├── history/             # Lista de historial
│   │   │   └── workout-stats/       # Estadísticas detalladas
│   │   └── (settings)/              # Pestaña Configuración
│   │       ├── exercises/           # Gestión de ejercicios
│   │       ├── routine/             # Creación de rutinas
│   │       ├── settings/            # Configuraciones
│   │       └── workout-days/        # Gestión de días
│   ├── _layout.tsx                  # Layout principal
│   ├── +html.tsx                    # Configuración web
│   └── +not-found.tsx               # Página 404
│
├── domain/                          # 🎯 Capa de Dominio (Clean Architecture)
│   ├── entities/                    # Entidades de negocio
│   │   ├── exercise.entity.ts       # Entidad Ejercicio
│   │   ├── routine.entity.ts        # Entidad Rutina
│   │   ├── workout-day.entity.ts    # Entidad Día de Entrenamiento
│   │   └── workout.entity.ts        # Entidad Entrenamiento
│   ├── dtos/                        # Data Transfer Objects
│   ├── repositories/                # Interfaces de repositorios
│   ├── datasources/                 # Interfaces de fuentes de datos
│   └── use-cases/                   # Casos de uso de negocio
│
├── infrastructure/                  # 🔧 Capa de Infraestructura
│   ├── repositories/                # Implementaciones de repositorios
│   ├── datasources/                 # Implementaciones de datasources
│   └── mappers/                     # Transformadores de datos
│
├── data/                           # 💾 Capa de Datos
│   ├── models/                     # Modelos de base de datos
│   ├── constants.ts                # Constantes de la aplicación
│   └── migrate-db.ts               # Migraciones de BD
│
├── presentation/                   # 🎨 Capa de Presentación
│   ├── components/                 # Componentes reutilizables
│   │   ├── exercises/              # Componentes de ejercicios
│   │   ├── routines/               # Componentes de rutinas
│   │   ├── ui/                     # Componentes UI base
│   │   └── workout-days/           # Componentes de días
│   └── hooks/                      # Hooks personalizados
│       ├── use-database.ts         # Hook de base de datos
│       └── use-exercises.ts        # Hook de ejercicios
│
├── config/                         # ⚙️ Configuraciones
│   └── helpers/                    # Utilidades y helpers
│
└── assets/                         # 🖼️ Recursos estáticos
    ├── fonts/                      # Fuentes personalizadas
    └── images/                     # Imágenes y iconos
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio (para Android) o Xcode (para iOS)

### Pasos de Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/chicho69-cesar/gymrat.git
   cd gymrat
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**

   ```bash
   npx expo start
   ```

4. **Ejecutar en dispositivo/emulador**
   - Para Android: Presiona `a` en la terminal o escanea el QR con Expo Go
   - Para iOS: Presiona `i` en la terminal o escanea el QR con Expo Go
   - Para Web: Presiona `w` en la terminal

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm start                    # Inicia el servidor Expo
npm run android             # Ejecuta en Android
npm run ios                 # Ejecuta en iOS
npm run web                 # Ejecuta en navegador

# Construcción
npm run build              # Construye la aplicación

# Calidad de Código
npm run lint               # Ejecuta el linter
npm run format             # Formatea el código

# Utilidades
npm run reset-project      # Reinicia el proyecto
```

### Migraciones

Las migraciones se gestionan en `data/migrate-db.ts` y se ejecutan automáticamente al iniciar la aplicación.

## 🎨 Componentes UI

### Sistema de Diseño

La aplicación utiliza **Tamagui** como sistema de diseño, proporcionando:

- **Tokens de diseño**: Colores, espaciado, tipografía consistentes
- **Componentes base**: Button, Input, Text, View, Stack
- **Theming**: Soporte para temas claro y oscuro
- **Responsive**: Adaptación automática a diferentes tamaños de pantalla

## 🧭 Navegación

La aplicación utiliza **Expo Router** con navegación basada en archivos:

```
app/
├── (tabs)/                 # Tab Navigator
│   ├── (home)/            # Stack Navigator - Home
│   ├── (history)/         # Stack Navigator - History  
│   └── (settings)/        # Stack Navigator - Settings
└── _layout.tsx            # Root Layout
```

## 🔄 Flujo de Datos

```
UI Component → Custom Hook → Use Case → Repository → DataSource → Database
     ↓              ↓           ↓           ↓           ↓          ↓
   Render ← State ← Entity ← Domain ← Infrastructure ← Data
```

### Ejemplo de Flujo Completo

1. **Usuario interactúa** con `ExerciseList` component
2. **Component usa** `useExercises` hook
3. **Hook llama** `ExerciseUseCases.getAll()`
4. **Use Case usa** `ExerciseRepository` interface
5. **Repository implementa** `ExerciseDataSource`
6. **DataSource consulta** SQLite database
7. **Datos se mapean** de Model a Entity
8. **Entity se devuelve** hasta el Component
9. **Component renderiza** la lista actualizada

## 🤝 Contribuir

### Guías de Contribución

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

### Estándares de Código

- Usar **TypeScript** para todo el código
- Seguir **Clean Architecture** principles
- Usar **Biome** para linting y formateo
- Escribir **tests** para nuevas funcionalidades
- Documentar **APIs públicas**

### Convenciones de Naming

```
- Componentes: PascalCase (ExerciseList)
- Hooks: camelCase con 'use' prefix (useExercises)
- Files: kebab-case (exercise-list.tsx)
- Variables: camelCase (exerciseData)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: [chicho69-cesar](https://github.com/chicho69-cesar)

## 📞 Soporte

Para reportar bugs o solicitar nuevas características, por favor abre un [issue](https://github.com/chicho69-cesar/gymrat/issues) en GitHub.

---

*Desarrollado con ❤️ usando React Native y Clean Architecture*
