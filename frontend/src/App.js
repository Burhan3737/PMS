import logo from "./logo.svg";
import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import api from "./reduxRelated/middleware/api";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import React from "react";
import { useState } from "react";
/* import { BrowserRouter as Router} from 'react-router-dom'; */

import rootReducer from "./reduxRelated/reducer/index.js";
import "react-table/react-table.css";
import "react-day-picker/lib/style.css";
import "react-dual-listbox/lib/react-dual-listbox.css";
import moment from "moment-timezone";
let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore);
let store = createStoreWithMiddleware(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export const StatusContext = React.createContext();





function App() {

  const [statusExports, setStatusExports] = useState([])
  //console.log(process.env.NODE_PATH)

  return (
    <div className="App">

      <Provider store={store}>

        <StatusContext.Provider value={{ statusExports, setStatusExports }}>
          <MainPage />
        </StatusContext.Provider>

      </Provider>
    </div>
  );
}

export default App;
