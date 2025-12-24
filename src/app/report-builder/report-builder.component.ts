import { Component, OnInit } from '@angular/core';
import { ActionConfig, FieldConfig, ReportConfig} from '../models/report-config.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReportConfigService } from '../services/report-config.service';
import { DropdownDataService } from '../services/dropdown-data.service';
import { CommonModule } from '@angular/common';
import { FieldDataService } from '../services/field-data.service';

@Component({
  selector: 'app-report-builder',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './report-builder.component.html',
  styleUrl: './report-builder.component.css',
})
export class ReportBuilderComponent implements OnInit {

  config!: ReportConfig;
  form!: FormGroup;
  fieldOptions: Record<string, any[]> = {};

  constructor(
    private route:ActivatedRoute,
    private fb: FormBuilder,
    private configService: ReportConfigService,
    private fieldService: FieldDataService
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const reportType = params['type'] || 'hierarchy';

      this.configService.getConfig(reportType).subscribe(cfg => {

        this.config = cfg;

        this.buildForm();
        this.setupSubscriptions();
        this.loadInitialDropdowns();
      });
    });
  }

  buildForm() {
    const group: any = {};
    this.config.fields.forEach(f => {
      group[f.key] = f.type === 'checkbox'
        ? [false]
        : ['', f.required ? Validators.required : []];
    });
    this.form = this.fb.group(group);
  }

  setupSubscriptions() {
    this.config.fields.forEach(field => {
      this.form.get(field.key)?.valueChanges.subscribe(value => {

        field.resetOnChange?.forEach(k => {
          this.form.get(k)?.reset();
          this.fieldOptions[k] = [];
        });

        if (field.type === 'checkbox' && field.api) {
          this.fieldService.callApi(field.api.endpoint, { value });
        }

        this.config.fields
          .filter(f => f.api?.dependsOn === field.key)
          .forEach(dep => {
            if (value) this.loadDropdown(dep);
          });
      });
    });
  }

  loadInitialDropdowns() {
    this.config.fields
      .filter(f => f.type === 'dropdown' && !f.api?.dependsOn)
      .forEach(f => this.loadDropdown(f));
  }

  loadDropdown(field: FieldConfig) {
  const params: Record<string, any> = {};

  if (field.api?.paramsMap) {
    Object.entries(field.api.paramsMap).forEach(([formKey, apiKey]) => {
      if (apiKey) {
        params[apiKey] = this.form.get(formKey)?.value;
      }
    });
  }

  this.fieldService
    .getData(field.api!.endpoint, params)
    .subscribe(data => {
      this.fieldOptions[field.key] = data;
    });
}

  isDisabled(field: FieldConfig): boolean {
    return !!(field.api?.dependsOn && !this.form.get(field.api.dependsOn)?.value);
  }

  handleAction(action: ActionConfig) {
    if (action.action === 'reset') {
      this.form.reset();
      return;
    }
    if (action.action === 'cancel') {
      alert('Cancelled');
      return;
    }
    if (action.api) {
      this.fieldService.callApi(action.api.endpoint, this.form.value);
    }
  }
}