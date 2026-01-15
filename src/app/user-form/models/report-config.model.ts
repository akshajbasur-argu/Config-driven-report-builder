export interface ReportConfig {
  key: string;
  title: string;
  fields: FieldConfig[];
  actions: ActionConfig[];
}

export interface FieldOption {
  id: string | number;
  name: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type: 'dropdown' | 'checkbox' | 'date' | 'radio' | 'textarea';
  required?: boolean;
  multiple?: boolean;

  /* ===== LAYOUT ===== */
  class?: string;          // wrapper classes (grid / width)
  inputClass?: string;     // input-specific classes
  labelClass?: string;     // label-specific classes
  inputLayout?: 'vertical' | 'horizontal'; // for radio buttons - display inline or stacked
  
  /* ===== ADVANCED LAYOUT ===== */
  layoutMode?: 'default' | 'split' | 'inline'; // NEW: Control label/input positioning
  labelWidth?: string;     // NEW: Label width (e.g., "col-span-3", "w-1-3")
  inputWidth?: string;     // NEW: Input width (e.g., "col-span-9", "w-2-3")
  
  /* ===== CONDITIONAL LABEL ===== */
  conditionalLabel?: {     // NEW: Dynamic label based on other field value
    when: string;          // field key to watch
    equals: any;           // value to match
    label: string;         // label to use when matched
  }[];

  /* ===== STATIC OPTIONS ===== */
  options?: FieldOption[];

  /* ===== CONDITIONAL STYLING ===== */
  conditionalClass?: {
    when: string;     // form field key
    equals: any;      // value to match
    class: string;    // class to apply
  }[];

  /* ===== API ===== */
  api?: {
    endpoint: string;
    dependsOn?: string[];
    paramsMap?: Partial<Record<string, string>>;
    mode?: 'load' | 'trigger';
  };

  resetOnChange?: string[];
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