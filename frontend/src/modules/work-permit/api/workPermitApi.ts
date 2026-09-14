import type { WorkPermitResponse } from '../types/types'
import { command, query } from '../../../shared/api/http'
export type WorkPermitListResponse={items:WorkPermitResponse[];page:number;pageSize:number;total:number;totalPages:number}
export function getWorkPermits(params:{page?:number;pageSize?:number;searchType?:'id'|'name';searchValue?:string}={}){const p=new URLSearchParams();Object.entries(params).forEach(([k,v])=>{if(v!==undefined&&v!=='')p.set(k,String(v))});return query<WorkPermitListResponse>(`/api/work-permits?${p}`)}
export function createWorkPermit(body: unknown){return command<WorkPermitResponse>('/api/work-permits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
export function updateWorkPermit(id:string,body:unknown){return command<WorkPermitResponse>(`/api/work-permits/${encodeURIComponent(id)}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})}
export function deleteWorkPermit(id:string){return command<{id:string}>(`/api/work-permits/${encodeURIComponent(id)}`,{method:'DELETE'})}
