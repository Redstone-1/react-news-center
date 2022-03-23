import Router from "./router/index";
import { Provider } from 'react-redux';
import store from "./redux/store";
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router></Router>
      </div>
    </Provider>
  );
}

export default App;
