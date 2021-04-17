import { fetchAuthLoading } from '../../common/fetch'
import { configs } from '../../configs'

export const addPointTrainingGroupService = ({
  title,
  maxPoint,
  isAnotherItem,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups`,
    method: 'post',
    data: {
      title,
      maxPoint,
      isAnotherItem,
    },
  })

export const addPointTrainingItemService = ({
  title,
  point,
  parentId,
  groupTitleId,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingItems`,
    method: 'post',
    data: {
      title,
      point,
      parentId,
      groupTitleId,
    },
  })

export const deletePointTrainingGroupService = (id) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups/${id}`,
    method: 'delete',
  })

export const deletePointTrainingItemService = (id) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingItems/${id}`,
    method: 'delete',
  })

export const updatePointTrainingGroupService = ({
  id,
  title,
  maxPoint,
  isAnotherItem,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingGroups?pointTrainingGroupId=${id}`,
    method: 'put',
    data: {
      title,
      maxPoint,
      isAnotherItem,
    },
  })

export const updatePointTrainingItemService = ({
  id,
  title,
  point,
  parentId,
  groupTitleId,
}) =>
  fetchAuthLoading({
    url: `${configs.API}/PointTrainingItems/${id}`,
    method: 'put',
    data: {
      id,
      title,
      point,
      parentId,
      groupTitleId,
    },
  })
