import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const users = []
const tweets = []

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body
    if(!username || !avatar || (typeof username !== 'string') || (typeof avatar !== 'string')) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }
    const user = {username, avatar}
    users.push(user)
    
    res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    const {username, tweet} = req.body
    if(!username || !tweet || (typeof username !== 'string') || (typeof tweet !== 'string')) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }
    const isAuthorized = users.find((user) => user.username === username)
    if(!isAuthorized) {
        return res.sendStatus(401)
    }
    const newTweet = {username, tweet}
    tweets.push(newTweet)
    res.status(201).send("OK")
})

app.get("/tweets", (req, res) => {
    const tenLastTweets = tweets.map((t) => {
        const newFormat = users.find((u) => u.username === t.username ?? u.avatar)
        return {...newFormat, tweet: t.tweet}
    }).slice(-10).reverse()
    res.send(tenLastTweets)
})

app.get("/tweets/:username", (req, res) => {
    const {username} = req.params
    const userExist = tweets.find((u) => u.username === username)
    if(!userExist) {
        return res.status(400).send("Usuário não tweetou ainda!")
    }
    const userTweets = tweets.filter((t) => t.username === username ?? t.tweet)
    res.send(userTweets)
})

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} `))