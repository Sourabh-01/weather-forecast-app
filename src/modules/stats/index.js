import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import styled from "styled-components";
import Switch from "@mui/material/Switch";
import utility from "../../utility";
import { getWeather, getWeatherDataByCoords } from "../../services/weather";
import { STORAGE_CONSTANTS, TOAST_MESSAGES } from "../../constants";
import DashboardComponent from "../dashboard";
import Charts from "../charts";
import { ReactComponent as CloudLogo } from "../../assets/cloudError.svg";
import { RotatingLines } from "react-loader-spinner";
import { Hint } from "react-autocomplete-hint";
import countryList from "react-select-country-list";
import "../../index.css";

const InputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 40px;
  @media (min-width: 300px) and (max-width: 767px) {
    display: block;
    margin: 17%;
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10%;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  @media (min-width: 300px) and (max-width: 767px) {
    justify-content: center;
  }
  label {
    font-size: 12px;
    color: black;
    font-weight: 600;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 90px;
    height: 90px;
    margin-bottom: 40px;
    margin-top: 40px;
    path {
      fill: white;
    }
  }
`;

const ScrollDiv = styled.div`
  overflow: hidden;
  @media (min-width: 300px) and (max-width: 767px) {
    overflow: scroll;
  }
`;

const MidDetails = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  div {
    max-width: 80%;
    margin: 10px;
  }
`;

const Stats = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.weather);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState(false);
  const debounced = useDebouncedCallback((value, unit) => {
    dispatch({
      type: "setInput",
      payload: value,
    });
    if (value !== "") {
      getWeatherData(value, unit ?? state.unit);
    }
  }, 1500);

  const debouncedLocationData = useDebouncedCallback((lat, lon) => {
    getLocationData(lat, lon);
  }, 1000);

  const getWeatherData = async (value, unit) => {
    let input = utility.trimSpaces(value.split(","));
    let requestData = {};
    if (utility.checkIsZip(input[0])) {
      if (!input[1]) {
        utility.failureToast(TOAST_MESSAGES.COUNTRY_CODE_MISSING);
        return;
      } else requestData["zip"] = input.join(",");
    } else requestData["q"] = input.join(",");
    requestData["unit"] = unit;
    dispatch({
      type: "setCityName",
      payload: requestData,
    });
    try {
      setLoading(true);
      let response = await getWeather(requestData);
      if (response?.status !== 200) {
        utility.failureToast(response?.response?.data?.message);
        dispatch({
          type: "setError",
          payload: true,
        });
      }
      setLoading(false);
      dispatch({
        type: "updateWeatherData",
        payload: response?.data,
      });
    } catch (error) {
      utility.failureToast(error);
      console.log(error);
    }
  };
  const getLocationData = async (lat, lon) => {
    let unit = state.unit;
    try {
      setLoading(true);
      let response = await getWeatherDataByCoords(lat, lon, unit);
      if (response?.status !== 200) {
        utility.failureToast(response?.response?.data?.message);
        dispatch({
          type: "setError",
          payload: true,
        });
      }
      setLoading(false);
      dispatch({
        type: "updateWeatherData",
        payload: response?.data,
      });
    } catch (error) {
      utility.failureToast(error);
      console.log(error);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      utility.failureToast(TOAST_MESSAGES.LOCATION_NOT_FETCHED);
      setLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          debouncedLocationData(
            position.coords.latitude,
            position.coords.longitude
          );
          dispatch({
            type: "setCoords",
            payload: [position.coords.latitude, position.coords.longitude],
          });
        },
        () => {
          dispatch({
            type: "setError",
            payload: true,
          });
        }
      );
    }
  };

  useEffect(() => {
    if (
      state.showError &&
      Object.values(state.cityName).length === 0 &&
      !sessionStorage.getItem(STORAGE_CONSTANTS.SHOW_ERROR)
    ) {
      utility.failureToast(TOAST_MESSAGES.LOCATION_NOT_FETCHED);
      sessionStorage.setItem(STORAGE_CONSTANTS.SHOW_ERROR, true);
      setLoading(false);
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.showError]);

  useEffect(() => {
    if (unit) {
      dispatch({
        type: "setUnit",
        payload: "imperial",
      });
      if (state.input !== "") {
        debounced(state.input ?? "", "imperial");
      } else {
        getLocation();
      }
    } else {
      dispatch({
        type: "setUnit",
        payload: "metric",
      });
      if (state.input !== "") {
        debounced(state.input ?? "", "metric");
      } else {
        getLocation();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  useEffect(() => {
    setLoading(true);
    dispatch({
      type: "setSuggestions",
      payload: countryList().getLabels(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <InputContainer>
        <Hint options={state.suggestions} allowTabFill>
          <input
            className="suggestedInput"
            onChange={(event) => debounced(event.target.value)}
            placeholder="Enter City Name or Zip Code"
          />
        </Hint>
        <SwitchContainer>
          <label>Celsius</label>
          <Switch
            onChange={() => {
              setLoading(true);
              setUnit(!unit);
            }}
          />
          <label>Fahrenheit</label>
        </SwitchContainer>
      </InputContainer>
      {(state && !state?.weatherData) || state?.weatherData?.length === 0 ? (
        <ErrorContainer>
          {loading ? (
            <LoaderContainer>
              <RotatingLines
                strokeColor="#BFBFBF"
                strokeWidth="2"
                animationDuration="1"
                width="100"
                visible={true}
              />
            </LoaderContainer>
          ) : (
            <div>
              <MidDetails>
                <CloudLogo />
                <div>Unable to fetch the details!</div>
                <div>
                  Please enter the location manually or allow access to
                  location.
                </div>
                <div>
                  Note: US Country code is set by default. Enter location like
                  "London/London,GB" or "208021, GB". Country Code is mandatory
                  for searching using zipcode.
                </div>
              </MidDetails>
            </div>
          )}
        </ErrorContainer>
      ) : (
        <>
          <ScrollDiv>
            <DashboardComponent loading={loading} setLoading={setLoading} />
          </ScrollDiv>
          <Charts loading={loading} unit={unit} />
        </>
      )}
    </>
  );
};

export default Stats;
