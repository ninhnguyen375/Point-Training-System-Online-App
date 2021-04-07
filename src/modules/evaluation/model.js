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

export const evaluationStatus = {
  NewEvaluationStatus: 'Mới',
  DraftEvaluationStatus: 'Đang lưu nháp',
  SubmitEvaluationStatus: 'Sinh viên đã đánh giá',
  ConfirmEvaluationStatus: 'Lớp trưởng đã xác nhận',
  ComplainWithMonitorAboutEvaluationStatus: 'Đang khiếu nại Lớp trưởng',
  ComplainWithLecturerAboutEvaluationStatus: 'Đang khiếu nại Giảng viên',
  AcceptEvaluationStatus: 'Giảng viên đã chấp nhận',
  CompleteEvalutionStatus: 'Hoàn tất',
  EmployeeSubmitEvaluationStatus: 'Chuyên viên đã đánh giá',
  CancelEvaluationStatus: 'Phiếu bị hủy',
}

export const evaluationStatusColor = {
  Mới: '',
  'Đang lưu nháp': 'gray',
  'Sinh viên đã đánh giá': 'blue',
  'Sinh viên đang khiếu nại kết quả': 'red',
  'Lớp trưởng đã xác nhận': 'geekblue',
  'Giảng viên đã chấp nhận': 'green',
}

export const classification = ['Kém', 'Yếu', 'Trung bình', 'Giỏi']

export const reasonForCancellation = [
  'Không chấm',
  'Nghỉ học',
  'Bảo lưu kết quả',
  'Đình chỉ học tập',
]
