import React, { Component } from "react";
import { Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { languageService } from "../../Language/language.service";
import { CommonModalStyle, ButtonStyle } from "style/basic/commonControls";
import { themeService } from "theme/service/activeTheme.service";
import { retroColors } from "../../style/basic/basicColors";
const MyButton = (props) => (
  <button className="setPasswordButton" {...props}>
    {props.children}
  </button>
);
class ConfirmationDialog extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.modal}
        toggle={this.props.toggle}
        contentClassName={themeService({ default: this.props.className, retro: "retroModal" })}
      >
        <ModalHeader> {this.props.headerText}</ModalHeader>
        <ModalBody>
          <div>{this.props.confirmationMessage}</div>
        </ModalBody>
        <ModalFooter>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            onClick={(e) => {
              this.props.handleResponse(true);
            }}
          >
            {languageService("Confirm")}
          </MyButton>
          <MyButton
            style={themeService(ButtonStyle.commonButton)}
            onClick={(e) => {
              this.props.handleResponse(false);
            }}
          >
            {languageService("Cancel")}
          </MyButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default ConfirmationDialog;
