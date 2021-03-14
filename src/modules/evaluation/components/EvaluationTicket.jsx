import {
  Button,
  Card,
  Divider,
  InputNumber,
  message,
  notification,
  Select,
  Table,
} from 'antd'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'
import handleError from '../../../common/utils/handleError'
import {
  getEvaluationPrivateService,
  getPointTrainingGroupsService,
  getYearsService,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import { disableEvaluationItems, semesters } from '../model'

const EvaluationTicket = ({ studentId }) => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [studentEvaluation, setStudentEvaluation] = useState(null)
  const [monitorEvaluation, setMonitorEvaluation] = useState(null)
  const [displayEvaluationTicket, setDisplayEvaluationTicket] = useState([])
  const [previousResult, setPreviousResult] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [years, setYears] = useState([])
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  // ref
  const inputPreviousResult = useRef(null)

  const { isMonitor } = profile
  const ticketOfMonitor = isMonitor && !studentId

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
                parentId: d.id,
                point: 0,
              })
              displayEvalutionTicket.push({ ...child, class: '' })
            })
          } else {
            evaluationDataItem.push({
              id: item.id,
              title: item.title,
              parentId: d.id,
              point: 0,
            })
          }
        })
      }

      evaluationData.push({
        id: `main_${d.id}`,
        maxPoint: d.maxPoint,
        point: 0,
        isAnotherItem: d.isAnotherItem,
        currentPoint: 0,
        items: evaluationDataItem,
      })
    })

    return {
      evaluationData,
      displayEvalutionTicket,
    }
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

  const getEvaluationPrivate = useCallback(async (yId, sId) => {
    try {
      let evaluationPrivate = await getEvaluationPrivateService({
        studentId: studentId || profile.id,
        semesterId: sId,
        yearId: yId,
      })
      evaluationPrivate = evaluationPrivate.data.data
      let pointTrainingGroups = await getPointTrainingGroupsService()
      pointTrainingGroups = pointTrainingGroups.data.data

      setEvaluation(evaluationPrivate)
      const mapped = mapToEvaluationTicket(pointTrainingGroups)

      setStudentEvaluation(
        evaluationPrivate.studentEvaluation || mapped.evaluationData,
      )
      setMonitorEvaluation(
        evaluationPrivate.monitorEvaluation || mapped.evaluationData,
      )
      setDisplayEvaluationTicket(mapped.displayEvalutionTicket)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  const getYears = useCallback(async () => {
    try {
      const { data } = await getYearsService()
      setYears(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getYears()
  }, [getYears])

  useEffect(() => {
    if (yearId && semesterId) {
      getEvaluationPrivate(yearId, semesterId)
    }
  }, [getEvaluationPrivate, yearId, semesterId])

  const handleChangePoint = (record, role) => (value) => {
    const { id } = record
    const point = value
    const clone = JSON.parse(
      JSON.stringify(
        role === ROLE.student ? studentEvaluation : monitorEvaluation,
      ),
    )

    const newEvaluationTicket = clone.map((group) => {
      if (group.id === id) {
        return { ...group, point }
      }

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

    if (role === ROLE.student) {
      setStudentEvaluation(newEvaluationTicket)
    } else {
      setMonitorEvaluation(newEvaluationTicket)
    }
  }

  const getEvaluationTicketItemById = (id, src) => {
    let item = {}

    if (!src) {
      return {}
    }

    src.every((ticket) => {
      const found =
        ticket.id === id ? ticket : ticket.items.find((a) => a.id === id)
      if (found) {
        item = found
        return false
      }
      return true
    })

    return item
  }

  const renderInputPoint = (r, forStudent) => {
    if ((r.point !== null && r.point !== undefined) || r.isAnotherItem) {
      return (
        <InputNumber
          style={{ width: 55 }}
          disabled={disableEvaluationItems.includes(r.id)}
          min={r.isAnotherItem ? 0 : r.point > 0 ? 0 : -100}
          max={r.isAnotherItem ? r.maxPoint : r.point > 0 ? r.point : 0}
          defaultValue={0}
          value={
            getEvaluationTicketItemById(
              r.id,
              forStudent ? studentEvaluation : monitorEvaluation,
            ).point || 0
          }
          onChange={handleChangePoint(r, forStudent ? ROLE.student : ROLE.monitor)}
        />
      )
    }

    return ''
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
      render: (r) => (r.isAnotherItem ? r.maxPoint : r.point),
    },
    {
      key: 2,
      title: 'Điểm SV tự đánh giá',
      align: 'center',
      render: (r) => renderInputPoint(r, true),
    },
    {
      key: 3,
      title: 'Lớp trưởng đánh giá',
      align: 'center',
      render: (r) => renderInputPoint(r, false),
    },
  ]

  const renderTicket = (cols, display, ev) => {
    if (!ev) {
      return ''
    }

    return (
      <div>
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
          columns={cols}
          dataSource={display}
        />
        <div className="d-flex justify-content-end mt-4">
          <Button className="me-2">LƯU NHÁP</Button>
          <Button
            type="primary"
            onClick={() => {
              if (previousResult === null && inputPreviousResult.current) {
                message.error('Vui lòng nhập điểm hệ 4')
                inputPreviousResult.current.focus()
              }
            }}
          >
            HOÀN TẤT
          </Button>
        </div>
      </div>
    )
  }

  return (
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
      <div className="row">
        <div className="col-lg-3">
          <div>Chọn năm học:</div>
          <Select
            onChange={(v) => setYearId(v)}
            placeholder="Chọn năm học"
            style={{ width: '100%' }}
          >
            {years[0] &&
              years.map((y) => (
                <Select.Option key={y.id} value={y.id}>
                  {y.title}
                </Select.Option>
              ))}
          </Select>
        </div>
        <div className="col-lg-3">
          <div>Chọn học kỳ:</div>
          <Select
            onChange={(v) => setSemesterId(v)}
            placeholder="Chọn học kỳ"
            style={{ width: '100%' }}
          >
            {semesters.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.title}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="col-lg-6">
        <Divider />
      </div>

      {renderTicket(columns, displayEvaluationTicket, evaluation)}
    </Card>
  )
}

EvaluationTicket.propTypes = {
  studentId: PropTypes.number,
}

EvaluationTicket.defaultProps = {
  studentId: null,
}

export default EvaluationTicket
