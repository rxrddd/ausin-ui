import request from '@/utils/request'

export function templateEdit(data) {
  return request({
    url: '/gmp_platform/template/edit',
    method: 'get',
    data
  })
}
export function templateChangeStatus(data) {
  return request({
    url: '/gmp_platform/template/changeStatus',
    method: 'post',
    data
  })
}
export function templateList(params) {
  return request({
    url: '/gmp_platform/template/list',
    method: 'get',
    params
  })
}
export function templateRemove(data) {
  return request({
    url: '/gmp_platform/template/remove',
    method: 'post',
    data
  })
}
