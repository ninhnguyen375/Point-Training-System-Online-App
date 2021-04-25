import { Button, Card, Divider, notification } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import CustomBreadcrumb from '../common/components/widgets/CustomBreadcrumb'
import MainLayout from '../common/hocs/MainLayout'
import { classification, evaluationStatus } from '../modules/evaluation/model'
import {
  getEvaluationBatchListService,
  getEvaluationsService,
} from '../modules/evaluation/services'

const Dashboard = () => {
  const history = useHistory()
  const [evaluations, setEvaluations] = useState([])
  const [acitveBatch, setAcitveBatch] = useState(null)
  const [counter, setCounter] = useState({})
  const [progressString, setProgressString] = useState('')

  const applyChart = (data) => {
    const ctx = document.getElementById('chart').getContext('2d')
    const config = {
      type: 'pie',
      data: {
        labels: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'Kém'],
        datasets: [
          {
            label: '# of Votes',
            data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: false,
            text: 'XẾP LOẠI',
          },
        },
      },
    }

    window.statisticChart = new window.Chart(ctx, config)
  }

  const getCurrentActiveEvaluations = useCallback(async () => {
    try {
      let batches = await getEvaluationBatchListService()
      batches = batches.data.data
      const currentActive = batches.find((item) => item.isInDeadline)

      if (
        !currentActive ||
        !currentActive.year.id ||
        !currentActive.semester.id
      ) {
        return
      }

      setAcitveBatch(currentActive)

      // get evaluations
      const yearId = currentActive.year.id
      const semesterId = currentActive.semester.id
      const { data } = await getEvaluationsService({
        yearId,
        semesterId,
      })

      setEvaluations(data.data)

      // counter
      for (let i = 0; i < classification.length; i += 1) {
        const item = classification[i]
        counter[item] = data.data.reduce(
          (prev, curr) => (curr.classification === item ? prev + 1 : prev),
          0,
        )
      }
      const calculatedCounter = {
        [classification[0]]: counter[classification[0]],
        [classification[1]]: counter[classification[1]],
        [classification[2]]: counter[classification[2]],
        [classification[3]]: counter[classification[3]],
        [classification[4]]: counter[classification[4]],
        [classification[5]]: counter[classification[5]],
      }

      setCounter(calculatedCounter)

      // progress
      const doneItems = data.data.filter(
        (e) =>
          e.status === evaluationStatus.Done ||
          e.status === evaluationStatus.Canceled,
      )

      setProgressString(`${doneItems.length}/${data.data.length}`)

      // chart
      applyChart(
        Object.keys(calculatedCounter).map((key) => calculatedCounter[key]),
      )
    } catch (err) {
      notification.info({
        message: 'Chưa có đợt đánh giá',
        description: (
          <div>
            Hãy bắt đầu đợt đánh giá mới.
            <br />
            <Button
              type="primary"
              size="small"
              className="mt-2"
              onClick={() => history.push('/evaluation/create')}
            >
              <i className="fas fa-play-circle me-2" />
              BẮT ĐẦU NGAY
            </Button>
          </div>
        ),
      })
    }
  }, [])

  useEffect(() => {
    getCurrentActiveEvaluations()
  }, [getCurrentActiveEvaluations])

  return (
    <MainLayout>
      <CustomBreadcrumb
        items={[
          {
            url: '/dashboard',
            title: 'Bảng Điều Khiển',
            icon: 'fas fa-home',
          },
        ]}
      />
      <Card title={<b>BẢNG ĐIỀU KHIỂN</b>}>
        {evaluations && evaluations[0] && (
          <div className="d-flex align-items-center flex-wrap">
            <div style={{ marginRight: 100 }}>
              <div
                aria-hidden="true"
                onClick={() => history.push('/evaluation-batch/detail')}
                className="statistic-card"
              >
                <div className="d-flex statistic-card__top">
                  <i className="fas fa-chart-bar" />
                  <div className="w-100 statistic-card__top__right">
                    <div className="d-flex statistic-card__top__right__title">
                      {acitveBatch
                        ? `HK${acitveBatch.semester.id} - ${acitveBatch.year.title}`
                        : ''}
                    </div>
                    <div className="statistic-card__top__right__tag">
                      <span className="number">{progressString} </span>
                      <span>HOÀN TẤT</span>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                <div className="d-flex statistic-card__bottom">
                  {counter &&
                    Object.keys(counter).map((key) => (
                      <div key={key}>
                        {key.toUpperCase()}: {counter[key]}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div
              style={{
                width: 300,
                height: 250,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <canvas id="chart" />
            </div>
          </div>
        )}

        <Divider />

        <div className="d-flex flex-wrap">
          <Link to="/evaluation/create">
            <div aria-hidden className="card-box card-box-primary me-4 mb-2">
              <i className="fas fa-play-circle" />
              BẮT ĐẦU ĐỢT ĐÁNH
            </div>
          </Link>
          <Link to="/student-class/import">
            <div aria-hidden className="card-box card-box-primary me-4 mb-2">
              <i className="fas fa-file-import" />
              NHẬP LỚP
            </div>
          </Link>
          <Link to="/student-class/import">
            <div aria-hidden className="card-box card-box-primary me-4 mb-2">
              <i className="fas fa-file-import" />
              NHẬP SINH VIÊN
            </div>
          </Link>
        </div>
      </Card>
    </MainLayout>
  )
}

export default Dashboard
