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

const chatUsersMobile = chat.querySelector(".chat-users-mobile")
const chatUsers = chat.querySelector(".chat-users")
const chatUser = chatUsers.querySelector(".chat-user")

// botao open close users

const openClose = chat.querySelector(".open-close-users")
const openUsers = openClose.querySelector("#menu")
const closeUsers = openClose.querySelector("#close")


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

const openCloseButton = () => {
    if (closeUsers.style.display == 'none') {
        closeUsers.style.display = 'flex'
        openUsers.style.display = 'none'
        chatUsersMobile.style.width = '250px'
        chatUsersMobile.style.height = '100vh'
        chatUsersMobile.style.padding = '15px'
    } else {
        closeUsers.style.display = 'none'
        openUsers.style.display = 'flex'
        chatUsersMobile.style.width = '0'
        chatUsersMobile.style.height = '0'
        chatUsersMobile.style.padding = '0'
    }
}

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


const scrollDown = () => {
    const chatContainer = document.querySelector(".chat-container")
    chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
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
            scrollDown()
    }
}

const createUsers = (data) => {
    chatUsers.innerHTML = ""
    chatUsersMobile.innerHTML = ""
    data.forEach(user => {
        const div1 = document.createElement("div")
        const div2 = document.createElement("div")
    
        div1.classList.add("chat-user")
        div2.classList.add("chat-user")
        
        div1.innerHTML = user.name
        div2.innerHTML = user.name
        div1.style.color = user.color
        div2.style.color = user.color
    
        chatUsers.appendChild(div1)
        chatUsersMobile.appendChild(div2)
    });
}

const createMessageLogin = (data) => {
    const userLogin = document.createElement("div")
    userLogin.classList.add("user-conection")
    userLogin.innerHTML = `<span style="color: ${data.userColor}">${data.userName}</span> entrou no chat.`
    chatMessages.appendChild(userLogin)
    scrollDown()
}

const createMessageLogout = (data) => {
    const user = data.user
    const userLogout = document.createElement("div")
    userLogout.classList.add("user-conection")
    userLogout.innerHTML = `<span style="color: ${user.color}">${user.name}</span> se desconectou.`
    chatMessages.appendChild(userLogout)
    scrollDown()
}

const createCountNotify = (data) => {
    const countUsers = chat.querySelector(".count-users")
    countUsers.innerHTML = ""
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
openClose.addEventListener("click", openCloseButton)