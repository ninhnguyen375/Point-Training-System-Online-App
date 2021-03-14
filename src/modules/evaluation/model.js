export const MODULE_NAME = 'evaluation'
export const disableEvaluationItems = [2, 3, 4, 5, 6, 7, 8, 9, 10]
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
      id: 1, // id riêng, ko liên quan tới DB
      maxPoint: 20,
      point: 20,
      isAnotherItem: true,
      currentPoint: 0,
      items: [
        {
          id: 1, // id của item trong DB
          title:
            'Tham gia hoạt động văn hóa, văn nghệ, TDTT, phòng chống TNXH…',
          point: 5,
          parentId: 1, // id riêng, ko liên quan DB
        },
      ],
    },
  ],
}
