import { styled } from "styled-components";

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: ${(props) => props.theme["gray-100"]};
  font-size: 1.125rem;
  font-weight: bold;
`;

const BaseInput = styled.input`
  background-color: transparent;
  color: ${(props) => props.theme["gray-100"]};
  height: 2.5rem;
  border: 0;
  border-bottom: 1px solid ${(props) => props.theme["gray-500"]};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;

  &:focus {
    border-color: ${(props) => props.theme["green-500"]};
    box-shadow: none;
  }

  &::placeholder {
    color: ${(props) => props.theme["gray-500"]};
  }
`;

export const TaskInput = styled(BaseInput)`
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`;

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem;
`;
