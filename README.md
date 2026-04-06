
# 🚚 QuickCourier

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Maven](https://img.shields.io/badge/Maven-Build-red)
![Docker](https://img.shields.io/badge/Docker-Container-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![REST API](https://img.shields.io/badge/API-RESTful-lightgrey)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

Sistema web para la **gestión de pedidos, facturación y cálculo de envíos**, desarrollado con **Spring Boot** aplicando **arquitectura limpia**, **seguridad JWT** y buenas prácticas profesionales.


---

# 📌 Descripción

QuickCourier es una aplicación web diseñada para optimizar la gestión logística mediante:

- Automatización de pedidos
- Gestión de productos
- Generación de facturas
- Cálculo de costos de envío
- API REST segura
- Arquitectura escalable

---

# 🧠 Características

✔️ API REST profesional  
✔️ Seguridad con JWT  
✔️ CRUD completo  
✔️ Arquitectura limpia  
✔️ DTO para transferencia de datos  
✔️ Docker  
✔️ Código mantenible  
✔️ Buenas prácticas backend  

---

# 🏗️ Arquitectura del sistema

El sistema sigue una arquitectura en capas:

Controller → Service → DTO → Model → Repository → Database

---

# 📊 Diagramas UML

### Diagrama de Casos de Uso
📄 [Ver PDF](Diagramas/QuickCurrier - Diagrama Casos de uso.pdf)

### Diagrama Entidad Relación
📄 [Ver PDF](Diagramas/QuickCurrier - Entidad-Relación.pdf)

### Diagrama de Componentes
📄 [Ver PDF](Diagramas/QuickCurrier - Diagrama de Componentes.pdf)

### Diagrama de Despliegue
📄 [Ver PDF](Diagramas/QuickCurrier - Diagrama de Despliegue.pdf)

---

# 🔐 Seguridad

El sistema utiliza autenticación basada en JWT:

- Login seguro
- Protección de endpoints
- Validación de token
- Control de acceso
- Autorización

Flujo:

Usuario → Login → JWT → Request con token → Validación → Acceso autorizado

---


# 🔗 Documentación de Endpoints

La API REST de **QuickCourier** se encuentra completamente documentada mediante **Swagger (OpenAPI 3)**, donde se pueden visualizar y probar todos los endpoints, parámetros, respuestas y modelos de datos.

📘 Acceso a Swagger UI:

http://localhost:8080/swagger-ui.html

o

http://localhost:8080/swagger-ui/index.html

Swagger permite:

- visualizar la estructura de requests y responses
- probar los endpoints directamente desde el navegador
- revisar los modelos DTO
- validar autenticación JWT
- consultar códigos de respuesta (200, 401, 403, 500, etc.)

---

# 📋 Lista de Endpoints

## 🔐 Autenticación

Base path:

/auth

| Método | Endpoint | Descripción |
|--------|---------|------------|
| POST | /auth/register | Registrar usuario |
| POST | /auth/login | Iniciar sesión y obtener JWT |
| POST | /auth/refresh | Refrescar token JWT |

---

## 📦 Productos

Base path:

/QuickCourier/Productos/Catalogo

| Método | Endpoint | Descripción |
|--------|---------|------------|
| GET | /QuickCourier/Productos/Catalogo | Obtener catálogo de productos |

---

## 📬 Pedidos

Base path:

/pedido

| Método | Endpoint | Descripción |
|--------|---------|------------|
| GET | /pedido/extras | Obtener extras de envío disponibles |
| GET | /pedido/zonas | Obtener zonas disponibles |
| POST | /pedido/crear | Crear pedido y calcular envío |
| POST | /pedido/calcular-peso | Calcular peso total del pedido |

---

## 🧾 Facturación

Base path:

/facturas

| Método | Endpoint | Descripción |
|--------|---------|------------|
| GET | /facturas/ultima | Obtener última factura generada |

---

## 🔑 API Keys

Base path:

/claves

| Método | Endpoint | Descripción |
|--------|---------|------------|
| POST | /claves/crear | Crear nueva API Key |
| POST | /claves/revocar | Revocar API Key |
| GET | /claves/validar | Validar API Key |


---

# 🛠️ Tecnologías utilizadas

- Java 17
- Spring Boot
- Spring Security
- JWT
- Maven
- Docker
- REST API
- HTML5
- CSS3

---

# 🚀 Instalación

git clone https://github.com/tuusuario/QuickCourier.git

cd QuickCourier

mvn spring-boot:run

Docker:

docker build -t quickcourier .

docker run -p 8080:8080 quickcourier

---

# 🎯 Objetivo

Demostrar:

- arquitectura limpia
- diseño de APIs REST
- seguridad backend
- organización profesional de código
- buenas prácticas de desarrollo

---

# 👨‍💻 Autores
Mariana Landinez Restrepo
Johann Sebastian Orjuela Heredia
Juan Diego Moreno Alayon
Jeison Miguel Gomez Gomez
