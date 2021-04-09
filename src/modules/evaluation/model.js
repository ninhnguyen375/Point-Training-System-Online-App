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
  New: 'Mới',
  Draft: 'Đang lưu nháp',
  StudentSubmited: 'Sinh viên đã đánh giá',
  MonitorConfirmed: 'Lớp trưởng đã xác nhận',
  ComplainingMonitor: 'Đang khiếu nại Lớp trưởng',
  ComplainingLecturer: 'Đang khiếu nại Giảng viên',
  ComplainingEmployee: 'Đang khiếu nại Chuyên viên',
  LecturerConfirmed: 'Giảng viên đã chấp nhận',
  EmployeeConfirmed: 'Chuyên viên đã đánh giá',
  Canceled: 'Phiếu bị hủy',
  Done: 'Hoàn tất',
}

export const evaluationStatusColor = {
  Mới: '',
  'Đang lưu nháp': 'gray',
  'Sinh viên đã đánh giá': 'blue',
  'Lớp trưởng đã xác nhận': 'purple',
  'Đang khiếu nại Lớp trưởng': 'red',
  'Đang khiếu nại Giảng viên': 'red',
  'Đang khiếu nại Chuyên viên': 'red',
  'Giảng viên đã chấp nhận': 'cyan',
  'Chuyên viên đã đánh giá': 'cyan',
  'Hoàn tất': 'green',
}

export const classification = ['Giỏi', 'Trung bình', 'Yếu', 'Kém']

export const reasonForCancellation = [
  'Không chấm',
  'Nghỉ học',
  'Bảo lưu kết quả',
  'Đình chỉ học tập',
  'Ra trường',
]
