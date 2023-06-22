/** @format */

export const handleRegisterUser = async (email, password, handleUn) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    email: email,
    password: password,
    username: handleUn,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const testFn = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL_LINK}register`,
      requestOptions
    );
    return response.json();
  };
  try {
    const result = await testFn();
    return result;
  } catch (err) {
    console.log(err);
  }
};
