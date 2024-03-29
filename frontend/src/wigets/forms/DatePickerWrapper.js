import React from "react";

export default function (ComposedClass) {
  class DatePickerWrapper extends React.Component {
    render() {
      return (
        <div>
          <ComposedClass {...this.props} />
        </div>
      );
    }
  }

  return DatePickerWrapper;
}
