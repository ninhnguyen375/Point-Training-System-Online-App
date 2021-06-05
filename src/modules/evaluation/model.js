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

export const classification = [
  'Xuất sắc',
  'Tốt',
  'Khá',
  'Trung bình',
  'Yếu',
  'Kém',
  'Phiếu bị hủy',
]

export const reasonForCancellation = [
  'Không chấm',
  'Nghỉ học',
  'Bảo lưu kết quả',
  'Đình chỉ học tập',
  'Ra trường',
]

export const a4 = {
  width: 595,
  height: 842,
  padding: 50,
  fontSize: 12,
}

export const evaluationTimelineStatusColor = {
  'Lưu phiếu đánh giá': '#1890ff', // #1890ff is light blue
  'Nộp phiếu đánh giá': '#1890ff',
  'Khiếu nại về kết quả phiếu đánh giá': '#340C6F',
  'Xác nhận phiếu đánh giá': '#1890ff',
  'Chấp nhận phiếu đánh giá': '#1890ff',
  'Hoàn tất phiếu đánh giá': 'green',
  'Hủy phiếu đánh giá': 'red',
  'Phục hồi phiếu đánh giá': 'orange',
}

export const evaluationTimelineStatus = {
  'Lưu phiếu đánh giá': { color: 'blue', icon: 'pencil-alt' }, // #1890ff is light blue
  'Nộp phiếu đánh giá': { color: 'blue', icon: 'paper-plane' },
  'Khiếu nại về kết quả phiếu đánh giá': { color: 'purple', icon: 'clipboard-list' },
  'Xác nhận phiếu đánh giá': { color: 'blue', icon: 'pen-alt' },
  'Chấp nhận phiếu đánh giá': { color: 'blue', icon: 'pen-square' },
  'Hoàn tất phiếu đánh giá': { color: 'green', icon: 'check-circle' },
  'Hủy phiếu đánh giá': { color: 'red', icon: 'ban' },
  'Phục hồi phiếu đánh giá': { color: 'orange', icon: 'window-restore' },
}
