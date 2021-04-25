import {
  Button,
  Card,
  Divider,
  notification,
  Popconfirm,
  Table,
  Tooltip,
} from 'antd'
import Dragger from 'antd/lib/upload/Dragger'
import moment from 'moment'
import React, { useState } from 'react'
import readExcelFile from 'read-excel-file'
import ExportCSV from '../../../common/components/widgets/ExportCSV'
import handleError from '../../../common/utils/handleError'
import { importStudentsService } from '../services'

const ImportStudent = () => {
  // state
  const [students, setStudents] = useState([])
  const [failStudents, setFailStudents] = useState([])

  const demoData = [
    {
      MSSV: 3117410000,
      'Họ Tên': 'Sinh viên 3117410000',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1170',
      Khóa: 'K17',
    },
    {
      MSSV: 3118410000,
      'Họ Tên': 'Sinh viên 3118410000',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1180',
      Khóa: 'K18',
    },
    {
      MSSV: 3119410000,
      'Họ Tên': 'Sinh viên 3119410000',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1190',
      Khóa: 'K19',
    },
    {
      MSSV: 3116410000,
      'Họ Tên': 'Sinh viên 3116410000',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1160',
      Khóa: 'K16',
    },
    {
      MSSV: 3115410000,
      'Họ Tên': 'Sinh viên 3115410000',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1150',
      Khóa: 'K15',
    },
    {
      MSSV: 3117410001,
      'Họ Tên': 'Sinh viên 3117410001',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1170',
      Khóa: 'K17',
    },
    {
      MSSV: 3118410001,
      'Họ Tên': 'Sinh viên 3118410001',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1180',
      Khóa: 'K18',
    },
    {
      MSSV: 3119410001,
      'Họ Tên': 'Sinh viên 3119410001',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1190',
      Khóa: 'K19',
    },
    {
      MSSV: 3116410001,
      'Họ Tên': 'Sinh viên 3116410001',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1160',
      Khóa: 'K16',
    },
    {
      MSSV: 3115410001,
      'Họ Tên': 'Sinh viên 3115410001',
      Email: '',
      'Ngày Sinh': '30/01/1999',
      Lớp: 'DCT1150',
      Khóa: 'K15',
    },
  ]

  const handleReadFile = async (file) => {
    if (!file) {
      return
    }

    window.PageLoading.show()

    try {
      const reader = await readExcelFile(file, {
        schema: {
          MSSV: {
            prop: 'code',
            type: String,
            required: true,
          },
          'Họ Tên': {
            prop: 'fullName',
            type: String,
            required: true,
          },
          Email: {
            prop: 'email',
            type: String,
            required: false,
          },
          'Ngày Sinh': {
            prop: 'dateOfBirth',
            type: String,
            required: true,
          },
          Lớp: {
            prop: 'studentClassTitle',
            type: String,
            required: true,
          },
          Khóa: {
            prop: 'studentClassCourse',
            type: String,
            required: true,
          },
        },
      })
      const { errors } = reader
      let { rows } = reader

      rows = rows.map((r, i) => ({
        ...r,
        row: i + 2,
      }))

      setStudents(rows)
      setFailStudents(
        errors.map(
          (e) => `vui lòng kiểm tra lại dòng ${e.row + 1}, cột "${e.column}".`,
        ),
      )
    } catch (err) {
      handleError(err, null, notification)
    }

    window.PageLoading.hide()
  }

  const handleChangeFileEvent = async (file) => {
    await handleReadFile(file.file.originFileObj)
  }

  const columns = [
    {
      key: 'row',
      title: 'Dòng',
      dataIndex: 'row',
    },
    {
      key: 'code',
      title: 'MSSV',
      dataIndex: 'code',
    },
    {
      key: 'fullName',
      title: 'Họ Tên',
      dataIndex: 'fullName',
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: 'dateOfBirth',
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
    },
    {
      key: 'studentClassTitle',
      title: 'Lớp',
      dataIndex: 'studentClassTitle',
    },
    {
      key: 'studentClassCourse',
      title: 'Khóa',
      dataIndex: 'studentClassCourse',
    },
  ]

  const handleImportStudent = async () => {
    try {
      const data = students.map((s) => ({
        ...s,
        dateOfBirth: moment(s.dateOfBirth, 'DD/MM/YYYY').format('MM/DD/YYYY'),
      }))
      await importStudentsService(data)

      notification.success({ message: 'Nhập sinh viên thành công' })
    } catch (err) {
      handleError(err, null, notification)
    }
  }

  return (
    <Card title={<b>NHẬP SINH VIÊN</b>}>
      <div className="row">
        <div className="col-lg-4 mb-2">
          <Dragger
            showUploadList={false}
            customRequest={({ onSuccess }) => onSuccess()}
            onChange={handleChangeFileEvent}
            fileList={[]}
            accept=".xlsx,.xls"
          >
            <i className="fas fa-cloud-upload-alt fs-3 text-secondary" />
            <div className="text-secondary">
              Tải lên danh sách Sinh Viên (.xlsx)
            </div>
          </Dragger>
        </div>
        <div className="col">
          <ExportCSV
            jsonData={demoData}
            fileName="demo_SinhVien"
            type="primary"
          >
            <i className="fas fa-file-download me-2" />
            TẢI XUỐNG FILE MẪU
          </ExportCSV>
        </div>
      </div>

      <div className="row mt-3">
        <Table
          rowKey={(r) => r.code}
          dataSource={students}
          size="small"
          columns={columns}
          scroll={{ x: 600 }}
          bordered
        />
      </div>
      <div>
        {failStudents.map((f) => (
          <div className="text-danger" key={f}>
            {f}
          </div>
        ))}
        <Divider />
        <div className="d-flex justify-content-end">
          <b>
            TỔNG:
            {students.length}
          </b>
        </div>
        <div
          className="d-flex justify-content-end mt-3"
          style={{ position: 'sticky', top: 10 }}
        >
          <Tooltip
            disabled={failStudents.length > 0}
            title={
              failStudents.length > 0
                ? 'Vui lòng xử lý lỗi trên file excel'
                : ''
            }
          >
            <Popconfirm
              placement="rightTop"
              disabled={failStudents.length > 0 || students.length === 0}
              title="Xác nhận"
              okButtonProps={{ className: 'success' }}
              onConfirm={handleImportStudent}
            >
              <Button
                disabled={failStudents.length > 0 || students.length === 0}
                size="large"
                className="success"
                type="primary"
              >
                <i className="fas fa-file-import me-2" />
                NHẬP VÀO HỆ THỐNG
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
    </Card>
  )
}

export default ImportStudent
