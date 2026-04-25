🛒 E-commerce 2026 | Modern Shopping Experience
Una plataforma de comercio electrónico de alto rendimiento construida bajo los principios de Clean Architecture. Este proyecto no solo se enfoca en la interfaz de usuario, sino en una separación de responsabilidades robusta que permite escalabilidad, pruebas unitarias sencillas y un mantenimiento ágil.

🔗 Demo en vivo | 📂 Documentación Técnica

🚀 Stack Tecnológico y Arquitectura
Para este proyecto se implementó una estructura desacoplada que garantiza un producto final ligero y profesional:

Frontend Core: React / JavaScript (ES6+) con Vite para optimización de assets.

Gestión de Estado: Store centralizado con composición de Providers.

Arquitectura: Diseño por capas (Presentation, Application, Domain, Infrastructure).

Estilos: CSS3 Moderno (Flexbox & Grid) con enfoque Adaptive.

Persistencia: LocalStorage Adapter para persistencia de sesión y carrito.

Integraciones: WhatsApp Service para finalización de pedidos.

🏗️ Arquitectura del Sistema
El proyecto sigue un flujo de datos unidireccional y modular, como se detalla en el diagrama de arquitectura:

Capa de Presentación (Presentation): Maneja la UI y la lógica de los componentes (ProductsPage, CartPage, AdminPage). Utiliza Hooks personalizados (useCart, useAuth, usePermissions) para interactuar con la lógica de negocio.

Capa de Aplicación (Application): Orquesta los casos de uso como processOrder y addToCart a través de servicios dedicados.

Capa de Dominio (Domain): Contiene la lógica esencial del negocio, entidades (Product, Order, User) y reglas de validación (RBAC).

Capa de Infraestructura (Infrastructure): Gestiona las herramientas externas, adaptadores de almacenamiento y servicios de mensajería (WhatsApp integration).

🛠️ Funcionalidades Clave
Catálogo Inteligente: Renderizado eficiente con búsqueda dinámica mediante SearchBar.

Gestión de Carrito: Persistencia total de datos y resumen detallado en el MiniCart.

Control de Acceso (RBAC): Sistema de permisos mediante usePermissions para proteger la zona de administración.

Checkout Optimizado: Integración con servicios externos para la gestión de órdenes.

📂 Estructura del Proyecto
Plaintext
src/
├── presentation/     # Componentes de UI, Pages y Hooks
├── application/      # Servicios y Casos de Uso (Business Logic)
├── domain/           # Entidades, Contratos y Reglas de Negocio
├── infrastructure/   # Adaptadores (Storage, API, WhatsApp)
└── store/            # Configuración y estado global

👤 Autor
Jairo Antonio Cárdenas M.
Full Stack Developer & Product Manager
