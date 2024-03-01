const stateSelect = document.querySelector("#allStatesName");
const citySelect = document.querySelector("#allCitiesName");

const key1 = "ajNRWUduTGYza04ydmdPeUh1UFFab21OUEY5RWV3UkNUT2dkTmkyRw==";

getCity();

function getCity() {
  let states = "";
  let stateCode;
  let cities = "";

  $.ajax({
    url: `https://api.countrystatecity.in/v1/countries/IN/states`,
    method: "GET",
    headers: {
      "X-CSCAPI-KEY": key1,
    },
    success: function (allStates) {
      states = `<option value="" selected disabled>Select State</option>`;
      populateSelectOptions(allStates, stateSelect, states);

      stateSelect.addEventListener("change", () => {
        $("#stateName").html(`Selected State : ${stateSelect.value}`);

        const selectedState = allStates.find((state) => state.name === stateSelect.value);
        stateCode = selectedState.iso2;

        searchCoronaState(stateCode);
        updateCitySelect(stateCode);
      });
    },
  });
}

function updateCitySelect(stateCode) {
  $.ajax({
    url: `https://api.countrystatecity.in/v1/countries/IN/states/${stateCode}/cities`,
    method: "GET",
    headers: {
      "X-CSCAPI-KEY": key1,
    },
    success: function (allCities) {
      cities = `<option value="" selected disabled>Select City</option>`;
      populateSelectOptions(allCities, citySelect, cities);

      citySelect.addEventListener("change", () => {
        $("#cityName").html(`Selected City : ${citySelect.value}`);
        searchCoronaCity(stateCode, citySelect.value);
      });
    },
  });
}

function searchCoronaState(state) {
  $.ajax({
    url: `https://data.covid19india.org/v4/min/data.min.json`,
    method: "GET",
    type: "JSON",
    crossDomain: true,

    success: function (coronaData) {
      const coronaStateData = coronaData[state];
      $("#confirmed").html(coronaStateData.total.confirmed);
      $("#deceased").html(coronaStateData.total.deceased);
      $("#recovered").html(coronaStateData.total.recovered);
      $("#tested").html(coronaStateData.total.tested);
    },
  });
}

function searchCoronaCity(state, city) {
  $.ajax({
    url: `https://data.covid19india.org/v4/min/data.min.json`,
    method: "GET",
    type: "JSON",
    crossDomain: true,

    success: function (coronaData) {
      const coronaStateData = coronaData[state];
      const coronaCityData = coronaStateData.districts[city];

      if (coronaCityData) {
        $("#error").html(``);
        $("#cityConfirmed").html(coronaCityData.total.confirmed);
        $("#cityDeceased").html(coronaCityData.total.deceased);
        $("#cityRecovered").html(coronaCityData.total.recovered);
        $("#cityTested").html(coronaCityData.total.tested);
      } else {
        $("#error").html(`${city}'s data not found, please select another City`);
        $("#cityConfirmed").html("");
        $("#cityDeceased").html("");
        $("#cityRecovered").html("");
        $("#cityTested").html("");
      }
    },
  });
}

function populateSelectOptions(arr, location, newVar) {
  arr.forEach((data) => {
    newVar += `<option value="${data.name}">${data.name}</option>`;
  });
  location.innerHTML = newVar;
}