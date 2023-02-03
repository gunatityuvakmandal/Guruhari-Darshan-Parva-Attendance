import React, { useState } from "react";
import { BACKEND_ENDPOINT, USER_DETAILS_LOCAL_STORAGE_KEY } from "../constants";
import { ColorRing } from "react-loader-spinner";

function Form({ trueCallerNotFound, name, phoneNumber }) {
  const [fullName, setFullName] = useState(name);
  const [nameValdationError, setNameValidationError] = useState(false);

  const [mobileNumber, setMobileNumber] = useState(phoneNumber);
  const [mobileNumberValidationError, setMobileNumberValidationError] =
    useState(false);

  const [sabha, setSabha] = useState("");
  const [reference, setReference] = useState("");

  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  async function submit() {
    if (fullName != "" && mobileNumber.length === 10) {
      console.log("Making the request");
      const body = {
        name: fullName,
        phoneNumber: mobileNumber,
        sabha: sabha,
        reference: reference,
      };
      console.log(body);
      setShowLoader(true);
      const response = await fetch(BACKEND_ENDPOINT + "/attendance", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (response.status != 200) {
        setServerError(await response.text());
        setShowLoader(false);
      } else {
        localStorage.setItem(
          USER_DETAILS_LOCAL_STORAGE_KEY,
          JSON.stringify(body)
        );
        setDone(true);
      }
    } else {
      if (fullName == "") {
        setNameValidationError(true);
      }

      if (mobileNumber.length != 10) {
        setMobileNumberValidationError(true);
      }
    }
  }

  if (done) {
    return (
      <div className="m-3 p-3 py-32 rounded-lg bg-white shadow-xl flex justify-center">
        <span>Thanks for the registration!</span>
      </div>
    );
  } else
    return (
      <>
        {showLoader && (
          <div className="p-3 m-3 bg-white rounded flex justify-center py-40">
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={["#ea580c", "#db2777", "#ea580c", "#db2777", "#db2777"]}
            />
          </div>
        )}
        {!showLoader && (
          <div className="p3 m-3">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              {trueCallerNotFound && (
                <>
                  <div
                    className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4"
                    role="alert"
                  >
                    <p>Truecaller not found or you have iphone.</p>
                    <p>Please fill the below form.</p>
                  </div>
                  <br />
                </>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullname"
                  type="text"
                  onChange={(e) => {
                    setNameValidationError(false);
                    setFullName(e.target.value);
                  }}
                  value={fullName}
                  disabled={!trueCallerNotFound}
                />
                {nameValdationError ? (
                  <span className="m-2 text-red-500 text-sm">
                    Name should't be blank
                  </span>
                ) : (
                  <></>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mobile Number
                </label>

                <input
                  className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="mobilenumber"
                  type="text"
                  onChange={(e) => {
                    setMobileNumberValidationError(false);
                    setMobileNumber(e.target.value);
                  }}
                  value={mobileNumber}
                  disabled={!trueCallerNotFound}
                />
                {mobileNumberValidationError ? (
                  <span className="text-red-500 text-sm">
                    Mobile Number should be 10 digits long
                  </span>
                ) : (
                  <></>
                )}
              </div>

              <p className="block text-gray-700 text-sm font-bold mb-2">
                Sabha
              </p>
              <div className="flex items-center">
                <input
                  id="santacruz"
                  type="radio"
                  value=""
                  name="sabha-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={(e) => setSabha("Santacruz")}
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Santacruz
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="andheri"
                  type="radio"
                  value=""
                  name="sabha-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={(e) => setSabha("Andheri")}
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Andheri
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="parla"
                  type="radio"
                  value=""
                  name="sabha-radio"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={(e) => setSabha("Vile Parle")}
                />
                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Vile Parle
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Reference (Optional)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="reference"
                  type="text"
                  placeholder=""
                  onChange={(e) => {
                    setReference(e.target.value);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="bg-gradient-to-r from-orange-600 to-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                  disabled={showLoader}
                  onClick={submit}
                >
                  Submit
                </button>
              </div>

              {serverError != "" ? (
                <div
                  className="my-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <span className="block sm:inline">{serverError}</span>
                  <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <button onClick={() => setServerError("")}>
                      <svg
                        className="fill-current h-6 w-6 text-red-500"
                        role="button"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <title>Close</title>
                        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                      </svg>
                    </button>
                  </span>
                </div>
              ) : (
                <></>
              )}
            </form>
          </div>
        )}
      </>
    );
}

export default Form;
