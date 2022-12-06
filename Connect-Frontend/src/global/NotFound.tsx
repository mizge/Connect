import React from "react";

const NotFound = () => {
  return (
    <div className="w3-display-middle">
      <link
        rel="stylesheet"
        href="https://www.w3schools.com/w3css/4/w3.css"
      ></link>
      <h1 className="w3-jumbo w3-animate-top w3-center">
        <code>Page Not Found</code>
      </h1>
      <h3 className="w3-center w3-animate-right">
        We couldn't fecth you any data with this request.
      </h3>
    </div>
  );
};

export default NotFound;
