export interface ReportConfig {
  key: string;
  title: string;
  fields: FieldConfig[];
  actions: ActionConfig[];
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'dropdown' | 'checkbox' | 'date';
  required?: boolean;

  api?: {
    endpoint: string;
    dependsOn?: string;

    // ✅ FIX IS HERE
    paramsMap?: Partial<Record<string, string>>;
  };

  resetOnChange?: string[];
}

export interface ActionConfig {
  key: string;
  label: string;
  type: 'primary' | 'secondary';
  action?: 'reset' | 'cancel';
  api?: {
    endpoint: string;
    method: 'POST' | 'GET';
  };
}
