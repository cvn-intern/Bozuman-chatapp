import React, {useState, useRef, useEffect} from 'react'

interface Count {
  count: number;
  changeCount: React.Dispatch<React.SetStateAction<number>>
}

const CountDown = ({count, changeCount}: Count) => {
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  const [timer, setTimer] = useState(0);

  const getTimeRemaining = (date: string) => {
    const total = Date.parse(date) - Date.parse((new Date()).toString());
    const seconds = Math.floor((total/1000) % 60);
    return {total, seconds};
  }

  const startTimer = (date: string) => {
    let {total, seconds} = getTimeRemaining(date);
    if(total >= 0) {
      setTimer(seconds);
      changeCount(seconds);
      sessionStorage.setItem('count', (timer-1).toString());
    }
  }

  const clearTimer = (date: string) : void => {
    setTimer(count);

    if (ref.current) {
      clearInterval(ref.current)
    }
    
    const id = setInterval(() => {
      startTimer(date);
    }, 1000);
    ref.current = id;
  }

  const getDeadTime = () : Date => {
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + count);
    return deadline;
  }

  useEffect(() => {
    clearTimer(getDeadTime().toString());
  },[count])

  return (
    <>
      {timer}
    </>
  )
}

export default CountDown;
