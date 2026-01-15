import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReportConfig, FieldConfig, ActionConfig } from '../models/report-config.model';
import { ReportConfigService } from '../services/report-config.service';
import { FieldDataService } from '../services/field-data.service';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.css'],
})
export class ReportBuilderComponent implements OnInit {

  @Input() config!: ReportConfig;  
  form!: FormGroup;

  fieldOptions: Record<string, any[]> = {};
  fieldLoading: Record<string, boolean> = {};
  fieldReady: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private configService: ReportConfigService,
    private fieldService: FieldDataService
  ) {}

  ngOnInit(): void {
    // FIX 1: Proper handling of @Input config
    if (this.config) {
      // Config passed via @Input (preview mode)
      this.initializeForm();
    } else {
      // Config loaded from route params (normal mode)
      this.route.queryParams.subscribe(params => {
        const reportType = params['type'] || 'hierarchy';
        this.configService.getConfig(reportType).subscribe(cfg => {
          this.config = cfg;
          this.initializeForm();
        });
      });
    }
  }

  // FIX 2: Centralized initialization
  private initializeForm(): void {
    this.buildForm();
    this.initFieldState();
    this.setupSubscriptions();
    this.loadInitialApis();
  }

  /* ================= FORM ================= */

  buildForm() {
    const group: any = {};

    this.config.fields.forEach(f => {
      if (f.type === 'checkbox') {
        group[f.key] = [false];
      }
      else if (f.type === 'dropdown' && f.multiple) {
        group[f.key] = [[]];
      }
      else {
        group[f.key] = ['', f.required ? Validators.required : []];
      }
    });

    this.form = this.fb.group(group);
  }

  /* ================= STATE ================= */

  initFieldState() {
    this.config.fields.forEach(f => {
      this.fieldLoading[f.key] = false;

      // FIX 3: Handle undefined dependsOn properly
      const deps = this.normalizeDependsOn(f.api?.dependsOn);
      const ready = !f.api || deps.length === 0;
      this.fieldReady[f.key] = ready;

      if (!ready) {
        this.form.get(f.key)?.disable({ emitEvent: false });
      }
    });
  }

  /* ================= DEPENDENCIES ================= */

  setupSubscriptions() {
    this.config.fields.forEach(source => {
      this.form.get(source.key)?.valueChanges.subscribe(() => {

        // FIX 4: Reset all downstream fields
        this.config.fields
          .filter(f => this.isDependentOn(f, source.key))
          .forEach(dep => {
            this.resetField(dep.key);
          });

        // FIX 5: Load next-level dependents that are ready
        this.config.fields
          .filter(f => this.isDependentOn(f, source.key))
          .forEach(dep => {
            if (this.areAllDependenciesReady(dep)) {
              this.executeFieldApi(dep);
            }
          });
      });
    });
  }

  // FIX 6: Helper to check if field depends on another
  private isDependentOn(field: FieldConfig, sourceKey: string): boolean {
    if (!field.api?.dependsOn) return false;
    return this.normalizeDependsOn(field.api.dependsOn).includes(sourceKey);
  }

  // FIX 7: Proper field reset
  private resetField(key: string): void {
    this.fieldReady[key] = false;
    this.fieldOptions[key] = [];
    this.form.get(key)?.reset();
    this.form.get(key)?.disable({ emitEvent: false });
  }

  areAllDependenciesReady(field: FieldConfig): boolean {
    if (!field.api?.dependsOn) return true;
    
    const deps = this.normalizeDependsOn(field.api.dependsOn);
    return deps.every(dep => {
      const control = this.form.get(dep);
      // FIX 8: Check both ready state and that value exists
      return this.fieldReady[dep] && control?.value != null && control?.value !== '';
    });
  }

  /* ================= API ================= */

  loadInitialApis() {
    this.config.fields
      .filter(f => {
        if (!f.api) return false;
        // FIX 9: Load fields with no dependencies or static options
        const deps = this.normalizeDependsOn(f.api.dependsOn);
        return deps.length === 0;
      })
      .forEach(f => this.executeFieldApi(f));
  }

  executeFieldApi(field: FieldConfig) {
    if (!field.api) return;

    // FIX 10: Don't call API if dependencies aren't met
    if (!this.areAllDependenciesReady(field)) {
      return;
    }

    this.fieldLoading[field.key] = true;
    this.fieldReady[field.key] = false;
    this.form.get(field.key)?.disable({ emitEvent: false });

    const params: Record<string, any> = {};
    if (field.api.paramsMap) {
      Object.entries(field.api.paramsMap).forEach(([formKey, apiKey]) => {
        const value = this.form.get(formKey)?.value;
        // FIX 11: Handle array values (multi-select)
        params[apiKey!] = Array.isArray(value) ? value : value;
      });
    }

    if (field.api.mode === 'load') {
      this.fieldService.getData(field.api.endpoint, params).subscribe({
        next: data => {
          this.fieldOptions[field.key] = data || [];
          this.enableField(field.key);
        },
        error: (err) => {
          console.error(`Error loading ${field.key}:`, err);
          this.fieldLoading[field.key] = false;
          this.fieldOptions[field.key] = [];
        }
      });
    } else {
      this.fieldService.callApi(field.api.endpoint, params).subscribe({
        next: () => this.enableField(field.key),
        error: (err) => {
          console.error(`Error calling API for ${field.key}:`, err);
          this.fieldLoading[field.key] = false;
        }
      });
    }
  }

  enableField(key: string) {
    this.fieldLoading[key] = false;
    this.fieldReady[key] = true;
    this.form.get(key)?.enable({ emitEvent: false });
  }

  /* ================= UI HELPERS ================= */

  getWrapperClasses(field: FieldConfig): string {
    const classes = [field.class || ''];

    // FIX 12: Safe conditional class evaluation
    field.conditionalClass?.forEach(c => {
      const control = this.form.get(c.when);
      if (control && control.value === c.equals) {
        classes.push(c.class);
      }
    });

    return classes.filter(c => c).join(' ');
  }
  
  // Get dynamic label based on conditional rules
  getFieldLabel(field: FieldConfig): string {
    if (!field.conditionalLabel || field.conditionalLabel.length === 0) {
      return field.label;
    }
    
    for (const condition of field.conditionalLabel) {
      const control = this.form.get(condition.when);
      if (control && control.value === condition.equals) {
        return condition.label;
      }
    }
    
    return field.label; // Default label if no conditions match
  }

  // Select All / Deselect All for multi-select dropdowns
  toggleSelectAll(fieldKey: string) {
    const control = this.form.get(fieldKey);
    if (!control) return;

    const allOptions = this.fieldOptions[fieldKey]?.map(o => o.id) || [];
    const currentValue = control.value || [];

    if (currentValue.length === allOptions.length) {
      // Deselect all
      control.setValue([]);
    } else {
      // Select all
      control.setValue(allOptions);
    }
  }

  // Check if all options are selected
  isAllSelected(fieldKey: string): boolean {
    const control = this.form.get(fieldKey);
    if (!control) return false;

    const currentValue = control.value || [];
    const allOptions = this.fieldOptions[fieldKey]?.map(o => o.id) || [];

    return currentValue.length > 0 && currentValue.length === allOptions.length;
  }

  // FIX 13: Handle undefined/null properly
  normalizeDependsOn(dep: string | string[] | undefined): string[] {
    if (!dep) return [];
    return Array.isArray(dep) ? dep : [dep];
  }

  /* ================= ACTIONS ================= */

  handleAction(action: ActionConfig) {
    // FIX 14: Prevent default form submission
    if (action.action === 'reset') {
      this.form.reset();
      this.initFieldState();
      this.loadInitialApis();
      return;
    }

    if (action.action === 'cancel') {
      this.form.reset();
      return;
    }

    // FIX 15: Only call API if form is valid for submit actions
    if (action.key === 'submit' && this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    if (action.api) {
      const formData = this.form.getRawValue(); // Get all values including disabled
      this.fieldService.callApi(action.api.endpoint, formData).subscribe({
        next: (response) => {
          console.log('Action completed successfully', response);
          // You can add success notification here
        },
        error: (err) => {
          console.error('Action failed:', err);
          // You can add error notification here
        }
      });
    }
  }
}
