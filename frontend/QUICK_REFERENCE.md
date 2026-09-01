# Metadata Harvester Frontend - Architecture Quick Reference

## 📊 Diagram Files Created

| File                         | Purpose                                       | Format                   |
| ---------------------------- | --------------------------------------------- | ------------------------ |
| `ARCHITECTURE.mmd`           | High-level component and service architecture | Mermaid Graph            |
| `DATA_FLOW.mmd`              | Data movement through the application         | Mermaid Flow Diagram     |
| `PROJECT_STRUCTURE.mmd`      | File system and folder organization           | Mermaid Hierarchy        |
| `COMPONENT_DEPENDENCIES.mmd` | Component imports and dependencies            | Mermaid Dependency Graph |
| `ARCHITECTURE_ANALYSIS.md`   | Detailed written analysis                     | Markdown                 |

---

## 🏗️ Architecture at a Glance

### Tech Stack

```
Angular 22 (Standalone Components)
├── Angular Material 22 (UI)
├── Reactive Forms (FormBuilder)
├── Angular Signals (State)
├── httpResource (Declarative HTTP)
└── TypeScript 6.0
```

### Application Structure

```
src/app/
├── app.ts                    ← Root component with RouterOutlet
├── app.routes.ts             ← Routing configuration
├── core/                     ← Shared services & layout
│   ├── services/
│   │   ├── metadata-api.service.ts      (httpResource declarations)
│   │   └── support-mail.service.ts      (Email handling)
│   ├── models/
│   │   └── metadata.model.ts            (TypeScript types)
│   └── layout/
│       ├── footer/           (Global footer)
│       ├── loader/           (Loading indicator with fun facts)
│       └── support-btn/      (Support contact button)
└── features/                 ← Routable feature modules
    ├── dashboard/            (Route: '/')
    ├── ingestion-wizard/     (Route: '/ingest')
    └── dataset-explorer/     (Route: '/explorer')
```

---

## 🔄 Core Patterns

### 1. Reactive Signals

All state uses Angular Signals for fine-grained reactivity:

```typescript
// Service-level signals
datasets = signal<DatasetRecord[]>([]);
selectedDatasetId = signal<string | null>(null);

// Component-level signals
uploading = signal<boolean>(false);
uploadProgress = signal<number>(0);
```

### 2. httpResource (Angular 22 Feature)

Declarative, auto-cached HTTP resources:

```typescript
datasetsResource = httpResource<DatasetRecord[]>(() => `${this.baseUrl}/datasets`, {
  defaultValue: [],
  parse: (r) => r?.content || [],
});
// Auto-fetches, caches, and provides reactive signals
```

### 3. Standalone Components

Every component is standalone (no NgModule):

```typescript
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, SupportBtn],  // Explicit imports
  templateUrl: '...'
})
```

---

## 🗺️ Routes & Navigation

| Route       | Component       | Purpose                                        |
| ----------- | --------------- | ---------------------------------------------- |
| `/`         | Dashboard       | View all datasets, metrics, failed validations |
| `/ingest`   | IngestionWizard | Upload new datasets                            |
| `/explorer` | DatasetExplorer | Browse datasets                                |
| `**`        | → Dashboard     | Wildcard fallback                              |

---

## 📡 Backend API Contracts

### Endpoints

```
GET    /datasets                       ← All datasets
GET    /datasets/:id                   ← Dataset details
GET    /metrics                        ← System metrics
GET    /metrics/failed-validations/list ← Failed logs
POST   /datasets/upload                ← Upload dataset
```

### Request/Response Models

```typescript
// GET /datasets
Response: { content: DatasetRecord[] }

// POST /datasets/upload
Body: FormData {
  format: MetadataFormat
  file: File
  targetCollection: string
}
Response: HttpEvent (progress tracking)
```

---

## 💾 Data Models

```typescript
// Supported metadata formats
type MetadataFormat = 'MOVEBANK_XML' | 'DWC_A' | 'JSON_SCHEMA';

// Ingestion status states
type IngestionStatus = 'PENDING' | 'VALIDATING' | 'PROCESSED' | 'FAILED';

// Main dataset record
interface DatasetRecord {
  id: string;
  title: string;
  format: MetadataFormat;
  status: IngestionStatus;
  updatedAt: string;
  recordCount: number;
  validationErrors?: string[];
}

// Upload payload
interface IngestionPayload {
  format: MetadataFormat;
  file: File;
  targetCollection: string;
}
```

---

## 🔌 Services

### MetadataApiService

**Responsibility**: All HTTP communication and data fetching

**Key Methods**:

```typescript
// Declarative resources (auto-fetched)
datasetsResource: httpResource<DatasetRecord[]>
failedDatasetsResource: httpResource<DatasetRecord[]>
datasetDetailsResource: httpResource<DatasetRecord>
metricsCountResource: httpResource<{ total, success, failed }>

// Imperative methods
uploadDataset(payload: IngestionPayload): Observable<HttpEvent>
selectDataset(id: string): void
```

