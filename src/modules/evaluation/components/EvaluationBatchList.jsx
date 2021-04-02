import {Button, Card, notification, Table, Tag} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {activeEvaluationBatchService, getEvaluationBatchListService} from '../services'

const EvaluationBatchList = () => {
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const history = useHistory()

  const getEvaluationBatch = useCallback(async () => {
    try {
      const {data} = await getEvaluationBatchListService()

      setEvaluationBatches(data.data.sort((a, b) => a.year.title < b.year.title ? 1 : -1))
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const handleActiveEvaluationBatch = async (r) => {
    if(!r.year || !r.year.id || !r.semester || !r.semester.id) {
      return
    }

    try {
      await activeEvaluationBatchService(r.year.id, r.semester.id)

      notification.success({message: 'Kích hoạt thành công'})
      getEvaluationBatch()
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <Card title={<b>ĐỢT ĐÁNH GIÁ RÈN LUYỆN ĐÃ TẠO</b>} size="small">
      <Table
        rowKey={(r) => `${r.year.id  }-${r.semester.id}`}
        dataSource={evaluationBatches}
        size="small"
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
            render: (r) => r.isInDeadline ? <Tag color="geekblue">ĐANG KÍCH HOẠT</Tag> : '',
          },
          {
            key: 'actions',
            title: <b>Hành Động</b>,
            align: 'right',
            render: (r) => (
              <div>
                {!r.isInDeadline && (
                  <Button
                    type="primary"
                    className="me-2 success"
                    icon={<i className="fas fa-play me-2" />}
                    onClick={() => handleActiveEvaluationBatch(r)}
                  >
                    KÍCH HOẠT
                  </Button>
                )}
                <Button
                  type="primary"
                  icon={<i className="fas fa-info-circle me-2" />}
                  onClick={() => history.push('/evaluation-batch/detail', r)}
                >
                  XEM
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
