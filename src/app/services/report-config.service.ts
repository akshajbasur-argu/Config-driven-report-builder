import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReportConfig } from '../models/report-config.model';

@Injectable({ providedIn: 'root' })
export class ReportConfigService {

  getConfig(type: string = 'hierarchy'): Observable<ReportConfig> {

    const configs: Record<string, ReportConfig> = {

      /* ======================================
         1. HIERARCHY SALES REPORT (COMPLEX)
      ====================================== */
      hierarchy: {
        key: 'hierarchy',
        title: 'Hierarchy Sales Report',

        fields: [
          {
            key: 'clientId',
            label: 'Client',
            type: 'dropdown',
            required: true,
            api: { endpoint: 'clients' },
            resetOnChange: ['distributorId', 'restaurantId']
          },
          {
            key: 'distributorId',
            label: 'Distributor',
            type: 'dropdown',
            required: true,
            api: {
              endpoint: 'distributors',
              dependsOn: 'clientId',
              paramsMap: { clientId: 'clientId' }
            },
            resetOnChange: ['restaurantId']
          },
          {
            key: 'restaurantId',
            label: 'Restaurant',
            type: 'dropdown',
            api: {
              endpoint: 'restaurants',
              dependsOn: 'distributorId',
              paramsMap: { distributorId: 'distributorId' }
            }
          },

          /* ---------- CHECKBOXES ---------- */

          {
            key: 'includeInactive',
            label: 'Include Inactive Restaurants',
            type: 'checkbox',
            api: { endpoint: 'toggleInactive' }
          },
          {
            key: 'includeTax',
            label: 'Include Tax',
            type: 'checkbox'
          },
          {
            key: 'groupByMonth',
            label: 'Group By Month',
            type: 'checkbox'
          }
        ],

        actions: [
          {
            key: 'submit',
            label: 'Download Report',
            type: 'primary',
            api: { endpoint: 'downloadHierarchy', method: 'POST' }
          },
          {
            key: 'preview',
            label: 'Preview',
            type: 'secondary',
            api: { endpoint: 'previewHierarchy', method: 'POST' }
          },
          {
            key: 'reset',
            label: 'Reset',
            type: 'secondary',
            action: 'reset'
          },
          {
            key: 'cancel',
            label: 'Cancel',
            type: 'secondary',
            action: 'cancel'
          }
        ]
      },

      /* ======================================
         2. SALES SUMMARY REPORT
      ====================================== */
      salesSummary: {
        key: 'salesSummary',
        title: 'Sales Summary Report',

        fields: [
          {
            key: 'clientId',
            label: 'Client',
            type: 'dropdown',
            required: true,
            api: { endpoint: 'clients' }
          },
          {
            key: 'dateFrom',
            label: 'From Date',
            type: 'date',
            required: true
          },
          {
            key: 'dateTo',
            label: 'To Date',
            type: 'date',
            required: true
          },
          {
            key: 'includeTax',
            label: 'Include Tax',
            type: 'checkbox'
          }
        ],

        actions: [
          {
            key: 'submit',
            label: 'Download',
            type: 'primary',
            api: { endpoint: 'downloadSalesSummary', method: 'POST' }
          },
          {
            key: 'reset',
            label: 'Reset',
            type: 'secondary',
            action: 'reset'
          }
        ]
      },

      /* ======================================
         3. DISTRIBUTOR PERFORMANCE
      ====================================== */
      distributorPerformance: {
        key: 'distributorPerformance',
        title: 'Distributor Performance Report',

        fields: [
          {
            key: 'clientId',
            label: 'Client',
            type: 'dropdown',
            required: true,
            api: { endpoint: 'clients' }
          },
          {
            key: 'distributorId',
            label: 'Distributor',
            type: 'dropdown',
            api: {
              endpoint: 'distributors',
              dependsOn: 'clientId',
              paramsMap: { clientId: 'clientId' }
            }
          },
          {
            key: 'includeInactive',
            label: 'Include Inactive Distributors',
            type: 'checkbox'
          }
        ],

        actions: [
          {
            key: 'submit',
            label: 'Download',
            type: 'primary',
            api: { endpoint: 'downloadDistributorPerformance', method: 'POST' }
          },
          {
            key: 'cancel',
            label: 'Cancel',
            type: 'secondary',
            action: 'cancel'
          }
        ]
      },

      /* ======================================
         4. RESTAURANT PERFORMANCE
      ====================================== */
      restaurantPerformance: {
        key: 'restaurantPerformance',
        title: 'Restaurant Performance Report',

        fields: [
          {
            key: 'clientId',
            label: 'Client',
            type: 'dropdown',
            required: true,
            api: { endpoint: 'clients' }
          },
          {
            key: 'restaurantId',
            label: 'Restaurant',
            type: 'dropdown',
            api: {
              endpoint: 'restaurants',
              dependsOn: 'clientId',
              paramsMap: { clientId: 'clientId' }
            }
          },
          {
            key: 'includeRatings',
            label: 'Include Ratings',
            type: 'checkbox'
          }
        ],

        actions: [
          {
            key: 'submit',
            label: 'Download',
            type: 'primary',
            api: { endpoint: 'downloadRestaurantPerformance', method: 'POST' }
          },
          {
            key: 'preview',
            label: 'Preview',
            type: 'secondary',
            api: { endpoint: 'previewRestaurantPerformance', method: 'POST' }
          }
        ]
      }

    };

    return of(configs[type]);
  }
}
