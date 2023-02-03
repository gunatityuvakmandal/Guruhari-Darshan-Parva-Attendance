import React, { useEffect, useState } from "react";
import BackgroundImage from "../../img/bg2.jpg";
import { v4 as uuidv4 } from "uuid";
import Form from "./Form";
import { ColorRing } from "react-loader-spinner";
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
  const [showLoader, setShowLoader] = useState(false);

  function initiateLogin() {
    window.location.href = `truecallersdk://truesdk/web_verify?requestNonce=${uniqueRequestId}&partnerKey=${TRUECALLER_APP_KEY}&partnerName=Guruhari Darshan Parva&lang=EN`;
    setShowLoader(true);
    setTimeout(async function () {
      if (document.hasFocus()) {
        // Truecaller is not installed or is ios
        setTrueCallerNotFound(true);
      } else {
        for (let i = 0; i < 3 && !isLoggedIn; i++) {
          setTimeout(async () => {
            let response = await fetch(
              BACKEND_ENDPOINT + "/" + uniqueRequestId
            );
            if (response.ok) {
              const resp = await response.json();
              localStorage.setItem(
                USER_DETAILS_LOCAL_STORAGE_KEY,
                JSON.stringify(resp)
              );
              setUserDetails(resp);
              setIsLoggedIn(true);
            } else {
              if (i == 2) {
                setTrueCallerNotFound(true);
              }
            }
          }, 1000);
        }
      }
    }, 3000);
  }

  const alreadyLoggedIn = localStorage.getItem(USER_DETAILS_LOCAL_STORAGE_KEY);
  let safariAgent = window.navigator.userAgent.indexOf("Safari") > -1;
  const chromeAgent = window.navigator.userAgent.indexOf("Chrome") > -1;
  if (chromeAgent && safariAgent) safariAgent = false;

  if (alreadyLoggedIn != null) {
    let user = JSON.parse(alreadyLoggedIn);
    return (
      <Form
        trueCallerNotFound={false}
        name={user?.name}
        phoneNumber={user?.phoneNumber}
      />
    );
  } else if (safariAgent || trueCallerNotFound) {
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
        {!showLoader && (
          <button
            className="rounded-lg bg-gradient-to-r from-orange-600 to-pink-600 text-white p-3 hover:bg-blue-800 text-bold text-md"
            onClick={() => initiateLogin()}
          >
            Register
          </button>
        )}
        {showLoader && (
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#ea580c", "#db2777", "#ea580c", "#db2777", "#db2777"]}
          />
        )}
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
