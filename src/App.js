import { useEffect,useRef,useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import axios from "axios";
import './App.css';
import handleFileChange from './HandleFileChange';
  import ArrowRightIcon from '@mui/icons-material/ArrowRight';
function App() {
  useEffect(() => {
   pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdfjs/pdf.worker.min.js`;
  }, []);
  const [textcontent,setTextContent]=useState("");
  const [showContentMenu,setShowContentMenu]=useState(false);
  const ref=useRef(null);
  const [text,settext]=useState("");
  const [pos,setPos]=useState({
    x:"",
    y:""
  })
  const [showMeaning,setShowMeaning]=useState(false);
  const [objs,setobjs]=useState({});
  console.log(objs);
   useEffect(()=>{
    console.log(textcontent);
   },[textcontent])
    const handleSpeak = (text) => {
      if (!('speechSynthesis' in window)) {
        alert('Your browser does not support Text-to-Speech');
        return;
      }
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US'; // You can change this to any language code, e.g., 'es-ES' for Spanish
  
      // Speak the text
      window.speechSynthesis.speak(utterance);
    };
    
    useEffect(() => {
      const handleKeyPress = (event) => {
        console.log('Key pressed:', event.key);
        if(event.key=="Meta"){
          setShowContentMenu(false);
        }
      };
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }, []);
    const   handleRightClick = (event,index,val1) => {
      event.preventDefault(); // Prevents the default right-click context menu
      // alert('Right-click detected!');
      settext(val1);
      console.log(" =>  ",index,event.target ,event,`${index}__`);
      setShowContentMenu(true);
      const { clientX, clientY } = event;
      setPos({
        ...pos,x:clientX,y:clientY
      })
      // Get the bounding rectangle of the parent element
      const parentElement = event.currentTarget.parentElement;
      const parentRect = parentElement.getBoundingClientRect();
    
      // Calculate position relative to the parent `div`
      // const relativeX = clientX - parentRect.left;
      // const relativeY = clientY - parentRect.top;
      
    };
    const [pageCount,setpageCount]=useState(0);
  return (
    <div className="App bg-black text-[white]">

      {pageCount ? <div className={` absolute top-[20px] left-[40px] `}>{pageCount}</div> :null }
     {!textcontent && <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>handleFileChange(e,setTextContent)}
      />}
      {textcontent ? <div className="w-[100%] bg-[rgba(255,255,255,.3)] min-h-[100px]"></div>:null}
      <div onClick={(e)=>{
          if(e.button===0){
            setShowContentMenu(false);
          }
      }} className="flex !transition-all flex-row h-[90%] mt-2 w-[100%]    ">{
        // flex  relative  w-90% flex-row h-90% gap-[20px] border-2 border-black overflow-y-scroll
         textcontent?.length? textcontent.map((ele,ind1)=>{
          return <div  style={{marginLeft: ind1===0? !pageCount? "":`-${pageCount}00%`:""}} key={ind1}  className=" main !min-w-[100%] h-[95%]  !overflow-y-scroll   ">
            
            {
              ele?.items?.map((e,i)=>{
                // console.log(e);
                if(e?.hasEOL)
                return <div   className={`flex min-w-[100%] h-[${e.height}px] items-center justify-center text-[20px] gap-[5px] my-1 `}  key={i}> 
                {e?.str.split(" ").map((val1,i1)=>{
                  return <div ref={ref} id={`${i+i1+ind1}__`} onContextMenu={(el)=>handleRightClick(el,i+i1+ind1,val1)} onClick={()=>{
                    console.log(val1);
                    handleSpeak(val1);
                  }} className=" " key={i+i1}>{val1}</div>
                })}
                 </div>
                else
                return  <div   className={`flex min-w-[${e.width}px] h-[${e.height}px] items-center justify-center text-[20px] gap-[5px] my-1 `}  key={i}> 
                {e?.str.split(" ").map((val1,i1)=>{
                  return <div ref={ref} id={`${i1+i+ind1}__`} onContextMenu={(el)=>handleRightClick(el,i1+i+ind1,val1)} onClick={()=>{
                    console.log(val1);
                    // handleSpeak(val1);
                    // settext(val1);
                  }} className=" " key={i1}>{val1}</div>
                })}
                 </div>
                
                // <div style={{minWidth:`${e.width}px`,marginLeft:"2px",marginRight:"2px", whiteSpace: "nowrap",height:`${e.height}px`,fontSize:"18px"}} className="inner" key={i}> {e?.str} </div>
              })
            }
          </div>
         }):null
        
        }
        
        {
  showContentMenu && <ContentMenu showMeaning={showMeaning} setobjs={setobjs} setShowMeaning={setShowMeaning} left={pos.x} top={pos.y} val={text} handleSpeak={handleSpeak}/>
}
    {showMeaning? <div className="absolute gap-[20px] !text-white flex flex-col justify-center items-center top-[25%] py-5 bottom-auto !ml-[18%] mr-auto !w-[60%] !h-[auto] !bg-[rgba(255,255,255,.4)] backdrop-blur-lg ">
      
      {  Object.keys(objs)?.length ?
       <>
        <h1 className="text-[24px]">  Meaning of {Object.keys(objs)[0]} </h1>
        <p className="w-[90%] leading-9 line-clamp-5  text-[18px]">{Object.values(objs)[0]} </p>
        {/* {Object.values(objs)[0].split(", ").map((e,i)=>{
          return <p className="w-[90%] text-[18px]"> . {e} </p>
        })} */}
       </>
        :null  }
        <div className="border-[1px] absolute border-white px-2 py-1 top-[20px] left-auto right-[20px]" onClick={()=>{
          setobjs({})
          setShowMeaning(false);
        }}> X</div>
      </div>
    :null
    }

{true &&     <ArrowRightIcon onClick={()=>setpageCount(pageCount+1)}  className="arrow active:bg-[rgba(0,0,0,.4)] transition-all active:cursor-pointer !left-[auto] !text-[32px] top-[120px] right-[5%] absolute"  />}

     
        </div>

       

    </div>
  );
}



export default App;


const ContentMenu=( {left,top,handleSpeak,val,setShowMeaning,setobjs} )=>{
  console.log(left,top);
  top=top + window.scrollY; 
  left= left + window.scrollX;
  const style = {
    position: 'absolute',
    left: `${left+30}px`,
    top: `${top-70}px`,
  };
  function trimSpecialCharactersAndSpaces(word) {
    // Use regex to match and trim special characters, commas, and white spaces from the start and end of the word
    return word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '').trim().replace(/^,+|,+$/g, '');
  }
  val=trimSpecialCharactersAndSpaces(val);
  async function meaningOfWord(word){
    try{const resp=await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    var data=(resp?.data[0]?.meanings);
    const newarr= data.map(e=>{
      return {definitions:e.definitions,partOfSpeech:e?.partOfSpeech};
     })
     var meanings=newarr.map(e=>{
      e= (e.definitions.map(e=>{
         e=(e.definition);
         return e;
       })).join(",");
       return e;
     }).join(",");
     console.log(`${val}`,meanings);
     return {[val]:meanings};
  }
    catch(e){
      console.log(e?.message);
      return {"error":e?.message}
    }
  }
  
  // useEffect(()=>{
  //  console.log("comp is getting updated",showMeaning);
  // },[showMeaning])
  var list=["Text to Speech","Annotation","BookMark"];
  return <> <div style={style} className={` absolute w-[auto]   h-[auto] bg-black  flex flex-col `}>

    {
      list.map((e,i)=>{
        return <div onClick={async()=>{
          if(i==0){
            handleSpeak(val)
          }
          else if(i==1){
            setShowMeaning(true);
            // meaningOfWord(val);
            setobjs(await meaningOfWord(val));
          }
        }} className={` active:tracking-wider w-[170px] cursor-pointer h-[30px]  border-[1px] flex font-2xl items-center justify-start  py-4 px-4  border-white text-white`} key={i}>{e}</div>
      })
    }
  </div>

  </>

}