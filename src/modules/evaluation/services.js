import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const getPointTrainingGroupsService = () =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups`,
    method: 'get',
  })

export const startEvaluationService = (data) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/Create`,
    method: 'post',
    data,
  })

export const getEvaluationPrivateService = (params) =>
  fetchAuthLoading({
    url: `${configs.API}/Evaluations/Private`,
    method: 'get',
    params,
  })

export const getYearsService = () =>
  fetchAuthLoading({
    url: `${configs.API}/Years`,
    method: 'get',
  })