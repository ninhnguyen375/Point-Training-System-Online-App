/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import React, { useEffect, useState } from 'react'
import html2canvas from 'html2canvas'
import JsPDF from 'jspdf'
import { Button } from 'antd'
import * as FileSaver from 'file-saver'
import logo from '../assets/images/sgu-logo.png'

const k = 0.70710437710438

const ClassStatistic = () => {
  const [size, setSize] = useState({})

  const printDocument = async () => {
    const pdf = new JsPDF('p', 'px', [size.width, size.height])
    pdf.deletePage(1)
    for (let i = 0; i < 2; i++) {
      const input = document.getElementById(`page${i}`)
      const canvas = await html2canvas(input)
      const imgData = canvas.toDataURL('image/png')

      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, 0, size.width, size.height)
    }

    const blob = pdf.output('blob')
    FileSaver.saveAs(blob, 'test.pdf')

    setTimeout(() => {
      window.close()
    }, 500)
  }

  useEffect(() => {
    const width = window.innerHeight * k
    const height = window.innerHeight

    for (let i = 0; i < 2; i++) {
      const input = document.getElementById(`page${i}`)
      input.style.width = `${width}px`
      input.style.height = `${height}px`
      input.style.fontSize = `${width / 50}px`
      input.style.padding = `${width / 10}px`
      input.style.border = '1px solid lightgray'
      document.getElementById('logo').style.width = `${width / 15}px`
    }

    setSize({ width, height })
  }, [])

  return (
    <div>
      <Button onClick={printDocument}>click</Button>
      <div
        id="page0"
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center">
              <div className="me-4">
                <img id="logo" src={logo} alt="img" />
              </div>
              <div className="text-center">
                <div>Truong Dai Hoc Sai Gon</div>
                <div>Phong Cong Tac Sinh Vien</div>
                <div>-o0o-</div>
              </div>
            </div>

            <div className="text-end">
              <div>Tot: 4</div>
              <div>Kha: 4</div>
              <div>TB: 4</div>
              <div>Yeu: 4</div>
            </div>
          </div>

          <div className="text-center mt-2">
            <div>
              <b>Bang Ghi Diem Ren Luyen</b>
            </div>
            <div>Hoc ky 1 - Nam hoc 2019 - 2020</div>
          </div>

          <div className="mt-2">
            <div>
              <b>
                Lop: Dai hoc chinh quy - nganh Cong Nghe Thong Tin - Khoa 17
                (DCT1171)
              </b>
            </div>
            <div>
              <b>Khoa: Cong Nghe Thong Tin - Cong Nghe Thong Tin</b>
            </div>
          </div>

          <table className="raw-table mt-2">
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
            ].map(() => (
              <tr>
                <td>r</td>
                <td>r</td>
                <td>r</td>
                <td>r</td>
                <td>r</td>
              </tr>
            ))}
          </table>
          <div>
            Tong cong danh sach nay co 22 sinh vien duoc danh gia ren luyen
          </div>

          <div className="d-flex justify-content-between mt-3">
            <div className="text-center">
              <div>LOP TRUONG</div>
              <div>Da Ky</div>
              <div>Nguyen Xuan Hoang Sang</div>
            </div>

            <div className="text-center">
              <div>CO VAN HOC TAP</div>
              <div>Da Ky</div>
              <div>Nguyen Xuan Hoang Sang</div>
            </div>

            <div className="text-center">
              <div>TRUONG KHOA/NGANH</div>
              <div>Da Ky</div>
              <div>Nguyen Xuan Hoang Sang</div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="page1"
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div>1234124</div>
      </div>
    </div>
  )
}

export default ClassStatistic