### SupportMailService

**Responsibility**: Support email management

**Methods**:

```typescript
getEmail(): string                      // Returns: rublin@gmx.de
handleContact(event: Event): Promise<boolean>  // Copy & mailto
```

---

## 🎨 Component Hierarchy

```
App
├── Dashboard (Route: '/')
│   ├── MetricsGrid
│   ├── Material Table
│   ├── Loader
│   └── Footer
│       └── SupportBtn
├── IngestionWizard (Route: '/ingest')
│   └── Reactive Form
└── DatasetExplorer (Route: '/explorer')
    └── Footer
        └── SupportBtn
```

---

## 🎯 Key Features

### Dashboard

- ✅ Sortable/filterable Material table
- ✅ Real-time metrics display (MetricsGrid)
- ✅ Failed validation log viewing
- ✅ Signal-based reactive data binding

### Ingestion Wizard

- ✅ Multi-format support (MOVEBANK_XML, DWC_A, JSON_SCHEMA)
- ✅ Automatic format detection
- ✅ File upload with progress tracking
- ✅ Form validation
- ✅ Error handling with user feedback

### Dataset Explorer

- ✅ Browse all datasets
- ✅ Link-based navigation

### Shared Components

- ✅ Loader: Fun facts during data loading
- ✅ Footer: Consistent page footer
- ✅ SupportBtn: Contact support (email obfuscation)

---

## 🔒 Security Measures

1. **Email Obfuscation**: Support email split into parts (`rublin` + `gmx.de`)
2. **Type Safety**: TypeScript strict mode
3. **Form Validation**: Reactive Forms with validators
4. **XSRF Protection**: Built-in HttpClient XSRF token handling
5. **Environment Separation**: Dev/Prod configs prevent secrets exposure

---

## 📈 Performance Features

1. **Standalone Components**: Smaller bundle (tree-shaking friendly)
2. **Signals**: Fine-grained change detection (not full template re-renders)
3. **httpResource Caching**: Automatic request deduplication
4. **Material Table**: Built-in sorting/pagination support
5. **SPA Proxy**: Dev proxy in `proxy.conf.json`

---

## 🧪 Testing Structure

Test files follow component structure (`.spec.ts` pattern):

```
Dashboard              → dashboard.spec.ts
MetadataApiService    → metadata-api.service.spec.ts
Footer               → footer.spec.ts
... (all components have tests)
```

**Testing Framework**: Vitest + jsdom

---

## 🚀 Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (with API proxy)
npm start
# Server runs on http://localhost:4200
# API calls proxied to backend via proxy.conf.json

# Run tests
npm test

# Build for production
npm run build
# Output: dist/frontend/
```

---

## 🌍 Environment Configuration

Located in `src/environments/`:

- **environment.ts**: Production config
- **environment.development.ts**: Development config

**Key Variables**:

```typescript
apiUrl: string; // Backend API base URL
```

---

## 📦 Key Dependencies

| Package           | Version | Purpose            |
| ----------------- | ------- | ------------------ |
| @angular/core     | ^22.0.0 | Framework core     |
| @angular/material | ^22.1.3 | UI components      |
| @angular/forms    | ^22.0.0 | Reactive forms     |
| @angular/router   | ^22.0.0 | Routing            |
| rxjs              | ~7.8.0  | Reactive utilities |
| typescript        | ~6.0.2  | Type safety        |
| vitest            | ^4.0.8  | Unit tests         |

---

## 🎓 Design Principles Applied

1. **Single Responsibility**: Each component/service has one job
2. **Dependency Injection**: Services injected, not imported directly
3. **Reactive Patterns**: Signals over imperative state
4. **Type Safety**: Full TypeScript strict mode
5. **DRY (Don't Repeat Yourself)**: Shared services and components
6. **Separation of Concerns**: Core/Features/Models layers
7. **Declarative Over Imperative**: httpResource vs manual HTTP

---

## 🔮 Future Enhancement Opportunities

- [ ] Lazy loading of feature modules
- [ ] Service Worker for offline support
- [ ] Dark mode theme switching
- [ ] Internationalization (i18n)
- [ ] Error boundaries & global error handling
- [ ] Analytics/performance monitoring
- [ ] Accessibility improvements (WCAG AAA)
- [ ] Component library extraction
- [ ] E2E testing with Playwright/Cypress
- [ ] State management (NgRx if complexity grows)

---

## 📝 Notes

- **No Redux/NgXC**: Application complexity doesn't warrant it
- **No RxJS Subscriptions**: Signals eliminate subscription management
- **Standalone Only**: No NgModule declarations
- **Modern Angular**: Uses Angular 22's latest features (httpResource, Signals)
- **Material Design**: UI built on Material Design System
