import React, { memo } from "react";
import { useSelector } from "react-redux";
import { styled } from "styled-components";
import countryList from "react-select-country-list";
import utility from "../../utility";
import moment from "moment/moment";

const Container = styled.div`
  display: flex;
  width: 94.5%;
  color: black;
  font-size: 35px;
  font-weight: 500;
  justify-content: space-between;
  padding: 20px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  @media (min-width: 300px) and (max-width: 767px) {
    font-size: 16px;
    width: 530px;
  }
`;

const LeftDetails = styled.div`
  width: 33%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`;
const MidDetails = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
  width: 33%;
`;

const RightDetails = styled.div`
  width: 33%;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  align-items: center;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const DescriptionContainer = styled.div`
  font-size: 15px;
`;

const LocationContainer = styled.span`
  white-space: nowrap;
`;

const CountryName = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
  padding-right: 12px;
  @media (min-width: 300px) and (max-width: 767px) {
    padding-right: 33%;
  }
`;

const TempratureContainer = styled.div`
  display: flex;
  color: black;
  font-size: 35px;
  font-weight: 500;
  justify-content: center;
  margin-top: 40px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const DetailsSection = styled.div`
  color: black;
  display: flex;
  justify-content: center;
  white-space: nowrap;
  span {
    font-size: 16px;
    font-weight: 500;
  }
`;

const Heading = styled.div`
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
`;

const DashboardComponent = ({ loading }) => {
  const state = useSelector((state) => state.weather);
  const { weather, main, clouds, name, sys, wind } = state.weatherData ?? "";
  return (
    <Container>
      <LeftDetails>
        <div>
          <img
            src={`https://openweathermap.org/img/wn/${
              weather && weather[0]?.icon
            }@2x.png`}
            alt=""
          />
          <div>{weather && weather[0]?.main}</div>
          <DescriptionContainer>
            {weather && utility.formatText(weather[0]?.description)}
          </DescriptionContainer>
          <DescriptionContainer>
            {"Cloudiness: " + clouds?.all + "%"}
          </DescriptionContainer>
        </div>
      </LeftDetails>
      <MidDetails>
        <div>
          <LocationContainer>{name}&nbsp;</LocationContainer>
          <CountryName>
            {countryList().getLabel(sys?.country ?? "")}
          </CountryName>
          <TempratureContainer>
            {main.temp + (state.unit === "metric" ? " °C" : " °F")}
          </TempratureContainer>
          <DetailsSection>
            <div>
              <FlexContainer>
                <Heading>Feels like:</Heading>
                <span>
                  {main?.feels_like + (state.unit === "metric" ? " °C" : " °F")}
                </span>
              </FlexContainer>
              <FlexContainer>
                <Heading>Humidity:</Heading>
                <span>{main?.humidity + "%"}</span>
              </FlexContainer>
              <FlexContainer>
                <Heading>Max Today:</Heading>

                <span>
                  {" "}
                  {main?.temp_max + (state.unit === "metric" ? " °C" : " °F")}
                </span>
              </FlexContainer>
              <FlexContainer>
                <Heading>Min Today:</Heading>

                <span>
                  {main?.temp_min + (state.unit === "metric" ? " °C" : " °F")}
                </span>
              </FlexContainer>
            </div>
          </DetailsSection>
        </div>
      </MidDetails>
      <RightDetails>
        <DetailsSection>
          <div>
            <FlexContainer>
              <Heading>Sunrise:</Heading>
              <span>{moment.unix(sys?.sunrise).format("LTS")}</span>
            </FlexContainer>
            <FlexContainer>
              <Heading>Sunset:</Heading>
              <span>{moment.unix(sys?.sunset).format("LTS")}</span>
            </FlexContainer>
            <FlexContainer>
              <Heading>Wind Speed:</Heading>
              <span>{wind?.speed + "Km/h"}</span>
            </FlexContainer>
            <FlexContainer>
              <Heading>Wind Direction:</Heading>
              <span>{wind?.deg + "°"}</span>
            </FlexContainer>
            <FlexContainer>
              <Heading>Pressure:</Heading>
              <span>{main?.pressure + "hPa"}</span>
            </FlexContainer>
          </div>
        </DetailsSection>
      </RightDetails>
    </Container>
  );
};

export default memo(DashboardComponent);
