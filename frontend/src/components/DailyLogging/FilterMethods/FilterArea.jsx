import React, { Component } from "react";
import "./filterStyle.css";
import Icon from "react-icons-kit";
import { arrowLeft } from "react-icons-kit/icomoon/arrowLeft";
import { arrowRight } from "react-icons-kit/icomoon/arrowRight";
class FilterArea extends Component {
  render() {
    return (
      <div>
        <div
          style={
            this.props.customStyle
              ? { padding: "15px", background: "inherit", ...this.props.customStyle }
              : { textAlign: "left", padding: "15px", background: "inherit" }
          }
        >
          <FilterDetail
            filterMode={this.props.filterMode}
            handleFilterMoveClick={this.props.handleFilterMoveClick}
            dateRange={this.props.dateRange}
          />
        </div>

        <div
          style={
            this.props.customStyle
              ? { padding: "15px", background: "inherit", cursor: "pointer", ...this.props.customStyle }
              : { textAlign: "right", padding: "15px", background: "inherit", cursor: "pointer" }
          }
        >
          <FilterItem name={"Day"} filterMode={this.props.filterMode} handleFilterClick={this.props.handleFilterClick} />
          <Divider />
          <FilterItem name={"Week"} filterMode={this.props.filterMode} handleFilterClick={this.props.handleFilterClick} />
          <Divider />
          <FilterItem name={"Month"} filterMode={this.props.filterMode} handleFilterClick={this.props.handleFilterClick} />
        </div>
      </div>
    );
  }
}

export default FilterArea;

const Divider = (props) => {
  return <span style={{ padding: "0px 5px" }}>|</span>;
};

const FilterItem = (props) => {
  return (
    <span
      className={props.filterMode === props.name ? "filter-active" : ""}
      onClick={(e) => {
        props.handleFilterClick(props.name);
      }}
    >
      {props.name}
    </span>
  );
};

const FilterDetail = (props) => {
  let value = "N/A";
  let validDateRange = props.dateRange && props.dateRange.from;
  if (props.filterMode === "Day" && validDateRange) value = props.dateRange.from.format("dddd");
  else if (props.filterMode === "Week" && validDateRange)
    value = props.dateRange.from.format("DD MMM YYYY") + " - " + props.dateRange.to.format("DD MMM YYYY");
  else if (props.filterMode === "Month" && validDateRange) {
    value = props.dateRange.from.format("MMMM YYYY");
  }
  return (
    <div>
      <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          props.handleFilterMoveClick();
        }}
      >
        <Icon icon={arrowLeft} size={18} />
      </span>
      <span style={{ padding: "0px 10px ", fontWeight: 600, fontSize: "18px" }}>{value}</span>
      <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          props.handleFilterMoveClick(1);
        }}
      >
        <Icon icon={arrowRight} size={18} />
      </span>
    </div>
  );
};
