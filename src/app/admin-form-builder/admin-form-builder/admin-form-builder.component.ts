// admin-form-builder.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ContainerFormConfig, ContainerConfig, FieldConfig, ActionConfig } from '../../user-form/models/report-config.model';
import { ReportPreviewComponent } from '../report-preview/report-preview.component';

@Component({
  selector: 'app-admin-form-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './admin-form-builder.component.html',
  styleUrls: ['./admin-form-builder.component.css']
})
export class AdminFormBuilderComponent {

  paletteFields = [
    { type: 'text', label: 'Text Input' },
    { type: 'dropdown', label: 'Dropdown' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'date', label: 'Date' },
    { type: 'radio', label: 'Radio' },
    { type: 'textarea', label: 'Textarea' },
    { type: 'note', label: 'Note/Alert' }
  ];

  paletteActions = [
    { type: 'primary', label: 'Primary Button' },
    { type: 'secondary', label: 'Secondary Button' }
  ];

  formConfig: ContainerFormConfig = {
    key: '',
    title: '',
    note: '',
    containers: [],
    actions: []
  };

  selectedContainer: ContainerConfig | null = null;
  selectedField: FieldConfig | null = null;
  selectedAction: ActionConfig | null = null;

  // Field editor state
  paramsMapString = '{}';
  selectedAllowedDays: number[] = [];
  selectedRestrictedDates: string[] = [];
  dateRangeLabel = '';
  dateRangeDays = '';
  newDateInteraction: { linkedField: string; type: 'minDate' | 'maxDate' } = { 
    linkedField: '', 
    type: 'minDate' 
  };

  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  // ==================== CONTAINER MANAGEMENT ====================

  addContainer() {
    const newContainer: ContainerConfig = {
      id: `container_${Date.now()}`,
      name: `Container ${this.formConfig.containers.length + 1}`,
      columns: 6, // Default to 6 columns (50% width)
      fields: [],
      padding: 20
    };
    this.formConfig.containers.push(newContainer);
    this.selectContainer(newContainer);
  }

  selectContainer(container: ContainerConfig) {
    this.selectedContainer = container;
    this.selectedField = null;
    this.selectedAction = null;
  }

  deleteContainer(container: ContainerConfig, event: Event) {
    event.stopPropagation();
    const index = this.formConfig.containers.indexOf(container);
    if (index !== -1) {
      this.formConfig.containers.splice(index, 1);
      if (this.selectedContainer === container) {
        this.selectedContainer = null;
      }
    }
  }

  duplicateContainer(container: ContainerConfig, event: Event) {
    event.stopPropagation();
    const duplicated: ContainerConfig = {
      ...JSON.parse(JSON.stringify(container)),
      id: `container_${Date.now()}`,
      name: `${container.name} (Copy)`
    };
    this.formConfig.containers.push(duplicated);
  }

  dropContainer(event: CdkDragDrop<ContainerConfig[]>) {
    moveItemInArray(this.formConfig.containers, event.previousIndex, event.currentIndex);
  }

  // ==================== FIELD MANAGEMENT ====================

  dropFieldIntoContainer(event: CdkDragDrop<any[]>, container: ContainerConfig) {
    if (event.previousContainer === event.container) {
      moveItemInArray(container.fields, event.previousIndex, event.currentIndex);
    } else {
      const source = event.previousContainer.data[event.previousIndex];
      
      const field: FieldConfig = {
        id: `field_${Date.now()}`,
        key: `${source.type}_${Date.now()}`,
        label: source.label,
        type: source.type,
        required: false,
        multiple: false,
        class: '',
        inputClass: '',
        options: source.type === 'radio' ? [] : undefined,
        conditionalClass: [],
        conditionalLabel: [],
        dropdownType: source.type === 'dropdown' ? 'native' : undefined,
        dateRestrictions: source.type === 'date' ? {} : undefined,
        dateRanges: source.type === 'date' ? [] : undefined,
        dateInteractions: source.type === 'date' ? [] : undefined,
        noteText: source.type === 'note' ? 'Enter note text here' : undefined,
        noteType: source.type === 'note' ? 'warning' : undefined,
        api: source.type === 'dropdown' || source.type === 'radio' ? {
          endpoint: '',
          mode: 'load',
          dependsOn: [],
          paramsMap: {}
        } : undefined,
        resetOnChange: []
      };

      container.fields.splice(event.currentIndex, 0, field);
      this.selectField(field, container);
    }
  }

