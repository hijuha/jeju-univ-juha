// import axios from "axios";
// // const axios = require("../node_modules/axios");

// // form fields
// const form = document.querySelector(".form-data");
// const region = document.querySelector(".region-name");
// const apiKey = document.querySelector(".api-key");
// // results
// const errors = document.querySelector(".errors");
// const loading = document.querySelector(".loading");
// const results = document.querySelector(".result-container");
// const usage = document.querySelector(".carbon-usage");
// const fossilfuel = document.querySelector(".fossil-fuel");
// const myregion = document.querySelector(".my-region");
// const clearBtn = document.querySelector(".clear-btn");

// const calculateColor = async (value) => {
//   let co2Scale = [0, 150, 600, 750, 800];
//   let colors = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];
//   let closestNum = co2Scale.sort((a, b) => {
//     return Math.abs(a - value) - Math.abs(b - value);
//   })[0];
//   console.log(value + " is closest to " + closestNum);
//   let num = (element) => element > closestNum;
//   let scaleIndex = co2Scale.findIndex(num);
//   let closestColor = colors[scaleIndex];
//   console.log(scaleIndex, closestColor);
//   chrome.runtime.sendMessage({
//     action: "updateIcon",
//     value: { color: closestColor },
//   });
// };

// // auth-token apikey = "mq8zL4mdPvU51"
// const displayCarbonUsage = async (apiKey, region) => {
//   try {
//     await axios
//       .get("https://api.co2signal.com/v1/latest", {
//         params: {
//           countryCode: region,
//         },
//         headers: {
//           //please get your own token from CO2Signal https://www.co2signal.com/
//           "auth-token": apiKey,
//         },
//       })
//       .then((response) => {
//         let CO2 = Math.floor(response.data.data.carbonIntensity);
//         calculateColor(CO2);
//         loading.style.display = "none";
//         form.style.display = "none";
//         myregion.textContent = region;
//         usage.textContent =
//           Math.round(response.data.data.carbonIntensity) +
//           " grams (grams C02 emitted per kilowatt hour)";
//         fossilfuel.textContent =
//           response.data.data.fossilFuelPercentage.toFixed(2) +
//           "% (percentage of fossil fuels used to generate electricity)";
//         results.style.display = "block";
//       });
//   } catch (error) {
//     console.log(error);
//     loading.style.display = "none";
//     results.style.display = "none";
//     errors.textContent =
//       "Sorry, we have no data for the region you have requested.";
//   }
// };

// function handleSubmit(e) {
//   e.preventDefault();
//   setUpUser(apiKey.value, region.value);
// }

// function init() {
//   const storedApiKey = localStorage.getItem("apiKey");
//   const storedRegion = localStorage.getItem("regionName");
//   chrome.runtime.sendMessage({
//     action: "updateIcon",
//     value: {
//       color: "green",
//     },
//   });
//   //set icon to be generic green
//   //todo
//   if (storedApiKey === null || storedRegion === null) {
//     results.style.display = "none";
//     loading.style.display = "none";
//     clearBtn.style.display = "none";
//     errors.textContent = "";
//   } else {
//     displayCarbonUsage(storedApiKey, storedRegion);
//     results.style.display = "none";
//     form.style.display = "none";
//     clearBtn.style.display = "block";
//   }
// }

// function setUpUser(apiKey, regionName) {
//   localStorage.setItem("apiKey", apiKey);
//   localStorage.setItem("regionName", regionName);
//   loading.style.display = "block";
//   errors.textContent = "";
//   clearBtn.style.display = "block";
//   displayCarbonUsage(apiKey, regionName);
// }

// function reset(e) {
//   e.preventDefault();
//   localStorage.removeItem("regionName");
//   init();
// }

// form.addEventListener("submit", (e) => handleSubmit(e));
// clearBtn.addEventListener("click", (e) => reset(e));
// init();

import axios from "axios";

const form = document.querySelector(".form-data");
const apiKey = document.querySelector(".api-key");

const regionInputs = [
  document.querySelector("#region1"),
  document.querySelector("#region2"),
  document.querySelector("#region3"),
];

const loading = document.querySelector(".loading");
const errors = document.querySelector(".errors");
const results = document.querySelector(".result-container");
const clearBtn = document.querySelector(".clear-btn");

const myRegions = [
  document.querySelector(".my-region1"),
  document.querySelector(".my-region2"),
  document.querySelector(".my-region3"),
];
const carbonUsages = [
  document.querySelector(".carbon-usage1"),
  document.querySelector(".carbon-usage2"),
  document.querySelector(".carbon-usage3"),
];
const fossilFuels = [
  document.querySelector(".fossil-fuel1"),
  document.querySelector(".fossil-fuel2"),
  document.querySelector(".fossil-fuel3"),
];

const calculateColor = async (value) => {
  const co2Scale = [0, 150, 600, 750, 800];
  const colors = ["#2AA364", "#F5EB4D", "#9E4229", "#381D02", "#381D02"];
  const closestNum = co2Scale.sort(
    (a, b) => Math.abs(a - value) - Math.abs(b - value)
  )[0];
  const scaleIndex = co2Scale.findIndex((element) => element > closestNum);
  const closestColor = colors[scaleIndex];

  chrome.runtime.sendMessage({
    action: "updateIcon",
    value: { color: closestColor },
  });
};

const displayCarbonUsage = async (apiKey, region, index) => {
  try {
    const response = await axios.get("https://api.co2signal.com/v1/latest", {
      params: { countryCode: region },
      headers: { "auth-token": apiKey },
    });

    const CO2 = Math.floor(response.data.data.carbonIntensity);
    calculateColor(CO2);

    myRegions[index].textContent = region;
    carbonUsages[
      index
    ].textContent = `${CO2} grams (grams CO2 emitted per kilowatt hour)`;
    fossilFuels[
      index
    ].textContent = `${response.data.data.fossilFuelPercentage.toFixed(
      2
    )}% (percentage of fossil fuels used to generate electricity)`;

    loading.style.display = "none";
    form.style.display = "none";
    results.style.display = "block";
  } catch (error) {
    console.error(error);
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent =
      "Sorry, we have no data for the region you have requested.";
  }
};

function handleSubmit(e) {
  e.preventDefault();
  const apiKeyValue = apiKey.value;
  regionInputs.forEach((input, index) => {
    if (input.value) {
      displayCarbonUsage(apiKeyValue, input.value, index);
    }
  });
}

function init() {
  results.style.display = "none";
  loading.style.display = "none";
  clearBtn.style.display = "none";
  errors.textContent = "";
}

function reset(e) {
  e.preventDefault();
  form.reset();
  init();
}

form.addEventListener("submit", handleSubmit);
clearBtn.addEventListener("click", reset);
init();
