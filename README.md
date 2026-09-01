# Ecological Metadata Harvester

An enterprise-grade system designed to ingest, validate and manage ecological metadata such as **Movebank XML** and **Darwin Core Archives** with integration into institutional **DSpace** repositories.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Neon DB](https://img.shields.io/badge/Neon-Cloud_Postgres-00E599?style=flat&logo=neon&logoColor=black)](https://neon.tech/)

[![Movebank API](https://img.shields.io/badge/Movebank-API_Live-2ea44f?style=flat&logo=databricks&logoColor=white)](https://www.movebank.org/)
[![DSpace](https://img.shields.io/badge/DSpace-D32F2F?style=flat&logo=dspace&logoColor=white)](https://dspace.org/)
[![MoveRDM Dataset Explorer](https://img.shields.io/badge/MoveRDM_Dataset_Explorer-Project-00a8cc?style=flat&logo=databricks&logoColor=white)](https://movebank-explorer.pages.dev)

[![Render](https://img.shields.io/badge/Render-Backend_Hosting-46E3B7?style=flat&logo=render&logoColor=black)](https://render.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20to-Cloudflare%20Pages-orange?logo=cloudflare)](https://pages.cloudflare.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Sandbox Mode](https://img.shields.io/badge/Mode-Sandbox-f59e0b?style=flat&logo=codesandbox&logoColor=white)](#-current-status-sandbox-mode)

[![Max Planck Institute](https://img.shields.io/badge/MPI_Animal_Behavior-Partner-005691?style=flat)](https://www.ab.mpg.de/)
[![University of Konstanz](https://img.shields.io/badge/Uni_Konstanz-Partner-003366?style=flat)](https://www.uni-konstanz.de/)

## 🧪 Current Status: Sandbox Mode

Currently, the application runs in an isolated sandbox environment. All processed metadata files and validation logs are securely stored locally within a dedicated PostgreSQL database (Neon), without transmitting data to external production repositories.

## 🚀 Live Demo

🔗 **[View Live Application on Cloudflare Pages](https://metadata-harvester.pages.dev)**

![Ecological Metadata Harvester Dashboard](image.png)

## 🏛️ Project Architecture

The high-level system architecture illustrates the data flow from the browser and frontend presentation layer down to the Spring Boot REST backend, asynchronous processing pipelines and persistent storage layers (PostgreSQL, DSpace and local metadata repositories).

The project is split into two independent sub-projects:

- **`backend/`** — Spring Boot REST API responsible for database management (Flyway, JPA), file validation pipelines and data storage.

- **`frontend/`** — Angular 22 Single Page Application providing an administrative dashboard, upload wizards and dataset explorers.

<p align="center">
  <img src="ARCHITECTURE.png" alt="Metadata Harvester Architecture Diagram" width="100%">
</p>

> _Tip: You can also inspect the raw diagram source code in [ARCHITECTURE.mmd](ARCHITECTURE.mmd)._

---

## 📚 Component-Specific Documentation

For detailed guides on how to build, run and configure each part of the system, please refer to their respective documentation:

- ⚙️ **[Backend README](./backend/README.md)** — Setup guide, environment variables, database configuration and API endpoints.

- 💻 **[Frontend README](./frontend/README.md)** — Angular development server, dependencies, UI components and build instructions.

---

## 🚀 Quick Start (Docker Compose)

You can spin up the entire stack (database and services) using the root configuration:

```bash
docker-compose up --build
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check the [issues page](https://github.com/wixhub/metadata-harvester/issues).

---

## 📬 Contact & Support

If you have any questions, suggestions or feedback regarding this project, feel free to reach out:

- **Author:** [@wixhub](https://github.com/wixhub)
  - **Telegram:** [@typeweb](https://t.me/typeweb)
- **GitHub Repository:** [moverdm-explorer](https://github.com/wixhub/metadata-harvester)

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

This project is open-source and available under the [MIT License](LICENSE).

- **Data Attribution**:
  - Animal tracking data provided by **[Movebank](www.movebank.org)** and individual researchers.
