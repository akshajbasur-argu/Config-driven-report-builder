import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';

import { ReportConfig, FieldConfig, ActionConfig } from '../../user-form/models/report-config.model';
import { MatDialog } from '@angular/material/dialog';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';

@Component({
  selector: 'app-admin-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './admin-form-builder.component.html',
  styleUrls: ['./admin-form-builder.component.css'],
})
export class AdminFormBuilderComponent {

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) {}

  paletteFields = [
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'date', label: 'Date' },
    { type: 'radio', label: 'Radio' },
    { type: 'textarea', label: 'Textarea' }
  ];

  paletteActions = [
    { type: 'primary', label: 'Primary Button' },
    { type: 'secondary', label: 'Secondary Button' }
  ];

  formConfig: ReportConfig = {
    key: '',
    title: '',
    fields: [],
    actions: []
  };

  selectedField?: FieldConfig;
  selectedAction?: ActionConfig;
  selectedFieldIndex: number = -1;
  selectedActionIndex: number = -1;
  selectedColumnPreset = '';
  paramsMapString = '';
  
  // Bootstrap utility classes for quick selection
  bootstrapClasses = {
    display: ['d-block', 'd-inline', 'd-inline-block', 'd-flex', 'd-grid', 'd-none'],
    flexDirection: ['flex-row', 'flex-column', 'flex-row-reverse', 'flex-column-reverse'],
    justifyContent: ['justify-content-start', 'justify-content-end', 'justify-content-center', 'justify-content-between', 'justify-content-around'],
    alignItems: ['align-items-start', 'align-items-end', 'align-items-center', 'align-items-baseline', 'align-items-stretch'],
    spacing: ['p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5'],
    sizing: ['w-25', 'w-50', 'w-75', 'w-100', 'h-25', 'h-50', 'h-75', 'h-100'],
    text: ['text-start', 'text-center', 'text-end', 'fw-bold', 'fw-normal', 'fw-light'],
    borders: ['border', 'border-top', 'border-bottom', 'border-start', 'border-end', 'rounded', 'rounded-circle'],
    colors: ['text-primary', 'text-secondary', 'text-success', 'text-danger', 'text-warning', 'text-info', 'bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-light', 'bg-dark']
  };
  
  selectedBootstrapClasses: string[] = [];

  dropField(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formConfig.fields, event.previousIndex, event.currentIndex);
      return;
    }

    const source = event.previousContainer.data[event.previousIndex];

    const field: FieldConfig = {
      key: `field_${Date.now()}`,
      label: source.label,
      type: source.type,
      required: false,
      multiple: false,
      class: 'col-span-6',
      inputClass: '',
      options: source.type === 'radio' ? [] : undefined,
      conditionalClass: [],
      api: source.type === 'dropdown' || source.type === 'radio' ? {
        endpoint: '',
        mode: 'load',
        dependsOn: [],
        paramsMap: {}
      } : undefined,
      resetOnChange: []
    };

    this.formConfig.fields.splice(event.currentIndex, 0, field);
    this.selectFieldByIndex(event.currentIndex);
  }

  addOption() {
    if (!this.selectedField) return;
    
    if (!this.selectedField.options) {
      this.selectedField.options = [];
    }
    this.selectedField.options.push({ id: '', name: '' });
  }

  removeOption(i: number) {
    if (!this.selectedField?.options) return;
    this.selectedField.options.splice(i, 1);
  }

  dropAction(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formConfig.actions, event.previousIndex, event.currentIndex);
      return;
    }

    const source = event.previousContainer.data[event.previousIndex];

    const action: ActionConfig = {
      key: `action_${Date.now()}`,
      label: source.label,
      type: source.type,
      action: '',
      api: { endpoint: '', method: 'POST' }
    };
    
    this.formConfig.actions.splice(event.currentIndex, 0, action);
    this.selectActionByIndex(event.currentIndex);
  }

  resettableFields(current: FieldConfig): FieldConfig[] {
    return this.formConfig.fields.filter(
      f => f.key && f.key !== current.key
    );
  }

  // FIX: Work with index instead of reference
  selectFieldByIndex(index: number) {
    this.selectedAction = undefined;
    this.selectedActionIndex = -1;
    this.selectedFieldIndex = index;
    this.selectedField = this.formConfig.fields[index];

    // Initialize params map string
    this.paramsMapString = this.selectedField.api?.paramsMap 
      ? JSON.stringify(this.selectedField.api.paramsMap, null, 2)
      : '{}';

    // Set column preset
    if (this.selectedField.class?.includes('col-span-12')) {
      this.selectedColumnPreset = 'col-span-12';
    } else if (this.selectedField.class?.includes('col-span-6')) {
      this.selectedColumnPreset = 'col-span-6';
    } else if (this.selectedField.class?.includes('col-span-4')) {
      this.selectedColumnPreset = 'col-span-4';
    } else if (this.selectedField.class?.includes('col-span-3')) {
      this.selectedColumnPreset = 'col-span-3';
    } else {
      this.selectedColumnPreset = '';
    }
  }

  selectField(field: FieldConfig) {
    const index = this.formConfig.fields.indexOf(field);
    if (index !== -1) {
      this.selectFieldByIndex(index);
    }
  }

  selectActionByIndex(index: number) {
    this.selectedField = undefined;
    this.selectedFieldIndex = -1;
    this.selectedColumnPreset = '';
    this.selectedActionIndex = index;
    this.selectedAction = this.formConfig.actions[index];
  }

  selectAction(action: ActionConfig) {
    const index = this.formConfig.actions.indexOf(action);
    if (index !== -1) {
      this.selectActionByIndex(index);
    }
  }

  // FIX: Save field changes explicitly
  saveFieldChanges() {
    if (this.selectedFieldIndex === -1 || !this.selectedField) return;

    // Update the params map from string
    if (this.selectedField.api && this.paramsMapString) {
      try {
        this.selectedField.api.paramsMap = JSON.parse(this.paramsMapString);
      } catch (err) {
        alert('Invalid JSON in Params Map. Please fix before saving.');
        return;
      }
    }

    // The reference is already correct, no need to reassign
    alert('Field settings saved!');
  }

  // FIX: Save action changes explicitly
  saveActionChanges() {
    if (this.selectedActionIndex === -1 || !this.selectedAction) return;
    alert('Action settings saved!');
  }

  deleteField(index: number) {
    this.formConfig.fields.splice(index, 1);

    if (this.selectedFieldIndex === index) {
      this.selectedField = undefined;
      this.selectedFieldIndex = -1;
    } else if (this.selectedFieldIndex > index) {
      this.selectedFieldIndex--;
    }
  }

  deleteAction(index: number) {
    this.formConfig.actions.splice(index, 1);

    if (this.selectedActionIndex === index) {
      this.selectedAction = undefined;
      this.selectedActionIndex = -1;
    } else if (this.selectedActionIndex > index) {
      this.selectedActionIndex--;
    }
  }

  updateParamsMap(value: string) {
    this.paramsMapString = value;
  }

  preview() {
    if (!this.formConfig.key || !this.formConfig.title) {
      alert('Please set Form Key and Form Title before previewing');
      return;
    }

    if (this.formConfig.fields.length === 0) {
      alert('Please add at least one field before previewing');
      return;
    }

    const invalidFields = this.formConfig.fields.filter(f => !f.key);
    if (invalidFields.length > 0) {
      alert('All fields must have a key before previewing');
      return;
    }

    this.dialog.open(ReportPreviewComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      data: {
        config: JSON.parse(JSON.stringify(this.formConfig))
      }
    });
  }

  saveConfig() {
    if (!this.formConfig.key || !this.formConfig.title) {
      alert('Please set Form Key and Form Title');
      return;
    }

    const invalidFields = this.formConfig.fields.filter(f => !f.key || !f.label);
    if (invalidFields.length > 0) {
      alert('All fields must have both key and label');
      return;
    }

    const invalidActions = this.formConfig.actions.filter(a => !a.key || !a.label);
    if (invalidActions.length > 0) {
      alert('All actions must have both key and label');
      return;
    }

    console.log('Form Configuration:', JSON.stringify(this.formConfig, null, 2));
    alert('Configuration saved to console. Check browser console (F12)');
  }

  dependencyFields(current: FieldConfig) {
    return this.formConfig.fields.filter(f => f.key && f.key !== current.key);
  }

  applyColumnPreset(value: string) {
    if (this.selectedField) {
      this.selectedField.class = value;
    }
  }

  addCondition() {
    if (!this.selectedField) return;
    
    if (!this.selectedField.conditionalClass) {
      this.selectedField.conditionalClass = [];
    }
    this.selectedField.conditionalClass.push({ when: '', equals: '', class: '' });
  }

  removeCondition(i: number) {
    if (!this.selectedField?.conditionalClass) return;
    this.selectedField.conditionalClass.splice(i, 1);
  }

  onParamsMapChange(event: Event) {
    const value = (event.target as HTMLTextAreaElement)?.value || '{}';
    this.updateParamsMap(value);
  }

  toggleMultiSelect() {
    if (this.selectedField) {
      this.selectedField.multiple = !this.selectedField.multiple;
    }
  }

  onFieldTypeChange() {
    if (!this.selectedField) return;

    if (this.selectedField.type === 'radio') {
      if (!this.selectedField.options) {
        this.selectedField.options = [];
      }
    } else if (this.selectedField.type === 'dropdown') {
      if (!this.selectedField.api) {
        this.selectedField.api = {
          endpoint: '',
          mode: 'load',
          dependsOn: [],
          paramsMap: {}
        };
      }
    }
  }
  
  // Add conditional label
  addConditionalLabel() {
    if (!this.selectedField) return;
    
    if (!this.selectedField.conditionalLabel) {
      this.selectedField.conditionalLabel = [];
    }
    this.selectedField.conditionalLabel.push({ when: '', equals: '', label: '' });
  }
  
  removeConditionalLabel(i: number) {
    if (!this.selectedField?.conditionalLabel) return;
    this.selectedField.conditionalLabel.splice(i, 1);
  }
  
  // Bootstrap class management
  onBootstrapClassChange(event: any) {
    this.selectedBootstrapClasses = Array.from(event.target.selectedOptions, (opt: any) => opt.value);
    if (this.selectedField) {
      this.selectedField.inputClass = this.selectedBootstrapClasses.join(' ');
    }
  }
  
  // Get all bootstrap classes as flat array for multi-select
  get allBootstrapClasses(): { category: string, classes: string[] }[] {
    return [
      { category: 'Display', classes: this.bootstrapClasses.display },
      { category: 'Flex Direction', classes: this.bootstrapClasses.flexDirection },
      { category: 'Justify Content', classes: this.bootstrapClasses.justifyContent },
      { category: 'Align Items', classes: this.bootstrapClasses.alignItems },
      { category: 'Spacing', classes: this.bootstrapClasses.spacing },
      { category: 'Sizing', classes: this.bootstrapClasses.sizing },
      { category: 'Text', classes: this.bootstrapClasses.text },
      { category: 'Borders', classes: this.bootstrapClasses.borders },
      { category: 'Colors', classes: this.bootstrapClasses.colors }
    ];
  }
}