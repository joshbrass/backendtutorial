const express = require("express")

const app = express()
const PORT = 8383


let data = ['doshima']

// Middleware
app.use(express.json())
// HTTP VERBS && ROUTES
// the method informs the nature of request and the route is a further subdirectory. (basically we direct the request to the body of the respond appropriately, and these locations or routes are called endpoints)

// type 1 website endpoint
// the below is for a website endpoint,i.e when a user make a request , he gets a html code a page for a website where "/" is the home page and  "/" is the end point to get to the dashboard page 
app.get('/', (req,res) => {
    
    res.send(`
        <body style='background:red; color:white;'>
            <h1>Data:</h1>
            <p> ${JSON.stringify(data)}</p>
        </body>
        `)
})

app.get('/dashboard', (req,res) => {
    res.send("<h1> this is the dashboard page</h1>")
})

// type 2 API endpoints (none visual)

app.get('/api/data', (req,res) => {
    console.log("this one is for data")
    res.send(data)
})


app.post("/api/data",(req,res) => {
    // when someone want to create an account when he clicks the signup button,the browser sends out a network request to the server to handle the action
    const newData = req.body
    console.log(newData)
    data.push(newData.name)
    res.sendStatus(201)
})

app.delete('/api/data',(req,res) => {
    data.pop(
    console.log("we deleted the element succefully"),
    res.send(203)
    )

})

app.listen(PORT, () => console.log(`server is running in ${PORT}`))