const BACK_URL = "http://localhost:3000";

window.addEventListener("load", onPageLoad);
function onPageLoad() {
  let userID = localStorage.getItem("userID");
  userID &&
    (document.getElementById("log-in").textContent =
      `You are user  n°${userID.slice(16)}`);
}

document.getElementById("log-in").addEventListener("click", logInHandle);

async function logInHandle() {
  let serverResponse = await fetch(BACK_URL + "/users");
  let jsonData = await serverResponse.json();
  localStorage.setItem("userID", jsonData._id);
  this.textContent = `You are user n°${jsonData._id.slice(20)}`;
}

function isConnected() {
  return localStorage.key("userID");
}
