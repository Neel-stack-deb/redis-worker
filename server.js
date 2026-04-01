const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.post("/send-email",async (req,res)=>{
  try {
    const email = req.body.email;
  } catch (error) {
    
  }
})
app.get("get-emails/:emailId",async (req,res)=>{})

app.listen(port, ()=>{console.log(" Server is running on port " + port);
});