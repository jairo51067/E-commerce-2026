# 🛒 E-commerce 2026 | Modern Shopping Experience

<div align="center">

![GitHub Repo Size](https://img.shields.io/github/repo-size/jairo51067/ecommerce-2026?style=for-the-badge&color=blue)
![Vercel Status](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

**Una solución de comercio electrónico robusta, escalable y diseñada bajo principios de Clean Architecture.**

[Explorar Demo en Vivo 🚀](https://tu-link.vercel.app) • [Reportar Bug 🐛](https://github.com/jairo51067/ecommerce-2026/issues) • [Solicitar Feature ✨](https://github.com/jairo51067/ecommerce-2026/issues)

</div>

---

## 📖 Descripción General

**E-commerce 2026** no es solo una tienda virtual; es un ecosistema desarrollado con un enfoque en **rendimiento extremo** y **mantenibilidad**. Utilizando una arquitectura desacoplada, el proyecto garantiza una experiencia de usuario fluida y un código preparado para el crecimiento empresarial.

### 🎯 Objetivos Logrados:
* **Performance:** Optimización de *Core Web Vitals* mediante carga bajo demanda.
* **Escalabilidad:** Separación estricta de lógica de negocio y UI (Clean Architecture).
* **UX/UI:** Diseño adaptable con enfoque *mobile-first* y estados persistentes.

---

## 🏗️ Arquitectura del Sistema (Clean Architecture)

El proyecto se estructura en capas independientes, permitiendo que la lógica de negocio sea ajena a los cambios en la tecnología de la interfaz o bases de datos.

| Capa | Responsabilidad | Tecnologías Clave |
| :--- | :--- | :--- |
| **Presentation** 📱 | Interfaz de usuario, gestión de rutas y hooks de estado. | React, Vite, CSS Grid/Flexbox |
| **Application** ⚙️ | Orquestación de casos de uso (Orders, Cart, Auth). | Services & Use Cases |
| **Domain** 🧠 | Entidades de negocio, reglas de validación y RBAC. | Logic, Entities, Permissions |
| **Infrastructure** 🔌 | Adaptadores externos y persistencia de datos. | LocalStorage, WhatsApp API |

---

## 🛠️ Stack Tecnológico

* **Frontend:** JavaScript ES6+ / React.
* **Tooling:** Vite (Build tool ultra-rápida).
* **State Management:** Context API con arquitectura de composición de Providers.
* **Seguridad:** Sistema de permisos basado en roles (RBAC).
* **Integraciones:** Servicio de mensajería vía WhatsApp para cierre de ventas.

---

## 📂 Estructura del Repositorio

```bash
src/
├── presentation/     # 🎨 UI: Components, Pages, Hooks, Layouts
├── application/      # ⚡ Logic: Services (Auth, Cart, Order)
├── domain/           # 🏛️ Core: Entities, Permissions, Contracts
├── infrastructure/   # 🛠️ Tools: LocalStorage, API Adapters, Utils
└── store/            # 📦 State: Global config & Providers
```

---

## ✨ Funcionalidades Destacadas

* ✅ **Carrito Persistente:** Los datos sobreviven a recargas del navegador mediante adaptadores de infraestructura.
* ✅ **Admin Dashboard:** Protegido por guardias de permisos (`usePermissions`).
* ✅ **Búsqueda Dinámica:** Filtrado de productos en tiempo real optimizado.
* ✅ **Checkout Estratégico:** Integración directa a WhatsApp para aumentar la tasa de conversión.

---

## 📖 Guía Rápida de Uso

Para una experiencia óptima en la plataforma, sigue estos pasos clave:

* **🔍 Exploración:** Utiliza la `SearchBar` para filtrar el catálogo en tiempo real. La arquitectura modular permite búsquedas instantáneas sin recargar la página.
* **🛒 Gestión de Compra:** Añade productos al carrito. Gracias a nuestro `LocalStorage Adapter`, tu selección permanecerá guardada incluso si cierras el navegador.
* **🚀 Finalización de Orden:** Haz clic en "Procesar Orden" en el carrito para activar el `OrderService`, el cual generará un resumen listo para ser enviado vía WhatsApp.
* **🛡️ Acceso Administrativo:** Para gestionar el inventario, accede a la sección Admin (requiere permisos validados por nuestro sistema RBAC).

> 💡 **¿Necesitas más detalles?** Consulta nuestro [Manual de Usuario Completo en la Wiki](../../wiki).

> > 📚 **¿Eres desarrollador o quieres conocer más?** Visita nuestra [Wiki Técnica](../../wiki) para ver diagramas de flujo, lógica de servicios y guías de contribución.

---

## ⚙️ Instalación y Configuración

```bash
# 1. Clonar el repositorio
git clone https://github.com/jairo51067/ecommerce-2026.git

# 2. Entrar al directorio
cd ecommerce-2026

# 3. Instalar dependencias
npm install

# 4. Iniciar entorno de desarrollo
npm run dev
```

---

## 👤 Autor

**Jairo Antonio Cárdenas M.**
*Full Stack Developer & Product Manager*

<div align="left">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/tu-usuario)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jairo51067)

</div>

---

<div align="center">
Desarrollado con ❤️ en San Cristóbal, Venezuela. 2026.
</div>
