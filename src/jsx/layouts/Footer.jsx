 import React from "react";

const Footer = (props) => {
  const d = new Date();

  return (
    <div className={`footer ${props.change}`}>
      <div className="copyright">
        <p>Design and develop by innovationpixel &copy; {d.getFullYear()}</p>
      </div>
    </div>
  );
};

export default Footer;


