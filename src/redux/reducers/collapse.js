// 控制左侧菜单隐藏显示的状态
export const Collapse = (prevState = {
  isCollapse: false
}, action) => {
  let { type } = action
  switch (type) {
    case "changeCollapse":
      let newState = {...prevState}
      newState.isCollapse = !newState.isCollapse
      return newState
    default:
      return prevState
  }
}