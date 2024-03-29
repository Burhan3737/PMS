import React from "react";


function UpdatePassword(props) {
  const { password, setPassword, newPassword, setNewPassword } = props

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'newPass') {
      setNewPassword(value)
    }
    else {
      setPassword(value)
    }
  }





  return (
    <div>

      <div className="field-wrapper" ><label>New Password</label>

        <input value={newPassword} name="newPass" onChange={handleChange} className="form-input" /></div>

      <div className="field-wrapper"  ><label>Re-enter Password</label>

        <input value={password} name="rePass" onChange={handleChange} className="form-input" /></div>

    </div>
  )



}



export default UpdatePassword