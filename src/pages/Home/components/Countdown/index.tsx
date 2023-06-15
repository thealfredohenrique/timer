import { useContext, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";
import { CountdownContainer, Separator } from "./styles";

function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    elapsedSeconds,
    setElapsedTime,
  } = useContext(CyclesContext);

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
          new Date(activeCycle.startDate)
        );

        if (diffInSeconds >= cycleSecondsAmount) {
          markCurrentCycleAsFinished();
          setElapsedTime(cycleSecondsAmount);
          clearInterval(interval);
        } else {
          setElapsedTime(diffInSeconds);
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

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}:${seconds}`;
  }, [activeCycle, minutes, seconds]);

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
