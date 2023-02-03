import React, { useEffect, useState } from "react";
import BackgroundImage from "../../img/bg2.jpg";
import { v4 as uuidv4 } from "uuid";
import Form from "./Form";
import {
  BACKEND_ENDPOINT,
  TRUECALLER_APP_KEY,
  USER_DETAILS_LOCAL_STORAGE_KEY,
} from "../constants";

function Body() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [trueCallerNotFound, setTrueCallerNotFound] = useState(false);
  const [uniqueRequestId] = useState(uuidv4());

  function initiateLogin() {
    window.location.href = `truecallersdk://truesdk/web_verify?requestNonce=${uniqueRequestId}&partnerKey=${TRUECALLER_APP_KEY}&partnerName=Guruhari Darshan Parva&lang=EN`;

    setTimeout(async function () {
      if (document.hasFocus()) {
        // Truecaller is not installed or is ios
        setTrueCallerNotFound(true);
      } else {
        while (!isLoggedIn) {
          let response = await fetch(BACKEND_ENDPOINT + "/" + uniqueRequestId);
          if (response.ok) {
            const resp = await response.json();
            localStorage.setItem(
              USER_DETAILS_LOCAL_STORAGE_KEY,
              JSON.stringify(resp)
            );
            setUserDetails(resp);
            setIsLoggedIn(true);
            break;
          } else {
            window.alert("Please wait for few seconds...");
          }
        }
      }
    }, 1000);
  }

  const alreadyLoggedIn = localStorage.getItem(USER_DETAILS_LOCAL_STORAGE_KEY);

  if (alreadyLoggedIn != null) {
    let user = JSON.parse(alreadyLoggedIn);
    return (
      <Form
        trueCallerNotFound={false}
        name={user?.name}
        phoneNumber={user?.phoneNumber}
      />
    );
  } else if (trueCallerNotFound) {
    return (
      <Form
        trueCallerNotFound={true}
        name=""
        phoneNumber=""
      />
    );
  } else {
    return !isLoggedIn ? (
      <div className="m-3 p-3 py-32 rounded-lg bg-white shadow-xl flex justify-center">
        <button
          className="rounded-lg bg-gradient-to-r from-orange-600 to-pink-600 text-white p-3 hover:bg-blue-800 text-bold text-md"
          onClick={() => initiateLogin()}
        >
          Register
        </button>
      </div>
    ) : (
      <Form
        trueCallerNotFound={false}
        name={userDetails?.name}
        phoneNumber={userDetails?.phoneNumber}
      />
    );
  }
}

export default Body;