  selectField(field: FieldConfig, container: ContainerConfig) {
    this.selectedField = field;
    this.selectedContainer = container;
    this.selectedAction = null;

    if (!this.selectedField.resetOnChange) {
      this.selectedField.resetOnChange = [];
    }
    if (!this.selectedField.conditionalClass) {
      this.selectedField.conditionalClass = [];
    }
    if (!this.selectedField.conditionalLabel) {
      this.selectedField.conditionalLabel = [];
    }

    this.paramsMapString = this.selectedField.api?.paramsMap 
      ? JSON.stringify(this.selectedField.api.paramsMap, null, 2)
      : '{}';

    if (this.selectedField.type === 'date') {
      this.selectedAllowedDays = this.selectedField.dateRestrictions?.allowedDays || [];
      this.selectedRestrictedDates = this.selectedField.dateRestrictions?.restrictedDates || [];
    }
  }

  deleteField(field: FieldConfig, container: ContainerConfig, event: Event) {
    event.stopPropagation();
    const index = container.fields.indexOf(field);
    if (index !== -1) {
      container.fields.splice(index, 1);
      if (this.selectedField === field) {
        this.selectedField = null;
      }
    }
  }

  // ==================== FIELD EDITOR METHODS ====================

  saveFieldChanges() {
    if (!this.selectedField) return;

    if (this.selectedField.api && this.paramsMapString) {
      try {
        this.selectedField.api.paramsMap = JSON.parse(this.paramsMapString);
      } catch (err) {
        alert('Invalid JSON in Params Map');
        return;
      }
    }

    if (this.selectedField.type === 'date' && this.selectedField.dateRestrictions) {
      this.selectedField.dateRestrictions.allowedDays = 
        this.selectedAllowedDays.length > 0 ? this.selectedAllowedDays : undefined;
      this.selectedField.dateRestrictions.restrictedDates = 
        this.selectedRestrictedDates.length > 0 ? this.selectedRestrictedDates : undefined;
    }

    alert('Field settings saved!');
  }

  addOption() {
    if (!this.selectedField?.options) {
      this.selectedField!.options = [];
    }
    this.selectedField!.options.push({ id: '', name: '' });
  }

  removeOption(i: number) {
    this.selectedField?.options?.splice(i, 1);
  }

  addCondition() {
    if (!this.selectedField?.conditionalClass) {
      this.selectedField!.conditionalClass = [];
    }
    this.selectedField!.conditionalClass.push({ when: '', equals: '', class: '' });
  }

  removeCondition(i: number) {
    this.selectedField?.conditionalClass?.splice(i, 1);
  }

  addConditionalLabel() {
    if (!this.selectedField?.conditionalLabel) {
      this.selectedField!.conditionalLabel = [];
    }
    this.selectedField!.conditionalLabel.push({ when: '', equals: '', label: '' });
  }

  removeConditionalLabel(i: number) {
    this.selectedField?.conditionalLabel?.splice(i, 1);
  }

  toggleAllowedDay(day: number) {
    const index = this.selectedAllowedDays.indexOf(day);
    if (index === -1) {
      this.selectedAllowedDays.push(day);
    } else {
      this.selectedAllowedDays.splice(index, 1);
    }
  }

  isAllowedDaySelected(day: number): boolean {
    return this.selectedAllowedDays.includes(day);
  }

  addRestrictedDate(date: string) {
    if (date && !this.selectedRestrictedDates.includes(date)) {
      this.selectedRestrictedDates.push(date);
    }
  }

