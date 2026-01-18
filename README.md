# 🛸 Dimension C-137

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**DimensionC137** es una aplicación web que te permite explorar el multiverso de Rick and Morty. Descubrí personajes, locaciones y episodios de todas las dimensiones con una interfaz moderna y responsive.

🌐 **[Ver Demo en Vivo](https://dimension-c137-beta.vercel.app/)**

---

## ✨ Características

### 👥 Personajes
- Exploración de 800+ personajes del multiverso
- Búsqueda en tiempo real por nombre
- Filtros por estado (Alive, Dead, Unknown) y género
- Vista detallada con información completa
- Paginación inteligente

### 🌍 Locaciones
- Descubrí 126+ locaciones interdimensionales
- Filtros por tipo y dimensión
- Información de residentes por ubicación
- Navegación fluida entre páginas

### 📺 Episodios
- Catálogo completo de 51 episodios
- Filtros por nombre y código de episodio
- Información de personajes por episodio
- Organización por temporadas

### 🎨 Diseño Moderno
- Interfaz inspirada en la serie
- Animaciones suaves y transiciones
- Cards interactivas con hover effects
- 100% responsive para todos los dispositivos

---

## 🚀 Tecnologías

| Tecnología | Versión |
|------------|---------|
| **Angular** | 18+ |
| **TypeScript** | 5.5+ |
| **Bootstrap** | 5.3 |
| **RxJS** | 7.8+ |

### Stack Técnico
- **Framework:** Angular 18+ (Standalone Components)
- **UI:** Bootstrap 5 + CSS3
- **Lenguaje:** TypeScript
- **Estado:** Signals API (Angular)
- **HTTP Client:** HttpClient + RxJS
- **API:** [Rick and Morty API](https://rickandmortyapi.com)
- **Deploy:** Vercel
- **Routing:** Angular Router con lazy loading

---

## 🛠️ Instalación Local

### Requisitos Previos
- Node.js 18+ (recomendado 20.x)
- npm 10+
- Angular CLI 18+

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/baez-nicolas/DimensionC137.git
cd DimensionC137
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
ng serve
# o
npm start
```

4. **Abrir en el navegador**
```
http://localhost:4200
```

5. **Build de producción**
```bash
ng build
```

Los archivos compilados estarán en `dist/DimensionC137/browser/`

## 🎨 Características Técnicas

### Arquitectura
- **Standalone Components:** Arquitectura moderna sin NgModules
- **Signals:** Estado reactivo con Signals API
- **Services:** Inyección de dependencias con `inject()`
- **HTTP Client:** Llamadas asíncronas a la API REST
- **Lazy Loading:** Carga diferida de componentes
- **Type Safety:** Interfaces TypeScript para todos los modelos

### API Integration
- **Endpoint:** https://rickandmortyapi.com/api
- **Recursos:** Characters, Locations, Episodes
- **Paginación:** Automática con info de páginas
- **Filtros:** Query params para búsquedas avanzadas
- **Error Handling:** Manejo robusto de errores HTTP

### Responsive Design
- **Mobile First:** Optimizado para dispositivos móviles
- **Breakpoints:** Adaptación fluida en tablets y desktop
- **Grid System:** Bootstrap grid responsive
- **Navbar:** Colapsable en móviles

---

## 🎯 Funcionalidades Destacadas

### Sistema de Búsqueda y Filtros
- Búsqueda en tiempo real con debounce
- Filtros combinados (nombre + status + gender)
- Reset de filtros con un click
- Feedback visual de resultados

### Navegación Intuitiva
- Paginación con botones prev/next
- Indicador de página actual
- Scroll automático al cambiar de página
- Rutas dinámicas para detalles

### Optimización de Performance
- Lazy loading de componentes
- Signals para reactividad eficiente
- HttpClient con RxJS observables
- Build optimizado para producción

---

## 🙏 Créditos

- **API:** [The Rick and Morty API](https://rickandmortyapi.com) - Creada por [Axel Fuhrmann](https://github.com/afuh)

---

## 👨‍💻 Autor

**Nicolás Baez**

- GitHub: [@baez-nicolas](https://github.com/baez-nicolas)
- LinkedIn: [linkedin.com/in/baez-nicolas](https://www.linkedin.com/in/baez-nicolas/)
- Proyecto: [DimensionC137](https://github.com/baez-nicolas/DimensionC137)
- Demo: [dimension-c137-beta.vercel.app](https://dimension-c137-beta.vercel.app/)

---

<div align="center">

**[⬆ Volver arriba](#-dimensionc-137)**

Hecho con ❤️ y 🛸

</div>

