export type CompatStatus = 'compatible' | 'incompatible' | 'partially_verified' | 'unknown';

export interface CompatibilityReport {
  sourceLanguage: string;
  sourceVersion?: string;
  targetEnvironment: string;
  syntaxCompatible: boolean;
  semanticCompatible: CompatStatus;
  runtimeCompatible: CompatStatus;
  apiCompatible: CompatStatus;
  environmentCompatible: CompatStatus;
  securityCompatible: CompatStatus;
  unsupportedFeatures: string[];
  warnings: string[];
  confidence: number;
  evidence: string[];
}
