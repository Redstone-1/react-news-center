// 控制全局loading
export const GlobalLoading = (prevState = {
  isLoading: false
}, action) => {
  let { type, payload } = action
  switch (type) {
    case "changeGlobalLoading":
      let newState = {...prevState}
      newState.isLoading = payload
      return newState
    default:
      return prevState
  }
}