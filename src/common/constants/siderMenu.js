import { ROLE } from '../../modules/user/model'

export default {
  [ROLE.student]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'evaluation-list-of-student',
          iconClass: 'fas fa-copy',
          title: 'Phiếu Của Bạn',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-list-alt',
          title: 'Đánh Giá Rèn Luyện',
        },
        {
          key: 'evaluation-list-of-class',
          iconClass: 'fas fa-copy',
          title: 'Danh Sách Phiếu Của Lớp',
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
          title: 'Phiếu Của Bạn',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-list-alt',
          title: 'Đánh Giá Rèn Luyện',
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Danh Sách Phiếu Của Lớp',
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
          title: 'Danh Sách Phiếu Của Lớp',
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
          title: 'Duyệt Phiếu Rèn Luyện',
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
          title: 'Bắt Đầu Đợt Đánh Giá',
        },
        {
          key: 'evaluation-batch',
          iconClass: 'fas fa-copy',
          title: 'Đợt Đánh Giá Đã Tạo',
        },
        {
          key: 'evaluation',
          iconClass: 'fas fa-copy',
          title: 'Phiếu Của Lớp Quá Hạn',
        },
      ],
    },
    {
      itemGroup: 'Quản Lý',
      items: [
        {
          key: 'evaluation-batch/detail',
          iconClass: 'fas fa-copy',
          title: 'DS Phiếu Rèn Luyện',
        },
        {
          key: 'student',
          iconClass: 'fas fa-user-graduate',
          title: 'Sinh Viên',
        },
        {
          key: 'student-class',
          iconClass: 'fas fa-suitcase',
          title: 'Danh Sách Lớp',
        },
      ],
    },
    {
      itemGroup: 'Nhập Liệu',
      items: [
        {
          key: 'student-class/import',
          iconClass: 'fas fa-file-import',
          title: 'Nhập Lớp',
        },
        {
          key: 'student/import',
          iconClass: 'fas fa-file-import',
          title: 'Nhập Sinh Viên',
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
          title: 'Tài Khoản Quản Lý',
        },
        {
          key: 'employee',
          iconClass: 'fas fa-users',
          title: 'Tài Khoản Nhân Viên',
        },
        {
          key: 'deputydean',
          iconClass: 'fas fa-users',
          title: 'Tài Khoản Phó Khoa',
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
          title: 'Bảng Điều Khiển',
        },
      ],
    },
  ],
}
