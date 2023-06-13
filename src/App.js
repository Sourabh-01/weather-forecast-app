import React from "react";
import styled from "styled-components";
import Stats from "./modules/stats";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0.8;
  background-image: url("/images/landscapeBgV2.jpg");
`;



const App = () => {
  return (
    <Container>
     <Stats/>
    </Container>
  );
};

export default App;
