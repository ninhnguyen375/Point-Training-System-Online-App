import { Button, Card, Divider, notification, Select, } from 'antd'
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
  const [yearId, setYearId] = useState(null)
  const [semesterId, setSemesterId] = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [activeBatch, setActiveBatch] = useState(null)
  const [counter, setCounter] = useState({})
  const [evaluationBatches, setEvaluationBatches] = useState([])
  const [progressString, setProgressString] = useState('')

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

      if (!yearId && !semesterId) {
        // default active select batch
        const currentActive = getCurrentActive(data)
        if (currentActive) {
          setYearId(currentActive.year.id)
          setSemesterId(currentActive.semester.id)
          setActiveBatch(currentActive)
        }
      }
    } catch (err) {
      notification.info({
        message: 'Chưa có đợt đánh giá',
      })
    }
  }, [])

  useEffect(() => {
    getEvaluationBatch()
  }, [getEvaluationBatch])

  const applyChart = (data) => {
    let ctx = document.getElementById('chart')

    if (ctx === undefined || ctx === null) {
      return
    }

    ctx = ctx.getContext('2d')

    const config = {
      type: 'pie',
      data: {
        labels: ['Xuất sắc', 'Tốt', 'Khá', 'Trung bình', 'Yếu', 'Kém', 'Phiếu bị hủy'],
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
              'rgba(117, 138, 138, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(117, 138, 138, 1)',
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
            display: true,
            text: 'XẾP LOẠI',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const { label, parsed, dataset } = context
                
                const sumEvaluations = dataset.data.reduce((total, item) => {
                  return total + item 
                }, 0)

                const percentage = ((parsed / sumEvaluations) * 100).toFixed(1);

                return [` ${label}: ${parsed}`, ` Tỉ lệ: ${percentage}%`]
              },
            }
          }
        },
      },
    }

    if (
      window.statisticChart !== undefined &&
      window.statisticChart !== null
    ) {
      window.statisticChart.destroy();
    }

    window.statisticChart = new window.Chart(ctx, config);
  }

  // const getCurrentActiveEvaluations = useCallback(async () => {
  //   try {
  //     let batches = await getEvaluationBatchListService()
  //     batches = batches.data.data
  //     const currentActive = batches.find((item) => item.isInDeadline)

  //     if (
  //       !currentActive ||
  //       !currentActive.year.id ||
  //       !currentActive.semester.id
  //     ) {
  //       return
  //     }

  //     setActiveBatch(currentActive)

  //     // get evaluations
  //     const yearId = currentActive.year.id
  //     const semesterId = currentActive.semester.id
  //     const { data } = await getEvaluationsService({
  //       yearId,
  //       semesterId,
  //     })

  //     setEvaluations(data.data)

  //     // counter
  //     for (let i = 0; i < classification.length; i += 1) {
  //       const item = classification[i]
  //       counter[item] = data.data.reduce(
  //         (prev, curr) => (curr.classification === item ? prev + 1 : prev),
  //         0,
  //       )
  //     }
  //     const calculatedCounter = {
  //       [classification[0]]: counter[classification[0]],
  //       [classification[1]]: counter[classification[1]],
  //       [classification[2]]: counter[classification[2]],
  //       [classification[3]]: counter[classification[3]],
  //       [classification[4]]: counter[classification[4]],
  //       [classification[5]]: counter[classification[5]],
  //     }

  //     setCounter(calculatedCounter)

  //     // progress
  //     const doneItems = data.data.filter(
  //       (e) =>
  //         e.status === evaluationStatus.Done ||
  //         e.status === evaluationStatus.Canceled,
  //     )

  //     setProgressString(`${doneItems.length}/${data.data.length}`)

  //     // chart
  //     applyChart(
  //       Object.keys(calculatedCounter).map((key) => calculatedCounter[key]),
  //     )
  //   } catch (err) {
  //     notification.info({
  //       message: 'Chưa có đợt đánh giá',
  //       description: (
  //         <div>
  //           Hãy bắt đầu đợt đánh giá mới.
  //           <br />
  //           <Button
  //             type="primary"
  //             size="small"
  //             className="mt-2"
  //             onClick={() => history.push('/evaluation/create')}
  //           >
  //             <i className="fas fa-play-circle me-2" />
  //             BẮT ĐẦU NGAY
  //           </Button>
  //         </div>
  //       ),
  //     })
  //   }
  // }, [])

  // useEffect(() => {
  //   getCurrentActiveEvaluations()
  // }, [getCurrentActiveEvaluations])

  const getEvaluations = useCallback(async () => {
    if (!yearId || !semesterId) {
      return
    }

    try {
      const { data } = await getEvaluationsService({
        yearId,
        semesterId,
      })

      setEvaluations(data.data)

      // counter
      for (let i = 0; i < classification.length; i += 1) {
        const item = classification[i]

        if (item !== classification[6]) { // classification[6] is 'Phiếu bị hủy'
          counter[item] = data.data.reduce(
            (prev, curr) => (
              curr.status !== evaluationStatus.Canceled  &&
              curr.classification === item ?
                prev + 1 : 
                prev
            ),
            0,
          )
        } else {
          counter[item] = data.data.reduce(
            (prev,curr) => (
              curr.status === evaluationStatus.Canceled ?
                prev + 1 :
                prev
            ),
            0,
          )
        }
      }
      const calculatedCounter = {
        [classification[0]]: counter[classification[0]],
        [classification[1]]: counter[classification[1]],
        [classification[2]]: counter[classification[2]],
        [classification[3]]: counter[classification[3]],
        [classification[4]]: counter[classification[4]],
        [classification[5]]: counter[classification[5]],
        [classification[6]]: counter[classification[6]],
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
      console.log(err)
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
  }, [yearId, semesterId])

  useEffect(() => {
    getEvaluations()
  }, [getEvaluations])

  const isEvaluationExistsCondition = 
    evaluations && 
    !!evaluations.find((e) => 
      (e.classification !== null || e.status === evaluationStatus.Canceled)
    )

  const getCurrentBatchActive = useCallback((batches = []) => {
    if (batches.length === 0) {
      return ''
    }

    const currentActive = batches.find(
      (evaluationBatch) =>
        evaluationBatch.semester.id === semesterId &&
        evaluationBatch.year.id === yearId,
    )

    if (
      !currentActive ||
      !currentActive.year.id ||
      !currentActive.semester.id
    ) {
      return
    }

    setActiveBatch(currentActive)
  }, [yearId, semesterId])

  useEffect(() => {
    getCurrentBatchActive(evaluationBatches)
  }, [getCurrentBatchActive])

  const renderSelectBatch = (batches = []) => {
    if (batches.length === 0) {
      return ''
    }

    return (
      <div className="semester-year col-lg-2">
        <div>Chọn Năm học và Học kỳ:</div>
        <Select
          onChange={(v) => {
            setYearId(parseInt(v.split('-')[0], 10))
            setSemesterId(parseInt(v.split('-')[1], 10))
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
        {renderSelectBatch(evaluationBatches)}
        {evaluations && evaluations[0] && (
          <div className="d-flex align-items-center flex-wrap mt-3">
            <div style={{ marginRight: 100 }}>
              <div
                aria-hidden="true"
                onClick={() => history.push(`/evaluation-batch/detail?yearId=${yearId}&semesterId=${semesterId}`)}
                className="statistic-card"
              >
                <div className="d-flex statistic-card__top">
                  <i className="fas fa-chart-bar" />
                  <div className="w-100 statistic-card__top__right">
                    <div className="d-flex statistic-card__top__right__title">
                      {activeBatch
                        ? `HK${activeBatch.semester.id} - ${activeBatch.year.title}`
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
              className="canvas-padding"
              style={{
                width: 300,
                height: 250,
                display: isEvaluationExistsCondition ? 'flex' : 'none',
                alignItems: 'center',
                paddingTop: 40,
              }}
            >
              {isEvaluationExistsCondition && <canvas width="250" height="250" id="chart" />}
            </div>
          </div>
        )}

        <Divider className={isEvaluationExistsCondition && "dashboard-divider"} />

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
