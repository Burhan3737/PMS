import React, { Component } from "react";
import ThisTable from "../../Common/ThisTable";
import { languageService } from "../../../Language/language.service";
import SvgIcon from "react-icons-kit";
import { pencilSquare } from "react-icons-kit/fa/pencilSquare";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";



class UserList extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        Header: languageService("Name"),
        accessor: "name",
      },
      {
        Header: languageService("Email"),
        accessor: "email",
        minWidth: 130,
      },
      {
        Header: languageService("Edit"),
        Cell: () => <SvgIcon size={20} icon={pencilSquare} />,
      },
    ];
  }
  render() {
    return (
      <div className="task-area col-md-12">
        <div className="table-responsive">
          <ThisTable
            tableColumns={this.columns}
            tableData={this.props.userLIst}
            pageSize={15}
            minRows={1}
            classNameCustom={"table table-striped"}
            pagination={true}
            handleSelectedClick={this.handleClick}
            onClickSelect
            height={"auto"}
          />
        </div>
      </div>
    );
  }
}

export default UserList;
