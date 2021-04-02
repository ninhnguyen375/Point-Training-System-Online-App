/* eslint-disable new-cap */
import { Button } from 'antd'
import jsPDF from 'jspdf'
import React from 'react'
import logo from '../assets/images/sgu-logo.png'
import '../assets/fonts/times-normal'
import '../assets/fonts/timesi-normal'
import '../assets/fonts/timesbd-normal'
import '../assets/fonts/timesbi-normal'

const TestExportPDF = () => {
  const pdf = new jsPDF({ unit: 'px', format: 'a4', userUnit: 'px' })
  pdf.setFont('times')
  pdf.setFont('timesi')
  pdf.setFont('timesbd')
  pdf.setFont('timesbi')

  const a4 = {
    width: 595,
    height: 842,
    padding: 59,
    fontSize: 12,
  }

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
    console.log(signSlot1.x, signSlot1.y, signSlot1.width, signSlot1.height)
    // eslint-disable-next-line no-console
    console.log(signSlot2.x, signSlot2.y, signSlot2.width, signSlot2.height)
    // eslint-disable-next-line no-console
    console.log(signSlot3.x, signSlot3.y, signSlot3.width, signSlot3.height)
    pdf.html(input, { html2canvas: { scale: 0.75 } }).then(() => {
      pdf.save('test.pdf')
    })
  }

  return (
    <div style={{ height: '100vh', overflow: 'auto' }}>
      <Button
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
        }}
        onClick={exportToPDF}
      >
        <i className="fas fa-download me-2" />
        TẢI XUỐNG
      </Button>

      <div id="pdf-element">
        <div
          style={{
            width: a4.width,
            height: a4.height,
            padding: a4.padding,
            fontSize: a4.fontSize,
            border: '1px solid lightgray',
          }}
        >
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
                <b>Khoa: Cong Nghe Thong Tin - Cong Nghe Thong Tin</b>
              </div>
            </div>

            <table className="raw-table mt-2">
              <thead>
                <tr>
                  <th>
                    <b>STT</b>
                  </th>
                  <th>
                    <b>MSSV</b>
                  </th>
                  <th>
                    <b>Ngay Sinh</b>
                  </th>
                  <th>
                    <b>Diem</b>
                  </th>
                  <th>
                    <b>Ghi Chu</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                ].map((r) => (
                  <tr key={r}>
                    <td>r</td>
                    <td>r</td>
                    <td>r</td>
                    <td>r</td>
                    <td>r</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              Tong cong danh sach nay co 22 sinh vien duoc danh gia ren luyen
            </div>

            <div className="d-flex justify-content-between mt-3">
              <div className="text-center">
                <div>
                  <b>LOP TRUONG</b>
                </div>
                <div className="mt-2 mb-2">
                  <i id="signSlot1">Đã ký điện tử</i>
                </div>
                <div>Nguyen Xuan Hoang Sang</div>
              </div>

              <div className="text-center">
                <div>
                  <b>CO VAN HOC TAP</b>
                </div>
                <div className="mt-2 mb-2">
                  <i id="signSlot2">Đã ký điện tử</i>
                </div>
                <div>Nguyen Xuan Hoang Sang</div>
              </div>

              <div className="text-center">
                <div>
                  <b>TRUONG KHOA/NGANH</b>
                </div>
                <div className="mt-2 mb-2">
                  <i id="signSlot3">Đã ký điện tử</i>
                </div>
                <div>Nguyen Xuan Hoang Sang</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestExportPDF
