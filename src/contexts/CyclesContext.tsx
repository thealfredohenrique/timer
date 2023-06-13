import { ReactNode, createContext, useState } from "react";

interface CreateNewCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
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
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  function setElapsedTime(seconds: number) {
    setElapsedSeconds(seconds);
  }

  function markCurrentCycleAsFinished() {
    setCycles((currentValue) =>
      currentValue.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, finishedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
  }

  function createNewCycle(data: CreateNewCycleData) {
    const newCycle: Cycle = {
      id: self.crypto.randomUUID(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((currentValue) => [...currentValue, newCycle]);
    setActiveCycleId(newCycle.id);
    setElapsedSeconds(0);
  }

  function stopCurrentCycle() {
    setCycles((currentValue) =>
      currentValue.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() };
        } else {
          return cycle;
        }
      })
    );
    setActiveCycleId(null);
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
