import { useContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";
import { CountdownContainer, Separator } from "./styles";
import { CyclesContext } from "../..";

function Countdown() {
  const { activeCycle, activeCycleId, markCurrentCycleAsFinished } =
    useContext(CyclesContext);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

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
          markCurrentCycleAsFinished();
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
  }, [
    activeCycle,
    activeCycleId,
    cycleSecondsAmount,
    markCurrentCycleAsFinished,
  ]);

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  );
}

export default Countdown;
