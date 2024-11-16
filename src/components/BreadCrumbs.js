import React from "react";
import {Link } from 'react-router-dom';
import "../styling/BreadCrumbs.css";

const BreadCrumbs = (props) => {
  return (
    <div className="breadCrumbs">
      {
        props.items?.length > 0 ? (
          props.items.map((item, index) => {
            return (
              <div key={`bread-crumb-item-${index}`}>
                {index > 0 && <span> {">"} </span> }
                {item.link ? <Link to={item.link} className="bread-crumb-item">{item.label}</Link> : <span className="bread-crumb-item">{item.label}</span>}
              </div>
            )
          })
        ) : ""
      }
    </div>
  );
}

export default BreadCrumbs;