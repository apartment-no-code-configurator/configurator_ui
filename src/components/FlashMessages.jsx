import React from "react";

const FlashMessages = (props) => {
  return (
    <>
      <div className="ui message red" id={props.errorId ? props.errorId : "app-error-message"}></div>
      <div className="ui message green" id={props.successId ? props.successId : "app-success-message"}></div>
    </>
  )
}

export default FlashMessages;