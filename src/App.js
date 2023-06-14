import React from "react";
import styled from "styled-components";
import Stats from "./modules/stats";

const Container = styled.div`
  width: 100%;
  position: absolute;
  height: 100vh;
  opacity: 0.8;
  background-image: url("/images/landscapeBgV2.jpg");
  @media (min-width: 300px) and (max-width: 767px) {
   height: 130vh;
  }
`;

const DetailsContainer = styled.div`
  position: relative;
  background: rgba(191, 191, 191, 0.5);
  width: 70%;
  left: 15%;
  top: 2%;
  border-radius: 15px;
  @media (min-width: 300px) and (max-width: 767px) {
    width: 92%;
    left: 4%;
  }
  @media (min-width: 768px) and (max-width: 1024px) {
    top: 12%;
    left: 8%;
    width: 85%;
  }
`;

const App = () => {
  return (
    <Container>
      <DetailsContainer>
        <Stats />
      </DetailsContainer>
    </Container>
  );
};

export default App;
