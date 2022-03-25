import { createStore, combineReducers } from 'redux';
import { Collapse } from './reducers/collapse';
import { GlobalLoading } from './reducers/globalLoading';
// redux 状态持久化
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 合并多个 reducers
const reducer = combineReducers({
  Collapse,
  GlobalLoading
})

// 持久化配置：key：本地存储键名，storage：使用 storage
const persistConfig = {
  key: 'news-system',
  storage,
  blacklist: ['GlobalLoading']
}

// 使用 redux-persist 里的方法对 store 层层包装
const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer)
const persistor = persistStore(store)

export { store, persistor }