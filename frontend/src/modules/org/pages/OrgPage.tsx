import { USER_SCOPE_LEVEL_LABELS as scopeLabels } from '../../../../../shared/domain-codes'
import { USER_ROLE_LABELS as roleLabels } from '../../../../../shared/domain-codes'
import { useEffect, useState } from 'react'
import type { UserRole, UserScopeLevel, Dept, Site, OrgUser, Warehouse } from '../types/types'
import { createUser, getOrganization } from '../api/orgApi'

export type OrganizationTab = 'site' | 'department' | 'warehouse' | 'user' | 'permission'

type OrganizationPageProps = {
  initialTab?: OrganizationTab
}



const emptyUser = {
  id: '', name: '', email: '', phone: '', title: '', position: '',
  deptId: '', roleId: 'user' as UserRole, siteId: '', scopeLevel: 'department' as UserScopeLevel,
}

export default function OrganizationPage({ initialTab = 'site' }: OrganizationPageProps) {
  const [activeTab, setActiveTab] = useState<OrganizationTab>(initialTab)
  const [sites, setSites] = useState<Site[]>([])
  const [departments, setDepartments] = useState<Dept[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [users, setUsers] = useState<OrgUser[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [userForm, setUserForm] = useState(emptyUser)

  useEffect(() => {
    let active = true
    void getOrganization().then((data) => {
      if (!active) return
      setSites(data.sites)
      setDepartments(data.departments)
      setWarehouses(data.warehouses)
      setUsers(data.users)
    })
    return () => {
      active = false
    }
  }, [])

  const siteName = (siteId: string) => sites.find((item) => item.id === siteId)?.name ?? siteId
  const departmentName = (departmentId: string) => departments.find((item) => item.id === departmentId)?.name ?? departmentId
  const scopeText = (item: OrgUser) => {
    if (item.scopeLevel === 'company') return '회사 전체'
    if (item.scopeLevel === 'site') return `${siteName(item.siteId)} 전체`
    return `${siteName(item.siteId)} / ${departmentName(item.deptId)}`
  }

  const changeTab = (tab: OrganizationTab) => {
    setActiveTab(tab)
    setIsAdding(false)
  }

  const addUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userForm.siteId || !userForm.deptId) return
    void createUser(userForm).then((created) => {
      setUsers((current) => [...current, created])
      setUserForm(emptyUser)
      setIsAdding(false)
    })
  }

  return (
    <main className="page page-screen">
      <header className="page-header">
        <div>
          <p className="eyebrow">Organization</p>
          <h1>조직관리</h1>
        </div>
      </header>

      <div className="tabs" role="tablist" aria-label="조직관리 메뉴">
        {([
          ['site', '사업장'], ['department', '부서'], ['warehouse', '창고'], ['user', '사용자'], ['permission', '권한'],
        ] as Array<[OrganizationTab, string]>).map(([tab, label]) => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => changeTab(tab)}>
            {label}
          </button>
        ))}
      </div>

      <section className="card table-card">
        <div className="section-header">
          <h2 className="card-title">{activeTab === 'site' ? '사업장 목록' : activeTab === 'department' ? '부서 목록' : activeTab === 'warehouse' ? '창고 목록' : activeTab === 'user' ? '사용자 목록' : '권한 목록'}</h2>
          {activeTab !== 'permission' && <button className="button button--primary button--form-action" type="button" onClick={() => setIsAdding((current) => !current)}>
            {isAdding ? '닫기' : '신규'}
          </button>}
        </div>

        {isAdding && activeTab === 'user' && (
          <form className="card filter-card" onSubmit={addUser}>
            <div className="form-grid form-grid--4">
              <label className="field">사용자 ID<input required value={userForm.id} onChange={(event) => setUserForm({ ...userForm, id: event.target.value })} /></label>
              <label className="field">사용자명<input required value={userForm.name} onChange={(event) => setUserForm({ ...userForm, name: event.target.value })} /></label>
              <label className="field">이메일<input required type="email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} /></label>
              <label className="field">전화번호<input required value={userForm.phone} onChange={(event) => setUserForm({ ...userForm, phone: event.target.value })} /></label>
              <label className="field">직책<input placeholder="예: 팀장, 파트장, 담당" value={userForm.title} onChange={(event) => setUserForm({ ...userForm, title: event.target.value })} /></label>
              <label className="field">직위<input placeholder="예: 과장, 대리, 사원" value={userForm.position} onChange={(event) => setUserForm({ ...userForm, position: event.target.value })} /></label>
              <label className="field">권한<select value={userForm.roleId} onChange={(event) => setUserForm({ ...userForm, roleId: event.target.value as UserRole })}><option value="totalAdmin">총괄관리자</option><option value="siteAdmin">사이트관리자</option><option value="departmentAdmin">부서관리자</option><option value="user">담당자</option></select></label>
              <label className="field">관리범위<select value={userForm.scopeLevel} onChange={(event) => setUserForm({ ...userForm, scopeLevel: event.target.value as UserScopeLevel })}>{Object.entries(scopeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="field">사업장<select required value={userForm.siteId} onChange={(event) => setUserForm({ ...userForm, siteId: event.target.value, deptId: '' })}><option value="">선택</option>{sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select></label>
              <label className="field">부서<select required value={userForm.deptId} onChange={(event) => setUserForm({ ...userForm, deptId: event.target.value })}><option value="">선택</option>{departments.filter((department) => !userForm.siteId || department.siteId === userForm.siteId).map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label>
              <div className="filter-actions"><button className="button button--primary" type="submit">저장</button></div>
            </div>
          </form>
        )}

        {activeTab === 'site' && <table className="data-table"><thead><tr><th>사업장번호</th><th>사업장명</th><th>사용</th></tr></thead><tbody>{sites.map((site) => <tr key={site.id}><td>{site.id}</td><td>{site.name}</td><td>{site.deleteYN === 'N' ? '사용' : '삭제'}</td></tr>)}</tbody></table>}
        {activeTab === 'department' && <table className="data-table"><thead><tr><th>부서번호</th><th>부서명</th><th>사업장</th><th>상위부서</th></tr></thead><tbody>{departments.map((department) => <tr key={department.id}><td>{department.id}</td><td>{department.name}</td><td>{siteName(department.siteId)}</td><td>{department.parentId ? departmentName(department.parentId) : '-'}</td></tr>)}</tbody></table>}
        {activeTab === 'warehouse' && <table className="data-table"><thead><tr><th>창고번호</th><th>창고명</th><th>사업장</th><th>사용</th></tr></thead><tbody>{warehouses.map((warehouse) => <tr key={warehouse.id}><td>{warehouse.id}</td><td>{warehouse.name}</td><td>{siteName(warehouse.siteId)}</td><td>{warehouse.deleteYN === 'N' ? '사용' : '삭제'}</td></tr>)}</tbody></table>}
        {activeTab === 'user' && <table className="data-table"><thead><tr><th>사용자ID</th><th>사용자명</th><th>부서</th><th>직책</th><th>직위</th><th>권한</th><th>관리범위</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.id}</td><td>{user.name}</td><td>{departmentName(user.deptId)}</td><td>{user.title}</td><td>{user.position}</td><td>{roleLabels[user.roleId]}</td><td>{scopeText(user)}</td></tr>)}</tbody></table>}
        {activeTab === 'permission' && <table className="data-table"><thead><tr><th>권한번호</th><th>권한명</th><th>기능</th><th>기본 관리범위</th></tr></thead><tbody><tr><td>totalAdmin</td><td>총괄관리자</td><td>전체 기능</td><td>회사 전체</td></tr><tr><td>siteAdmin</td><td>사이트관리자</td><td>조직·구매·재고 관리</td><td>사업장</td></tr><tr><td>departmentAdmin</td><td>부서관리자</td><td>구매요청·결재</td><td>부서</td></tr><tr><td>user</td><td>담당자</td><td>구매요청</td><td>부서</td></tr></tbody></table>}
      </section>
    </main>
  )
}
