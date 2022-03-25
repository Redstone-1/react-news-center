import Router from "./router/index";
import { Provider } from 'react-redux';
import { store } from "./redux/store";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store'
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <div className="App">
          <Router></Router>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
