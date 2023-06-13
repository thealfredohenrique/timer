import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { HandPalm, Play } from "@phosphor-icons/react";
import { CyclesContext } from "../../contexts/CyclesContext";
import Countdown from "./components/Countdown";
import NewCycleForm from "./components/NewCycleForm";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";

const validationSchema = zod.object({
  task: zod.string().trim().min(1, "Informe a tarefa."),
  minutesAmount: zod
    .number()
    .min(5, "O ciclo precisa ser no mínimo de 5 minutos.")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos."),
});

type NewCycleFormData = zod.infer<typeof validationSchema>;

function Home() {
  const { activeCycle, createNewCycle, stopCurrentCycle } =
    useContext(CyclesContext);
  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, /* reset, */ watch } = newCycleForm;

  const task = watch("task");
  const isSubmitDisabled = !task?.trim();

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={stopCurrentCycle} type="button">
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
