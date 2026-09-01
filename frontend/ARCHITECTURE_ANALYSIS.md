# Metadata Harvester Frontend - Architectural Analysis

## Overview

This is an **Angular 22** standalone components application built with reactive patterns and modern TypeScript. The frontend serves as a user interface for a metadata harvesting and validation system that processes datasets in multiple formats (MOVEBANK_XML, DWC_A, JSON_SCHEMA).

## Technology Stack

- **Framework**: Angular 22 (standalone components)
- **UI Framework**: Angular Material 22
- **State Management**: Angular Signals (reactive primitives)
- **HTTP**: Angular HttpClient with declarative `httpResource`
- **Forms**: Reactive Forms with FormBuilder
- **Styling**: SCSS
- **Testing**: Vitest + jsdom
- **Node**: 24.15.0+
- **Package Manager**: npm 10.9.8+

## Architecture Layers

### 1. **Presentation Layer** (Features)

Located in `src/app/features/`, these are the primary user-facing components:

#### Dashboard (`/features/dashboard/`)

- **Route**: `/` (default route)
- **Purpose**: Main dashboard showing all datasets and metrics
- **Key Features**:
  - Display datasets in a sortable, filterable Material table
  - Show metrics cards (total, success, failed counts)
  - Display failed validation logs
  - Real-time data binding via reactive signals
- **Components Used**:
  - `MetricsGrid`: Displays KPI cards
  - `Loader`: Shows fun facts during data loading
  - `Footer`: Support contact information
- **Data Source**: `MetadataApiService.datasetsResource`

#### Ingestion Wizard (`/features/ingestion-wizard/`)

- **Route**: `/ingest`
- **Purpose**: File upload and metadata ingestion workflow
- **Key Features**:
  - Format selection (MOVEBANK_XML, DWC_A, JSON_SCHEMA)
  - File upload with drag-and-drop capability
  - Progress tracking with signal-based UI updates
  - Automatic format detection based on file name
  - Error handling and user feedback
- **Form**: Reactive form with format and targetCollection fields
- **Data Flow**: File → MetadataApiService.uploadDataset() → Backend API

#### Dataset Explorer (`/features/dataset-explorer/`)

- **Route**: `/explorer`
- **Purpose**: Browse and explore all available datasets
- **Key Features**:
  - List view of all datasets
  - Link navigation to other features
- **Data Source**: `MetadataApiService.datasetsResource`

### 2. **Component Layer** (Reusable & Layout)

Located in `src/app/core/layout/`:

#### Footer Component

- Provides consistent footer across all pages
- Contains the Support Button
- Semantic HTML footer element

#### Support Button Component

- Contact support email functionality
- Obfuscated email to prevent spam harvesting
- Uses `SupportMailService` for email handling
- Clipboard copy + mailto fallback

#### Loader Component

- Displays during data loading states
- Shows fun facts from `public/data/animal-facts.json`
- Accepts `wakeUpCountdown` input signal
- Rotation between fun facts at intervals

### 3. **Service Layer**

Located in `src/app/core/services/`:

#### MetadataApiService (`@Service`)

**Core responsibilities**:

- HTTP communication with backend API
- Reactive data fetching using Angular's `httpResource` (Angular 22 feature)
- Automatic response parsing and transformation
- Error handling and caching

**Declarative Resources** (auto-managed):

```typescript
datasetsResource: httpResource<DatasetRecord[]>
  GET /datasets
  → Returns all datasets

failedDatasetsResource: httpResource<DatasetRecord[]>
  GET /metrics/failed-validations/list
  → Maps backend logs to DatasetRecord format

datasetDetailsResource: httpResource<DatasetRecord>
  GET /datasets/{id}
  → Dynamic resource based on selectedDatasetId signal

metricsCountResource: httpResource<{ total, success, failed }>
  GET /metrics
  → System-wide metrics
```

**Methods**:

- `uploadDataset(payload: IngestionPayload): Observable<HttpEvent>`
- `selectDataset(id: string)`: Sets reactive signal for dynamic fetching

#### SupportMailService (`@Service`)

**Responsibilities**:

- Email address management (obfuscated)
- User contact handling
- Clipboard operations with browser API fallback

**Key Method**:

```typescript
handleContact(event: Event): Promise<boolean>
  - Prevents default link behavior
  - Copies email to clipboard
  - Opens mailto client
  - Returns success/failure status
```

