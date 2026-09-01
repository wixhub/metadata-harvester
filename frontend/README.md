# Ecological Metadata Harvester & Ingestion Gateway (Frontend)

An enterprise-grade Angular administrative dashboard and ingestion wizard. It interfaces directly with the backend ecosystem to manage metadata records, process scientific file uploads and display system telemetry metrics.

---

## 🚀 Live Demo

🔗 **[View Live Application on Cloudflare Pages](https://metadata-harvester.pages.dev)**

---

## 🚀 Tech Stack

- Framework & Core: Angular (Standalone Components, Signals, Reactive Forms, Modern Control Flow) version 22.0.0

- UI Components: Angular Material 22.1.3

- Language: TypeScript 6.0.2

- Styling: Global styles.scss with component-scoped SCSS stylesheets

- State Management & Communication: Angular HttpClient with proxy configuration, reactive signals, and declarative httpResource fetching

- Testing: Vitest 4.0.8

## System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        Browser["🌐 Browser"]
    end

    subgraph "Angular Application"
        AppRoot["App Root<br/>app.ts"]
        Router["Router<br/>app.routes.ts"]

        subgraph "Core Layer"
            Services["Services<br/>────────"]
            MAS["MetadataApiService<br/>- httpResource reactive state<br/>- Datasets fetch<br/>- Failed validations<br/>- Dataset details"]
            SMS["SupportMailService<br/>- Email obfuscation<br/>- Clipboard copy<br/>- Mailto handler"]

            Models["Models<br/>────────"]
            Metadata["metadata.model.ts<br/>- DatasetRecord<br/>- IngestionPayload<br/>- RestPage<br/>- MetadataFormat<br/>- IngestionStatus"]

            Services --> MAS
            Services --> SMS
            Models --> Metadata
        end

        subgraph "Layout Components"
            Layout["Core Layout"]
            Footer["Footer Component"]
            Loader["Loader Component"]
            SupportBtn["Support Button"]
            Layout --> Footer
            Layout --> Loader
            Layout --> SupportBtn
        end

        subgraph "Feature Modules"
            Dashboard["📊 Dashboard<br/>dashboard.ts<br/>- Metrics Grid<br/>- Dataset Stats"]
            Ingestion["📤 Ingestion Wizard<br/>ingestion-wizard.ts<br/>- File Upload<br/>- Format Selection<br/>- Target Collection"]
            Explorer["🔍 Dataset Explorer<br/>dataset-explorer.ts<br/>- Browse Datasets<br/>- Search & Filter"]
            Powered["ℹ️ Powered By<br/>powered.ts<br/>- Attribution Page"]
        end

        Router --> Dashboard
        Router --> Ingestion
        Router --> Explorer
        Router --> Powered

        Dashboard --> Layout
        Ingestion --> Layout
        Explorer --> Layout
        Powered --> Layout

        Dashboard --> MAS
        Ingestion --> MAS
        Explorer --> MAS
        SupportBtn --> SMS
    end

    subgraph "HTTP Communication"
        HttpClient["@angular/common/http<br/>HttpClient"]
        Proxy["Proxy Config<br/>proxy.conf.json<br/>/api/* → Backend"]
    end

    subgraph "External Services"
        ProdBackend["🔧 Production Backend<br/>https://metadata-harvester-backend<br/>.onrender.com/api/v1"]
        LocalBackend["🔧 Local Backend<br/>http://localhost:8080/api/v1"]
    end

    subgraph "API Endpoints"
        GetDatasets["/datasets"]
        GetDatasetDetail["/datasets/{id}"]
        GetMetrics["/metrics/failed-validations/list"]
        UploadDataset["/ingest"]
    end

    AppRoot --> Router
    AppRoot --> Browser

    MAS --> HttpClient
    HttpClient --> Proxy
    Proxy --> |Production| ProdBackend
    Proxy --> |Development| LocalBackend

    ProdBackend --> GetDatasets
    ProdBackend --> GetDatasetDetail
    ProdBackend --> GetMetrics
    ProdBackend --> UploadDataset

    LocalBackend --> GetDatasets
    LocalBackend --> GetDatasetDetail
    LocalBackend --> GetMetrics
    LocalBackend --> UploadDataset

    subgraph "Build & Deploy"
        Build["Build Pipeline<br/>ng build --configuration production"]
        Assets["Static Assets<br/>public/"]
        CDN["CDN/Hosting"]
    end

    AppRoot --> Build
    Assets --> Build
    Build --> CDN

    style AppRoot fill:#2196F3,color:#fff
    style Dashboard fill:#4CAF50,color:#fff
    style Ingestion fill:#FF9800,color:#fff
    style Explorer fill:#9C27B0,color:#fff
    style MAS fill:#FF5722,color:#fff
    style ProdBackend fill:#F44336,color:#fff
    style LocalBackend fill:#FFC107,color:#333
```

## 📁 Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   │   └── metadata.model.ts      # TypeScript interfaces & types (DatasetRecord, IngestionPayload, etc.)
│   │   └── services/
│   │       ├── metadata-api.service.ts # REST API gateway integration using httpResource
│   │       └── support-mail.service.ts # Email obfuscation, clipboard copy, and mailto handling
│   ├── features/
│   │   ├── dashboard/                 # System metrics & recent ingestion logs
│   │   ├── ingestion/                 # Multi-format telemetry upload wizard
│   │   ├── explorer/                  # DSpace collection/item repository explorer
│   │   └── powered/                   # Attribution and credits page
│   ├── app.component.ts
│   ├── app.config.ts                  # Global app providers & HttpClient setup
│   └── app.routes.ts                  # Lazy/direct route definitions
├── index.html
└── styles.scss                        # Global root CSS styles & variables
```

## 🌟 Core Features & Routes

- / — Dashboard: Real-time visibility tracking total datasets, successful metadata harvests, and validation error statistics.

- /ingest — Ingestion Wizard: Supports multi-format scientific file uploads including Movebank XML, Darwin Core Archives (DwC-A), and JSON Schemas, mapping them directly to target collections.

- /explorer — Dataset Explorer: Inspect harvested metadata records, view structural status, search, filter, and diagnose error payloads.

- /powered — Powered By: Attribution and technology credits page.

## Data Flow & State Management

The application leverages Angular's modern reactivity primitives:

```Plaintext
User Action → Router → Feature Component → Service → HttpClient → Proxy → Backend API → Response → HttpResource → Signal → Template
```

- Reactive Signals: Built-in signal() handles component-level local state.

- HttpResource: Provides declarative, reactive resource fetching for asynchronous API data integration.

- RxJS: Manages complex asynchronous event streams where applicable.

### 🔗 **API Endpoints**

| Method | Endpoint                                  | Purpose                 |
| ------ | ----------------------------------------- | ----------------------- |
| GET    | `/api/v1/datasets`                        | Fetch all datasets      |
| GET    | `/api/v1/datasets/{id}`                   | Fetch dataset details   |
| GET    | `/api/v1/metrics/failed-validations/list` | Get validation failures |
| POST   | `/api/v1/ingest`                          | Upload new dataset      |

### 🌍 **Environment Configuration**

- **Production**: `https://metadata-harvester-backend.onrender.com/api/v1`
- **Development**: `http://localhost:8080/api/v1`

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
