import type { department, site, user, warehouse } from '../../../entities/organization/types'

export type OrganizationMockData = {
  sites: site[]
  departments: department[]
  warehouses: warehouse[]
  users: user[]
}

export const organizationMockData: OrganizationMockData = {
  sites: [
    { id: 'SITE-HQ', companyId: 'COMPANY-HPS', name: '본사', deleteYN: 'N' },
    { id: 'SITE-01', companyId: 'COMPANY-HPS', name: '1번사업소', deleteYN: 'N' },
  ],
  departments: [
    { id: 'DEPT-EXEC', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', name: '대표이사', parentId: null, deleteYN: 'N' },
    { id: 'DEPT-MGMT', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', name: '경영관리팀', parentId: 'DEPT-EXEC', deleteYN: 'N' },
    { id: 'DEPT-TECH', companyId: 'COMPANY-HPS', siteId: 'SITE-01', name: '기술운영팀', parentId: 'DEPT-EXEC', deleteYN: 'N' },
  ],
  warehouses: [
    { id: 'WH-HQ', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', name: '본사', deleteYN: 'N' },
    { id: 'WH-01', companyId: 'COMPANY-HPS', siteId: 'SITE-01', name: '1번 창고', deleteYN: 'N' },
  ],
  users: [
    { id: 'USER-1001', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', deptId: 'DEPT-EXEC', name: '박대표', email: 'park@example.com', phone: '010-0000-1001', title: '대표이사', position: '대표이사', useYN: 'Y', roleId: 'totalAdmin', permissions: ['organization.manage', 'purchase.request.create', 'purchase.order.manage', 'inventory.receipt.manage', 'inventory.issue.manage', 'approval.process'], scopeLevel: 'company', deleteYN: 'N' },
    { id: 'USER-1002', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', deptId: 'DEPT-MGMT', name: '김경영', email: 'kim@example.com', phone: '010-0000-1002', title: '팀장', position: '차장', useYN: 'Y', roleId: 'siteAdmin', permissions: ['organization.manage', 'purchase.request.create', 'purchase.order.manage', 'inventory.receipt.manage', 'inventory.issue.manage'], scopeLevel: 'site', deleteYN: 'N' },
    { id: 'USER-1003', companyId: 'COMPANY-HPS', siteId: 'SITE-HQ', deptId: 'DEPT-MGMT', name: '최관리', email: 'choi@example.com', phone: '010-0000-1003', title: '', position: '', useYN: 'Y', roleId: 'departmentAdmin', permissions: ['purchase.request.create', 'approval.process'], scopeLevel: 'department', deleteYN: 'N' },
    { id: 'USER-1004', companyId: 'COMPANY-HPS', siteId: 'SITE-01', deptId: 'DEPT-TECH', name: '이기술', email: 'lee@example.com', phone: '010-0000-1004', title: '팀장', position: '차장', useYN: 'Y', roleId: 'departmentAdmin', permissions: ['purchase.request.create', 'approval.process'], scopeLevel: 'department', deleteYN: 'N' },
    { id: 'USER-1005', companyId: 'COMPANY-HPS', siteId: 'SITE-01', deptId: 'DEPT-TECH', name: '정운영', email: 'jeong@example.com', phone: '010-0000-1005', title: '', position: '', useYN: 'Y', roleId: 'user', permissions: ['purchase.request.create'], scopeLevel: 'department', deleteYN: 'N' },
  ],
}
