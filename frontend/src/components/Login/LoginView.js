import React from "react";
import { languageService } from "../../Language/language.service";
import { Container, Col, Label, Button, FormGroup } from "reactstrap";
import { AvForm, AvInput, AvFeedback, AvGroup } from "availity-reactstrap-validation";
//import {LoadingOverlay, Loader} from 'react-overlay-loader';
import "react-overlay-loader/styles.css";
import PropTypes from "prop-types";
// import Recaptcha from "react-recaptcha";
import { ButtonStyle } from "style/basic/commonControls";
import { retroColors, pmsThemeColors } from "style/basic/basicColors.js";
import { themeService } from "theme/service/activeTheme.service";

// const sitekey = "6LegVGkUAAAAAJRHOVXe0JXbXNXO3OVLL46C3FgP";

// specifying your onload callback function
// const callback = () => {
//   //console.log('Done!!!!');
// };

// const verifyCallback = response => {
//   //console.log(response);
// };

// const expiredCallback = () => {
//   //console.log(`Recaptcha expired`);
// };

// // define a variable to store the recaptcha instance
// let recaptchaInstance;

class LoginView extends React.Component {
  render() {
    const props = this.props;
    return (
      <Container style={props.formContainerStyle}>
        <div className="app-logo">
          <h3>{languageService("Login")}</h3>
        </div>
        <AvForm model={props.defaultValues} onValidSubmit={props.submitHandle}>
          <Col>
            <AvGroup className="form-field">
              <Label className="app-lbl">{languageService("Email")}</Label>
              <AvInput
                required
                type="email"
                name="email"
                id="txtEmail"
                placeholder="myemail@email.com"
                value={props.inputValue.email}
                onChange={props.onInputChange}
              />
              {/* <AvFeedback style={{ color: retroColors.second }} tooltip>
                {languageService("Please enter valid email address")}
              </AvFeedback> */}
            </AvGroup>
          </Col>
          <Col>
            <AvGroup className="form-field">
              <Label className="app-lbl" for="examplePassword">
                {languageService("Password")}
              </Label>
              <AvInput
                required
                type="password"
                name="password"
                id="txtPassword"
                placeholder="********"
                value={props.inputValue.password}
                onChange={props.onInputChange}
              />
              {/* <AvFeedback style={{ color: retroColors.second }} tooltip>
                {languageService("Password Required")}
              </AvFeedback> */}
            </AvGroup>
          </Col>
          <Col>
            {/* <AvGroup>
              <Label style={props.formLabelStyle} check for="chkRemember">
              <AvInput
                type="checkbox"
                name="chkRemember"
                id="chkRemember"
                style={props.checkBoxStyle}

              />&nbsp;&nbsp;
              Remember me</Label>

            </AvGroup> */}
          </Col>

          <Col>
            <FormGroup>
              <div>
                <Button className="common-button">{languageService("Login")}</Button>
              </div>
            </FormGroup>
          </Col>
          <Col>
            <AvGroup>
              <Label
                style={themeService({ default: { ...props.forgotPassStyle }, tenant: { cursor: "pointer" } })}
                onClick={props.clickForgotPasswordHandle}
              >
                <div>{languageService("Forgot Password")}?</div>
              </Label>
            </AvGroup>
          </Col>

          <Col>
            {/* <div class="g-recaptcha" data-sitekey="6LegVGkUAAAAAJRHOVXe0JXbXNXO3OVLL46C3FgP"></div> */}
            {/* <Recaptcha
            ref={e => recaptchaInstance = e}
            sitekey={sitekey}
            size="normal"
            render="explicit"
            verifyCallback={props.recaptchaCallbacks.verifyCallback}
            onloadCallback={props.recaptchaCallbacks.onloadCallback}
            expiredCallback={props.recaptchaCallbacks.expiredCallback}
          /> */}
          </Col>
        </AvForm>
      </Container>
    );
  }
}

LoginView.propTypes = {
  defaultValues: PropTypes.object,
  formStyle: PropTypes.object,
  baseStyle: PropTypes.object,
  formLabelStyle: PropTypes.object,
  checkBoxStyle: PropTypes.object,
  loginTitleBar: PropTypes.object,
  buttonsContainer: PropTypes.object,
  submitButtonStyle: PropTypes.object,
  inputValue: PropTypes.object,
  submitHandle: PropTypes.func,
  onInputChange: PropTypes.func,
  recaptchaCallbacks: PropTypes.object,
};

LoginView.defaultProps = {
  defaultValues: {
    chkRemember: true,
  },
  inputValue: { email: "" },
  loginTitleBar: {
    fontfamily: "Arial",
    fontSize: "23px",

    margin: "0",
    textAlign: "center",
    textTransform: "uppercase",
  },
  formStyle: {
    width: "280px",
    height: "40px",
  },
  formContainer: {
    textAlign: "left",
    padding: "0em",
    margin: "1em",
    border: "0px solid #d3d3d3",
    borderRadius: ".5em",
    verticalAlign: "middle",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    marginTop: "10px",
  },
  baseStyle: {
    textAlign: "left",
    padding: "0em",
    margin: "auto",
    border: "0px solid #d3d3d3",
    borderRadius: ".5em",
    verticalAlign: "middle",
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    marginTop: "10px",

    /*         width: "340px",
        height: "470px",
        backgroundColor: "#fff",
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "auto",
        borderRadius: "5px",
        boxShadow: "0px 20px 30px -5px rgba(0, 0, 0, 0.4)"
 */
  },
  buttonsContainer: {
    marginTop: "10px",
  },
  formLabelStyle: {
    fontFamily: "Arial",
    fontSize: "14px",

    letterSpacing: "0.35px",
  },
  checkBoxStyle: {
    position: "relative",
    margin: "0",
    borderStyle: "Solid",
    borderColor: "#465261",
    borderWidth: "0px",
    width: "16px",
    height: "16px",
    borderRadius: "3px",
  },
  loginButtonStyle: {
    width: "100%",
    height: "40px",
    backgroundColor: pmsThemeColors.first,
    border: "none",
    borderRadius: "2px",
    cursor: "pointer",
    fontFamily: "Arial",
    fontSize: "14px",
    letterSpacing: "0.35px",
    color: "#FFFFFF",
  },
  forgotPassStyle: {
    marginTop: "5px",
    textDecoration: "none",
    fontFamily: "Arial",
    fontSize: "14px",
    letterSpacing: "0.35px",

    cursor: "pointer",
  },

  formContainerStyle: {},
  //forgotPassButtonStyle: ForgotPasswordButton
};

export default LoginView;
