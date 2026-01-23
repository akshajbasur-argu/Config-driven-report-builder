import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ContainerFormConfig } from '../../user-form/models/report-config.model';
import { ReportBuilderComponent } from '../../user-form/report-builder/report-builder.component';

@Component({
  standalone: true,
  selector: 'app-report-preview',
  imports: [CommonModule, MatDialogModule, ReportBuilderComponent],
  template: `
    <h2 mat-dialog-title>Form Preview</h2>

    <mat-dialog-content style="max-height: 75vh; overflow: auto;">
      <app-report-builder [config]="data.config"></app-report-builder>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})

export class ReportPreviewComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { config: ContainerFormConfig }
  ) {}
}
