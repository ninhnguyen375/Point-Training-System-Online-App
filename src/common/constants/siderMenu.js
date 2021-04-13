import { ROLE } from '../../modules/user/model'

export default {
  [ROLE.student]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'evaluation-list-of-student',
          iconClass: 'fas fa-copy',
          title: 'Phiếu của bạn',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-list-alt',
          title: 'Đánh giá rèn luyện',
        },
        {
          key: 'evaluation-list-of-class',
          iconClass: 'fas fa-copy',
          title: 'Danh sách phiếu của lớp',
        },
      ],
    },
  ],
  [ROLE.monitor]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'evaluation-list-of-student',
          iconClass: 'fas fa-copy',
          title: 'Phiếu của bạn',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-list-alt',
          title: 'Đánh giá rèn luyện',
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Danh sách phiếu của lớp',
        },
      ],
    },
  ],
  [ROLE.lecturer]: [
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Danh sách phiếu của lớp',
        },
      ],
    },
  ],
  [ROLE.deputydean]: [
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Duyệt phiếu rèn luyện',
        },
      ],
    },
  ],
  [ROLE.employee]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'evaluation/create',
          iconClass: 'fas fa-play-circle',
          title: 'Bắt đầu đợt đánh giá',
        },
        {
          key: 'evaluation-batch',
          iconClass: 'fas fa-calendar-week',
          title: 'Đợt đánh giá đã tạo',
        },
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Phiếu của lớp quá hạn',
        },
        {
          key: 'evaluation-batch/detail',
          iconClass: 'fas fa-chart-bar',
          title: 'Thống kê rèn luyện',
        },
      ],
    },
    {
      itemGroup: 'Quản Lý',
      items: [
        {
          key: 'student',
          iconClass: 'fas fa-user-graduate',
          title: 'Sinh viên',
        },
        {
          key: 'lecturer',
          iconClass: 'fas fa-user-graduate',
          title: 'Giảng viên',
        },
        {
          key: 'student-class',
          iconClass: 'fas fa-suitcase',
          title: 'Danh sách lớp',
        },
      ],
    },
    {
      itemGroup: 'Nhập Liệu',
      items: [
        {
          key: 'student-class/import',
          iconClass: 'fas fa-file-import',
          title: 'Nhập lớp',
        },
        {
          key: 'student/import',
          iconClass: 'fas fa-file-import',
          title: 'Nhập sinh viên',
        },
      ],
    },
  ],
  [ROLE.manager]: [
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'manager',
          iconClass: 'fas fa-users',
          title: 'Tài khoản quản lý',
        },
        {
          key: 'employee',
          iconClass: 'fas fa-users',
          title: 'Tài khoản nhân viên',
        },
        {
          key: 'deputydean',
          iconClass: 'fas fa-users',
          title: 'Tài khoản phó khoa',
        },
      ],
    },
  ],
  default: [
    {
      itemGroup: 'Tổng quan',
      items: [
        {
          key: 'dashboard',
          iconClass: 'fas fa-home',
          title: 'Bảng điều khiển',
        },
      ],
    },
  ],
}
