import express from "express"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const users = []
const tweets = []

app.post("/sign-up", (req, res) => {
    const { username, avatar } = req.body
    if (!username || !avatar || (typeof username !== 'string') || (typeof avatar !== 'string')) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }
    const user = { username, avatar }
    users.push(user)

    res.status(201).send("OK")
})

app.post("/tweets", (req, res) => {
    const { username, tweet } = req.body
    const { user } = req.headers
    if (user) {

        if (!tweet || (typeof tweet !== 'string')) {
            return res.status(400).send("Todos os campos são obrigatórios!")
        }
        const isHAuthorized = users.find((u) => u.username === user)
        if (!isHAuthorized) {
            return res.sendStatus(401)
        }
        const newHTweet = { username: user, tweet }
        tweets.push(newHTweet)
        res.status(201).send("OK")
    }
    if (!username || !tweet || (typeof username !== 'string') || (typeof tweet !== 'string')) {
        return res.status(400).send("Todos os campos são obrigatórios!")
    }
    const isAuthorized = users.find((user) => user.username === username)
    if (!isAuthorized) {
        return res.sendStatus(401)
    }
    const newTweet = { username, tweet }
    tweets.push(newTweet)
    res.status(201).send("OK")
})

app.get("/tweets", (req, res) => {
    const {page} = parseInt(req.query.page)
    if(page) {
        if(page === 1 ) {
            const tenLastPTweets = tweets.map((t) => {
                const newPFormat = users.find((u) => u.username === t.username ?? u.avatar)
                return { ...newPFormat, tweet: t.tweet }
            }).slice(-10).reverse()
            res.send(tenLastPTweets)
        }else if(page === 2) {
            const tenMiddleTweets = tweets.map((t) => {
                const newTFormat = users.find((u) => u.username === t.username ?? u.avatar)
                return { ...newTFormat, tweet: t.tweet }
            }).slice(-11, -20).reverse()
            res.send(tenMiddlePTweets)
        } else {
            return res.status(400).send("Informe uma página válida!")
        }
    }
    const tenLastTweets = tweets.map((t) => {
        const newFormat = users.find((u) => u.username === t.username ?? u.avatar)
        return { ...newFormat, tweet: t.tweet }
    }).slice(-10).reverse()
    res.send(tenLastTweets)
})

app.get("/tweets/:username", (req, res) => {
    const { username } = req.params
    const userExist = tweets.find((u) => u.username === username)

    const userTweets = tweets.filter((t) => t.username === username ?? t.tweet)
    res.send(userTweets)
})

const PORT = 5000
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} `))