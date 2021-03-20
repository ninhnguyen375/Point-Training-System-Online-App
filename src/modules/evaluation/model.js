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
  SubmitEvaluationStatus: 'Sinh viên đã nộp',
  ConfirmEvaluationStatus: 'Lớp trưởng đã xác nhận',
  AcceptEvaluationStatus: 'Giảng viên đã chấp nhận',
}