  removeRestrictedDate(index: number) {
    this.selectedRestrictedDates.splice(index, 1);
  }

  addDateRange() {
    if (!this.selectedField?.dateRanges) {
      this.selectedField!.dateRanges = [];
    }
    if (this.dateRangeLabel && this.dateRangeDays) {
      this.selectedField!.dateRanges.push({
        label: this.dateRangeLabel,
        days: parseInt(this.dateRangeDays, 10)
      });
      this.dateRangeLabel = '';
      this.dateRangeDays = '';
    }
  }

  removeDateRange(index: number) {
    this.selectedField?.dateRanges?.splice(index, 1);
  }

  addDateInteraction() {
    if (!this.selectedField?.dateInteractions) {
      this.selectedField!.dateInteractions = [];
    }
    if (this.newDateInteraction.linkedField) {
      this.selectedField!.dateInteractions.push({
        linkedField: this.newDateInteraction.linkedField,
        type: this.newDateInteraction.type
      });
      this.newDateInteraction = { linkedField: '', type: 'minDate' };
    }
  }

  removeDateInteraction(index: number) {
    this.selectedField?.dateInteractions?.splice(index, 1);
  }

  getDayName(day: number): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  }

  getAllFields(): FieldConfig[] {
    return this.formConfig.containers.flatMap(c => c.fields);
  }

  getDateFields(): FieldConfig[] {
    return this.getAllFields().filter(f => f.type === 'date' && f.key !== this.selectedField?.key);
  }

  getDependencyFields(): FieldConfig[] {
    return this.getAllFields().filter(f => 
      f.key && f.key !== this.selectedField?.key && f.type !== 'note'
    );
  }

  getResettableFields(): FieldConfig[] {
    return this.getAllFields().filter(f => 
      f.key && f.key !== this.selectedField?.key && f.type !== 'note'
    );
  }

  getLinkedFieldLabel(fieldKey: string): string {
    const field = this.getAllFields().find(f => f.key === fieldKey);
    return field?.label || fieldKey;
  }

  onParamsMapChange(event: Event) {
    this.paramsMapString = (event.target as HTMLTextAreaElement).value || '{}';
  }

  // ==================== ACTION MANAGEMENT ====================

  dropAction(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.formConfig.actions, event.previousIndex, event.currentIndex);
    } else {
      const source = event.previousContainer.data[event.previousIndex];
      const action: ActionConfig = {
        key: `action_${Date.now()}`,
        label: source.label,
        type: source.type,
        action: '',
        api: { endpoint: '', method: 'POST' }
      };
      this.formConfig.actions.splice(event.currentIndex, 0, action);
      this.selectAction(action);
    }
  }

  selectAction(action: ActionConfig) {
    this.selectedAction = action;
    this.selectedField = null;
    this.selectedContainer = null;
  }

  deleteAction(index: number) {
    this.formConfig.actions.splice(index, 1);
  }

  saveActionChanges() {
    alert('Action settings saved!');
  }

  // ==================== SAVE & PREVIEW ====================

  saveConfig() {
    if (!this.formConfig.key || !this.formConfig.title) {
      alert('Please set Form Key and Form Title');
      return;
    }

    console.log('Form Configuration:', JSON.stringify(this.formConfig, null, 2));
    
    this.http.post('http://localhost:8081/api/container-forms', this.formConfig).subscribe({
      next: () => alert('Configuration saved successfully!'),
      error: (err) => {
        console.error('Error saving configuration', err);
        alert('Error saving configuration');
      }
    });
  }

  preview() {
    if (!this.formConfig.key || !this.formConfig.title) {
      alert('Please set Form Key and Form Title before previewing');
      return;
    }

    console.log(this.formConfig)

    this.dialog.open(ReportPreviewComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      data: {
        config: JSON.parse(JSON.stringify(this.formConfig))
      }
    });
  }

  getContainerDropListIds(): string[] {
    return this.formConfig.containers.map(c => c.id);
  }

  getContainerColumnClass(columns: number): string {
    return `col-${columns}`;
  }
}