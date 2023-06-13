import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import styled from "styled-components";
import Switch from "@mui/material/Switch";
import utility from "../../utility";
import { getWeather, getWeatherDataByCoords } from "../../services/weather";
import { STORAGE_CONSTANTS, TOAST_MESSAGES } from "../../constants";
import DashboardComponent from "../dashboard";

const DetailsContainer = styled.div`
  position: relative;
  /* background-color: transparent; */
  background: rgba(191, 191, 191, 0.5);
  width: 70%;
  left: 15%;
  top: 15%;
  border-radius: 15px;
`;

const Input = styled.input`
  padding-left: 15px;
  width: 200px;
  height: 40px;
  border: 1px solid #d6d5d4;
  opacity: 0.8;
  border-radius: 25px;
  outline: none;
  &:focus {
    border: 1px solid #d6d5d4;
  }
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding-top: 40px;
`;

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  label {
    font-size: 12px;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue",
      sans-serif;
  }
`;

const Stats= () => {
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
    }, 1000);
  
    const debouncedLocationData = useDebouncedCallback((lat, lon) => {
      getLocationData(lat, lon);
    }, 200);
  
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
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            debouncedLocationData(
              position.coords.latitude,
              position.coords.longitude
            );
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

  return (
    <DetailsContainer>
        <InputContainer>
          <Input
            onChange={(event) => debounced(event.target.value)}
            placeholder="Enter City Name or Zip Code"
          />
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
        <DashboardComponent loading={loading} />
      </DetailsContainer>
  )
}

export default Stats;