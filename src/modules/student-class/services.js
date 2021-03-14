import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const getStudentsOfClassByMonitorIdService = (monitorId, token) => fetchAuthLoading({
  url: `${configs.API}/StudentClasses/GetStudentsInClass`,
  method: 'GET',
  token,
  params: {
    monitorId,
  },
})