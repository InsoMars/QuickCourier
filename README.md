
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

## Auth

POST /auth/login  
POST /auth/register  

---

## Productos

GET /products  
GET /products/{id}  
POST /products  
PUT /products/{id}  
DELETE /products/{id}  

---

## Pedidos

GET /orders  
GET /orders/{id}  
POST /orders  
PUT /orders/{id}  
DELETE /orders/{id}  

---

## Facturación

GET /invoice/{orderId}  
GET /invoice  

---

## Envíos

POST /shipping/calculate  

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
