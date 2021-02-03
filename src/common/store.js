import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../modules/rootReducer'

const persistConfig = {
  key: 'training-point-system',
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: composeWithDevTools,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
      ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      ignoredPaths: ['items.dates'],
    },
  }),
})

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('../modules/rootReducer', () =>
    store.replaceReducer(rootReducer),
  )
}

export const persistor = persistStore(store)
