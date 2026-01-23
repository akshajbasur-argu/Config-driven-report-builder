// report-config.model.ts

export interface ContainerConfig {
  id: string;
  name: string;
  columns: number; // 1-12 column span in grid
  fields: FieldConfig[];
  padding?: number;
}

export interface ContainerFormConfig {
  key: string;
  title: string;
  note?: string;
  containers: ContainerConfig[];
  actions: ActionConfig[];
}

export interface FieldConfig {
  id: string;
  key: string;
  label?: string;
  type: 'dropdown' | 'checkbox' | 'date' | 'radio' | 'textarea' | 'note' | 'text';
  required?: boolean;
  multiple?: boolean;
  
  // Note field
  noteText?: string;
  noteType?: 'info' | 'warning' | 'success' | 'danger';
  
  // Styling
  class?: string;
  inputClass?: string;
  labelClass?: string;
  inputLayout?: 'vertical' | 'horizontal';
  
  // Layout modes
  layoutMode?: 'default' | 'split' | 'inline';
  labelWidth?: string;
  inputWidth?: string;
  
  // Options
  options?: FieldOption[];
  
  // Conditional behavior
  conditionalClass?: ConditionalClass[];
  conditionalLabel?: ConditionalLabel[];
  
  // API integration
  api?: ApiConfig;
  
  // Field dependencies
  resetOnChange?: string[];
  
  // Dropdown specific
  dropdownType?: 'native' | 'primeng';
  
  // Date specific
  dateRestrictions?: DateRestriction;
  dateRanges?: DateRange[];
  dateInteractions?: DateInteraction[];
}

export interface FieldOption {
  id: string | number;
  name: string;
}

export interface ConditionalClass {
  when: string;
  equals: any;
  class: string;
}

export interface ConditionalLabel {
  when: string;
  equals: any;
  label: string;
}

export interface ApiConfig {
  endpoint: string;
  dependsOn?: string[];
  paramsMap?: Record<string, string>;
  mode?: 'load' | 'trigger';
}

export interface DateRestriction {
  allowedDays?: number[];
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: string;
  maxDate?: string;
  restrictedDates?: string[];
}

export interface DateRange {
  label: string;
  days: number;
}

export interface DateInteraction {
  linkedField: string;
  type: 'minDate' | 'maxDate';
}

export interface ActionConfig {
  key: string;
  label: string;
  type: 'primary' | 'secondary';
  action?: 'reset' | 'cancel' | '';
  api?: {
    endpoint: string;
    method: 'POST' | 'GET';
  };
}