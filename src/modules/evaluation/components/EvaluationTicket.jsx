import {
  Button,
  Card,
  Input,
  InputNumber,
  message,
  notification,
  Table,
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import handleError from '../../../common/utils/handleError'
import { getPointTrainingGroupsService } from '../services'
import { MODULE_NAME as MODULE_USER } from '../../user/model'
import { disableEvaluationItems } from '../model'

const EvaluationTicket = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [evaluationTicket, setEvaluationTicket] = useState([])
  const [displayEvaluationTicket, setDisplayEvaluationTicket] = useState([])
  const [previousResult, setPreviousResult] = useState(null)
  // ref
  const inputPreviousResult = useRef(null)
  console.log('~ inputPreviousResult', inputPreviousResult)

  const mapToEvaluationTicket = (data = []) => {
    const displayEvalutionTicket = []
    const evaluationData = []
    const clone = [...data]

    clone.forEach((d) => {
      const evaluationDataItem = []

      displayEvalutionTicket.push({
        ...d,
        class: 'fw-bold',
        id: `main_${d.id}`,
        title: `${d.title} (tối đa ${d.maxPoint} điểm)`,
      })

      if (d.pointTrainingItemList) {
        d.pointTrainingItemList.forEach((item) => {
          displayEvalutionTicket.push({ ...item, class: 'fw-bold' })

          if (item.childrenItemList) {
            item.childrenItemList.forEach((child) => {
              evaluationDataItem.push({
                id: child.id,
                title: child.title,
                parentID: d.id,
                point: 0,
              })
              displayEvalutionTicket.push({ ...child, class: '' })
            })
          } else {
            evaluationDataItem.push({
              id: item.id,
              title: item.title,
              parentID: d.id,
              point: 0,
            })
          }
        })
      }

      evaluationData.push({
        id: d.id,
        maxPoint: d.maxPoint,
        currentPoint: 0,
        items: evaluationDataItem,
      })
    })

    setEvaluationTicket(evaluationData)
    setDisplayEvaluationTicket(displayEvalutionTicket)
  }

  const validatePoint = (cloneEvaluationTicket) => {
    let isValid = true

    cloneEvaluationTicket.every((group) => {
      const cloneGroup = JSON.parse(JSON.stringify(group))
      const totalPoint = group.items.reduce((sum, item) => sum + item.point, 0)

      if (totalPoint > cloneGroup.maxPoint) {
        isValid = false
        return false
      }

      return true
    })

    return isValid
  }

  const getPointTrainingGroups = useCallback(async () => {
    try {
      const { data } = await getPointTrainingGroupsService()
      mapToEvaluationTicket(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getPointTrainingGroups()
  }, [getPointTrainingGroups])

  const updateEvalutionItemPointByID = (id, point) => {
    const newEvaluationTicket = evaluationTicket.map((group) => {
      const cloneEvaluation = JSON.parse(JSON.stringify(group))

      const itemIndex = cloneEvaluation.items.findIndex(
        (item) => item.id === id,
      )

      if (itemIndex !== -1) {
        cloneEvaluation.items[itemIndex].point = point
      }

      return {
        ...cloneEvaluation,
        currentPoint: cloneEvaluation.currentPoint + point,
      }
    })

    if (!validatePoint(newEvaluationTicket)) {
      notification.error({ message: 'Điểm vượt quá mức tối đa' })
      return
    }

    setEvaluationTicket(newEvaluationTicket)
  }

  const handleChangePoint = (record) => (value) => {
    updateEvalutionItemPointByID(record.id, value)
  }

  const getEvaluationTicketItemByID = (id) => {
    let item = {}

    evaluationTicket.every((ticket) => {
      const found = ticket.items.find((a) => a.id === id)
      if (found) {
        item = found
        return false
      }
      return true
    })

    return item
  }

  const columns = [
    {
      key: 0,
      title: 'NỘI DUNG ĐÁNH GIÁ',
      width: '50vw',
      render: (r) => <div className={r.class}>{r.title}</div>,
    },
    {
      key: 1,
      title: 'Điểm',
      align: 'center',
      dataIndex: 'point',
    },
    {
      key: 2,
      title: 'Điểm SV tự đánh giá',
      align: 'center',
      render: (r) => {
        if (r.point !== null && r.point !== undefined) {
          return (
            <InputNumber
              style={{ width: 55 }}
              disabled={disableEvaluationItems.indexOf(r.id) > -1}
              min={r.point > 0 ? 0 : -100}
              max={r.point > 0 ? r.point : 0}
              defaultValue={0}
              value={getEvaluationTicketItemByID(r.id).point}
              onChange={handleChangePoint(r)}
            />
          )
        }
        return ''
      },
    },
    { key: 3, title: 'Điểm lớp đánh giá', align: 'center' },
  ]

  return (
    <div>
      <Card
        title={
          <span>
            <b>TỰ ĐÁNH GIÁ RÈN LUYỆN </b>
            - Sinh viên thực hiện đánh giá đến hết
            ngày
            {' '}
            <b className="text-danger">
              {profile.deadlineDate || moment().format('DD/MM/yyyy').toString()}
            </b>
          </span>
        }
      >
        <div>
          <div className="mt-2">
            <b>Họ tên:</b>
            {' '}
            {profile.fullName || 'sv'}
          </div>
          <div className="mt-2">
            <b>MSSV:</b>
            {' '}
            {profile.code || 'sv'}
          </div>
          <div className="mt-2">
            <b>Nhập hệ 4 học kỳ trước:</b>
            <div className="mt-2">
              <InputNumber
                ref={inputPreviousResult}
                min={0}
                max={4}
                placeholder="Điểm học kỳ trước"
                style={{ width: 155 }}
                onChange={(v) => setPreviousResult(v)}
                value={previousResult}
              />
            </div>
          </div>
        </div>

        <Table
          className="mt-3"
          rowKey={(r) => r.id}
          size="small"
          pagination={false}
          columns={columns}
          dataSource={displayEvaluationTicket}
        />
        <div className="d-flex justify-content-end mt-4">
          <Button
            className="me-2"
            onClick={() => console.log(evaluationTicket)}
          >
            LƯU NHÁP
          </Button>
          <Button
            type="primary"
            onClick={() => {
              if (previousResult === null) {
                message.error('Vui lòng nhập điểm hệ 4')
                inputPreviousResult.current.focus()
              }
              console.log(evaluationTicket)
            }}
          >
            HOÀN TẤT
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default EvaluationTicket
