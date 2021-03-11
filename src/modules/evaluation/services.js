import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const getPointTrainingGroupsService = () =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups`,
    method: 'get',
  })
