export const isLoggedOn = () => localStorage.getItem("access_token") !== null;
export const loggedInUser = () => localStorage.getItem("loggedInUser");
