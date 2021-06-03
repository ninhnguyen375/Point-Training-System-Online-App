import {
  Button,
  Card,
  Divider,
  Input,
  notification,
  Select,
  Table,
  Tag,
} from 'antd'
import qs from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {
  classification,
  evaluationStatus,
  evaluationStatusColor,
} from '../model'
import {
  getEvaluationBatchListService,
  getEvaluationsService,
  getEvaluationPrivateService,
} from '../services'
import { MODULE_NAME as MODULE_USER, ROLE } from '../../user/model'
import { getString } from '../../../common/utils/object'

const EvaluationListOfStudentClass = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [evaluationList, setEvaluationList] = useState(null)
  const [filteredEvaluationList, setFilteredEvaluationList] = useState(null)
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [search, setSearch] = useState({})

  const history = useHistory()

  const getCurrentActive = (batches = []) => batches.find((b) => b.isInDeadline)
  const checkIsCurrentActive = (yId, sId) => {
    const found = evaluationBatches.find(
      (b) =>
        parseInt(b.year.id, 10) === parseInt(yId, 10) &&
        parseInt(b.semester.id, 10) === parseInt(sId, 10),
    )

    if (found) {
      return found.isInDeadline
    }

    return false
  }

  const getEvaluationBatch = useCallback(async () => {
    try {
      let { data } = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))
      setEvaluationBatches(data)

      // default active select batch
      const currentActive = getCurrentActive(data)
      if (currentActive) {
        setYearId(currentActive.year.id)
        setSemesterId(currentActive.semester.id)
      }
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const getEvaluationList = useCallback(async () => {
    if (!yearId || !semesterId) {
      return
    }
    try {
      let evaluationPrivate = await getEvaluationPrivateService({
        semesterId,
        yearId,
        studentId: profile.id,
      })

      evaluationPrivate = evaluationPrivate.data.data
      if (!evaluationPrivate.monitorId) {
        // Reset list
        setEvaluationList([])
        setFilteredEvaluationList([])

        notification.info({
          message:
            'Không thể xem danh sách phiếu của lớp do bạn thuộc lớp quá hạn ra trường',
        })
        return
      }

      const { data } = await getEvaluationsService({
        yearId,
        semesterId,
        monitorId: evaluationPrivate.monitorId,
      })

      setEvaluationList(data.data)
      setFilteredEvaluationList(data.data)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [yearId, semesterId])

  useEffect(() => {
    getEvaluationList()
  }, [getEvaluationList])

  const gotoConfirmPage = (r) => {
    history.push(
      `/make-evaluation?${qs.stringify({
        studentId: r.studentId,
        yearId: r.yearId,
        semesterId: r.semesterId,
      })}`,
    )
  }

  const columns = [
    {
      key: 'code',
      title: <b>MSSV</b>,
      render: (r) => r.student.code,
    },
    {
      key: 'fullName',
      title: <b>Sinh Viên</b>,
      render: (r) => (
        <span className={r.studentId === profile.id ? 'fw-bold' : ''}>
          {r.student.fullName}
        </span>
      ),
    },
    {
      key: 'status',
      title: <b>Trạng Thái</b>,
      align: 'center',
      render: (r) => (
        <Tag color={evaluationStatusColor[r.status]}>{r.status}</Tag>
      ),
    },
    {
      key: 'conclustionPoint',
      title: <b>Tổng Điểm</b>,
      align: 'center',
      render: (r) => r.conclusionPoint,
    },
    {
      key: 'classification',
      title: <b>Xếp Loại</b>,
      align: 'center',
      render: (r) => r.classification,
    },
    {
      key: 'action',
      title: <b>Hành Động</b>,
      align: 'right',
      render: (r) => (
        <Button onClick={() => gotoConfirmPage(r)}>
          <i className="fas fa-info me-2" />
          XEM
        </Button>
      ),
    },
  ]

  const renderSelectBatch = (batches = []) => {
    if (batches.length === 0) {
      return ''
    }

    return (
      <div className="col-lg-2">
        <div>Chọn Năm học và Học kỳ:</div>
        <Select
          onChange={(v) => {
            setYearId(v.split('-')[0])
            setSemesterId(v.split('-')[1])
          }}
          placeholder="Chọn Năm học và Học kỳ"
          style={{ width: '100%' }}
          value={yearId && semesterId ? `${yearId}-${semesterId}` : null}
        >
          {evaluationBatches.map((evaluationBatch) => (
            <Select.Option
              key={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
              value={`${evaluationBatch.year.id}-${evaluationBatch.semester.id}`}
            >
              {`${evaluationBatch.semester.title}, ${evaluationBatch.year.title}`}
            </Select.Option>
          ))}
        </Select>

        {!checkIsCurrentActive(yearId, semesterId) && (
          <Button
            onClick={() => {
              const curr = getCurrentActive(evaluationBatches)
              if (curr) {
                setYearId(curr.year.id)
                setSemesterId(curr.semester.id)
              } else {
                notification.info({
                  message: 'Hiện tại chưa có đợt đánh giá.',
                })
              }
            }}
            type="primary"
            className="mt-2"
            block
          >
            LẤY HIỆN TẠI
          </Button>
        )}
      </div>
    )
  }

  const applySearch = useCallback(() => {
    if (!evaluationList) {
      return
    }

    let newEvaluationList = [...evaluationList]

    if (search.fullName) {
      newEvaluationList = newEvaluationList.filter(
        (e) =>
          e.student.fullName
            .toLowerCase()
            .indexOf(search.fullName.toLowerCase()) > -1,
      )
    }
    if (search.code) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.student.code.indexOf(search.code) > -1,
      )
    }
    if (search.status) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.status === search.status,
      )
    }
    if (search.classification) {
      newEvaluationList = newEvaluationList.filter(
        (e) => e.classification === search.classification,
      )
    }

    setFilteredEvaluationList(newEvaluationList)
  }, [search, evaluationList])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  return (
    <Card
      title={
        <span>
          <b>
            {`DANH SÁCH PHIẾU ĐIỂM RÈN LUYỆN CỦA LỚP${
              (profile.roleName === ROLE.student &&
                evaluationList &&
                ` ${getString(
                  evaluationList[0],
                  'student.studentClass.title',
                )}`) ||
              ''
            }`}
          </b>
        </span>
      }
    >
      <div>{renderSelectBatch(evaluationBatches)}</div>

      <Divider />

      {filteredEvaluationList && (
        <div>
          <div className="d-flex justify-content-between flex-wrap">
            <div className="d-flex flex-wrap">
              <Input
                onChange={(e) =>
                  setSearch({ ...search, fullName: e.target.value })
                }
                allowClear
                className="me-2 mb-2"
                style={{ width: 200 }}
                placeholder="Tên SV"
              />
              <Input
                onChange={(e) => setSearch({ ...search, code: e.target.value })}
                allowClear
                className="me-2 mb-2"
                style={{ width: 200 }}
                placeholder="MSSV"
              />
              <Select
                onChange={(v) => setSearch({ ...search, status: v })}
                placeholder="Trạng thái"
                className="me-2 mb-2"
                style={{ width: 200 }}
                allowClear
              >
                {Object.keys(evaluationStatus).map((k) => (
                  <Select.Option key={k} value={evaluationStatus[k]}>
                    {evaluationStatus[k]}
                  </Select.Option>
                ))}
              </Select>
              <Select
                onChange={(v) => setSearch({ ...search, classification: v })}
                placeholder="Xếp loại"
                className="me-2 mb-2"
                style={{ width: 120 }}
                allowClear
              >
                {classification.map((c) => (
                  <Select.Option key={c} value={c}>
                    {c}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <Button onClick={() => getEvaluationList()} type="primary">
              <i className="fas fa-sync me-2" />
              LÀM MỚI
            </Button>
          </div>
          <Table
            size="small"
            rowKey={(r) => r.id}
            dataSource={filteredEvaluationList}
            columns={columns}
            scroll={{ x: '600px' }}
          />
        </div>
      )}
    </Card>
  )
}

export default EvaluationListOfStudentClass
