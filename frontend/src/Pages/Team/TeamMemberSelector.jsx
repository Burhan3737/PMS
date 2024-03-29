import React, { useState } from "react";
import { useEffect } from "react";
import DualListBox from "react-dual-listbox";
import { ic_chevron_left } from "react-icons-kit/md/ic_chevron_left";
import { ic_chevron_right } from "react-icons-kit/md/ic_chevron_right";
import SvgIcon from "react-icons-kit";
export default function TeamMemberSelector({ users, handleUsersChange, newTeam }) {
  const [selected, setSelected] = useState([]);

  useEffect(()=>{
    setSelected(newTeam.team.map(user => user.email))
  },[newTeam])

  let icons = {
    moveLeft: <SvgIcon key="left" size={20} icon={ic_chevron_left} />,
    moveAllLeft: [
      <SvgIcon
        key="leftAll1"
        size={20}
        icon={ic_chevron_left}
        style={{ verticalAlign: "middle", height: "100%", marginRight: "-7px", padding: "0px" }}
      />,
      <SvgIcon
        key="leftAll2"
        size={20}
        icon={ic_chevron_left}
        style={{ verticalAlign: "middle", height: "100%", marginLeft: "-7px", padding: "0px" }}
      />,
    ],
    moveRight: <SvgIcon key="right" size={20} icon={ic_chevron_right} />,
    moveAllRight: [
      <SvgIcon
        size={20}
        key="rightAll1"
        icon={ic_chevron_right}
        style={{ verticalAlign: "middle", height: "100%", marginRight: "-7px", padding: "0px" }}
      />,
      <SvgIcon
        size={20}
        key="rightAll2"
        icon={ic_chevron_right}
        style={{ verticalAlign: "middle", height: "100%", marginLeft: "-7px", padding: "0px" }}
      />,
    ],
    moveDown: <SvgIcon size={20} icon={ic_chevron_right} />,
    moveUp: <SvgIcon size={20} icon={ic_chevron_left} />,
  };
 

  return (
    <DualListBox
      options={loadOptions(users)}
      selected={selected}
      onChange={(value) => {
        setSelected(value);
        handleUsersChange(value);
      }}
      icons={icons}
    />
  );
}

function loadOptions(users) {
  let toRet = [];
  if (users) toRet = users.map((u) => ({ label: u.name, value: u.email }));
  return toRet;
}
