// tela login
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = loginForm.querySelector(".login-input")

//tela chat
const chat = document.querySelector(".chat")
const chatMessages = document.querySelector(".chat-messages")
const chatForm = chat.querySelector(".chat-form")
const chatInput = chatForm.querySelector(".chat-input")


// variaveis
const user = { id: "", name: "", color: ""}
const colors = [
    "coral",
    "aquamarine",
    "bisque",
    "burlywood",
    "chocolate",
    "darkorange",
    "deeppink",
    "crimson",
    "forestgreen",
    "gold"
]

let websocket


// funções
const createMessageSelf = (content) => {
    const div = document.createElement("div")
    
    div.classList.add("chat-self-messages")
    
    div.innerHTML = content

    return div
}

const createMessageOther = (content, name, color) => {
    const div = document.createElement("div")
    const span = document.createElement("span")
    
    div.classList.add("chat-others-messages")
    span.classList.add("message-others")
    
    div.appendChild(span)
    span.style.color = color
    
    span.innerHTML = name
    div.innerHTML += content
    

    return div
}

const getRandomColor = () => {
    const i = Math.floor(Math.random() * colors.length)
    return colors[i]
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, userContent } = JSON.parse(data)

    const message = userId == user.id
        ? createMessageSelf(userContent)
        : createMessageOther(userContent, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault()
    
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket('ws://localhost:8080')
    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        userContent: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}


// eventos
loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)