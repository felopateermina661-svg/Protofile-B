import React, { useState } from 'react'



export default function TypeWrite({text}) {

const [display, setDisplay] = useState("");
const [phase, setPhase] = useState("typing");

useEffect(() => {
  
let timer;

if (phase === "typing") {
  if (display.length < text.length) {
    timer = setTimeout(() => {
     
    setDisplay(text.slice(0, display.length + 1))
    }, 50);
  } else {
    timer = setTimeout(() => {
      
    setPhase("erasing");
    }, 1500);
  }
}

  if (phase === "erasing") {
    if (display.length > 0) {
      timer = setTimeout(() => {
        
        setDisplay(text.slice(0, display.length - 1))
      }, 30);

    } else {

      timer = setTimeout(() => {
      setPhase("typing");
      }, 300);
    }
  }

  return () => {
    
  clearTimeout(timer);
  }
  
}, [phase, display, text])



  return (
    <p className=" flex text-white text-2xl font-black justify-between ">{display}</p>
  )
}





function App() {
  return (
    <TypeWrite text={"I'm a Full Stack Developer"} />
  )
}

export default App;

