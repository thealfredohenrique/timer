import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { HandPalm, Play } from "@phosphor-icons/react";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().trim().min(1, "Informe a tarefa."),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos.")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const task = watch("task");
  const isSubmitDisabled = !task?.trim();

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
  const cycleSecondsAmount = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSecond = activeCycle ? cycleSecondsAmount - elapsedSeconds : 0;
  const cycleMinutes = Math.floor(currentSecond / 60);
  const cycleSeconds = currentSecond % 60;
  const minutes = String(cycleMinutes).padStart(2, "0");
  const seconds = String(cycleSeconds).padStart(2, "0");

  useEffect(() => {
    let interval: number;

    if (activeCycle) {
      interval = setInterval(() => {
        const diffInSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (diffInSeconds >= cycleSecondsAmount) {
          setCycles((currentValue) =>
            currentValue.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() };
              } else {
                return cycle;
              }
            })
          );

          setElapsedSeconds(cycleSecondsAmount);
          clearInterval(interval);
        } else {
          setElapsedSeconds(diffInSeconds);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, activeCycleId, cycleSecondsAmount]);

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}:${seconds}`;
  }, [activeCycle, seconds, minutes]);

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
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            type="text"
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register("task")}
          />
          <datalist id="task-suggestions">
            <option value="Projeto A"></option>
            <option value="Projeto B"></option>
            <option value="Projeto C"></option>
          </datalist>

          <label htmlFor="minutes-amount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutes-amount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

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
