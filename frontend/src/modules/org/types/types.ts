import type { UserRole, UserScopeLevel, UserPermission } from '../../../../../shared/domain-codes'
export type { UserRole, UserScopeLevel, UserPermission } from '../../../../../shared/domain-codes'

// audit fields - database에는 두나, frontend에는 활용하지 않음 
// createdAt: string
// createdBy: string
// updatedAt: string
// updatedBy: string

// System 관리자 전용 
// export type company = {
//     id: string
//     name: string
//     deleteYN: string
// }

export type Site = {
    id: string
    companyId: string
    name: string
    deleteYN: string
}

export type Dept = {
    // PK: companyId + id, siteId is reference only
    id: string
    companyId: string
    siteId: string
    name: string
    parentId: string | null
    deleteYN: string
}

export type Warehouse = {
    // PK: companyId + id, siteId is reference only
    id: string
    companyId: string
    siteId: string
    name: string
    deleteYN: string
}

export type OrgUser = {
    // PK: companyId + id
    id: string
    companyId: string
    siteId: string
    deptId: string
    name: string
    email: string   
    phone: string
    title: string   // 직책 - 결재문서에 활용(예:팀장)
    position: string    // 직위(예:사원,대리,과장,차장,부장,이사,상무,전무,대표이사)
    useYN: string   // 사용여부:휴직 등 
    roleId: UserRole
    permissions: UserPermission[]
    scopeLevel: UserScopeLevel
    deleteYN: string
}

export type Company = { id: string; name: string; deleteYN: string }
export type OrgResponse = {
    sites: Site[]
    departments: Dept[]
    warehouses: Warehouse[]
    users: OrgUser[]
}
