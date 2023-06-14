import axios from "axios";
import { httpConstants } from "../constants";

const headers = {
  "Content-type": httpConstants.CONTENT_TYPE.APPLICATION_JSON,
};

export const getWeather = async (data) => {
  let url = `${
    process.env.REACT_APP_GET_WEATHER + httpConstants.API_ENDPOINTS.WEATHER
  }`;
  if (data?.q) {
    url += `?q=${data.q}`;
  }
  if (data?.zip) {
    url += `?zip=${data.zip}`;
  }
  url += `&appid=${process.env.REACT_APP_API_KEY}&units=${data.unit}`;
  try {
    let response = await axios(url, {
      method: httpConstants.METHOD_TYPE.GET,
      headers: headers,
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
    return Promise.resolve(response);
  } catch (error) {
    Promise.reject(error);
    console.log(error);
  }
};

export const getChartData = async (data) => {
  let url = `${
    process.env.REACT_APP_GET_WEATHER + httpConstants.API_ENDPOINTS.FORECAST
  }`;
  if (data?.q) {
    url += `?q=${data.q}`;
  }
  if (data?.zip) {
    url += `?zip=${data.zip}`;
  }
  url += `&appid=${process.env.REACT_APP_API_KEY}&units=${data.unit}`;
  try {
    let response = await axios(url, {
      method: httpConstants.METHOD_TYPE.GET,
      headers: headers,
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
    return Promise.resolve(response);
  } catch (error) {
    Promise.reject(error);
    console.log(error);
  }
};

export const getWeatherDataByCoords = async (lat, lon, unit) => {
  let url = `${
    process.env.REACT_APP_GET_WEATHER +
    httpConstants.API_ENDPOINTS.WEATHER +
    `?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=${unit}`
  }`;
  try {
    let response = await axios(url, {
      method: httpConstants.METHOD_TYPE.GET,
      headers: headers,
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
    return Promise.resolve(response);
  } catch (error) {
    Promise.reject(error);
    console.log(error);
  }
};

export const getChartsByCoords = async (lat, lon, unit) => {
  let url = `${
    process.env.REACT_APP_GET_WEATHER +
    httpConstants.API_ENDPOINTS.FORECAST +
    `?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}&units=${unit}`
  }`;
  try {
    let response = await axios(url, {
      method: httpConstants.METHOD_TYPE.GET,
      headers: headers,
    })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
    return Promise.resolve(response);
  } catch (error) {
    Promise.reject(error);
    console.log(error);
  }
};
