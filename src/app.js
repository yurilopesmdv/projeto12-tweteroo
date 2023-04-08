import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const users = []
const tweets = []

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body
    const user = { username, avatar}
    users.push(user)
    res.send("OK")
})



const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} `))