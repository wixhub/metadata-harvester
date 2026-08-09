# Ecological Metadata Harvester & Ingestion Gateway (Frontend)

An enterprise-grade, modern Angular administrative dashboard and ingestion wizard designed to interface with the Ecological Metadata Harvester & Ingestion Gateway backend (Spring Boot, PostgreSQL, and DSpace-aligned repositories).

---

## 🚀 Live Demo

🔗 **[View Live Application on Cloudflare Pages](https://metadata-harvester.pages.dev)**

---

## 🚀 Tech Stack

- Framework: Angular (Standalone Components, Signals, Reactive Forms, Modern Control Flow). This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.7.

- Language: TypeScript

- Styling: Global styles.scss with component-scoped SCSS stylesheets

- HTTP/Routing: Angular HttpClient & Router with component input binding

## 🌟 Core Features

Dashboard & Metrics: Real-time visibility tracking total datasets, successful metadata harvests, and anomaly/validation failures.

Telemetry Ingestion Wizard: Supports multi-format scientific file uploads including Movebank XML, Darwin Core Archives (DwC-A), and JSON Schemas, mapping them directly to target DSpace collections.

Repository Explorer: Inspect harvested metadata records, view structural status, and diagnose error payloads.

## 📁 Project Architecture

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── metadata.model.ts      # TypeScript interfaces & types
│   │   └── services/
│   │       └── metadata-api.service.ts  # REST API gateway integration
│   ├── features/
│   │   ├── dashboard/                 # System metrics & recent ingestion logs
│   │   ├── ingestion/                 # Multi-format telemetry upload wizard
│   │   └── explorer/                  # DSpace collection/item repository explorer
│   ├── app.component.ts
│   ├── app.config.ts                    # Global app providers & HttpClient setup
│   └── app.routes.ts                    # Lazy/direct route definitions
├── index.html
└── styles.scss                          # Global root SCSS styles & variables
```

---

## 🛠️ Local Installation & Setup

### Prerequisites

- Node.js (v18+ recommended)

- Angular CLI (Latest version)

1. Clone & Install Dependencies

```Bash
git clone git@github.com:wixhub/metadata-harvester.git
cd metadata-harvester/frontend
npm install
```

2. Configure API Endpoint

Verify or update the base URL in your service file if your Spring Boot backend runs on a different port or host:

```text
Path: src/app/core/services/metadata-api.service.ts

Default: http://localhost:8080/api/v1/metadata
```

3. Run the Development Server

```Bash
npm start
```

Navigate to http://localhost:4200/ in your browser. The application will automatically reload if you change any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
