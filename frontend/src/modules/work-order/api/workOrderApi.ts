import type { WorkOrderListResponse, WorkOrderResponse } from '../types/types'
import { command, query } from '../../../shared/api/http'
export function getWorkOrders(params:{page?:number;pageSize?:number;searchType?:'id'|'name';searchValue?:string}={}){const p=new URLSearchParams();Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!=='')p.set(k,String(v))});return query<WorkOrderListResponse>(`/api/work-orders?${p}`)}
export function getWorkOrder(id:string){return query<WorkOrderResponse>(`/api/work-orders/${encodeURIComponent(id)}`)}
export function createWorkOrder(body: unknown){return command<WorkOrderResponse>('/api/work-orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
export function updateWorkOrder(id:string,body:unknown){return command<WorkOrderResponse>(`/api/work-orders/${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
export function deleteWorkOrder(id:string){return command<{id:string}>(`/api/work-orders/${encodeURIComponent(id)}`,{method:'DELETE'})}
