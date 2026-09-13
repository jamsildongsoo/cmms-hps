# DB 설계문서

| 테이블 |
| --- |
| [company](#company) |
| [site](#site) |
| [dept](#dept) |
| [warehouse](#warehouse) |
| [user](#user) |
| [user_auth](#user_auth) |
| [auth_login_history](#auth_login_history) |
| [auth_session](#auth_session) |
| [code_group](#code_group) |
| [code_item](#code_item) |
| [equipment](#equipment) |
| [material](#material) |
| [pm_record](#pm_record) |
| [pm_record_item](#pm_record_item) |
| [work_order](#work_order) |
| [work_order_phase](#work_order_phase) |
| [work_order_item](#work_order_item) |
| [work_permit](#work_permit) |
| [approval](#approval) |
| [approval_participant](#approval_participant) |
| [attachment](#attachment) |
| [attachment_item](#attachment_item) |
| [board_post](#board_post) |
| [purchase_request](#purchase_request) |
| [purchase_request_item](#purchase_request_item) |
| [purchase_order](#purchase_order) |
| [purchase_order_item](#purchase_order_item) |
| [inventory_document](#inventory_document) |
| [inventory_document_item](#inventory_document_item) |
| [inventory_balance](#inventory_balance) |
| [inventory_ledger_entry](#inventory_ledger_entry) |
| [inventory_closing_period](#inventory_closing_period) |
| [inventory_closing_balance](#inventory_closing_balance) |

## company

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| name | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## site

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| name | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## dept

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| parentId | varchar | 255 | N | Y | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## warehouse

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## user

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| deptId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| email | varchar | 255 | N | N | — |
| phone | varchar | 255 | N | N | — |
| title | varchar | 255 | N | N | — |
| position | varchar | 255 | N | N | — |
| roleId | enum | — | N | N | — |
| permissions | jsonb | — | N | N | — |
| scopeLevel | enum | — | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## user_auth

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| userId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| loginId | varchar | 255 | N | N | — |
| passwordHash | varchar | 255 | N | Y | — |
| passwordChangedAt | timestamptz | — | N | Y | — |
| failedLoginCount | integer | — | N | N | `0` |
| lockedUntil | timestamptz | — | N | Y | — |
| lastLoginAt | timestamptz | — | N | Y | — |
| active | boolean | — | N | N | `true` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## auth_login_history

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | N | N | — |
| userId | varchar | 255 | N | Y | — |
| loginId | varchar | 255 | N | N | — |
| result | enum | — | N | N | — |
| failureReason | varchar | 255 | N | Y | — |
| occurredAt | timestamptz | — | N | N | — |
| ipAddress | varchar | 45 | N | Y | — |
| userAgent | varchar | 1000 | N | Y | — |
| sessionId | varchar | 255 | N | Y | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |

## auth_session

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | N | N | — |
| userId | varchar | 255 | N | N | — |
| refreshTokenHash | varchar | 255 | N | N | — |
| issuedAt | timestamptz | — | N | N | — |
| expiresAt | timestamptz | — | N | N | — |
| lastUsedAt | timestamptz | — | N | Y | — |
| revokedAt | timestamptz | — | N | Y | — |
| ipAddress | varchar | 45 | N | Y | — |
| userAgent | varchar | 1000 | N | Y | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |

## code_group

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| groupCode | varchar | 255 | Y | N | — |
| groupName | varchar | 255 | N | N | — |
| system | boolean | — | N | N | `false` |
| sortOrder | integer | — | N | N | `0` |
| active | boolean | — | N | N | `true` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## code_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| groupCode | varchar | 255 | Y | N | — |
| code | varchar | 25 | Y | N | — |
| label | varchar | 255 | N | N | — |
| sortOrder | integer | — | N | N | `0` |
| active | boolean | — | N | N | `true` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## equipment

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| location | varchar | 255 | N | N | — |
| type | varchar | 25 | N | N | — |
| installedAt | date | — | N | N | — |
| maker | varchar | 255 | N | N | — |
| model | varchar | 255 | N | N | — |
| specification | varchar | 255 | N | N | — |
| serialNumber | varchar | 255 | N | N | — |
| permitRequired | varchar | 255 | N | N | — |
| summary | text | — | N | N | — |
| status | varchar | 255 | N | N | — |
| classificationGroup | varchar | 255 | N | N | `'equipmentType'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## material

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| category | varchar | 255 | N | N | — |
| specification | varchar | 255 | N | N | — |
| unit | varchar | 255 | N | N | — |
| maker | varchar | 255 | N | N | — |
| model | varchar | 255 | N | N | — |
| standardPrice | numeric | 20, 6 | N | N | — |
| status | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| classificationGroup | varchar | 255 | N | N | `'materialType'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## pm_record

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| deptId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| summary | text | — | N | N | — |
| equipmentId | varchar | 255 | N | N | — |
| type | varchar | 255 | N | N | — |
| date | date | — | N | N | — |
| workerId | varchar | 255 | N | N | — |
| decision | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| classificationGroup | varchar | 255 | N | N | `'inspectionType'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## pm_record_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| pmRecordId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| inspectionName | varchar | 255 | N | N | — |
| inspectionMethod | varchar | 255 | N | N | — |
| standardValue | varchar | 255 | N | N | — |
| result | varchar | 255 | N | N | — |
| unit | varchar | 255 | N | N | — |

## work_order

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | Y | N | — |
| deptId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| equipmentId | varchar | 255 | N | N | — |
| type | varchar | 255 | N | N | — |
| priority | varchar | 255 | N | N | — |
| permitRequired | boolean | — | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| classificationGroup | varchar | 255 | N | N | `'workOrderType'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## work_order_phase

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| workOrderId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| phase | enum | — | Y | N | `'plan'`,`'result'` |
| status | varchar | 255 | N | N | — |
| date | date | — | N | N | — |
| workerId | varchar | 255 | N | N | — |
| manHours | numeric | 20, 6 | N | N | — |
| manHoursUnit | varchar | 255 | N | N | — |
| cost | numeric | 20, 6 | N | N | — |
| summary | text | — | N | N | — |

## work_order_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| workOrderId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| name | varchar | 255 | N | N | — |
| method | varchar | 255 | N | N | — |
| result | varchar | 255 | N | N | — |

## work_permit

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | Y | N | — |
| deptId | varchar | 255 | N | N | — |
| name | varchar | 255 | N | N | — |
| type | varchar | 255 | N | N | — |
| classificationGroup | varchar | 255 | N | N | `'workPermitType'` |
| workerId | varchar | 255 | N | N | — |
| supervisorId | varchar | 255 | N | N | — |
| workPlace | varchar | 255 | N | N | — |
| permitFrom | timestamptz | — | N | N | — |
| permitTo | timestamptz | — | N | N | — |
| summary | text | — | N | N | — |
| safetyActionRequirements | jsonb | — | N | N | — |
| specialRequirements | text | — | N | N | — |
| safetyReviewOpinion | text | — | N | N | — |
| gasInspections | jsonb | — | N | N | — |
| gasMeasurer | varchar | 255 | N | N | — |
| gasConfirmer | varchar | 255 | N | N | — |
| safetyCheckWitness | varchar | 255 | N | N | — |
| safetyCheckWorker | varchar | 255 | N | N | — |
| completionWitness | varchar | 255 | N | N | — |
| completionWorker | varchar | 255 | N | N | — |
| issuer | varchar | 255 | N | N | — |
| approver | varchar | 255 | N | N | — |
| permitRequired | jsonb | — | N | N | — |
| supplementDetails | jsonb | — | N | N | — |
| status | varchar | 255 | N | N | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## approval

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| module | enum | — | N | N | — |
| recordId | varchar | 255 | N | N | — |
| recordSiteId | varchar | 255 | N | Y | — |
| status | enum | — | N | N | — |
| requesterId | varchar | 255 | N | N | — |
| title | varchar | 255 | N | N | — |
| content | text | — | N | Y | — |
| requestedAt | timestamptz | — | N | Y | — |
| completedAt | timestamptz | — | N | Y | — |
| currentStep | integer | — | N | N | — |
| totalSteps | integer | — | N | N | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## approval_participant

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| sequenceNo | integer | — | Y | N | — |
| userId | varchar | 255 | N | N | — |
| userName | varchar | 255 | N | N | — |
| deptName | varchar | 255 | N | N | — |
| title | varchar | 255 | N | N | — |
| actionCode | enum | — | N | N | — |
| status | enum | — | N | N | — |
| processedAt | timestamptz | — | N | Y | — |
| comment | text | — | N | Y | — |

## attachment

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| module | enum | — | N | N | — |
| recordId | varchar | 255 | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## attachment_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| attachmentId | varchar | 255 | Y | N | — |
| fileName | varchar | 255 | N | N | — |
| fileSize | bigint | — | N | N | — |
| contentType | varchar | 255 | N | N | — |
| storagePath | varchar | 255 | N | N | — |

## board_post

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| title | varchar | 255 | N | N | — |
| content | text | — | N | N | — |
| authorId | varchar | 255 | N | N | — |
| authorName | varchar | 255 | N | N | — |
| viewCount | integer | — | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## purchase_request

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| deptId | varchar | 255 | N | N | — |
| requesterId | varchar | 255 | N | N | — |
| purchaserId | varchar | 255 | N | Y | — |
| name | varchar | 255 | N | N | — |
| requestDate | date | — | N | N | — |
| requiredDate | date | — | N | N | — |
| expectedDeliveryDate | date | — | N | Y | — |
| deliveryConfirmed | boolean | — | N | N | — |
| purpose | text | — | N | N | — |
| remarks | text | — | N | N | — |
| status | enum | — | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## purchase_request_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| purchaseRequestId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| materialId | varchar | 255 | N | N | — |
| quantity | numeric | 20, 6 | N | N | — |
| unit | varchar | 255 | N | N | — |
| requiredDate | date | — | N | N | — |
| purpose | text | — | N | N | — |

## purchase_order

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| siteId | varchar | 255 | N | N | — |
| deptId | varchar | 255 | N | N | — |
| warehouseId | varchar | 255 | N | N | — |
| purchaserId | varchar | 255 | N | N | — |
| purchaseRequestId | varchar | 255 | N | Y | — |
| vendorId | varchar | 255 | N | N | — |
| orderDate | date | — | N | N | — |
| expectedDeliveryDate | date | — | N | N | — |
| name | varchar | 255 | N | N | — |
| remarks | text | — | N | N | — |
| status | enum | — | N | N | — |
| deleteYN | varchar | 1 | N | N | `'N'` |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## purchase_order_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| purchaseOrderId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| materialId | varchar | 255 | N | N | — |
| quantity | numeric | 20, 6 | N | N | — |
| unit | varchar | 255 | N | N | — |
| unitPrice | numeric | 20, 6 | N | N | — |
| amount | numeric | 20, 6 | N | N | — |
| expectedDeliveryDate | date | — | N | N | — |

## inventory_document

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| documentType | enum | — | N | N | — |
| transactionReason | enum | — | N | N | — |
| status | enum | — | N | N | — |
| warehouseId | varchar | 255 | N | N | — |
| relatedWarehouseId | varchar | 255 | N | Y | — |
| relatedDocumentId | varchar | 255 | N | Y | — |
| purchaseRequestId | varchar | 255 | N | Y | — |
| purchaseOrderId | varchar | 255 | N | Y | — |
| documentDate | date | — | N | N | — |
| expectedDeliveryDate | date | — | N | Y | — |
| shippedAt | timestamptz | — | N | Y | — |
| shippedBy | varchar | 255 | N | Y | — |
| receivedAt | timestamptz | — | N | Y | — |
| receivedBy | varchar | 255 | N | Y | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## inventory_document_item

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| documentId | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| id | varchar | 255 | Y | N | — |
| materialId | varchar | 255 | N | N | — |
| purchaseRequestItemId | varchar | 255 | N | Y | — |
| purchaseOrderItemId | varchar | 255 | N | Y | — |
| quantity | numeric | 20, 6 | N | N | — |
| shippedQuantity | numeric | 20, 6 | N | N | — |
| receivedQuantity | numeric | 20, 6 | N | N | — |
| unitCost | numeric | 20, 6 | N | Y | — |

## inventory_balance

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| warehouseId | varchar | 255 | Y | N | — |
| materialId | varchar | 255 | Y | N | — |
| quantity | numeric | 20, 6 | N | N | — |
| amount | numeric | 20, 6 | N | N | — |
| reservedQuantity | numeric | 20, 6 | N | N | — |
| availableQuantity | numeric | 20, 6 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |

## inventory_ledger_entry

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| id | varchar | 255 | Y | N | — |
| companyId | varchar | 255 | Y | N | — |
| warehouseId | varchar | 255 | N | N | — |
| materialId | varchar | 255 | N | N | — |
| transactionType | enum | — | N | N | — |
| transactionReason | enum | — | N | N | — |
| quantity | numeric | 20, 6 | N | N | — |
| amount | numeric | 20, 6 | N | N | — |
| unitCost | numeric | 20, 6 | N | Y | — |
| counterpartyWarehouseId | varchar | 255 | N | Y | — |
| documentId | varchar | 255 | N | Y | — |
| documentItemId | varchar | 255 | N | Y | — |
| referenceType | enum | — | N | N | — |
| referenceId | varchar | 255 | N | N | — |
| referenceItemId | varchar | 255 | N | Y | — |
| referenceSiteId | varchar | 255 | N | Y | — |
| transferGroupId | varchar | 255 | N | Y | — |
| occurredAt | timestamptz | — | N | N | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |

## inventory_closing_period

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| warehouseId | varchar | 255 | N | N | — |
| yearMonth | varchar | 6 | Y | N | — |
| status | enum | — | N | N | — |
| closedAt | timestamptz | — | N | Y | — |
| closedBy | varchar | 255 | N | Y | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |

## inventory_closing_balance

| Field | Type | Size | PK | NULL | Default |
| --- | --- | --- | --- | --- | --- |
| companyId | varchar | 255 | Y | N | — |
| warehouseId | varchar | 255 | Y | N | — |
| yearMonth | varchar | 6 | Y | N | — |
| materialId | varchar | 255 | Y | N | — |
| openingQuantity | numeric | 20, 6 | N | N | — |
| openingAmount | numeric | 20, 6 | N | N | — |
| receiptQuantity | numeric | 20, 6 | N | N | — |
| receiptAmount | numeric | 20, 6 | N | N | — |
| issueQuantity | numeric | 20, 6 | N | N | — |
| issueAmount | numeric | 20, 6 | N | N | — |
| transferInQuantity | numeric | 20, 6 | N | N | — |
| transferInAmount | numeric | 20, 6 | N | N | — |
| transferOutQuantity | numeric | 20, 6 | N | N | — |
| transferOutAmount | numeric | 20, 6 | N | N | — |
| adjustmentQuantity | numeric | 20, 6 | N | N | — |
| adjustmentAmount | numeric | 20, 6 | N | N | — |
| closingQuantity | numeric | 20, 6 | N | N | — |
| closingAmount | numeric | 20, 6 | N | N | — |
| createdAt | timestamptz | — | N | N | — |
| createdBy | varchar | 255 | N | N | — |
| updatedAt | timestamptz | — | N | N | — |
| updatedBy | varchar | 255 | N | N | — |
