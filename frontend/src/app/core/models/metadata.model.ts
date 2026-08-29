export type MetadataFormat = 'MOVEBANK_XML' | 'DWC_A' | 'JSON_SCHEMA';

export type IngestionStatus = 'PENDING' | 'VALIDATING' | 'PROCESSED' | 'FAILED';

export type CardType = 'total' | 'success' | 'failed';

export interface DatasetRecord {
  id: string;
  title: string;
  format: MetadataFormat;
  status: IngestionStatus;
  updatedAt: string;
  recordCount: number;
  validationErrors?: string[];
}

export interface IngestionPayload {
  format: MetadataFormat;
  file: File;
  targetCollection: string;
}

export interface RestPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface AnimalFact {
  id: number;
  title: string;
  text: string;
  readTimeSeconds: number;
  icon: string;
}
