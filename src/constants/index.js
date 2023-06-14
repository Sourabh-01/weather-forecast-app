export const httpConstants = {
  METHOD_TYPE: {
    POST: "POST",
    PUT: "PUT",
    GET: "GET",
    DELETE: "DELETE",
  },
  CONTENT_TYPE: {
    APPLICATION_JSON: "application/json",
    APPLICATION_FORM_URLENCODED: "application/x-www-form-urlencoded",
  },
  API_ENDPOINTS: {
    WEATHER: "/data/2.5/weather",
    FORECAST: "/data/2.5/forecast",
  },
};

export const TOAST_MESSAGES = {
  COUNTRY_CODE_MISSING: "Country Code is missing. Unable to get weather data.",
  LOCATION_NOT_FETCHED: "Unable to fetch location. Enter manually.",
  EMPTY_INPUT: "Input is empty.",
};

export const STORAGE_CONSTANTS = {
  SHOW_ERROR: "Error",
};
