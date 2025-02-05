// tela login
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login-form")
const loginInput = loginForm.querySelector(".login-input")

const conecting = document.querySelector(".conecting")

//tela chat
const chat = document.querySelector(".chat")
const chatMessages = document.querySelector(".chat-messages")
const chatForm = chat.querySelector(".chat-form")
const chatInput = chatForm.querySelector(".chat-input")

const chatUsers = chat.querySelector(".chat-users")
const chatUser = chatUsers.querySelector(".chat-user")

// variaveis
const user = { id: "", name: "", color: "", login: false }
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
let users = []

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
    let content =  JSON.parse(data)
    
    if (content.users) {
        createUsers(content.users)
    }

    if (content.logout == true) {
        createMessageLogout(content)
        createCountNotify(content)
    }

    if (content.login == true) {
        createMessageLogin(content)
        createCountNotify(content)
    }
    const { userId, userName, userColor, userLogin, userContent } = JSON.parse(data)
    
    if (userLogin == false) {
        const message = userId == user.id
            ? createMessageSelf(userContent)
            : createMessageOther(userContent, userName, userColor)
            
            chatMessages.appendChild(message)
            scrollScreen()
    }
}

const createUsers = (data) => {
    chatUsers.innerHTML = ""
    data.forEach(user => {
        const div = document.createElement("div")
    
        div.classList.add("chat-user")
        
        div.innerHTML = user.name
        div.style.color = user.color
    
        chatUsers.appendChild(div)
    });
}

const createMessageLogin = (data) => {
    const userLogin = document.createElement("div")
    userLogin.classList.add("user-conection")
    userLogin.innerHTML = `<span style="color: ${data.userColor}">${data.userName}</span> entrou no chat.`
    chatMessages.appendChild(userLogin)
    scrollScreen()
}

const createMessageLogout = (data) => {
    const user = data.user
    const userLogout = document.createElement("div")
    userLogout.classList.add("user-conection")
    userLogout.innerHTML = `<span style="color: ${user.color}">${user.name}</span> se desconectou.`
    chatMessages.appendChild(userLogout)
    scrollScreen()
}

const createCountNotify = (data) => {
    const countUsers = document.createElement("div")
    countUsers.classList.add("count-users")
    countUsers.innerHTML = `online: <span style="color: chartreuse">${data.users.length}</span>`
    chatMessages.appendChild(countUsers)
}

const sendMessageLogin = (user) => {
    
    chat.style.display = "flex"
    conecting.style.display = "none"

    const data = {
        name: user.name,
        color: user.color,
        id: user.id
    }
    
    websocket.send(JSON.stringify({type: "login", data}))
}

const handleLogin = (event) => {
    event.preventDefault()
    
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    conecting.style.display = "flex"

    websocket = new WebSocket('wss://app-chating.onrender.com') //wss://app-chating.onrender.com
    
    websocket.onopen = () => sendMessageLogin(user)
    websocket.onclose = () => websocket.send("close")

    websocket.onmessage = processMessage
}

const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        userLogin: user.login,
        userContent: chatInput.value
    }

    websocket.send(JSON.stringify(message))
    chatInput.value = ""
}


// eventos
loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)