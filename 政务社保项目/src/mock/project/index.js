import Mock from 'mockjs'
import '@/mock/extend'

const projectArr = Mock.mock({
  'list|6': [
    {
      logo: '1',
      desc: '3333'
    }
  ]
}).list

Mock.mock('/project', 'get', () => {
  return projectArr
})
