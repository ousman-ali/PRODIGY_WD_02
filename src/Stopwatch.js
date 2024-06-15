import React, {useState, useEffect,useRef} from 'react'
import  "./Stopwatch.css"
const math = require ('mathjs')
// var floor = require( 'math-floor' );


function parseTimeFormat(timeString) {
    const [hoursString, minutesString, secondsString, millisecondsString] = timeString.split(':');
  
    const hours = parseInt(hoursString, 10);
    const minutes = parseInt(minutesString, 10);
    const seconds = parseInt(secondsString, 10);
    const milliseconds = parseInt(millisecondsString, 10) * 10;
  
    const elapsedTime = (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
    return elapsedTime;
  }

const Stopwatch = () => {
    const [isRunning, setIsRunning]=useState(false);
    const [elapsedTime, setElapsedTime]=useState(0);
    const intervalIdRef= useRef(null);
    const startTimeRef=useRef(0);
    const [laps, setLaps]=useState([]);
    const [time, setTime]=useState([]);
    const [lapTime, setLapTime] = useState([]);


    useEffect(()=>{

        if(isRunning){
            intervalIdRef.current= setInterval(()=>{
                setElapsedTime(Date.now()-startTimeRef.current);
            },10);
        }

        return ()=>{
            clearInterval(intervalIdRef.current);
        }

    }, [isRunning]);

    function start(){
        setIsRunning(true);
        startTimeRef.current= Date.now()-elapsedTime;
    }

    function pause(){
        setIsRunning(false);
    }

    function reset(){
        setElapsedTime(0);
        setIsRunning(false);
        setLaps([]);
        setTime([]);
        setLapTime([]);

    }

    function timeFormat(elapsedTime){
        let hours = math.floor(elapsedTime / (1000*60*60) % 12);
        let minutes = math.floor(elapsedTime / (1000*60) % 60);
        let seconds = math.floor(elapsedTime / (1000) % 60);
        let milliseconds = math.floor((elapsedTime % 1000) / 10);

        hours = String(hours).padStart(2,"0");
        minutes = String(minutes).padStart(2,"0");  
        seconds = String(seconds).padStart(2,"0"); 
        milliseconds = String(milliseconds).padStart(2,"0");
    
        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
      
    }

    function handleClick() {
        if (isRunning) {
            const currentTime = elapsedTime;
          setLaps((prevLaps) => [...prevLaps, currentTime]);
          setTime((prevTime) => [...prevTime, timeFormat(currentTime)]);
          if (time.length > 0) {
            const intervalTime = currentTime -  parseTimeFormat(time[time.length - 1]);
            setLapTime((prevLapTime) => [...prevLapTime, timeFormat(intervalTime)]);
          } else {
            setLapTime((prevLapTime) => [...prevLapTime, '00:00:00:00']);
          }
        }
      }

     return (
       <>
              <div className='stopwatch'>
                   <div className='watch'>{timeFormat(elapsedTime)}</div>  
                        <div className='time-controls'>
                            <button onClick= {start} className='start-button'>Start</button>
                            <button onClick= {pause} className='pause-button'>Pause</button>
                            <button onClick= {reset} className='reset-button'>Reset</button>
                        </div>  
                 
              </div>  
          <div className='lap'>
            <button onClick={handleClick}>Lap</button>
                <div className='lap-display'>
                    <div className='contents'>Lap
            <div>
                     {laps.map((lap, index) => (
                     <div key={index}>{index + 1}</div>))}
            </div>
                    </div>
                        <div className="contents">
                                    Lap time
                                    <div>
                                        {lapTime.map((t, index) => (
                                            <div key={index}>{t}</div>
                                        ))}
                                   </div>
                       </div>
                    <div className='contents'>Overall time
                    <div>
                            {time.map((t, index) => (
                            <div key={index}>{t}</div>  ))}
                    </div>
                    </div>
                </div>
            </div>
       </>   
            );
}

export default Stopwatch;
