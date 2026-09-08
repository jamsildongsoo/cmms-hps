// autility fields - frontend에는 활용하지 않음 
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

export type site = {
    id: string
    companyId: string
    name: string
    deleteYN: string
}

export type department = { 
    // PK: companyId + id, siteId is reference only
    id: string
    companyId: string
    siteId: string
    name: string
    parentId: string | null
    deleteYN: string
}

export type warehouse = {
    // PK: companyId + id, siteId is reference only
    id: string
    companyId: string
    siteId: string
    name: string
    deleteYN: string
}

export type UserRole = 'totalAdmin' | 'siteAdmin' | 'departmentAdmin' | 'user'

export type UserScopeLevel = 'company' | 'site' | 'department'

export type UserPermission =
    | 'organization.manage'
    | 'purchase.request.create'
    | 'purchase.order.manage'
    | 'inventory.receipt.manage'
    | 'inventory.issue.manage'
    | 'approval.process'

export type user = {
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