### 4. **Data Model Layer**

Located in `src/app/core/models/`:

#### Type Definitions (`metadata.model.ts`)

**Enums/Type Unions**:

```typescript
MetadataFormat = 'MOVEBANK_XML' | 'DWC_A' | 'JSON_SCHEMA';
IngestionStatus = 'PENDING' | 'VALIDATING' | 'PROCESSED' | 'FAILED';
CardType = 'total' | 'success' | 'failed';
```

**Key Interfaces**:

```typescript
DatasetRecord {
  id: string
  title: string
  format: MetadataFormat
  status: IngestionStatus
  updatedAt: string
  recordCount: number
  validationErrors?: string[]
}

IngestionPayload {
  format: MetadataFormat
  file: File
  targetCollection: string
}

RestPage<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
```

### 5. **Routing Configuration**

Located in `src/app/app.routes.ts`:

```typescript
Routes = [
  { path: '', component: Dashboard }, // /
  { path: 'ingest', component: IngestionWizard }, // /ingest
  { path: 'explorer', component: DatasetExplorer }, // /explorer
  { path: '**', redirectTo: '' }, // Wildcard fallback
];
```

### 6. **Configuration Layer**

Located in `src/environments/`:

- **environment.ts**: Production configuration
- **environment.development.ts**: Development configuration
- **Key Variables**:
  - `apiUrl`: Backend API base URL
  - Environment-specific settings

## Data Flow Architecture

### Read Flow (Get Datasets)

```
User navigates to / (Dashboard)
    ↓
Dashboard component initializes
    ↓
Injects MetadataApiService
    ↓
Service declares datasetsResource (httpResource)
    ↓
httpResource automatically:
  1. Checks cache
  2. If not cached, makes GET /datasets request
  3. Parses response via custom parse function
  4. Returns Observable<DatasetRecord[]>
    ↓
Dashboard subscribes via reactive signal
    ↓
Signal updates trigger change detection
    ↓
Material table renders with sorted/filtered data
```

### Upload Flow (Ingest Dataset)

```
User selects file in IngestionWizard
    ↓
Form validation (format required)
    ↓
User clicks upload
    ↓
IngestionWizard calls:
  MetadataApiService.uploadDataset(IngestionPayload)
    ↓
Service creates FormData with:
  - format field
  - file field (File object)
  - targetCollection field
    ↓
HttpClient.post() with progress tracking
    ↓
uploadProgress signal updates UI in real-time
    ↓
On success: navigate back to Dashboard
On error: display errorMessage signal
```

### Contact Flow (Support)

```
User clicks support button
    ↓
SupportBtn calls SupportMailService.handleContact()
    ↓
Service:
  1. Reconstructs email from obfuscated parts
  2. Copies email to navigator.clipboard
  3. Opens mailto: link
    ↓
User's email client opens (mailto fallback)
Email copied to clipboard (primary action)
```

## Reactive Patterns

### Angular Signals Usage

The application uses Angular's `signal()` API for state management:

**Dashboard Signals**:

```typescript
datasets = this.apiService.datasetsResource.value; // Signal<DatasetRecord[]>
failedDatasets = this.apiService.failedDatasetsResource.value;
metrics = this.apiService.metricsCountResource.value;
```

**IngestionWizard Signals**:

```typescript
uploading = signal<boolean>(false);
uploadProgress = signal<number>(0);
selectedFile = signal<File | null>(null);
errorMessage = signal<string | null>(null);
```

**Benefits**:

- Fine-grained reactivity (only affected components re-render)
- No RxJS subscription management required
- Automatic change detection integration
- TypeScript type safety

### httpResource Pattern

Angular 22's `httpResource()` provides:

- **Declarative HTTP**: Define resources, not requests
- **Automatic Caching**: Built-in request deduplication
- **Parsing**: Custom transformation of responses
- **Error Handling**: Standard error propagation
- **Reactive Binding**: Direct signal integration

## Component Hierarchy

```
App (root)
├── RouterOutlet
└── Routes to:
    ├── Dashboard
    │   ├── MetricsGrid (child component)
    │   ├── MatTable (Material table)
    │   ├── Loader
    │   └── Footer
    │       └── SupportBtn
    ├── IngestionWizard
    │   ├── Reactive Form
    │   └── Loader
    └── DatasetExplorer
        └── Footer
            └── SupportBtn
```

