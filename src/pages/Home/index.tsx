import { createContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { HandPalm, Play } from "@phosphor-icons/react";
import Countdown from "./components/Countdown";
import NewCycleForm from "./components/NewCycleForm";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

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
  elapsedSeconds: number;
  markCurrentCycleAsFinished(): void;
  setElapsedTime(seconds: number): void;
}

export const CyclesContext = createContext({} as CyclesContextData);

const validationSchema = zod.object({
  task: zod.string().trim().min(1, "Informe a tarefa."),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos.")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof validationSchema>;

function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, reset, watch } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task?.trim();

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

  function handleCreateNewCycle(data: NewCycleFormData) {
    const newCycle: Cycle = {
      id: self.crypto.randomUUID(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    setCycles((currentValue) => [...currentValue, newCycle]);
    setActiveCycleId(newCycle.id);
    setElapsedSeconds(0);
    reset();
  }

  function handleStopCycle() {
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
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            elapsedSeconds,
            markCurrentCycleAsFinished,
            setElapsedTime,
          }}
        >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={handleStopCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}

export default Home;
