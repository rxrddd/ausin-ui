import request from '@/utils/request'

export function getMsgRecord(params) {
  return request({
    url: '/gmp_platform/msg/record',
    method: 'get',
    params
  })
}
export function getAllChannel(params) {
  return request({
    url: '/gmp_platform/sms/getAllChannel',
    method: 'get',
    params
  })
}
