import React, { useState,useEffect } from "react";
import { MdSend } from "react-icons/md";

function App() {
  const [value,setValue] = useState('') //state for taking input from the input tag
  const [message,setMessage] = useState(null); //to store the response we are getting from the server
  const [previousChats,setPreviousChats] = useState([]); //array to store all the previous chats
  const [currentTitle,setCurrentTitle] = useState(null); //value of current chat in our feild

  const createNewChat=()=>{ //function for creating a new chat
    setMessage(null);
    setValue('');
    setCurrentTitle(null);
  }

  const getMessages = async () => {   //for sending post request to our server to get response of the messages that we are requestng
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value, //value is the user query to the AI
      }),
      headers:{
        "Content-Type":"application/json"
      }
    };

    try {
      const response = await fetch("http://localhost:5000/completions", options);
      const data =await response.json();
      setMessage(data.choices[0].message);
    } catch (err) {
      console.log(err);
    }
  };

const handleClick = (uniqueTitle)=>{ // The function to bring back old chat from the history to the feed
  setCurrentTitle(uniqueTitle);
  setMessage(null);
  setValue("")
  
}

useEffect(()=>{

  if(!currentTitle&&value&&message){  // UseEffect callback for storing all the data of previous chat into an array
      setCurrentTitle(value);
  }
  if(currentTitle&&value){
      setPreviousChats(previousChats=>(
        [...previousChats,{
            title:currentTitle,
            role:"user",
            content:value
        },{
          title:currentTitle,
          role:message.role,
          content:message.content
        }]
      ))
  }


},[message,currentTitle])

const currentChat = previousChats.filter(previousChats=>previousChats.title===currentTitle) //current chat that is in our feed

const uniqueTitles= Array.from( new Set( previousChats.map(previousChat=>{ //for creating unique titles for our chat
  return previousChat.title
})))


return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {
            uniqueTitles?.map((uniqueTitle,index)=>{
              return <li key={index} onClick={()=>handleClick(uniqueTitle)}>{uniqueTitle}</li>
            })
          }
        </ul>
        <nav>
          <p>Made By Ashish</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle&&<h1>Intellichat</h1>}
        <ul className="feed">
                {currentChat?.map((chatMessage,index)=>{
                  return <li key={index} className={chatMessage.role==="user"?"userMessage":"AIMessage"}>
                    <p className="role">{chatMessage.role}:</p>
                    <p className="content">{chatMessage.content}</p>
                  </li>
                })}
                
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input type="text" value={value} onChange={(e)=>setValue(e.target.value)}/>
            <div className="submit">
              <MdSend onClick={getMessages} />
            </div>
          </div>
          <p className="info">
            This app is based on OpenAi's free API, Some information can be
            inaccurate, It does not provide data after 2021
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
