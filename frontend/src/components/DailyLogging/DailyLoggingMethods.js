import { defaultFormVal } from "./DailyLoggingVars";
import { isJSON } from "../../utils/isJson";
//import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
import moment from "moment";
import 'moment-timezone';
import { utcToZonedTime } from "date-fns-tz";

export function handleAddSessionState() {
  return { form: { ...defaultFormVal }, addMode: true, editMode: false, changeInForm: false };
}

export function loadFormRelatedState(state) {
  console.log("From loading", state.form)
  return { form: state.form, addMode: state.addMode, editMode: state.editMode, changeInForm: state.changeInForm };
}

export function saveSession(currState, user, createMethod, updateMethod) {
  // save
  let taskSession = { ...currState.form };
  if (taskSession._id) {
    updateMethod(taskSession);
  } else if (user) {
    taskSession.user = { id: user._id, email: user.email, name: user.name };
    createMethod(taskSession);
  } else {
    // show error handler message ("current logged in user is not found, please logout and login again")
    console.log("User is not logged in properly , please logout and login again");
  }
}

// export function saveSession(currState, user, createMethod, updateMethod) {
//   return new Promise((resolve, reject) => {
//     let taskSession = { ...currState.form };

//     if (taskSession._id) {
//       updateMethod(taskSession)
//         .then(() => resolve())
//         .catch(error => reject(error));
//     } else if (user) {
//       taskSession.user = { id: user._id, email: user.email, name: user.name };
//       createMethod(taskSession)
//         .then(() => resolve())
//         .catch(error => reject(error));
//     } else {
//       // Handle the case where user is not logged in
//       const error = new Error("User is not logged in properly");
//       reject(error);
//     }
//   });
// }


export function getActiveSession(userId, range, method) {
  return new Promise((resolve, reject) => {
    let query = "";
    if (userId) query = query + "?userId=" + userId;
  

    method(`/activeSession/${query}`)
      .then(response => {
        
        resolve(response); 
      })
      .catch(error => {
        
        reject(error); 
      });
  });
}

// export function getActiveSession(userId, range, method) {
//   let query = "";
//   if (userId) query = query + "?userId=" + userId;
//   if (range) {
//     var jsonArray = encodeURIComponent(JSON.stringify(range));
//     query = query + (userId ? "&range=" : "?range=") + jsonArray;
//   }
//   method(`/activeSession?${query}=true`);



// }




export function getSessions(userId, range, method) {
  let query = "";
  if (userId) query = query + "?userId=" + userId;
  if (range) {
    var jsonArray = encodeURIComponent(JSON.stringify(range));
    query = query + (userId ? "&range=" : "?range=") + jsonArray;
  }
  method(query);
}





export function resetOrEditMethod(currState, selectedSession) {
  // reset

  let formToPut = { ...defaultFormVal };

  if (selectedSession && currState.editMode) {
    formToPut = selectedSession;
  }
  currState.form = formToPut;
  currState.changeInForm = false;
}

export function cancelMethod() {
  // cancel
  return { form: { ...defaultFormVal }, addMode: false, editMode: false, changeInForm: false };
}
export function editMode(currState, session) {
  currState.form = session;
  currState.form.checkin = setStringToDate(currState.form.checkin);
  currState.form.checkout = setStringToDate(currState.form.checkout);
  currState.addMode = false;
  currState.editMode = true;
  currState.changeInForm = false;
  currState.selectedSession = session;
}

function setStringToDate(date) {
  if (date) {
    let dateObj = new Date(date);
    if (isValidDate(dateObj)) return dateObj;
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}



export function convertTimezone(stateToSet, timezone) {
  let date1 = ''


  if (stateToSet.form.checkin) {
    date1 = stateToSet.form.checkin
  }

  else if (stateToSet.form.checkout) {
    date1 = stateToSet.form.checkout
  }

  if (date1) {

    const date2 = utcToZonedTime(date1, timezone);

    const timeDifferenceMs = date1 - date2;



    if (stateToSet.form.checkin) {

      stateToSet.form.checkin = new Date(stateToSet.form.checkin.getTime() + timeDifferenceMs);

    }

    if (stateToSet.form.checkout) {

      stateToSet.form.checkout = new Date(stateToSet.form.checkout.getTime() + timeDifferenceMs);
    }

  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  //console.log("User Timezone: ", userTimezone, "Convert to: ", timezone, "Offset: ", diff)

}