## State Management Strategy

### Signal-Driven Approach

- **No NgRx/NgXC**: Application complexity doesn't warrant Redux-like patterns
- **Local Component Signals**: State kept close to usage
- **Service Signals**: Shared state in services (selectedDatasetId)
- **httpResource Signals**: Automatic server state management

### Data Sharing

1. **Between Components**: Via injected services
2. **Parent to Child**: Via `@Input()` signals
3. **Server State**: Via `httpResource` declarative fetching
4. **Form State**: Via FormBuilder reactive forms

## API Integration

### Backend Endpoints

```
GET  /datasets                          → List all datasets
GET  /datasets/:id                      → Get dataset details
GET  /metrics                           → System metrics
GET  /metrics/failed-validations/list   → Failed validation logs
POST /datasets/upload                   → Upload new dataset
```

### HTTP Configuration

- **Base URL**: Configured via `environment.apiUrl`
- **Dev Proxy**: `proxy.conf.json` proxies API calls in development
- **Interceptors**: (If needed, not currently visible)

## Testing Strategy

### Test Files Present

- `*.spec.ts` files alongside components
- Testing Framework: **Vitest** + **jsdom**
- Coverage: Unit tests for components and services

**Test Structure**:

```
src/app/
├── app.spec.ts
├── core/
│   ├── layout/[component]/[component].spec.ts
│   └── services/[service].spec.ts
└── features/[feature]/[component].spec.ts
```

## Build & Deployment

### Development

```bash
npm start          # ng serve --proxy-config proxy.conf.json
npm run watch      # ng build --watch (SPA dev mode)
npm test           # vitest (unit tests)
```

### Production

```bash
npm run build      # ng build --configuration production
                   # Outputs to dist/frontend/
```

### SPA Routing

- `public/_redirects`: Netlify SPA routing configuration
- `proxy.conf.json`: Local development API proxy

## Security Considerations

1. **Email Obfuscation**: Support email split into parts to prevent bot harvesting
2. **Reactive Forms**: FormBuilder validation prevents client-side tampering
3. **Type Safety**: TypeScript strict mode prevents type-related runtime errors
4. **HttpClient**: Uses Angular's HttpClient (includes XSRF protection by default)
5. **Environment Separation**: Dev/Prod configs prevent credential leaks

## Performance Optimizations

1. **Standalone Components**: Tree-shaking friendly, smaller bundle
2. **Signals**: Fine-grained change detection (not full template re-renders)
3. **httpResource Caching**: Automatic request deduplication
4. **Material Table Sorting**: Server-side capable (not yet implemented)
5. **Lazy Loading**: Not used (small app), but routing supports it

## Accessibility Features

1. **Material Components**: Built-in ARIA support
2. **Semantic HTML**: Footer, proper heading hierarchy
3. **Form Labels**: Reactive Forms with validation
4. **SCSS Theming**: Material theme configuration support

## Project Structure Benefits

1. **Core Module**: Centralized shared services and reusable components
2. **Features Folder**: Each feature is independently routable
3. **Models Folder**: Single source of truth for data types
4. **Services Folder**: Dependency injection and separation of concerns
5. **Environments**: Environment-specific configuration management

## Key Dependencies

| Package           | Version | Purpose              |
| ----------------- | ------- | -------------------- |
| @angular/core     | ^22.0.0 | Core framework       |
| @angular/material | ^22.1.3 | UI component library |
| @angular/cdk      | ^22.1.3 | Component Dev Kit    |
| @angular/forms    | ^22.0.0 | Reactive forms       |
| @angular/router   | ^22.0.0 | Client-side routing  |
| rxjs              | ~7.8.0  | Reactive utilities   |
| typescript        | ~6.0.2  | Type safety          |
| vitest            | ^4.0.8  | Unit testing         |

## Future Enhancement Opportunities

1. **Lazy Loading**: Load feature modules on-demand
2. **State Management**: Add NgRx if app complexity increases
3. **Animations**: Add Angular Animations for transitions
4. **i18n**: Internationalization support
5. **Dark Mode**: Theme switching with Material theming
6. **Caching Strategy**: Service Worker for offline support
7. **Error Boundaries**: Global error handling component
8. **Performance Monitoring**: Analytics integration
9. **Accessibility**: Further WCAG improvements
10. **Component Library**: Extract reusable components into separate package
