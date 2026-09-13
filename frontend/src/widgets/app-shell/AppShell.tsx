import type { LoginInfo } from '../../entities/auth/types'
import { useState } from 'react'
import type { Theme } from '../../core/theme/theme'
import PmRecordListPage from '../../pages/pm-record/PmRecordListPage'
import PmRecordFormPage from '../../pages/pm-record/PmRecordFormPage'
import WorkOrderPlanFormPage from '../../pages/work-order/WorkOrderPlanFormPage'
import WorkOrderResultFormPage from '../../pages/work-order/WorkOrderResultFormPage'
import WorkOrderListPage from '../../pages/work-order/WorkOrderListPage'
import EquipmentListPage from '../../pages/equipment/EquipmentListPage'
import WorkPermitListPage from '../../pages/work-permit/WorkPermitListPage'
import OrgPage from '../../pages/org/OrgPage'
import PurchaseRequestPage from '../../pages/purchase/PurchaseRequestPage'
import PurchaseOrderPage from '../../pages/purchase/PurchaseOrderPage'
import InventoryTransactionPage from '../../pages/inventory/InventoryTransactionPage'
import InventoryLedgerPage from '../../pages/inventory/InventoryLedgerPage'
import MaterialListPage from '../../pages/material/MaterialListPage'
import ApprovalPage from '../../pages/approval/ApprovalPage'
import ApprovalFormPage from '../../pages/approval/ApprovalFormPage'
import ApprovalDetailPage from '../../pages/approval/ApprovalDetailPage'
import FreeBoardPage from '../../pages/board/FreeBoardPage'
import { toPrintInfo } from '../../shared/print/printInfo'

type AppShellProps = {
  session: LoginInfo
  theme: Theme
  onLogout: () => void
}

const menuSections = [
  { title: '기준정보', items: ['조직관리'] },
  { title: '설비관리', items: ['설비', '예방점검', '작업오더', '작업허가'] },
  { title: '자재관리', items: ['자재', '구매요청', '구매오더', '재고처리', '재고원장'] },
  { title: '공통업무', items: ['결재', '게시판'] },
  { title: '시스템관리', items: ['로그인이력', '사용자관리'] },
]

