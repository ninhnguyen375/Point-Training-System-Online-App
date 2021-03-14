import { ROLE } from '../../modules/user/model'

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
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'evaluation',
          iconClass: 'fas fa-file-alt',
          title: 'Phiếu Điểm Rèn Luyện',
        },
        {
          key: 'import-list',
          iconClass: 'fas fa-file-import',
          title: 'Phiếu Nhập',
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
