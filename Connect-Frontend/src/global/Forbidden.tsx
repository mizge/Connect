import React from "react";

const Forbidden = () => {
  return (
    <div className="w3-display-middle">
      <link
        rel="stylesheet"
        href="https://www.w3schools.com/w3css/4/w3.css"
      ></link>
      <h1 className="w3-jumbo w3-animate-top w3-center">
        <code>Access Denied</code>
      </h1>
      <h3 className="w3-center w3-animate-right">
        You dont have permission to view this site.
      </h3>
      <h6 className="w3-center w3-animate-zoom">error code:403 forbidden</h6>
    </div>
  );
};

export default Forbidden;
