const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

let users = new Map()


wss.on("connection", (ws) => {
    ws.on("error", console.error)

    ws.on("message", (message) => {
        let data = JSON.parse(message.toString())
        
        if (data.type == "login") {
            const userId = data.data.id
            const userName = data.data.name
            const userColor = data.data.color
            
            users.set({ id: userId, name: userName, color: userColor }, ws)
            
            wss.clients.forEach((client) => client.send(JSON.stringify({userName, userColor ,users: Array.from(users.keys()), login: true})))
        }
        if (data.userLogin == false) {
            wss.clients.forEach((client) => client.send(message.toString()))
        }
    })

    ws.on("close", () => {
        console.log(users.entries())
        for (let [user, socket] of users.entries()) {
            if (socket == ws) {
                users.delete(user)
                wss.clients.forEach((client) => client.send(JSON.stringify({ users: Array.from(users.keys()), logout: true, user })))
            }
        }
    })

    console.log('Client connected.')
})