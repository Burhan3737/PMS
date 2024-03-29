import { SelectField } from "../../FormInputs/InputFields";
export const UserSelectArea = (props) => {
  let style = { display: "flex", alignItems: "flex-end", flexDirection: "column-reverse", paddingRight: "15px" };
  if (props.customStyle) {
    style = {
      ...style,
      ...props.customStyle,
    };
  }
  return (
    <div style={style}>
      <SelectField
        SelectField
        label={props.label}
        options={calculateUserOpts(props.userList)}
        customStyle={props.customStyle}
        value={props.selectedUser}
        changeHandler={(e, blurValue) => {
          props.onUserSelectChange(e.target.value, "user", blurValue);
        }}
      />
    </div>
  );
};

function calculateUserOpts(userList) {
  let uList = [];
  if (userList) {
    uList = userList.map((user) => {
      return { val: user._id, text: user.name };
    });
  }
  return uList;
}
