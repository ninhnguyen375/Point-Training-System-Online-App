export const MODULE_NAME = 'evaluation'
export const disableEvaluationItems = [2, 3, 4, 5, 6, 7, 8, 9]
export const semesters = [
  {
    id: 1,
    title: 'Học kỳ 1',
  },
  {
    id: 2,
    title: 'Học kỳ 2',
  },
]
const a = {
  studentEvalution: [
    {
      id: 1,
      maxPoint: 20,
      point: 20,
      isAnotherItem: true,
      currentPoint: 0,
      items: [
        {
          id: 1,
          title: 'Tham gia hoạt động văn hóa, văn nghệ, TDTT, phòng chống TNXH…',
          point: 5,
          parentId: 1,
        },
      ],
    },
  ],
}

export const evaluationStatus = {
  NewEvaluationStatus: 'Mới',
  DraftEvaluationStatus: 'Đang lưu nháp',
  SubmitEvaluationStatus: 'Sinh viên đã đánh giá',
  ComplainEvaluationStatus: 'Sinh viên đang khiếu nại kết quả',
  ConfirmEvaluationStatus: 'Lớp trưởng đã xác nhận',
  AcceptEvaluationStatus: 'Giảng viên đã chấp nhận',
}

export const evaluationStatusColor = {
  'Mới': '',
  'Đang lưu nháp': 'gray',
  'Sinh viên đã đánh giá': 'blue',
  'Sinh viên đang khiếu nại kết quả': 'red',
  'Lớp trưởng đã xác nhận': 'lime',
  'Giảng viên đã chấp nhận': 'green',
}