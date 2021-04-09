/* eslint-disable new-cap */
import { Button, Switch } from 'antd'
import jsPDF from 'jspdf'
import React, { useCallback, useEffect, useState } from 'react'
import { any, arrayOf, objectOf } from 'prop-types'
import logo from '../assets/images/sgu-logo.png'
import '../assets/fonts/times-normal'
import '../assets/fonts/timesi-normal'
import '../assets/fonts/timesbd-normal'
import '../assets/fonts/timesbi-normal'
import { a4, evaluationStatus } from '../modules/evaluation/model'
import { getString } from '../common/utils/object'

const ClassStatisticExport = ({ evaluations }) => {
  // state
  const [isFilterValidTicket, setIsFilterValidTicket] = useState(false)
  const [pages, setPages] = useState([])

  const itemsLength = pages.reduce((prev, curr) => prev + curr.items.length, [])

  // pdfjs
  const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' })
  pdf.setFont('times')
  pdf.setFont('timesi')
  pdf.setFont('timesbd')
  pdf.setFont('timesbi')

  const getPages = useCallback(() => {
    const newPages = []
    let src = [...evaluations]
    src = src.map((s, i) => ({ ...s, index: i + 1 }))

    if (isFilterValidTicket) {
      src = src.filter((s) => !!s.conclusionPoint)
    }

    const itemNumWithHeaderAndFooter = 22
    const itemNumWithHeader = 28
    const itemNumWithFooter = 32
    const itemNum = 37
    let numPage = 1
    let isSplitFooter = true

    // init page 1
    if (src.length <= itemNumWithHeaderAndFooter) {
      isSplitFooter = false
      newPages.push({
        numPage,
        items: src.splice(0),
      })
    } else {
      newPages.push({
        numPage,
        items: src.splice(
          0,
          src.length >= itemNumWithHeader ? itemNumWithHeader : src.length,
        ),
      })
    }

    // apply newPages
    while (src.length > 0) {
      numPage += 1

      if (src.length <= itemNumWithFooter) {
        isSplitFooter = false
        newPages.push({
          numPage,
          items: src.splice(0),
        })
      } else {
        newPages.push({
          numPage,
          items: src.splice(0, src.length >= itemNum ? itemNum : src.length),
        })
      }
    }
    if (isSplitFooter) {
      newPages.push({
        numPage: numPage + 1,
        items: [],
      })
    }

    setPages(newPages)
  }, [isFilterValidTicket, evaluations])

  useEffect(() => {
    getPages()
  }, [getPages])

  const exportToPDF = async () => {
    const input = document.getElementById('pdf-element')

    const signSlot1 = document
      .getElementById('signSlot1')
      .getBoundingClientRect()
    const signSlot2 = document
      .getElementById('signSlot2')
      .getBoundingClientRect()
    const signSlot3 = document
      .getElementById('signSlot3')
      .getBoundingClientRect()

    // eslint-disable-next-line no-console
    console.log(
      parseInt(signSlot1.x, 10),
      parseInt(signSlot1.y, 10),
      parseInt(signSlot1.width, 10),
      parseInt(signSlot1.height, 10),
    )
    // eslint-disable-next-line no-console
    console.log(
      parseInt(signSlot2.x, 10),
      parseInt(signSlot2.y, 10),
      parseInt(signSlot2.width, 10),
      parseInt(signSlot2.height, 10),
    )
    // eslint-disable-next-line no-console
    console.log(
      parseInt(signSlot3.x, 10),
      parseInt(signSlot3.y, 10),
      parseInt(signSlot3.width, 10),
      parseInt(signSlot3.height, 10),
    )

    pdf.html(input, { html2canvas: { scale: 0.75 } }).then(() => {
      pdf.save('test.pdf')
    })
  }

  const renderTable = (page) => {
    if (page.items.length === 0) {
      return ''
    }
    return (
      <table className="raw-table mt-2">
        <thead>
          <tr>
            <th>
              <b>STT</b>
            </th>
            <th>
              <b>Mã sinh viên</b>
            </th>
            <th>
              <b>Họ và tên SV</b>
            </th>
            <th>
              <b>Ngày sinh</b>
            </th>
            <th>
              <b>Điểm</b>
            </th>
            <th>
              <b>Ghi chú</b>
            </th>
          </tr>
        </thead>
        <tbody>
          {page.items.map((r) => (
            <tr key={r.index}>
              <td>{r.index}</td>
              <td>{getString(r, 'student.code')}</td>
              <td>
                <div className="d-flex justify-content-between pe-1 ps-1">
                  <span>
                    {getString(r, 'student.fullName')
                      .split(' ')
                      .slice(
                        0,
                        getString(r, 'student.fullName').split(' ').length - 1,
                      )
                      .join(' ')}
                  </span>
                  <span>
                    {
                      getString(r, 'student.fullName').split(' ')[
                        getString(r, 'student.fullName').split(' ').length - 1
                      ]
                    }
                  </span>
                </div>
              </td>
              <td>{getString(r, 'student.dateOfBirth')}</td>
              <td>{r.conclusionPoint}</td>
              <td>
                {r.status === evaluationStatus.Canceled
                  ? r.reasonForCancellation
                  : r.classification}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const renderFooter = () => (
    <div>
      <div>
        Tổng cộng danh sách này có {itemsLength} sinh viên được đánh giá rèn
        luyện
      </div>

      <div className="d-flex justify-content-between mt-3">
        <div className="text-center">
          <div>
            <b>LỚP TRƯỞNG</b>
          </div>
          <div className="mt-2 mb-2">
            <i id="signSlot1">Đã ký điện tử</i>
          </div>
          <div>Nguyen Xuan Hoang Sang</div>
        </div>

        <div className="text-center">
          <div>
            <b>CỐ VẤN HỌC TẬP</b>
          </div>
          <div className="mt-2 mb-2">
            <i id="signSlot2">Đã ký điện tử</i>
          </div>
          <div>Nguyen Xuan Hoang Sang</div>
        </div>

        <div className="text-center">
          <div>
            <b>TRƯỞNG KHOA/NGÀNH</b>
          </div>
          <div className="mt-2 mb-2">
            <i id="signSlot3">Đã ký điện tử</i>
          </div>
          <div>Nguyen Xuan Hoang Sang</div>
        </div>
      </div>
    </div>
  )

  const renderHeader = () => (
    <div>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <div className="me-4">
            <img id="logo" src={logo} width={50} alt="img" />
          </div>
          <div className="text-center">
            <div>Trường Đại Học Sài Gòn</div>
            <div>Phòng Công Tác Sinh Viên</div>
            <div> -o0o- </div>
          </div>
        </div>

        <div className="text-end">
          <div>Tốt: 4</div>
          <div>Khá: 4</div>
          <div>TB: 4</div>
          <div>Yếu: 4</div>
        </div>
      </div>

      <div className="text-center mt-2">
        <div>
          <b>Bảng Ghi Điểm Rèn Luyện</b>
        </div>
        <div>Học kỳ 1 - Năm học 2019 - 2020</div>
      </div>

      <div className="mt-2">
        <div>
          <b>
            Lớp: Đại học chính quy - ngành Công Nghệ Thông Tin - Khóa 17
            (DCT1171)
          </b>
        </div>
        <div>
          <b>Khoa: Công Nghệ Thông Tin - Công Nghệ Thông Tin</b>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div
        className="d-flex align-items-center mb-2 flex-wrap"
        style={{ width: a4.width }}
      >
        <Button onClick={exportToPDF} type="primary" className="me-2">
          <i className="fas fa-download me-2" />
          TẢI XUỐNG
        </Button>
        <div className="d-flex align-items-center">
          <Switch
            onChange={(checked) => setIsFilterValidTicket(checked)}
            checked={isFilterValidTicket}
            className="me-2"
          />
          CHỈ LẤY SINH VIÊN CÓ ĐIỂM
        </div>
      </div>

      <div id="pdf-element">
        {itemsLength > 0 ? (
          pages.map((p) => (
            <div
              key={p.numPage}
              style={{
                width: a4.width,
                height: a4.height,
                padding: a4.padding,
                fontSize: a4.fontSize,
                border: '1px solid lightgray',
              }}
            >
              <div>
                {p.numPage === 1 && renderHeader()}

                {renderTable(p)}

                {p.numPage === pages.length && renderFooter()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">
            <i>Rỗng</i>
          </div>
        )}
      </div>
    </div>
  )
}

ClassStatisticExport.propTypes = {
  evaluations: arrayOf(objectOf(any)).isRequired,
}

export default ClassStatisticExport
