const noTripFoundTMPL = document.getElementById("no-trip-tmpl").content;
const tripTMPL = document.getElementById("trip-tmpl").content;

const searchResultDIV = document.getElementById("search-results");

document.getElementById("search-btn").addEventListener("click", onSearchHandle);
async function onSearchHandle() {
  let trajectQuery = {
    departure: document.getElementById("departure").value,
    arrival: document.getElementById("arrival").value,
    date: document.getElementById("date").value,
  };
  for (key in trajectQuery) {
    trajectQuery[key]
      ? document.getElementById(key).classList.remove("invalid-input")
      : document.getElementById(key).classList.add("invalid-input");
  }

  let serverResponse = await fetch(BACK_URL + "/trips", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trajectQuery),
  });
  let jsonData = await serverResponse.json();
  jsonData.result && renderSearchResult(jsonData.data);
}

function renderSearchResult(searchResult) {
  searchResultDIV.innerHTML = "";
  if (searchResult.length == 0) {
    searchResultDIV.appendChild(noTripFoundTMPL.cloneNode(true));
    return;
  }
  for (let trip of searchResult) {
    let tripDIV = tripTMPL.cloneNode(true);
    tripDIV.querySelector("#departure").textContent = trip.departure;
    tripDIV.querySelector("#arrival").textContent = trip.arrival;
    tripDIV.querySelector("#price").textContent = trip.price;
    let time = new Date(trip.date);
    console.log(time, trip);
    tripDIV.querySelector("#time").textContent = `${time.getHours()}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    tripDIV
      .querySelector("#book-btn")
      .addEventListener("click", addToCartHandle(trip._id));
    searchResultDIV.appendChild(tripDIV);
  }
}

function addToCartHandle(id) {
  return async function () {
    let userID = isConnected()
    if(!userID){
      alert("Please log in.")
      return
    }
    let serverResponse = await fetch(BACK_URL + `/trips/cart/${userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    let jsonData = await serverResponse.json();
    jsonData.result && window.location.assign("./views/cart.html");
  };
}
