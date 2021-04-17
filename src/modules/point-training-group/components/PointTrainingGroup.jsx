import { Button, Card, notification, Popconfirm, Tag, Tooltip } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import handleError from '../../../common/utils/handleError'
import { getPointTrainingGroupsService } from '../../evaluation/services'
import {
  addPointTrainingGroupService,
  addPointTrainingItemService,
  deletePointTrainingGroupService,
  updatePointTrainingGroupService,
  deletePointTrainingItemService,
  updatePointTrainingItemService,
} from '../services'
import AddGroupForm from './AddGroupForm'

const PointTrainingGroup = () => {
  const [pointTrainingGroup, setPointTrainingGroup] = useState([])

  const getPointTrainingGroup = useCallback(async () => {
    try {
      const { data } = await getPointTrainingGroupsService()

      setPointTrainingGroup(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getPointTrainingGroup()
  }, [getPointTrainingGroup])

  const addPointTrainingGroup = async (values) => {
    try {
      await addPointTrainingGroupService({ ...values, isAnotherItem: true })

      notification.success({ message: 'Thành công' })
      window.Modal.clear()
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickAddGroup = () => {
    window.Modal.show(
      <AddGroupForm isGroup onSubmit={addPointTrainingGroup} />,
      {
        title: <b>THÊM NHÓM MỤC</b>,
        key: 'add-group-modal',
      },
    )
  }

  const removePointTrainingGroup = async (id) => {
    try {
      await deletePointTrainingGroupService(id)

      notification.success({ message: 'Thành công' })
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const removePointTrainingItem = async (id) => {
    try {
      await deletePointTrainingItemService(id)

      notification.success({ message: 'Thành công' })
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const addPointTrainingItem = (group, item, parentId) => async (values) => {
    try {
      const gTitleSplit = group.title.split(' - ')

      await updatePointTrainingGroupService({
        ...group,
        title: gTitleSplit.length === 1 ? gTitleSplit[0] : gTitleSplit[1],
        isAnotherItem: false,
      })

      if (parentId) {
        const iTitleSplit = item.title.split('. ')

        await updatePointTrainingItemService({
          ...item,
          title: iTitleSplit.length === 1 ? iTitleSplit[0] : iTitleSplit[1],
          groupTitleId: group.id,
          point: null,
        })
      }

      await addPointTrainingItemService({
        ...values,
        groupTitleId: group.id,
        parentId,
      })

      notification.success({ message: 'Thành công' })
      window.Modal.clear()
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickAddItem = (group, item, parentId) => {
    window.Modal.show(
      <AddGroupForm
        isGroup={false}
        onSubmit={addPointTrainingItem(group, item, parentId)}
      />,
      {
        title: <b>THÊM MỤC CON</b>,
        key: 'add-item-modal',
      },
    )
  }

  const updatePointTrainingItem = (item, groupId) => async (values) => {
    try {
      await updatePointTrainingItemService({
        ...item,
        ...values,
        groupTitleId: groupId,
      })
      notification.success({ message: 'Thành công' })
      window.Modal.clear()
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const updatePointTrainingGroup = (group) => async (values) => {
    try {
      await updatePointTrainingGroupService({
        id: group.id,
        ...values,
      })
      notification.success({ message: 'Thành công' })
      window.Modal.clear()
      getPointTrainingGroup()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const handleClickEditItem = (item, groupId) => {
    window.Modal.show(
      <AddGroupForm
        isGroup={false}
        editMode
        onSubmit={updatePointTrainingItem(item, groupId)}
        data={item}
      />,
      {
        title: <b>CHỈNH SỬA MỤC</b>,
        key: `edit-item-modal_${item.id}`,
      },
    )
  }

  const handleClickEditGroup = (group) => {
    window.Modal.show(
      <AddGroupForm
        isGroup
        editMode
        onSubmit={updatePointTrainingGroup(group)}
        data={group}
      />,
      {
        title: <b>CHỈNH SỬA MỤC</b>,
        key: `edit-group-modal_${group.id}`,
      },
    )
  }

  return (
    <Card title={<b>MỤC ĐÁNH GIÁ RÈN LUYỆN</b>}>
      <div className="point-training-group">
        {pointTrainingGroup.map((group) => (
          <div key={group.title}>
            <div className="point-training-group__group">
              <div>
                <Tooltip title="Mã mục">
                  <Tag>A{group.id}</Tag>
                </Tooltip>{' '}
                {group.title} - Tối đa: {group.maxPoint}đ
                <Popconfirm
                  title="Xác nhận"
                  onConfirm={() => removePointTrainingGroup(group.id)}
                >
                  <Tooltip title="Xóa mục này">
                    <Button
                      size="small"
                      className="ms-1 remove-button"
                      type="text"
                    >
                      <i className="fas fa-times" />
                    </Button>
                  </Tooltip>
                </Popconfirm>
                <Tooltip title="Chỉnh sửa mục">
                  <Button
                    size="small"
                    onClick={() => handleClickEditGroup(group)}
                    className="ms-2 edit-button"
                    type="text"
                  >
                    <i className="fas fa-pen" />
                  </Button>
                </Tooltip>
              </div>

              {/* items */}
              {group.pointTrainingItemList.map((item) => (
                <div key={item.title}>
                  <div className="point-training-group__item">
                    <div>
                      <Tooltip className="me-1" title="Mã mục">
                        <Tag>{item.id}</Tag>
                      </Tooltip>
                      {item.title}
                      {item.point !== null && (
                        <b className="ms-2">
                          {parseInt(item.point, 10) >= 0
                            ? `+${item.point}`
                            : item.point}
                          đ
                        </b>
                      )}
                      <Popconfirm
                        title="Xác nhận"
                        onConfirm={() => removePointTrainingItem(item.id)}
                      >
                        <Tooltip title="Xóa mục này">
                          <Button
                            size="small"
                            className="ms-2 remove-button"
                            type="text"
                          >
                            <i className="fas fa-times" />
                          </Button>
                        </Tooltip>
                      </Popconfirm>
                      <Tooltip title="Chỉnh sửa mục">
                        <Button
                          size="small"
                          onClick={() => handleClickEditItem(item, group.id)}
                          className="ms-2 edit-button"
                          type="text"
                        >
                          <i className="fas fa-pen" />
                        </Button>
                      </Tooltip>
                    </div>

                    {/* childs */}
                    {item.childrenItemList &&
                      item.childrenItemList.map((child) => (
                        <div
                          key={child.title}
                          className="point-training-group__child"
                        >
                          <Tooltip title="Mã mục">
                            <Tag>{child.id}</Tag>
                          </Tooltip>
                          {child.title}
                          {child.point !== null && (
                            <b className="ms-2">
                              {parseInt(child.point, 10) >= 0
                                ? `+${child.point}`
                                : child.point}
                              đ
                            </b>
                          )}
                          <Popconfirm
                            title="Xác nhận"
                            onConfirm={() => removePointTrainingItem(child.id)}
                          >
                            <Tooltip title="Xóa mục này">
                              <Button
                                size="small"
                                className="ms-2 remove-button"
                                type="text"
                              >
                                <i className="fas fa-times" />
                              </Button>
                            </Tooltip>
                          </Popconfirm>
                          <Tooltip title="Chỉnh sửa mục">
                            <Button
                              onClick={() =>
                                handleClickEditItem(child, group.id)
                              }
                              size="small"
                              className="edit-button"
                              type="text"
                            >
                              <i className="fas fa-pen" />
                            </Button>
                          </Tooltip>
                        </div>
                      ))}

                    <div className="point-training-group__child">
                      <Button
                        onClick={() => handleClickAddItem(group, item, item.id)}
                        size="small"
                        className="mb-2"
                      >
                        <i className="fas fa-plus-circle me-2" />
                        Thêm mục con
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="point-training-group__item">
                <Button
                  onClick={() => handleClickAddItem(group)}
                  className="mb-2 secondary"
                  size="small"
                  style={{ borderRadius: 0 }}
                >
                  <i className="fas fa-plus-circle me-2" />
                  Thêm mục
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button type="primary" onClick={handleClickAddGroup}>
          <i className="fas fa-plus me-2" />
          THÊM NHÓM MỤC
        </Button>
      </div>
    </Card>
  )
}

export default PointTrainingGroup
