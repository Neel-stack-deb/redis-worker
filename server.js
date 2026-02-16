const express = require('express');
const app = express();
const port = 3000;

app.use(express.json())

app.post("/send-email",()=>{})
app.get("get-emails/:emailId",()=>{})

app.listen(port, ()=>{console.log(" Server is running on port " + port);
});