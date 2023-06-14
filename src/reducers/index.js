import { createReducer } from "@reduxjs/toolkit";

let initialState = {
  cityName: {},
  loading: false,
  weatherData: [],
  showError: false,
  unit: "",
  input: "",
  coords: [],
};

const setCityName = (state, action) => {
  state.cityName = action.payload;
};
const setLoading = (state, action) => {
  state.loading = action.payload;
};
const updateWeatherData = (state, action) => {
  state.weatherData = action.payload;
};
const setError = (state, action) => {
  state.showError = action.payload;
};

const setUnit = (state, action) => {
  state.unit = action.payload;
};

const setInput = (state, action) => {
  state.input = action.payload;
};

const setCoords = (state, action) => {
  state.coords = action.payload;
};

export const weatherReducer = createReducer(initialState, {
  setCityName,
  setLoading,
  updateWeatherData,
  setError,
  setUnit,
  setInput,
  setCoords,
});
