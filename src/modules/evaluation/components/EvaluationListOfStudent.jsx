import { Button, Card, notification, Select, Table, Tag } from 'antd'
import qs from 'query-string'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import handleError from '../../../common/utils/handleError'
import {
  classification,
  evaluationStatus,
  evaluationStatusColor,
} from '../model'
import {
  getEvaluationBatchListService,
  getEvaluationPrivateService,
} from '../services'
import { MODULE_NAME as MODULE_USER } from '../../user/model'

const EvaluationListOfStudent = () => {
  // store
  const profile = useSelector((state) => state[MODULE_USER].profile)
  // state
  const [evaluationList, setEvaluationList] = useState([])
  const [filteredEvaluationList, setFilteredEvaluationList] = useState([])
  const [search, setSearch] = useState({})

  const getEvaluationPrivate = async (sId, yId) => {
    try {
      let { data } = await getEvaluationPrivateService({
        studentId: profile.id,
        semesterId: sId,
        yearId: yId,
      })
      data = data.data

      return data
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      return null
    }
  }

  const getEvaluationBatch = useCallback(async () => {
    try {
      let { data } = await getEvaluationBatchListService()
      data = data.data
      data = data.sort((a, b) => (a.year.title < b.year.title ? 1 : -1))

      // get evaluations of student
      let evals = []
      data.forEach((batch) => {
        evals.push(getEvaluationPrivate(batch.semester.id, batch.year.id))
      })

      evals = await Promise.all(evals)
      evals = evals.filter((e) => !!e)
      evals = evals.map((e) => ({
        ...e,
        ...data.find(
          (d) => d.semester.id === e.semesterId && d.year.id === e.yearId,
        ),
      }))

      setEvaluationList(evals)
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const columns = [
    {
      key: 'batch',
      title: <b>Năm Học</b>,
      render: (r) => (
        <b>
          Học kỳ {r.semester.id}, {r.year.title}
        </b>
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
      key: 'isInDeadline',
      title: <b>Đang Đánh Giá</b>,
      align: 'center',
      render: (r) =>
        r.isInDeadline && !r.isFinished ? <Tag color="geekblue">Đang Đánh Giá</Tag> : '',
    },
    {
      title: <b>Tổng Điểm</b>,
      align: 'center',
      render: (r) =>
        r.conclusionPoint || <i className="text-secondary">chưa có</i>,
    },
    {
      title: <b>Xếp Loại</b>,
      align: 'center',
      render: (r) =>
        r.classification || <i className="text-secondary">chưa có</i>,
    },
    {
      title: <b>Hành Động</b>,
      align: 'right',
      render: (r) => (
        <Link
          to={`/make-evaluation?${qs.stringify({
            studentId: r.studentId,
            yearId: r.yearId,
            semesterId: r.semesterId,
          })}`}
        >
          <Button shape="circle">
            <i className="fas fa-info" />
          </Button>
        </Link>
      ),
    },
  ]

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
          <b>DANH SÁCH PHIẾU ĐIỂM RÈN LUYỆN CỦA BẠN</b>
        </span>
      }
    >
      <div>
        <div className="d-flex justify-content-between flex-wrap">
          <div className="d-flex flex-wrap">
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
        </div>
        <Table
          size="small"
          rowKey={(r) => r.id}
          dataSource={filteredEvaluationList}
          columns={columns}
          scroll={{ x: 600 }}
        />
      </div>
    </Card>
  )
}

export default EvaluationListOfStudent
