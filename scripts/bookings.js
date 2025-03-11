const BACK_URL = "http://localhost:3000";

const bookingTMPL = document.getElementById("booking-tmpl").content;
const bookingContainer = document.getElementById("bookings");

window.addEventListener("load", getBookingData);
async function getBookingData() {
  try {
    let serverResponse = await fetch(BACK_URL + "/bookings", {
      method: "GET", //just to be suuuuure
    });
    let jsonData = await serverResponse.json();
    jsonData.result && renderBookingContent(jsonData.data);
  } catch (error) {
    renderBookingContent(testData);
  }
}

function renderBookingContent(bookingContent) {
  bookingContainer.innerHTML = "";
  bookingContent.forEach((trip) => {
    console.log(trip);
    let tripDIV = bookingTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    let time = new Date(trip.date.$date);
    tripDIV.querySelector(
      "#time"
    ).textContent = `${time.getHours()}:${time.getMinutes()}`;
    //update timeleft every minutes
    setInterval(() => {
      tripDIV.querySelector("#time-left").textContent = getTimeLeft(time);
    }, 60_000);
    tripDIV.querySelector("#price").textContent = trip.price;
    bookingContainer.appendChild(tripDIV);
  });
}

function getTimeLeft(date) {
  let timeDelta = Math.floor((date.getTime() - Date.now()) / (1000 * 3600));
  console.log(date.getTime(), Date.now(), timeDelta);
  return timeDelta < 60
    ? `${timeDelta} minutes`
    : `${Math.floor(timeDelta / 60)} heure(s)`;
}

const testData = [
  {
    departure: "Pau",
    arrival: "Majorque",
    date: { $date: "2025-03-11T09:53:52.428Z" },
    price: 99,
  },
  {
    departure: "Test",
    arrival: "Tset",
    date: { $date: "2025-03-11T09:57:45.677Z" },
    price: 146,
  },
  {
    departure: "Boud1",
    arrival: "0pom",
    date: { $date: "2025-03-11T10:19:36.198Z" },
    price: 91,
  },
  {
    departure: "TM",
    arrival: "LP",
    date: { $date: "2025-03-11T10:36:07.251Z" },
    price: 143,
  },
];
