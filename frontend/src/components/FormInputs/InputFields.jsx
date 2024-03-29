import { themeService } from "../../theme/service/activeTheme.service";
import DateTimePicker from "react-datetime-picker";
import { languageService } from "../../Language/language.service";
export const InputFieldCustom = (props) => {
  return (
    <div style={{ ...themeService(formFieldStyle.fieldStyle), ...props.style }}>
      {props.label && (
        <label style={{ ...themeService(formFieldStyle.lblStyle), width: "inherit", margin: "0px 5px 5px", ...props.labelStyle }}>
          {languageService(props.label)}
        </label>
      )}
      <input
        style={{ ...themeService(formFieldStyle.inputStyle), ...props.inputStyle }}
        disabled={props.disabled}
        onChange={(e) => props.changeHandler(e, false)}
        onBlur={(e) => props.changeHandler(e, true)}
        value={props.value}
        {...props.inputFieldProps}
      />
    </div>
  );
};

export const Label = (props) => {
  return <div style={props.styles}>{props.children}</div>;
};

export const InputDateField = (props) => {
  return (
    <div style={{ ...themeService(formFieldStyle.dateTimeField), ...props.style }}>
      {props.label && (
        <label style={{ ...themeService(formFieldStyle.lblStyle), width: "inherit", margin: "0px 5px 5px", ...props.labelStyle }}>
          {languageService(props.label)}
        </label>
      )}
      <span style={{ ...themeService(formFieldStyle.inputDateTimeField), ...props.inputDateStyle }}>
        <DateTimePicker
          onChange={(e) => {
            props.changeHandler(e, false);
          }}
          value={props.value}
          {...props.dayTimePickerProps}
        />
      </span>
    </div>
  );
};

export const SelectField = (props) => {
  return (
    <div style={{ ...themeService(formFieldStyle.fieldStyle), display: "inline-block", margin: "0px 0px 15px 0px", ...props.style }}>
      {props.label && (
        <label style={{ ...themeService(formFieldStyle.lblStyle), width: "inherit", margin: "0px 5px 5px", ...props.labelStyle }}>
          {languageService(props.label)}
        </label>
      )}
      <select
        style={
          props.customStyle
            ? { ...themeService(formFieldStyle.selectFieldStyle), width: "inherit", ...props.customStyle }
            : { ...themeService(formFieldStyle.selectFieldStyle), width: "inherit" }
        }
        onChange={(e) => props.changeHandler(e, false, "select")}
        onBlur={(e) => props.changeHandler(e, true, "select")}
        {...props.inputFieldProps}
        value={props.value}
      >
        {props.options &&
          props.options.map((item, index) => (
            <option key={index} value={item.val}>
              {languageService(item.text)}
            </option>
          ))}
      </select>
    </div>
  );
};
export const TextAreaField = (props) => {
  return (
    <div style={{ ...themeService(formFieldStyle.fieldStyle), ...props.style }}>
      {props.label && (
        <label style={{ ...themeService(formFieldStyle.lblStyle), width: "inherit", margin: "0px 5px 5px", ...props.labelStyle }}>
          {languageService(props.label)}
        </label>
      )}
      <textarea
        rows="2"
        cols="50"
        style={{ ...themeService(formFieldStyle.textAreaStyle), ...props.inputStyle }}
        disabled={props.disabled}
        onChange={(e) => props.changeHandler(e, false)}
        onBlur={(e) => props.changeHandler(e, true)}
        value={props.value}
        {...props.inputFieldProps}
      />
    </div>
  );
};

const formFieldStyle = {
  fieldStyle: { tenant: { margin: "5px 15px" } },
  lblStyle: { tenant: { display: "block", fontWeight: 600 } },
  inputStyle: { tenant: { height: "27px" } },
  textAreaStyle: { tenant: { verticalAlign: "top" } },
  selectFieldStyle: { tenant: { height: "30px" } },
  inputDateTimeField: { tenant: { background: "#fff" } },
};
