import React from "react";
import { Link } from "react-router-dom";
import "./PageNotFound.css";
import { Segment } from "semantic-ui-react";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
        <h1 className="heading">Page not found</h1>
        <p>We looked everywhere for the page. Are you sure the website URL is correct?</p>
        <p>Get in touch with the admin</p>
        <Link to="/" className="back-to-home-link">Go Back Home</Link>
    </div>
  )
}

export default PageNotFound;