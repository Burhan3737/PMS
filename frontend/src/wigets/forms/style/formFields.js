import { basicColors, retroColors } from "style/basic/basicColors";
export const formFeildStyle = {
  feildStyle: {
    default: {},
    retro: {
      marginBottom: "15px",
    },
  },
  lblStyle: {
    default: {
      marginBottom: "5px",
      float: "left",
      fontSize: "14px",
      color: basicColors.first,
    },
    retro: {
      marginBottom: "5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: retroColors.second,
      width: "30%",
    },
  },
  lblSmallStyle: {
    default: {
      marginBottom: "5px",
      float: "left",
      fontSize: "14px",
      color: basicColors.first,
    },
    retro: {
      marginBottom: "5px",
      fontSize: "14px",
      fontWeight: "bold",
      color: retroColors.second,
      width: "auto",
    },
  },
  inputStyle: {
    default: {
      width: "100%",
      height: "34px",
      padding: "6px 12px",
      fontSize: "12px",
      lineHeight: "1.42857143",
      color: "#378b77",
      backgroundColor: "#fff",
      backgroundImage: "none",
      border: "1px solid #e3e9ef",
      borderRadius: "2px",
      WebkitBoxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
      boxShadow: "inset 0 1px 1px rgba(0, 0, 0, 0.05)",
      WebkitTransition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
      OTransition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
      transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
    },
    retro: {
      width: "70%",
      height: "34px",
      padding: "6px 6px 6px 6px",
      fontSize: "12px",
      lineHeight: "1.42857143",
      color: retroColors.second,
      backgroundColor: retroColors.fifth,
      backgroundImage: "none",
      border: "1px solid" + retroColors.ten,
      borderRadius: "0px",
      WebkitTransition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
      OTransition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
      transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
    },
  },
  selectInputFieldContainer: {
    default: {},
    retro: {
      width: "70%",
      position: "relative",
    },
  },

  selectInputCaret: {
    default: { height: "34px", padding: "6px 12px", background: "#fff" },
    retro: {
      height: "34px",

      padding: "6px 6px 6px 6px",
      background: "#fff",
      border: "0px solid grey",
      borderLeft: "none",
      cursor: "pointer",
    },
  },
  selectInputDropDown: {
    default: {},
    retro: {
      border: "0",
      position: "absolute",
      bottom: "-68px",
      height: "68px",
      overflow: "auto",
      width: "100%",
      zIndex: "10",
      WebkitBoxShadow: " 0px 3px 5px 0px rgba(0,0,0,0.75)",
      MozBoxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
      boxShadow: "0px 3px 5px 0px rgba(0,0,0,0.75)",
      background: "#fff",
    },
  },
  inputSelectFieldStyle: {
    default: {},
    retro: {
      height: "34px",
      width: "-webkit-calc(100% - 77px)",
      width: " -moz-calc(100% - 77x)",
      width: "      calc(100% - 77px)",
      padding: "6px 12px",
      fontSize: "12px",
      lineHeight: "1.42857143",
      color: retroColors.second,
      backgroundColor: retroColors.fifth,
      backgroundImage: "none",
      border: "0px solid grey",
      borderRadius: "0px",
      borderRight: "none",
      WebkitTransition: "border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
      OTransition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s",
      transition: "border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s",
    },
  },
  inputSelectRowContainer: {
    default: {},
    retro: {
      height: "34px",
      padding: "6px 12px 9px",
      background: "#fff",
      border: "0px solid darkgrey",
      cursor: "pointer",
    },
  },
};