export default function AppShell({ session, theme, onLogout }: AppShellProps) {
  const printInfo = toPrintInfo(session)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ 설비관리: true })
  const [currentPage, setCurrentPage] = useState<
    | 'pm-list'
    | 'pm-form'
    | 'equipment-list'
    | 'work-order-list'
    | 'work-order-plan-form'
    | 'work-order-result-form'
    | 'work-order-result-view'
    | 'work-permit-list'
    | 'org'
    | 'purchase-request'
    | 'purchase-order'
    | 'inventory-transaction'
    | 'material-list'
    | 'inventory-ledger'
    | 'approval'
    | 'approval-form'
    | 'approval-detail'
    | 'board'
  >('pm-list')
  const [workOrderPlanMode, setWorkOrderPlanMode] = useState<'create' | 'edit' | 'view'>('create')
  const [workOrderResultMode, setWorkOrderResultMode] = useState<'create' | 'edit' | 'view'>('create')
  const [approvalId, setApprovalId] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleSection = (title: string) => {
    setOpenSections((current) => ({ ...current, [title]: !current[title] }))
  }

  return (
    <div className={theme === 'dark' ? 'shell dark-theme' : 'shell'}>
      <header className="topbar">
        <div className="brand">CMMS</div>
        <div className="topbar-actions">
          <div className="user-summary">
            <span>{session.userId}</span>
            <span>{session.userName}</span>
            <span>{session.deptName}</span>
            <span>{session.siteName}</span>
            <button className="icon-button" type="button" aria-label="사용자 메뉴" aria-expanded={isUserMenuOpen} onClick={() => setIsUserMenuOpen((current) => !current)}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Zm5.5-1.5 1 1-3.5 3.5h-1v-1l3.5-3.5Z" />
              </svg>
            </button>
            {isUserMenuOpen && <button className="logout-button" type="button" onClick={onLogout}>로그아웃</button>}
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="sidebar" aria-label="주 메뉴">
          <nav className="sidebar-nav">
            {menuSections.map((section) => (
              <div className="nav-group" key={section.title}>
                <h2 className="nav-group-title">
                  <button
                    className="nav-group-toggle"
                    type="button"
                    aria-expanded={openSections[section.title] === true}
                    onClick={() => toggleSection(section.title)}
                  >
                    <span>{section.title}</span>
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="m7 10 5 5 5-5" />
                    </svg>
                  </button>
                </h2>
                {openSections[section.title] && (
                  <div className="nav-subnav">
                    {section.items.map((item) => (
                      <button
                        className={
                          (item === '예방점검' && currentPage.startsWith('pm-')) ||
                          (item === '설비' && currentPage === 'equipment-list') ||
                          (item === '작업오더' && currentPage.startsWith('work-order-')) ||
                          (item === '작업허가' && currentPage === 'work-permit-list') ||
                          (item === '조직관리' && currentPage === 'org') ||
                          (item === '구매요청' && currentPage === 'purchase-request') ||
                          (item === '구매오더' && currentPage === 'purchase-order') ||
                          (item === '재고처리' && currentPage === 'inventory-transaction')
                          || (item === '자재' && currentPage === 'material-list')
                          || (item === '재고원장' && currentPage === 'inventory-ledger')
                          || (item === '결재' && (currentPage === 'approval' || currentPage === 'approval-form' || currentPage === 'approval-detail'))
                          || (item === '게시판' && currentPage === 'board')
                            ? 'nav-subitem active'
                            : 'nav-subitem'
                        }
                        type="button"
                        key={item}
                        onClick={() => {
                          if (item === '예방점검') setCurrentPage('pm-list')
                          if (item === '설비') setCurrentPage('equipment-list')
                          if (item === '작업오더') setCurrentPage('work-order-list')
                          if (item === '작업허가') setCurrentPage('work-permit-list')
                          if (item === '조직관리') setCurrentPage('org')
                          if (item === '구매요청') setCurrentPage('purchase-request')
                          if (item === '구매오더') setCurrentPage('purchase-order')
                          if (item === '재고처리') setCurrentPage('inventory-transaction')
                          if (item === '자재') setCurrentPage('material-list')
                          if (item === '재고원장') setCurrentPage('inventory-ledger')
                          if (item === '결재') setCurrentPage('approval')
                          if (item === '게시판') setCurrentPage('board')
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main className="content">
          {currentPage === 'org' ? (
            <OrgPage />
          ) : currentPage === 'purchase-request' ? (
            <PurchaseRequestPage session={session} />
          ) : currentPage === 'purchase-order' ? (
            <PurchaseOrderPage session={session} />
          ) : currentPage === 'inventory-transaction' ? (
            <InventoryTransactionPage session={session} />
          ) : currentPage === 'material-list' ? (
            <MaterialListPage />
          ) : currentPage === 'inventory-ledger' ? (
            <InventoryLedgerPage />
          ) : currentPage === 'approval' ? (
            <ApprovalPage session={session} onCreate={() => setCurrentPage('approval-form')} onDetail={(id) => { setApprovalId(id); setCurrentPage('approval-detail') }} />
          ) : currentPage === 'approval-form' ? (
            <ApprovalFormPage session={session} onBack={() => setCurrentPage('approval')} />
          ) : currentPage === 'approval-detail' ? (
            <ApprovalDetailPage approvalId={approvalId} session={session} onBack={() => setCurrentPage('approval')} />
          ) : currentPage === 'board' ? (
            <FreeBoardPage session={session} />
          ) : currentPage === 'equipment-list' ? (
            <EquipmentListPage
              printInfo={printInfo}
            />
          ) : currentPage === 'work-permit-list' ? (
            <WorkPermitListPage
              printInfo={printInfo}
            />
          ) : currentPage === 'pm-list' ? (
            <PmRecordListPage
              onCreate={() => setCurrentPage('pm-form')}
              printInfo={printInfo}
            />
          ) : currentPage === 'pm-form' ? (
            <PmRecordFormPage
              onBack={() => setCurrentPage('pm-list')}
              printInfo={printInfo}
            />
          ) : currentPage === 'work-order-list' ? (
            <WorkOrderListPage
              onCreate={() => {
                setWorkOrderPlanMode('create')
                setCurrentPage('work-order-plan-form')
              }}
              onPlanView={() => {
                setWorkOrderPlanMode('view')
                setCurrentPage('work-order-plan-form')
              }}
              onResultCreate={() => {
                setWorkOrderResultMode('create')
                setCurrentPage('work-order-result-form')
              }}
              onResultView={() => {
                setWorkOrderResultMode('view')
                setCurrentPage('work-order-result-view')
              }}
              printInfo={printInfo}
            />
          ) : currentPage === 'work-order-result-form' ? (
            <WorkOrderResultFormPage
              mode={workOrderResultMode}
              onBack={() => setCurrentPage('work-order-list')}
              printInfo={printInfo}
            />
          ) : currentPage === 'work-order-result-view' ? (
            <WorkOrderResultFormPage
              mode={workOrderResultMode}
              onBack={() => setCurrentPage('work-order-list')}
              printInfo={printInfo}
            />
          ) : (
            <WorkOrderPlanFormPage
              mode={workOrderPlanMode}
              onBack={() => setCurrentPage('work-order-list')}
              printInfo={printInfo}
            />
          )}
        </main>
      </div>
    </div>
  )
}
