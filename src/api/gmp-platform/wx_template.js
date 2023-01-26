import request from '@/utils/request'

export function getOfficialAccountTemplateList(params) {
  return request({
    url: '/gmp_platform/wxTemplate/getOfficialAccountTemplateList',
    method: 'get',
    params
  })
}
