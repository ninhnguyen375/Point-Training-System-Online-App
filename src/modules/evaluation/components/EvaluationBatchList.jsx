import { Button, Card, Modal, notification, Popconfirm, Table, Tag } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {
  activeEvaluationBatchService,
  deleteEvaluationBatchService,
  getEvaluationBatchListService,
} from '../services'
import { evaluationStatusColor } from '../model'

const EvaluationBatchList = () => {
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const history = useHistory()

  const getEvaluationBatch = useCallback(async () => {
    try {
      const { data } = await getEvaluationBatchListService()

      setEvaluationBatches(
        data.data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1)),
      )
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const handleActiveEvaluationBatch = async (r) => {
    if (!r.year || !r.year.id || !r.semester || !r.semester.id) {
      return
    }

    try {
      await activeEvaluationBatchService(r.year.id, r.semester.id)

      notification.success({ message: 'Kích hoạt thành công' })
      getEvaluationBatch()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  const deleteEvaluationBatch = (r) => {
    Modal.confirm({
      content:
        'Dữ liệu bị xóa sẽ không thể hoàn tác, chắc chắn xóa đợt đánh giá này?',
      onOk: async () => {
        try {
          await deleteEvaluationBatchService(r.semester.id, r.year.id)

          notification.success({
            message: 'Xóa đợt đánh giá',
            description: 'Thành công',
          })

          getEvaluationBatch()
        } catch (error) {
          handleError(error, null, notification)
        }
      },
    })
  }

  return (
    <Card title={<b>ĐỢT ĐÁNH GIÁ RÈN LUYỆN ĐÃ TẠO</b>}>
      <div className="d-flex justify-content-end mb-2">
        <Link to="/evaluation/create">
          <Button type="primary">
            <i className="fas fa-play-circle me-2" />
            BẮT ĐẦU ĐỢT ĐÁNH GIÁ
          </Button>
        </Link>
      </div>
      <Table
        rowKey={(r) => `${r.year.id}-${r.semester.id}`}
        dataSource={evaluationBatches}
        size="small"
        scroll={{ x: 400 }}
        columns={[
          {
            key: 'year',
            title: <b>Năm Học</b>,
            render: (r) => r.year.title,
          },
          {
            key: 'semester',
            title: <b>Học Kỳ</b>,
            render: (r) => r.semester.title,
          },
          {
            key: 'active',
            title: <b>Trạng Thái</b>,
            align: 'center',
            render: (r) =>
              (r.isInDeadline && !r.isFinished && (
                <Tag className="m-0" color="geekblue">
                  ĐANG KÍCH HOẠT
                </Tag>
              )) ||
              (r.isFinished && (
                <Tag className="m-0" color={evaluationStatusColor['Hoàn tất']}>
                  HOÀN TẤT
                </Tag>
              )) ||
              '',
          },
          {
            key: 'actions',
            title: <b>Hành Động</b>,
            align: 'right',
            render: (r) => (
              <div>
                {!r.isInDeadline && !r.isFinished && (
                  <Button
                    type="primary"
                    className="me-2 success"
                    onClick={() => handleActiveEvaluationBatch(r)}
                  >
                    <i className="fas fa-play me-2" />
                    KÍCH HOẠT
                  </Button>
                )}
                <Popconfirm
                  title="Xóa đợt đánh giá này?"
                  onConfirm={() => deleteEvaluationBatch(r)}
                >
                  <Button shape="circle" type="primary" className="me-2" danger>
                    <i className="fas fa-trash" />
                  </Button>
                </Popconfirm>
                <Button
                  shape="circle"
                  onClick={() =>
                    history.push(
                      `/evaluation-batch/detail?yearId=${r.year.id}&semesterId=${r.semester.id}`,
                    )
                  }
                >
                  <i className="fas fa-info" />
                </Button>
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}

export default EvaluationBatchList
