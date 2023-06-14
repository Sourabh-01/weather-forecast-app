import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LineChart, Line, YAxis, Tooltip, Legend, XAxis } from "recharts";
import { styled } from "styled-components";
import { useDispatch } from "react-redux";
import { getChartData, getChartsByCoords } from "../../services/weather";
import utility from "../../utility";
import { useDebouncedCallback } from "use-debounce";
import moment from "moment";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin: 20px;
  border-radius: 12px;
  padding: 20px;
`;

const Charts = ({ loading, unit }) => {
  const debouncedGetCoordsData = useDebouncedCallback(() => {
    getDataByCoords();
  }, 1000);

  const debouncedByName = useDebouncedCallback((value, unit) => {
    getForecastData(value, unit);
  }, 1000);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.weather);
  const [weatherData, setWeatherData] = useState([]);

  const getDataByCoords = async () => {
    const { coords, unit } = state;
    try {
      let response = await getChartsByCoords(coords[0], coords[1], unit);
      if (response?.status !== 200) {
        utility.failureToast(response?.response?.data?.message);
        dispatch({
          type: "setError",
          payload: true,
        });
      }
      let dataArray = [];
      response?.data?.list.forEach((element) => {
        let data = {
          Day: moment(element?.dt_txt, "YYYY-MM-DD HH:mm:ss").format("ddd"),
          Min: element?.main?.temp_min,
          Max: element?.main?.temp_max,
        };
        dataArray.push(data);
      });
      setWeatherData(dataArray);
    } catch (error) {
      utility.failureToast(error);
      console.log(error);
    }
  };

  const getForecastData = async (value, unit) => {
    let input = utility.trimSpaces(value.split(","));
    let requestData = {};
    if (utility.checkIsZip(input[0])) {
      if (!input[1]) {
        return;
      } else requestData["zip"] = input.join(",");
    } else requestData["q"] = input.join(",");
    requestData["unit"] = unit;
    dispatch({
      type: "setCityName",
      payload: requestData,
    });
    try {
      let response = await getChartData(requestData);
      if (response?.status !== 200) {
        utility.failureToast(response?.response?.data?.message);
        dispatch({
          type: "setError",
          payload: true,
        });
      }
      let dataArray = [];
      response?.data?.list.forEach((element) => {
        let data = {
          Day: moment(element?.dt_txt, "YYYY-MM-DD HH:mm:ss").format("ddd"),
          Min: element?.main?.temp_min,
          Max: element?.main?.temp_max,
        };
        dataArray.push(data);
      });
      setWeatherData(dataArray);
    } catch (error) {
      utility.failureToast(error);
      console.log(error);
    }
  };

  useEffect(() => {
    if (unit) {
      if (state.input !== "") {
        debouncedByName(state.input ?? "", "imperial");
      } else {
        debouncedGetCoordsData();
      }
    } else {
      if (state.input !== "") {
        debouncedByName(state.input ?? "", "metric");
      } else {
        debouncedGetCoordsData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <Container>
          <LineChart
            width={Math.floor(window.outerWidth / 1.6)}
            height={250}
            data={weatherData}
          >
            <XAxis dataKey="Day"/>
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Min"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="Max" stroke="#82ca9d" />
          </LineChart>
        </Container>
      )}
    </>
  );
};

export default Charts;
