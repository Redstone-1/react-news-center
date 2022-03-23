import { createStore, combineReducers } from 'redux';
import { Collapse } from './reducers/collapse';

// 合并多个 reducers
const reducer = combineReducers({
  Collapse
})

const store = createStore(reducer)

export default store