import { combineReducers } from "redux";
import loginReducer from "./loginReducer.js";

import ajaxStatusReducer from "./ajaxStatusReducer.js";
import { commonReducers } from "reduxCURD/reducer.js";
import languageHelperReducer from "./languageHelperReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";

const rootReducer = combineReducers({
  ...commonReducers,
  loginReducer,
  forgotPasswordReducer,
  
  ajaxStatusReducer,

  languageHelperReducer,
});

export default rootReducer;
