import { Routes } from '@angular/router';
import { ReportBuilderComponent } from './user-form/report-builder/report-builder.component';
import { AdminFormBuilderComponent } from './admin-form-builder/admin-form-builder/admin-form-builder.component';
import { ReportPreviewComponent } from './admin-form-builder/report-preview/report-preview.component';

export const routes: Routes = [
    {
  path: 'reports',
  component: ReportBuilderComponent
},
{
  path:'builder',
  component: AdminFormBuilderComponent
},
{
  path:'report-preview',
  component: ReportPreviewComponent
},

];
