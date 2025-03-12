const bookingTMPL = document.getElementById("booking-tmpl").content;
const bookingContainer = document.getElementById("bookings");

window.addEventListener("load", getBookingData);
async function getBookingData() {
  let userID = isConnected();
  if (!userID) {
    alert("Please log in.");
    return;
  }
  let serverResponse = await fetch(BACK_URL + `/trips/bookings/${userID}`, {
    method: "GET", //just to be suuuuure
  });
  let jsonData = await serverResponse.json();
  jsonData.result && renderBookingContent(jsonData.data);
}

function renderBookingContent(bookingContent) {
  bookingContainer.innerHTML = "";
  bookingContent.forEach((trip) => {
    console.log(trip);
    let tripDIV = bookingTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    let time = new Date(trip.date);
    console.log(time, getTimeLeft(time));
    tripDIV.querySelector("#time").textContent =
      `${time.getHours()}:${time.getMinutes().toString().padStart(2, "0")}`;
    //update timeleft every minutes
    tripDIV.querySelector("#time-left").textContent = getTimeLeft(time);
    tripDIV.querySelector("#price").textContent = trip.price;
    bookingContainer.appendChild(tripDIV);
  });
}

function getTimeLeft(date) {
  let timeDelta = Math.floor((date.getTime() - Date.now()) / 60_000);
  console.log(timeDelta);
  console.log(date.getTime(), Date.now(), timeDelta);
  if (timeDelta < 0) {
    return "Train left allready.";
  }
  return timeDelta < 60
    ? `${timeDelta} minutes`
    : `${Math.floor(timeDelta / 60)} hour(s)`;
}
