import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReportConfig } from '../models/report-config.model';
import { T } from '@angular/cdk/keycodes';

@Injectable({ providedIn: 'root' })
export class ReportConfigService {

  getConfig(type: string = 'hierarchy'): Observable<any> {

return of(null)
//     const configs: Record<string, ReportConfig> = {

//       /* ======================================
//          1. HIERARCHY SALES REPORT
//       ====================================== */
//       hierarchy: {
//         key: 'hierarchy',
//         title: 'Hierarchy Sales Report',

//         fields: [
//           {
//             key: 'clientId',
//             label: 'Client',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'clients',
//               mode: 'load'
//             },
//             resetOnChange: ['distributorId', 'restaurantId']
//           },
//           {
//             key: 'distributorId',
//             label: 'Distributor',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'distributors',
//               dependsOn: ['clientId'],
//               paramsMap: { clientId: 'clientId' },
//               mode: 'load'
//             },
//             resetOnChange: ['restaurantId']
//           },
//           {
//             key: 'restaurantId',
//             label: 'Restaurant',
//             type: 'dropdown',
//             api: {
//               endpoint: 'restaurants',
//               dependsOn: ['distributorId'],
//               paramsMap: { distributorId: 'distributorId' },
//               mode: 'load'
//             }
//           },

//           /* ---------- CHECKBOXES ---------- */

//           {
//             key: 'includeInactive',
//             label: 'Include Inactive Restaurants',
//             type: 'checkbox',
//             api: {
//               endpoint: 'toggleInactive',
//               mode: 'trigger'
//             }
//           },
//           {
//             key: 'includeTax',
//             label: 'Include Tax',
//             type: 'checkbox',
//             api: {
//               endpoint: 'toggleTax',
//               mode: 'trigger'
//             }
//           },
//           {
//             key: 'groupByMonth',
//             label: 'Group By Month',
//             type: 'checkbox',
//             api: {
//               endpoint: 'groupByMonth',
//               mode: 'trigger'
//             }
//           }
//         ],

//         actions: [
//           {
//             key: 'submit',
//             label: 'Download Report',
//             type: 'primary',
//             api: { endpoint: 'downloadHierarchy', method: 'POST' }
//           },
//           {
//             key: 'preview',
//             label: 'Preview',
//             type: 'secondary',
//             api: { endpoint: 'previewHierarchy', method: 'POST' }
//           },
//           {
//             key: 'reset',
//             label: 'Reset',
//             type: 'secondary',
//             action: 'reset'
//           },
//           {
//             key: 'cancel',
//             label: 'Cancel',
//             type: 'secondary',
//             action: 'cancel'
//           }
//         ]
//       },

//       /* ======================================
//          2. SALES SUMMARY REPORT
//       ====================================== */
//       salesSummary: {
//         key: 'salesSummary',
//         title: 'Sales Summary Report',

//         fields: [
//           {
//             key: 'clientId',
//             label: 'Client',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'clients',
//               mode: 'load'
//             }
//           },
//           {
//             key: 'dateFrom',
//             label: 'From Date',
//             type: 'date',
//             required: true,
//             api: {
//               endpoint: 'fromDateChanged',
//               mode: 'trigger'
//             }
//           },
//           {
//             key: 'dateTo',
//             label: 'To Date',
//             type: 'date',
//             required: true,
//             api: {
//               endpoint: 'toDateChanged',
//               dependsOn: ['dateFrom'],
//               mode: 'trigger'
//             }
//           },
//           {
//             key: 'includeTax',
//             label: 'Include Tax',
//             type: 'checkbox',
//             api: {
//               endpoint: 'toggleTax',
//               mode: 'trigger'
//             }
//           }
//         ],

//         actions: [
//           {
//             key: 'submit',
//             label: 'Download',
//             type: 'primary',
//             api: { endpoint: 'downloadSalesSummary', method: 'POST' }
//           },
//           {
//             key: 'reset',
//             label: 'Reset',
//             type: 'secondary',
//             action: 'reset'
//           }
//         ]
//       },

//       /* ======================================
//          3. DISTRIBUTOR PERFORMANCE
//       ====================================== */
//       distributorPerformance: {
//         key: 'distributorPerformance',
//         title: 'Distributor Performance Report',

//         fields: [
//           {
//             key: 'clientId',
//             label: 'Client',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'clients',
//               mode: 'load'
//             }
//           },
//           {
//             key: 'distributorId',
//             label: 'Distributor',
//             type: 'dropdown',
//             api: {
//               endpoint: 'distributors',
//               dependsOn: ['clientId'],
//               paramsMap: { clientId: 'clientId' },
//               mode: 'load'
//             }
//           },
//           {
//             key: 'includeInactive',
//             label: 'Include Inactive Distributors',
//             type: 'checkbox',
//             api: {
//               endpoint: 'toggleInactiveDistributor',
//               mode: 'trigger'
//             }
//           }
//         ],

//         actions: [
//           {
//             key: 'submit',
//             label: 'Download',
//             type: 'primary',
//             api: { endpoint: 'downloadDistributorPerformance', method: 'POST' }
//           },
//           {
//             key: 'cancel',
//             label: 'Cancel',
//             type: 'secondary',
//             action: 'cancel'
//           }
//         ]
//       },

//       /* ======================================
//          4. RESTAURANT PERFORMANCE
//       ====================================== */
//       restaurantPerformance: {
//         key: 'restaurantPerformance',
//         title: 'Restaurant Performance Report',

//         fields: [
//           {
//             key: 'clientId',
//             label: 'Client',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'clients',
//               mode: 'load'
//             }
//           },
//           {
//             key: 'restaurantId',
//             label: 'Restaurant',
//             type: 'dropdown',
//             api: {
//               endpoint: 'restaurants',
//               dependsOn: ['clientId'],
//               paramsMap: { clientId: 'clientId' },
//               mode: 'load'
//             }
//           },
//           {
//             key: 'includeRatings',
//             label: 'Include Ratings',
//             type: 'checkbox',
//             api: {
//               endpoint: 'toggleRatings',
//               mode: 'trigger'
//             }
//           }
//         ],

//         actions: [
//           {
//             key: 'submit',
//             label: 'Download',
//             type: 'primary',
//             api: { endpoint: 'downloadRestaurantPerformance', method: 'POST' }
//           },
//           {
//             key: 'preview',
//             label: 'Preview',
//             type: 'secondary',
//             api: { endpoint: 'previewRestaurantPerformance', method: 'POST' }
//           }
//         ]
//       },

//       /* ======================================
//          5. TEST CONFIG (FIXED)
//       ====================================== */
//       test: {
//         key: 'test',
//         title: 'Test',

//         fields: [
//           {
//             key: 'clientId',
//             label: 'Client',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: 'clients',
//               mode: 'load'
//             },
//             resetOnChange: ['restaurant', 'distributorId']
//           },
//           {
//             key: 'restaurant',
//             label: 'Restaurant',
//             type: 'dropdown',
//             required: true,
//             api: {
//               endpoint: '/api/restaurants',
//               dependsOn: ['clientId'],
//               paramsMap: { clientId: 'clientId' },
//               mode: 'load'
//             }
//           },
//           {
//             key: 'distributorId',
//             label: 'Distributor',
//             type: 'dropdown',
//             api: {
//               endpoint: '/api/distributors',
//               dependsOn: ['clientId'],
//               paramsMap: { clientId: 'clientId' },
//               mode: 'load'
//             }
//           }
//         ],

//         actions: [
//           {
//             key: 'submit',
//             label: 'Submit',
//             type: 'primary',
//             api: {
//               endpoint: '/submit',
//               method: 'POST'
//             }
//           },
//           {
//             key: 'cancel',
//             label: 'Cancel',
//             type: 'secondary',
//             action: 'cancel'
//           }
//         ]
//       },
//       test2: {
//         "key": "test2",
//         "title": "Test2",
//         "fields": [
//           {
//             "key": "clientId",
//             "label": "Client",
//             "type": "dropdown",
//             "required": true,
//             "api": {
//               "endpoint": "clients",
//               "mode": "load",
//               "dependsOn": [],
//               "paramsMap": {}
//             },
//             "resetOnChange": []
//           },
//           {
//             "key": "test",
//             "label": "Test",
//             "type": "checkbox",
//             "required": false,
//             "api": {
//               "endpoint": "",
//               "mode": "trigger",
//               "dependsOn": [
//                 "clientId"
//               ],
//               "paramsMap": { "clientId": "clientId" }
//             },
//             "resetOnChange": []
//           },
//           {
//             "key": "date",
//             "label": "Date",
//             "type": "date",
//             "required": false,
//             "api": {
//               "endpoint": "",
//               "mode": "trigger",
//               "dependsOn": [],
//               "paramsMap": {}
//             },
//             "resetOnChange": []
//           },
//           {
//             "key": "radio",
//             "label": "Radio",
//             "type": "radio",
//             "required": false,
//             "api": {
//               "endpoint": "",
//               "mode": "load",
//               "dependsOn": [],
//               "paramsMap": {}
//             },
//             "resetOnChange": []
//           },
//           {
//             "key": "text",
//             "label": "TextArea",
//             "type": "textarea",
//             "required": false,
//             "api": {
//               "endpoint": "",
//               "mode": "trigger",
//               "dependsOn": [],
//               "paramsMap": {}
//             },
//             "resetOnChange": []
//           }
//         ],
//         "actions": [
//           {
//             "key": "submit",
//             "label": "Submit",
//             "type": "primary",
//             "api": {
//               "endpoint": "/submit",
//               "method": "POST"
//             },
//             "action": ""
//           },
//           {
//             "key": "reset",
//             "label": "Reset",
//             "type": "secondary",
//             "api": {
//               "endpoint": "",
//               "method": "POST"
//             },
//             "action": "reset"
//           },
//           {
//             "key": "cancel",
//             "label": "Cancel",
//             "type": "secondary",
//             "api": {
//               "endpoint": "",
//               "method": "POST"
//             },
//             "action": "cancel"
//           }
//         ]
//       },
//       test3: {
//   "key": "produce_price_usage",
//   "title": "Comprehensive Produce Price Usage Report",
//   "fields": [
//     {
//       "key": "role",
//       "label": "Role",
//       "type": "radio",
//       "required": true,
//       "class": "col-span-12 grid text-red-500",
//       "options": [
//         { "id": "CLIENT", "name": "Client" },
//         { "id": "DISTRIBUTOR", "name": "Distributor" }
//       ],
//       "resetOnChange": ["clientId", "distributorIds"],
//       "api": {
//         "endpoint": "clients",
//         "mode": "load",
//         "dependsOn": [],
//       },
//     },

//     {
//       "key": "clientId",
//       "label": "Client",
//       "type": "dropdown",
//       "required": true,
//       "class": "col-span-12",
//       "api": {
//         "endpoint": "clients",
//         "mode": "load",
//         "dependsOn": ["role"],  
//       },
//       "conditionalClass": [
//         {
//           "when": "role",
//           "equals": "CLIENT",
//           "class": ""
//         },
//         {
//           "when": "role",
//           "equals": "DISTRIBUTOR",
//           "class": "hidden"
//         }
//       ]
//     },

//     {
//       "key": "startDate",
//       "label": "Start Date",
//       "type": "date",
//       "required": true,
//       "class": "col-span-6"
//     },

//     {
//       "key": "endDate",
//       "label": "End Date",
//       "type": "date",
//       "required": true,
//       "class": "col-span-6"
//     },

//     {
//       "key": "distributorIds",
//       "label": "Distributors",
//       "type": "dropdown",
//       "required": false,
//       "class": "col-span-12",
//       "api": {
//         "endpoint": "/api/distributors",
//         "mode": "load",
//         "dependsOn": ["clientId"],
//         "paramsMap": {
//           "clientId": "clientId"
//         }
//       }
//     },

//     {
//       "key": "includeCostAvoidance",
//       "label": "Include Cost Avoidance?",
//       "type": "checkbox",
//       "class": "col-span-12"
//     },

//     {
//       "key": "includeThirdPartyId",
//       "label": "Include Third Party ID?",
//       "type": "checkbox",
//       "class": "col-span-12"
//     },

//     {
//       "key": "includeAllowances",
//       "label": "Include Allowances?",
//       "type": "checkbox",
//       "class": "col-span-12"
//     }
//   ],
//   "actions": [
//     {
//       "key": "submit",
//       "label": "Generate Report",
//       "type": "primary",
//       "api": {
//         "endpoint": "/api/reports/produce-price-usage",
//         "method": "POST"
//       }
//     },
//     {
//       "key": "reset",
//       "label": "Reset",
//       "type": "secondary",
//       "action": "reset"
//     }
//   ]
// }

//     };

    // return of(configs[type]);
  }
}
