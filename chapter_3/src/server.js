import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'


const app = express()
const PORT = process.env.PORT|| 3000


const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)


app.use(express.json())


app.use(express.static(path.join(__dirname, '../public')))


app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


// Routes
app.use('/auth', authRoutes)

app.listen(PORT, () =>{
        console.log(`server has started on port: ${PORT}`)
})