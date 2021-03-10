/* eslint-disable no-plusplus */
export const orderStatus = {
  part1: [
    { key: 'waiting-quotation', name: 'Chờ báo giá' },
    { key: 'dealing', name: 'Trao đổi nội dung báo giá' },
    { key: 'quotation-completed', name: 'Đã báo giá' },
    {
      key: 'order-confirmed',
      name: 'Đã xác nhận đặt hàng',
      isImportant: true,
      isExtra: true,
      titleWarn: 'Bạn có chắc chắn xác nhận đơn hàng này',
    },
    {
      key: 'canceled',
      name: 'Đã hủy',
      isImportant: true,
      isExtra: true,
      titleWarn: 'Bạn có chắc chắn hủy đơn hàng này',
    },
  ],
  part2: [
    { key: 'order-confirmed', name: 'Đã xác nhận đặt hàng' },
    { key: 'order-preparing', name: 'Đang thực hiện đơn hàng' },
    { key: 'shipping', name: 'Chuẩn bị giao hàng' },
    { key: 'exported', name: 'Đã giao hàng' },
    {
      key: 'done',
      name: 'Hoàn tất',
      isImportant: true,
      isExtra: true,
      titleWarn: 'Bạn có chắc chắn hoàn tất đơn hàng này',
    },
    {
      key: 'canceled',
      name: 'Đã hủy',
      isImportant: true,
      isExtra: true,
      titleWarn: 'Bạn có chắc chắn hủy đơn hàng này',
    },

  ],
  part3: [
    { key: 'done', name: 'Hoàn tất' },
  ],
}

export const indentifyPart = (status) => {
  for (let i = 0; i < orderStatus.part1.length; i++) { if (status === orderStatus.part1[i].key && !orderStatus.part1[i].isExtra) return { part: 'part1', item: orderStatus.part1[i] } }
  for (let i = 0; i < orderStatus.part2.length; i++) { if (status === orderStatus.part2[i].key && !orderStatus.part2[i].isExtra) return { part: 'part2', item: orderStatus.part2[i] } }
  for (let i = 0; i < orderStatus.part3.length; i++) { if (status === orderStatus.part3[i].key && !orderStatus.part3[i].isExtra) return { part: 'part3', item: orderStatus.part3[i] } }
  return null
}

export const getListOptionFollowPart = (partKey, currentValue) => {
  switch (partKey) {
    case 'part1':
      if (currentValue !== 'quotation-completed') return orderStatus.part1.filter((i) => i.key !== 'order-confirmed')
      return orderStatus.part1
    case 'part2':
      if (currentValue !== 'exported') return orderStatus.part2.filter((i) => i.key !== 'done')
      return orderStatus.part2
    case 'part3':
      return orderStatus.part3
    default:
      return []
  }
}

export default null
