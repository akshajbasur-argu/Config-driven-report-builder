// report-builder.component.ts - COMPLETE WORKING VERSION

import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActionConfig, ContainerConfig, ContainerFormConfig, FieldConfig, FieldOption } from '../models/report-config.model';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AutoCompleteModule],
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.css'],
})
export class ReportBuilderComponent implements OnInit, OnDestroy {
  @Input() config: ContainerFormConfig | null ={
  "key": "comprehensive-form",
  "title": "Comprehensive Test Form - All Fields Render",
  "note": "This form demonstrates rendering of 10+ fields across multiple containers",
  "containers": [
    {
      "id": "container_1",
      "name": "Personal Information",
      "columns": 6,
      "padding": 20,
      "fields": [
        {
          "id": "field_1",
          "key": "firstName",
          "label": "First Name",
          "type": "text",
          "required": true,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_2",
          "key": "lastName",
          "label": "Last Name",
          "type": "text",
          "required": true,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_3",
          "key": "email",
          "label": "Email Address",
          "type": "text",
          "required": true,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    },
    {
      "id": "container_2",
      "name": "Contact Details",
      "columns": 6,
      "padding": 20,
      "fields": [
        {
          "id": "field_4",
          "key": "phone",
          "label": "Phone Number",
          "type": "text",
          "required": false,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_5",
          "key": "country",
          "label": "Country",
          "type": "dropdown",
          "required": true,
          "multiple": false,
          "dropdownType": "primeng",
          "options": [
            { "id": "us", "name": "United States" },
            { "id": "uk", "name": "United Kingdom" },
            { "id": "ca", "name": "Canada" },
            { "id": "au", "name": "Australia" }
          ],
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_6",
          "key": "city",
          "label": "City",
          "type": "text",
          "required": false,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    },
    {
      "id": "container_3",
      "name": "Preferences",
      "columns": 4,
      "padding": 20,
      "fields": [
        {
          "id": "field_7",
          "key": "newsletter",
          "label": "Subscribe to Newsletter",
          "type": "checkbox",
          "required": false,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_8",
          "key": "preferredContact",
          "label": "Preferred Contact Method",
          "type": "radio",
          "required": true,
          "options": [
            { "id": "email", "name": "Email" },
            { "id": "phone", "name": "Phone" },
            { "id": "sms", "name": "SMS" }
          ],
          "inputLayout": "vertical",
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    },
    {
      "id": "container_4",
      "name": "Schedule Information",
      "columns": 4,
      "padding": 20,
      "fields": [
        {
          "id": "field_9",
          "key": "appointmentDate",
          "label": "Appointment Date",
          "type": "date",
          "required": true,
          "dateRestrictions": {
            "disablePast": true
          },
          "dateRanges": [
            { "label": "Tomorrow", "days": 1 },
            { "label": "Next Week", "days": 7 },
            { "label": "2 Weeks", "days": 14 }
          ],
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_10",
          "key": "timeSlot",
          "label": "Time Slot",
          "type": "dropdown",
          "required": true,
          "multiple": false,
          "dropdownType": "native",
          "options": [
            { "id": "morning", "name": "Morning (9AM - 12PM)" },
            { "id": "afternoon", "name": "Afternoon (1PM - 5PM)" },
            { "id": "evening", "name": "Evening (6PM - 9PM)" }
          ],
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    },
    {
      "id": "container_5",
      "name": "Additional Information",
      "columns": 4,
      "padding": 20,
      "fields": [
        {
          "id": "field_11",
          "key": "interests",
          "label": "Areas of Interest",
          "type": "dropdown",
          "required": false,
          "multiple": true,
          "dropdownType": "native",
          "options": [
            { "id": "tech", "name": "Technology" },
            { "id": "health", "name": "Healthcare" },
            { "id": "finance", "name": "Finance" },
            { "id": "education", "name": "Education" },
            { "id": "entertainment", "name": "Entertainment" }
          ],
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    },
    {
      "id": "container_6",
      "name": "Comments",
      "columns": 12,
      "padding": 20,
      "fields": [
        {
          "id": "field_12",
          "key": "note_1",
          "type": "note",
          "noteText": "Please ensure all required fields are filled out before submitting the form.",
          "noteType": "info",
          "class": "",
          "conditionalClass": [],
          "conditionalLabel": []
        },
        {
          "id": "field_13",
          "key": "comments",
          "label": "Additional Comments",
          "type": "textarea",
          "required": false,
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        },
        {
          "id": "field_14",
          "key": "referralSource",
          "label": "How did you hear about us?",
          "type": "dropdown",
          "required": false,
          "multiple": false,
          "dropdownType": "native",
          "options": [
            { "id": "search", "name": "Search Engine" },
            { "id": "social", "name": "Social Media" },
            { "id": "friend", "name": "Friend/Family" },
            { "id": "ad", "name": "Advertisement" },
            { "id": "other", "name": "Other" }
          ],
          "class": "",
          "inputClass": "",
          "conditionalClass": [],
          "conditionalLabel": [],
          "resetOnChange": []
        }
      ]
    }
  ],
  "actions": [
    {
      "key": "submit",
      "label": "Submit Form",
      "type": "primary",
      "action": "",
      "api": {
        "endpoint": "/api/forms/submit",
        "method": "POST"
      }
    },
    {
      "key": "cancel",
      "label": "Cancel",
      "type": "secondary",
      "action": "cancel"
    }
  ]
};
  @Input() reportKey: string = '';

  form!: FormGroup;
  formReady: boolean = false;
  fieldOptionsCache: Map<string, any[]> = new Map();
  fieldOptions: { [key: string]: any[] } = {};
  fieldLoading: { [key: string]: boolean } = {};
  fieldReady: { [key: string]: boolean } = {};
  filteredOptions: { [key: string]: any[] } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}
  

  ngOnInit() {
    console.log('=== ReportBuilder INIT START ===');
    
    if (!this.config) {
      console.error('No config provided!');
      return;
    }

    if (!this.config.containers || this.config.containers.length === 0) {
      console.error('No containers in config!');
      return;
    }

    console.log(`Config has ${this.config.containers.length} containers`);
    
    // Build form FIRST
    this.buildForm();
    
    // Then load data
    setTimeout(() => this.loadInitialData(), 50);
    
    console.log('=== ReportBuilder INIT END ===');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

private buildForm() {
  const group: { [key: string]: FormControl } = {};

  this.config!.containers.forEach(container => {
    container.fields.forEach(field => {

      if (field.type === 'note') return;

      let value: any = '';
      if (field.type === 'checkbox') value = false;
      if (field.multiple) value = [];

      const validators = field.required ? [Validators.required] : [];
      group[field.key] = new FormControl(value, validators);
    });
  });

  this.form = new FormGroup(group);
  this.formReady = true;

  console.log('FORM CONTROLS:', this.form.controls);

  this.cdr.detectChanges(); // 🔥 CRITICAL
}

  private setupListeners() {
    this.config!.containers.forEach(container => {
      container.fields.forEach(field => {
        if (field.resetOnChange || field.api?.mode === 'trigger') {
          const ctrl = this.form.get(field.key);
          if (ctrl) {
            ctrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
              this.onFieldChange(field);
            });
          }
        }
      });
    });
  }

  private loadInitialData() {
    this.config!.containers.forEach(container => {
      container.fields.forEach(field => {
        if (field.options && field.options.length > 0) {
          this.fieldOptions[field.key] = field.options;
          this.fieldReady[field.key] = true;
        } else if (field.api && field.api.endpoint && field.api.mode === 'load') {
          if (!field.api.dependsOn || field.api.dependsOn.length === 0) {
            this.loadFieldData(field);
          } else {
            this.fieldReady[field.key] = false;
          }
        } else {
          this.fieldReady[field.key] = true;
        }
      });
    });
  }

  private loadFieldData(field: FieldConfig) {
    if (!field.api || !field.api.endpoint) return;

    this.fieldLoading[field.key] = true;
    this.fieldReady[field.key] = false;

    const params = this.buildApiParams(field);
    
    this.http.get(field.api.endpoint, { params })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.fieldOptions[field.key] = Array.isArray(data) ? data : [];
          this.filteredOptions[field.key] = this.fieldOptions[field.key];
          this.fieldLoading[field.key] = false;
          this.fieldReady[field.key] = true;
        },
        error: () => {
          this.fieldOptions[field.key] = [];
          this.fieldLoading[field.key] = false;
          this.fieldReady[field.key] = false;
        }
      });
  }

  private buildApiParams(field: FieldConfig): any {
    const params: any = {};
    if (field.api?.dependsOn) {
      field.api.dependsOn.forEach((dep: string) => {
        const value = this.form.get(dep)?.value;
        const key = field.api!.paramsMap?.[dep] || dep;
        params[key] = value;
      });
    }
    return params;
  }

  onFieldChange(field: FieldConfig) {
    if (field.resetOnChange) {
      field.resetOnChange.forEach(key => this.form.get(key)?.reset());
    }

    if (field.api && field.api.mode === 'trigger') {
      const params = this.buildApiParams(field);
      this.http.post(field.api.endpoint, params)
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }

    this.reloadDependentFields(field);
  }

  private reloadDependentFields(changed: FieldConfig) {
    this.config!.containers.forEach(container => {
      container.fields.forEach(field => {
        if (field.api?.dependsOn?.includes(changed.key)) {
          this.loadFieldData(field);
        }
      });
    });
  }

  getFieldLabel(field: FieldConfig): string {
    if (!field.conditionalLabel || field.conditionalLabel.length === 0) {
      return field.label || '';
    }

    for (const cond of field.conditionalLabel) {
      const val = this.form.get(cond.when)?.value;
      if (val == cond.equals) return cond.label;
    }

    return field.label || '';
  }

  toggleSelectAll(fieldKey: string) {
    const current = this.form.get(fieldKey)?.value || [];
    const all = this.fieldOptions[fieldKey] || [];
    
    if (current.length === all.length) {
      this.form.get(fieldKey)?.setValue([]);
    } else {
      this.form.get(fieldKey)?.setValue(all.map(o => o.id));
    }
  }

  isAllSelected(fieldKey: string): boolean {
    const current = this.form.get(fieldKey)?.value || [];
    const all = this.fieldOptions[fieldKey] || [];
    return current.length === all.length && all.length > 0;
  }

  onAutoCompleteFilter(event: any, fieldKey: string) {
    const q = event.query.toLowerCase();
    const all = this.fieldOptions[fieldKey] || [];
    this.filteredOptions[fieldKey] = all.filter(o => o.name.toLowerCase().includes(q));
  }

  onAutoCompleteDropdown(fieldKey: string) {
    this.filteredOptions[fieldKey] = this.fieldOptions[fieldKey] || [];
  }

  applyDateRange(fieldKey: string, days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    this.form.get(fieldKey)?.setValue(d.toISOString().split('T')[0]);
  }

  getDateMinAttribute(fieldKey: string): string | null {
    const field = this.getAllFields().find(f => f.key === fieldKey);
    if (!field?.dateRestrictions) return null;

    if (field.dateRestrictions.minDate) return field.dateRestrictions.minDate;
    if (field.dateRestrictions.disablePast) return new Date().toISOString().split('T')[0];

    if (field.dateInteractions) {
      for (const i of field.dateInteractions) {
        if (i.type === 'minDate') {
          const v = this.form.get(i.linkedField)?.value;
          if (v) return v;
        }
      }
    }

    return null;
  }

  getDateMaxAttribute(fieldKey: string): string | null {
    const field = this.getAllFields().find(f => f.key === fieldKey);
    if (!field?.dateRestrictions) return null;

    if (field.dateRestrictions.maxDate) return field.dateRestrictions.maxDate;
    if (field.dateRestrictions.disableFuture) return new Date().toISOString().split('T')[0];

    if (field.dateInteractions) {
      for (const i of field.dateInteractions) {
        if (i.type === 'maxDate') {
          const v = this.form.get(i.linkedField)?.value;
          if (v) return v;
        }
      }
    }

    return null;
  }

  getAllFields(): FieldConfig[] {
    return this.config?.containers.flatMap(c => c.fields) || [];
  }

  getContainerColumnClass(columns: number): string {
    return `col-${columns}`;
  }

  handleAction(action: ActionConfig) {
    if (action.action === 'reset') {
      this.form.reset();
      return;
    }

    if (action.action === 'cancel') {
      window.history.back();
      return;
    }

    if (action.api) {
      if (this.form.invalid) {
        Object.keys(this.form.controls).forEach(k => this.form.get(k)?.markAsTouched());
        alert('Please fill all required fields');
        return;
      }

      this.http.request(action.api.method, action.api.endpoint, { body: this.form.value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => alert('Form submitted successfully!'),
          error: () => alert('Error submitting form')
        });
    }
  }

  // TrackBy functions
  trackByContainerId = (i: number, c: ContainerConfig) => c.id;
  trackByFieldId = (i: number, f: FieldConfig) => f.id;
  trackByActionKey = (i: number, a: ActionConfig) => a.key;
  trackByOptionId = (i: number, o: FieldOption) => o.id;
  trackByRangeLabel = (i: number, r: any) => r.label;
}