import React, { useEffect, useState } from 'react';

const TextToSpeechComponent = ({word}) => {
  const [text, setText] = useState(word);

  
//   useEffect(()=>{
//      handleSpeak();
//   },[word])
  return (
    <div>
      {/* <h1>Text-to-Speech Demo</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something to speak"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSpeak}>Speak</button> */}
    </div>
  );
};

export default TextToSpeechComponent;
