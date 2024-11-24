import React from "react";

const FlashMessages = (props) => {
  return (
    <>
      <div className="ui message red" id={props.errorId}></div>
      <div className="ui message green" id={props.successId}></div>
    </>
  )
}

export default FlashMessages;