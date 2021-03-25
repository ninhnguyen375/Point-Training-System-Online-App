import {ROLE} from '../../modules/user/model'

export default {
  [ROLE.student]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'dashboard',
          iconClass: 'fas fa-home',
          title: 'Bảng Điều Khiển',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-edit',
          title: 'Tự Đánh Giá Rèn Luyện',
        },
      ],
    },
  ],
  [ROLE.monitor]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'dashboard',
          iconClass: 'fas fa-home',
          title: 'Bảng Điều Khiển',
        },
        {
          key: 'make-evaluation',
          iconClass: 'fas fa-edit',
          title: 'Tự Đánh Giá Rèn Luyện',
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-file-alt',
          title: 'Danh Sách Phiếu Của Lớp',
        },
      ],
    },
  ],
  [ROLE.lecturer]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'dashboard',
          iconClass: 'fas fa-home',
          title: 'Bảng Điều Khiển',
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-file-alt',
          title: 'Danh Sách Phiếu Của Lớp',
        },
      ],
    },
  ],
  [ROLE.employee]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'dashboard',
          iconClass: 'fas fa-home',
          title: 'Bảng Điều Khiển',
        },
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
