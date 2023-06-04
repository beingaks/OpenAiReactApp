const PORT = 5000;
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const API_KEY = "XXXXXXXXXXXXXXX"; //value of API key

app.post("/completions", async (req, res) => {  //post request for  client  

const options = { //all the payload that will be sent to the api
    method:"POST",
    headers:{
        "Authorization":`Bearer ${API_KEY}`,
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{role:"user",content:req.body.message}], //this is the user query
        max_tokens:100,
    })
}

  try {

   const response= await fetch('https://api.openai.com/v1/chat/completions',options)
    const data =await response.json();
    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
