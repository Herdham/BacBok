const chatTo = document.getElementById("chatTo")
const find_people = document.querySelector(".find_people")
const startChat = document.querySelector(".no_message")
chatTo.addEventListener("click", function(e){
    find_people.style.display = "block"
    startChat.style.display = "none"
})


startChat.addEventListener("click", function(e) {
    find_people.style.display = "block"
    startChat.style.display = "none"
})


const to_search = document.getElementById("to_search")
const list_container = document.querySelector(".list_container")
const list_wrapper = document.querySelector(".list_wrapper")
to_search.addEventListener("keyup", function(e) {
    let query = to_search.value.trim()

    if(query === ""){
        list_container.style.display = "none"
        list_wrapper.innerHTML = ""
        return
    }

    
    fetch(`/chat/api/search-profile?q=${encodeURIComponent(query)}`, {
        method: "GET"
    }).then(res => res.json()).then(data => {
        
        list_container.style.display = "none"
        list_wrapper.innerHTML = ""
        const message_link = list_wrapper.closest(".list_container")

        //loggedIn UserName
        let loggedUser = JSON.parse(document.getElementById("user-data").textContent)
        
        data.forEach(element => {
            if(!(element.username === loggedUser)){
                list_container.style.display = "block"
                const div = document.createElement("div")
                div.setAttribute("class", "peoples_info")
                const div2 = document.createElement("div")
                div2.setAttribute("class", "peoples_info_data")
                const atag = document.createElement("a")
                atag.setAttribute("class", "list_link")
                const img = document.createElement("img")
                const h4 = document.createElement("h4")
                const p = document.createElement("p")
                img.src = element.image
                h4.innerText = element.fullname
                p.innerText = `@${element.username}`
                div2.append(h4, p)
                div.append(img, div2)
                atag.append(div)
                atag.href = `message/${element.id}`
                list_wrapper.append(atag)
            }
        });

        const message_to = document.querySelector(".message_to")
        const to_search = document.getElementById("to_search")

        //User Info to chat
        const info_wrapper = document.querySelector(".info_wrapper")
        const chatbox = document.querySelector(".chatBox")
        const form = document.querySelector(".form")
        function whomToChat(data){
            info_wrapper.style.display = "block"
            info_wrapper.innerHTML = ""
            const img = document.createElement("img")
            img.src = data.image
            const h4 = document.createElement("h4")
            h4.innerText = data.fullname
            const p = document.createElement("p")
            p.innerHTML = `<p><ion-icon name="lock-closed-outline"></ion-icon><span>Only people in this chat can read, listen to, or share them</span></p>`
            const div = document.createElement("div")
            div.setAttribute("class", "user_info")
            div.append(img, h4, p)
            info_wrapper.append(div)
            chatbox.style.display = "block"
            form.style.display = "block"
        }

        //UserCancle not to chat
        function UserCancle(data){
            list_container.style.display = "none"
            list_wrapper.innerHTML = ""
            const h5 = document.createElement("h5")
            h5.innerText = data.fullname
            const ionIcon = document.createElement("ion-icon")
            ionIcon.setAttribute("name", "close-outline")
            ionIcon.setAttribute("id", "cancle_user_btn")
            const div = document.createElement("div")
            div.setAttribute("class", "cancle_user")
            div.append(h5, ionIcon)
            to_search.style.display = "none"
            message_to.append(div)
            
            
            
            //To Remember the clickBtn
            function remember(){
                ionIcon.addEventListener("click", function(e){
                    div.style.display = "none"
                    to_search.style.display = "block"
                    info_wrapper.style.display = "none"
                    to_search.value = ""
                    chatbox.style.display = "none"
                    form.style.display = "none"
                })
            }

            return remember
            
        }

        const wrapper = list_wrapper.querySelectorAll(".list_link")
        wrapper.forEach(wrap => {
            wrap.addEventListener("click", function(e){
                e.preventDefault()
                console.log(e.currentTarget.href)
                const linkUrl = String(e.currentTarget.href).split("/")
                const profileId = Number(linkUrl[linkUrl.length - 1])
                console.log(profileId)
                
                fetch(`/chat/api/search-profile?q=${encodeURIComponent(query)}`, {
                    method: "GET"
                }).then(res => res.json())
                .then(profiles => {
                    profiles.forEach(profile => {
                        if (profile.id == profileId) {
                            UserCancle(profile)()
                            whomToChat(profile)

                            fetch(`/chat/get_message_api/${profileId}`, {
                                method: "GET"
                            }).then(res => res.json())
                            .then(messages => {
                                const message_container = document.querySelector(".message_container");
                                const message = messages.message
                                const chatBox = document.querySelector(".chatBox")
                                message.forEach(msg => {
                                    function scrollToBottom(){
                                        chatBox.scrollTop = chatBox.scrollHeight
                                    }
                                    if (msg.sender__username == loggedUser) {
                                        const sender = document.createElement("div")
                                        sender.className = "sender"
                                        const sender_name = document.createElement("strong")
                                        const span_msg = document.createElement("span")
                                        sender_name.innerText = msg.sender__username
                                        span_msg.textContent = msg.message
                                        sender.append(sender_name, span_msg)
                                        message_container.append(sender)
                                    }else{
                                        const receive = document.createElement("div")
                                        receive.className = "receive"
                                        const receive_name = document.createElement("strong")
                                        const span_msg = document.createElement("span")
                                        receive_name.innerText = msg.sender__username
                                        span_msg.textContent = msg.message
                                        receive.append(receive_name, span_msg)
                                        message_container.append(receive)

                                    }
                                    scrollToBottom()
                                })
                                scrollBottom()
                            })
                            function scrollBottom(){
                                const anchor = document.getElementById("anchor")
                                if (anchor) {
                                    anchor.scrollIntoView({behavior: "auto", block: "end"})
                                }
                            }

                            document.addEventListener("DOMContentLoaded", scrollBottom)
                            window.addEventListener("load", scrollBottom)

                            const socketUrl = `ws://${window.location.host}/ws/chat/message/${profileId}`
                            const chatSocket = new WebSocket(socketUrl)
                            const message_form = document.getElementById("message_form")
                            const message_input = document.getElementById("message_input")
                            const message_container = document.querySelector(".message_container")
                
                            chatSocket.addEventListener("open", function(e){
                                console.log("Connection Establised and connected")
                                
                                message_form.addEventListener("submit", function(e) {
                                    e.preventDefault()
                                    const formData = new FormData(e.currentTarget)
                                    console.log(formData)
                                    chatSocket.send(JSON.stringify({
                                        'message': message_input.value
                                    }))
                                    message_form.reset()
                                })
                            })

                            chatSocket.addEventListener("message", function(e){
                                const data = JSON.parse(e.data)
                                fetch(`/chat/get_message_api/${profileId}`, {
                                    method: "GET"
                                })
                                .then(res => res.json())
                                .then(messages => {   
                                    const chatBox = document.querySelector(".chatBox")
                                    const currentUserId = JSON.parse(document.getElementById("userId").textContent)
                                    const currentUser = JSON.parse(document.getElementById("user-data").textContent)
                                    function scrollToBottom() {
                                        chatBox.scrollTop = chatBox.scrollHeight
                                    }
                                    if (data.user_id == currentUserId) {    
                                        message_container.innerHTML += `<div class="sender"><strong>${currentUser}</strong><span>${data.message}</span></div>`
                                    }else{
                                        message_container += `<div class="receive"><strong>${messages.target_user}</strong><span>${data.message}</span></div>`
                                    }
                                    scrollToBottom()
                                })
                            })
                        }
                    })
                })
            })
        })
    })


})



