import {Button, Input, notification, Select, Table} from 'antd'
import {arrayOf, func, number} from 'prop-types'
import React, {useCallback, useEffect, useState} from 'react'
import handleError from '../../../common/utils/handleError'
import {getStudentClassListService} from '../services'

const SelectStudentClassList = ({defaultSelectedKeys, onSelect, ignoreKeys}) => {
  // state
  const [studentClasses, setStudentClasses] = useState([])
  const [filterdStudentClasses, setFilterdStudentClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState({})
  const [selectedKeys, setSelectedKeys] = useState([...defaultSelectedKeys])

  const applySearch = useCallback(() => {
    let res = [...studentClasses]

    if (search.title) {
      res = res.filter(
        (r) => r.title.toLowerCase().indexOf(search.title.toLowerCase()) > -1,
      )
    }
    if (search.course) {
      res = res.filter((r) => r.course === search.course)
    }

    // apply ignore
    res = res.filter(c => !ignoreKeys.includes(c.id))

    setFilterdStudentClasses(res)
  }, [search, studentClasses])

  useEffect(() => {
    applySearch()
  }, [applySearch])

  const getCourse = (arr = []) => {
    const res = arr.reduce((prev, curr) => {
      if (prev.indexOf(curr.course) === -1) {
        return [...prev, curr.course]
      }
      return prev
    }, [])

    return res
  }

  const getStudentClassList = useCallback(async () => {
    try {
      const {data} = await getStudentClassListService()

      setStudentClasses(data.data)
      setCourses(getCourse(data.data))
    } catch (err) {
      handleError(err, null, notification)
    }
  }, [])

  useEffect(() => {
    getStudentClassList()
  }, [getStudentClassList])

  const columns = [
    {
      key: 'title',
      title: 'Lớp',
      dataIndex: 'title',
    },
    {
      key: 'course',
      title: 'Khóa',
      dataIndex: 'course',
    },
  ]

  const uniqueKeys = (arr = []) =>
    arr.reduce(
      (prev, curr) => (prev.indexOf(curr) === -1 ? [...prev, curr] : prev),
      [],
    )

  return (
    <div>
      <div className="d-flex">
        <Input
          onChange={(e) => setSearch({...search, title: e.target.value})}
          className="me-2"
          allowClear
          placeholder="Tìm Lớp"
        />
        <Select
          onChange={(v) => setSearch({...search, course: v})}
          className="me-2"
          allowClear
          placeholder="Khóa Học"
          style={{width: 200}}
        >
          {courses.map((c) => (
            <Select.Option key={c} value={c}>
              {c}
            </Select.Option>
          ))}
        </Select>
        <Button onClick={() => getStudentClassList()}>
          <i className="fas fa-sync me-2" />
          LÀM MỚI
        </Button>
      </div>

      <Table
        rowSelection={{
          onSelect: (record, selected) => {
            if (selected) {
              setSelectedKeys([...selectedKeys, record.id])
            } else {
              setSelectedKeys(selectedKeys.filter((key) => key !== record.id))
            }
          },
          selectedRowKeys: selectedKeys,
          hideSelectAll: true,
        }}
        columns={columns}
        rowKey={(r) => r.id}
        dataSource={filterdStudentClasses}
        size="small"
        className="mt-3"
      />

      <div className="mt-2 d-flex justify-content-end">
        <Button type="text">
          Đã chọn
          {' '}
          {selectedKeys.length}
        </Button>
        <Button
          onClick={() => {
            onSelect(
              selectedKeys,
              selectedKeys.map((key) =>
                studentClasses.find((c) => c.id === key),
              ),
            )
            window.Modal.hide()
          }}
          type="primary"
        >
          CHỌN
        </Button>
      </div>
    </div>
  )
}

SelectStudentClassList.propTypes = {
  defaultSelectedKeys: arrayOf(number),
  onSelect: func,
  ignoreKeys: arrayOf(number),
}

SelectStudentClassList.defaultProps = {
  defaultSelectedKeys: [],
  onSelect: () => {},
  ignoreKeys: [],
}

export default SelectStudentClassList
