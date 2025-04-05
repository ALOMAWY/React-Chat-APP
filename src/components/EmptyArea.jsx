import styled from "styled-components";

const EmptyEreaStyled = styled.div`
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid rgb(89, 96, 144);

  h1 {
    opacity: 0.5;
    text-transform: capitalize;
  }
`;

const EmptyErea = () => {
  return (
    <EmptyEreaStyled>
      <h1>Select a chat To Start a Conversation</h1>
    </EmptyEreaStyled>
  );
};

export default EmptyErea;
