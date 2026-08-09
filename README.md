# Ecological Metadata Harvester

An enterprise-grade system designed to ingest, validate, and manage ecological metadata (such as **Movebank XML** and **Darwin Core Archives**) with future integration capabilities into institutional **DSpace** repositories.

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=flat&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Neon DB](https://img.shields.io/badge/Neon-Cloud_Postgres-00E599?style=flat&logo=neon&logoColor=black)](https://neon.tech/)
[![Render](https://img.shields.io/badge/Render-Backend_Hosting-46E3B7?style=flat&logo=render&logoColor=black)](https://render.com/)

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![Sandbox Mode](https://img.shields.io/badge/Mode-Sandbox-f59e0b?style=flat&logo=codesandbox&logoColor=white)](#-current-status-sandbox-mode)

## 🧪 Current Status: Sandbox Mode

Currently, the application runs in an isolated sandbox environment. All processed metadata files and validation logs are securely stored locally within a dedicated PostgreSQL database (Neon), without transmitting data to external production repositories.

---

## 🏛️ Project Architecture

The project is split into two independent sub-projects:

- **`backend/`** — Spring Boot REST API responsible for database management (Flyway, JPA), file validation pipelines, and data storage.

- **`frontend/`** — Modern Angular (v18+) Single Page Application providing an administrative dashboard, upload wizards, and dataset explorers.

---

## 📚 Component-Specific Documentation

For detailed guides on how to build, run, and configure each part of the system, please refer to their respective documentation:

- ⚙️ **[Backend README](./backend/README.md)** — Setup guide, environment variables, database configuration, and API endpoints.

- 💻 **[Frontend README](./frontend/README.md)** — Angular development server, dependencies, UI components, and build instructions.

---

## 🚀 Quick Start (Docker Compose)

You can spin up the entire stack (database and services) using the root configuration:

```bash
docker-compose up --build
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/wixhub/moverdm-explorer-web/issues).

---

## 📬 Contact & Support

If you have any questions, suggestions, or feedback regarding this project, feel free to reach out:

- **Author:** [@Rublin](https://github.com/wixhub)
- **Telegram:** [@typeweb](https://t.me/typeweb)
- **GitHub Repository:** [moverdm-explorer](https://github.com/wixhub/moverdm-explorer-web)

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

This project is open-source and available under the [MIT License](LICENSE).
