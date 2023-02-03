import React from "react";
import TitleTextImage from "../../img/title-white-gujarati.png";

function Header() {
  return (
    <>
      <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-lg m-3 p-3 shadow-xl flex justify-center">
        <img src={TitleTextImage} />
      </div>
    </>
  );
}

export default Header;
