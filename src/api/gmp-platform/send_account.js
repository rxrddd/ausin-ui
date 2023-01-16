import request from '@/utils/request'

export function sendAccountList(params) {
  return request({
    url: '/gmp_platform/sendAccount/list',
    method: 'get',
    params
  })
}

export function sendAccountChangeStatus(data) {
  return request({
    url: '/gmp_platform/sendAccount/changeStatus',
    method: 'post',
    data
  })
}

export function sendAccountEdit(data) {
  return request({
    url: '/gmp_platform/sendAccount/edit',
    method: 'post',
    data
  })
}

export function sendAccountQuery(params) {
  return request({
    url: '/gmp_platform/sendAccount/query',
    method: 'get',
    params
  })
}
