import {Button, Card, notification, Table} from 'antd'
import React, {useCallback, useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {getEvaluationBatchListService} from '../services'

const EvaluationBatchList = () => {
  const [createdEvaluations, setCreatedEvaluations] = useState(null)
  const history = useHistory()

  const getCreatedEvaluations = useCallback(async () => {
    try {
      const {data} = await getEvaluationBatchListService()

      setCreatedEvaluations(data.data.sort((a, b) => a.year.title < b.year.title ? 1 : -1))
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getCreatedEvaluations()
  }, [getCreatedEvaluations])

  return (
    <Card title={<b>ĐỢT ĐÁNH GIÁ RÈN LUYỆN ĐÃ TẠO</b>} size="small">
      <Table
        rowKey={(r) => `${r.year.id  }-${r.semester.id}`}
        dataSource={createdEvaluations || []}
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
            key: 'actions',
            title: <b>Hành Động</b>,
            align: 'right',
            render: (r) => (
              <div>
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
