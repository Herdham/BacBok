const messageForm = document.getElementById("messageForm")
console.log(messageForm)


const UserId = JSON.parse(document.getElementById("user-id").textContent)
const webSocketUrl = `ws://${window.location.host}/ws/chat/message/${UserId}`
const chatSocket = new WebSocket(webSocketUrl)

chatSocket.addEventListener("open", function(e){
    console.log("Connection Established")
    messageForm.addEventListener("submit", function(e){
        e.preventDefault()
        const messageInput = document.getElementById("messageInput").value
        chatSocket.send(JSON.stringify({
            "message": messageInput
        }))

        messageForm.reset()
    })
})

chatSocket.addEventListener("message", function(e) {
    const data = JSON.parse(e.data)
    const username = JSON.parse(document.getElementById("user-data").textContent)
    const receiver_username = JSON.parse(document.getElementById("receiver_username").textContent)
    const currentUserId = JSON.parse(document.getElementById("currentId").textContent)
    const messages = document.querySelector(".messages")
    const message = document.querySelector(".message")

    function scrollBottomMessage(){
        messages.scrollTop = messages.scrollHeight
    }
    
    if(data.user_id == currentUserId){
        message.innerHTML += `<div class="sender_message">
                                            <strong>${username}</strong>
                                            <span>${data.message}</span>
                                        </div>`
    }else{
        message.innerHTML += `<div class="receiver_message">
                                        <strong>${receiver_username}</strong>
                                        <span>${data.message}</span>
                                    </div>`
    }
    scrollBottomMessage()
})

function scrollBottom() {
    const anchor = document.getElementById("scroll-anchor")
    if (anchor) {
        anchor.scrollIntoView({ behavior: "auto", block: "end" })
    }
}

document.addEventListener("DOMContentLoaded", function(){
    setTimeout(scrollBottom, 20)
})

window.addEventListener("load", scrollBottom)