import { ReactNode, createContext, useReducer, useState } from "react";
import cyclesReducer, { ActionTypes, Cycle } from "../reducers/cycles";

interface CreateNewCycleData {
  task: string;
  minutesAmount: number;
}

interface CyclesContextData {
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  cycles: Cycle[];
  elapsedSeconds: number;
  createNewCycle: (data: CreateNewCycleData) => void;
  markCurrentCycleAsFinished: () => void;
  setElapsedTime: (seconds: number) => void;
  stopCurrentCycle: () => void;
}

interface CyclesContextProviderProps {
  children: ReactNode;
}

export const CyclesContext = createContext({} as CyclesContextData);

function CyclesContextProvider({ children }: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { cycles, activeCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setElapsedTime(seconds: number) {
    setElapsedSeconds(seconds);
  }

  function markCurrentCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
      payload: { activeCycleId },
    });
  }

  function createNewCycle(data: CreateNewCycleData) {
    const newCycle: Cycle = {
      id: self.crypto.randomUUID(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: { newCycle },
    });
    setElapsedSeconds(0);
  }

  function stopCurrentCycle() {
    dispatch({
      type: ActionTypes.STOP_CURRENT_CYCLE,
      payload: { activeCycleId },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        cycles,
        elapsedSeconds,
        createNewCycle,
        markCurrentCycleAsFinished,
        setElapsedTime,
        stopCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}

export default CyclesContextProvider;
