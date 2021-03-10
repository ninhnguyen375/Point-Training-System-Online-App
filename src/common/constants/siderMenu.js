import { ROLE } from '../../modules/user/model'

export default {
  [ROLE.student]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'overview',
          iconClass: 'fas fa-home',
          title: 'Tổng Quan',
          children: [
            {
              key: 'dashboard',
              title: 'Bảng Điều Khiển',
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          key: 'data',
          iconClass: 'fas fa-user',
          title: 'Thông Tin',
          children: [
            {
              key: 'profile',
              title: 'Thông Tin Cá Nhân',
            },
          ],
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'admin',
          iconClass: 'fas fa-user',
          title: 'Quản lý Admin',
        },
        {
          key: 'import-list',
          iconClass: 'fas fa-file-import',
          title: 'Phiếu Nhập',
        },
      ],
    },
  ],
  [ROLE.admin]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'overview',
          iconClass: 'fas fa-home',
          title: 'Tổng Quan',
          children: [
            {
              key: 'dashboard',
              title: 'Bảng Điều Khiển',
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          key: 'data',
          iconClass: 'fas fa-user',
          title: 'Thông Tin',
          children: [
            {
              key: 'profile',
              title: 'Thông Tin Cá Nhân',
            },
          ],
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'product-manager',
          iconClass: 'fas fa-box',
          title: 'Sản Phẩm',
          children: [
            {
              key: 'category',
              iconClass: 'far fa-list-alt',
              title: 'Danh Mục',
            },
            {
              key: 'product',
              iconClass: 'fas fa-cubes',
              title: 'Sản Phẩm',
            },
            {
              key: 'import-list',
              iconClass: 'fas fa-file',
              title: 'Phiếu Nhập',
            },
            {
              key: 'export-list',
              iconClass: 'fas fa-file',
              title: 'Phiếu Xuất',
            },
            {
              key: 'import',
              iconClass: 'fas fa-file',
              title: 'Nhập kho',
            },
            {
              key: 'export',
              iconClass: 'fas fa-file',
              title: 'Xuất kho',
            },
          ],
        },
        {
          key: 'customer-manager',
          iconClass: 'fas fa-user',
          title: 'Khách Hàng',
          children: [
            {
              key: 'order',
              iconClass: 'fas fa-border-all',
              title: 'Đơn hàng',
            },
            {
              key: 'customer',
              iconClass: 'fas fa-user',
              title: 'Khách hàng',
            },
          ],
        },
        {
          key: 'seller-manager',
          iconClass: 'fas fa-user',
          title: 'Seller',
          children: [
            {
              key: 'seller',
              iconClass: 'fas fa-user',
              title: 'Quản lý Seller',
            },
            {
              key: 'seller-reward-history',
              iconClass: 'fas fa-history',
              title: 'Lịch Sử Thưởng',
            },
          ],
        },
        {
          key: 'blog-manager',
          iconClass: 'fab fa-blogger-b',
          title: 'Blog',
          children: [
            {
              key: 'blog-category',
              iconClass: 'fas fa-cubes',
              title: 'Danh Mục Blog',
            },
            {
              key: 'blog-post',
              iconClass: 'fab fa-blogger-b',
              title: 'Bài Đăng',
            },
          ],
        },
        {
          key: 'other-manager',
          iconClass: 'fas fa-tasks',
          title: 'Khác',
          children: [
            {
              key: 'banner',
              iconClass: 'far fa-images',
              title: 'Quản lý Banner',
            },
            {
              key: 'front-page',
              iconClass: 'fas fa-pager',
              title: 'Danh Sách Trang',
            },
          ],
        },
      ],
    },
    {
      itemGroup: 'Khác',
      items: [
        {
          key: 'banner',
          iconClass: 'far fa-images',
          title: 'Quản lý Banner',
        },
        {
          key: 'front-page',
          iconClass: 'fas fa-pager',
          title: 'Danh Sách Trang',
        },
      ],
    },
  ],
  [ROLE.seller]: [
    {
      itemGroup: 'Tổng Quan',
      items: [
        {
          key: 'overview',
          iconClass: 'fas fa-home',
          title: 'Tổng Quan',
          children: [
            {
              key: 'dashboard',
              title: 'Bảng Điều Khiển',
            },
          ],
        },
      ],
    },
    {
      items: [
        {
          key: 'data',
          iconClass: 'fas fa-user',
          title: 'Thông Tin',
          children: [
            {
              key: 'profile',
              title: 'Thông Tin Cá Nhân',
            },
            {
              key: 'seller-reward-history',
              iconClass: 'fas fa-history',
              title: 'Lịch Sử Thưởng',
            },
          ],
        },
      ],
    },
    {
      itemGroup: 'Quản lý',
      items: [
        {
          key: 'customer-manager',
          iconClass: 'fas fa-user',
          title: 'Khách Hàng',
          children: [
            {
              key: 'order',
              iconClass: 'fas fa-border-all',
              title: 'Đơn hàng',
            },
            {
              key: 'customer',
              iconClass: 'fas fa-user',
              title: 'Khách hàng',
            },
          ],
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
