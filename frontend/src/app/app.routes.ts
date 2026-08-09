import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { IngestionWizard } from './features/ingestion-wizard/ingestion-wizard';
import { DatasetExplorer } from './features/dataset-explorer/dataset-explorer';

export const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'ingest', component: IngestionWizard },
  { path: 'explorer', component: DatasetExplorer },
  { path: '**', redirectTo: '' },
];
