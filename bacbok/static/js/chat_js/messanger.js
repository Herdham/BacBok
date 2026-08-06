// ==========================================
// GSAP ANIMATIONS - MESSENGER PAGE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    // Navbar slides down
    tl.from('.navbar', {
        duration: 0.6,
        y: -80,
        opacity: 0,
        ease: "power2.out"
    })

    // Left sidebar slides in
    .from('.main_container .first', {
        duration: 0.6,
        x: -60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.3")

    // Main area fades in
    .from('.main_container .second', {
        duration: 0.5,
        scale: 0.95,
        opacity: 0,
        ease: "back.out(1.5)"
    }, "-=0.3")

    // Chat list items stagger
    .from('.recent_message a', {
        duration: 0.4,
        x: -30,
        opacity: 0,
        stagger: 0.05,
        ease: "power2.out"
    }, "-=0.2");
});


// ==========================================
// DOM ELEMENTS
// ==========================================
const chatTo = document.getElementById("chatTo");
const find_people = document.querySelector(".find_people");
const startChat = document.querySelector(".no_message");

// Start chat button
chatTo.addEventListener("click", function(e) {
    find_people.style.display = "block";
    startChat.style.display = "none";
    
    // Fade in animation
    gsap.fromTo(find_people,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
});

// "Your messages" click to start chat
startChat.addEventListener("click", function(e) {
    find_people.style.display = "block";
    startChat.style.display = "none";
    
    gsap.fromTo(find_people,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
    );
});


// ==========================================
// SEARCH USERS TO MESSAGE
// ==========================================
const to_search = document.getElementById("to_search");
const list_container = document.querySelector(".list_container");
const list_wrapper = document.querySelector(".list_wrapper");

to_search.addEventListener("keyup", function(e) {
    let query = to_search.value.trim();

    if (query === "") {
        gsap.to(list_container, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
                list_container.style.display = "none";
                list_wrapper.innerHTML = "";
            }
        });
        return;
    }

    fetch(`/chat/api/search-profile?q=${encodeURIComponent(query)}`, {
        method: "GET"
    }).then(res => res.json()).then(data => {
        list_container.style.display = "none";
        list_wrapper.innerHTML = "";

        let loggedUser = JSON.parse(document.getElementById("user-data").textContent);

        data.forEach(element => {
            if (!(element.username === loggedUser)) {
                list_container.style.display = "block";
                
                const div = document.createElement("div");
                div.setAttribute("class", "peoples_info");
                
                const div2 = document.createElement("div");
                div2.setAttribute("class", "peoples_info_data");
                
                const atag = document.createElement("a");
                atag.setAttribute("class", "list_link");
                
                const img = document.createElement("img");
                const h4 = document.createElement("h4");
                const p = document.createElement("p");
                
                img.src = element.image;
                h4.innerText = element.fullname;
                p.innerText = `@${element.username}`;
                
                div2.append(h4, p);
                div.append(img, div2);
                atag.append(div);
                atag.href = `message/${element.id}`;
                list_wrapper.append(atag);
                
                // Stagger animation for search results
                gsap.from(div, {
                    x: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        });

        // Animate list container appearance
        gsap.fromTo(list_container,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );

        const message_to = document.querySelector(".message_to");
        const info_wrapper = document.querySelector(".info_wrapper");
        const chatbox = document.querySelector(".chatBox");
        const form = document.querySelector(".form");

        // Function to show who you're chatting with
        function whomToChat(data) {
            info_wrapper.style.display = "block";
            info_wrapper.innerHTML = "";
            
            const img = document.createElement("img");
            img.src = data.image;
            
            const h4 = document.createElement("h4");
            h4.innerText = data.fullname;
            
            const p = document.createElement("p");
            p.innerHTML = `<ion-icon name="lock-closed-outline"></ion-icon><span>Only people in this chat can read, listen to, or share them</span>`;
            
            const div = document.createElement("div");
            div.setAttribute("class", "user_info");
            div.append(img, h4, p);
            info_wrapper.append(div);
            
            chatbox.style.display = "block";
            form.style.display = "block";
            
            // Animate chat box appearance
            gsap.from(chatbox, { opacity: 0, y: 20, duration: 0.4, ease: "power3.out" });
            gsap.from(form, { opacity: 0, y: 20, duration: 0.3, delay: 0.1, ease: "power3.out" });
        }

        // Function to cancel chat with user
        function UserCancle(data) {
            list_container.style.display = "none";
            list_wrapper.innerHTML = "";
            
            const h5 = document.createElement("h5");
            h5.innerText = data.fullname;
            
            const ionIcon = document.createElement("ion-icon");
            ionIcon.setAttribute("name", "close-outline");
            ionIcon.setAttribute("id", "cancle_user_btn");
            
            const div = document.createElement("div");
            div.setAttribute("class", "cancle_user");
            div.append(h5, ionIcon);
            to_search.style.display = "none";
            message_to.append(div);
            
            // Animate cancel user tag
            gsap.from(div, { scale: 0, duration: 0.3, ease: "back.out(1.7)" });

            function remember() {
                ionIcon.addEventListener("click", function(e) {
                    gsap.to(div, {
                        scale: 0,
                        duration: 0.2,
                        onComplete: () => {
                            div.style.display = "none";
                            to_search.style.display = "block";
                            info_wrapper.style.display = "none";
                            to_search.value = "";
                            chatbox.style.display = "none";
                            form.style.display = "none";
                        }
                    });
                });
            }
            return remember;
        }

        const wrapper = list_wrapper.querySelectorAll(".list_link");
        wrapper.forEach(wrap => {
            wrap.addEventListener("click", function(e) {
                e.preventDefault();
                const linkUrl = String(e.currentTarget.href).split("/");
                const profileId = Number(linkUrl[linkUrl.length - 1]);

                fetch(`/chat/api/search-profile?q=${encodeURIComponent(query)}`, {
                    method: "GET"
                }).then(res => res.json())
                .then(profiles => {
                    profiles.forEach(profile => {
                        if (profile.id == profileId) {
                            UserCancle(profile)();
                            whomToChat(profile);

                            fetch(`/chat/get_message_api/${profileId}`, {
                                method: "GET"
                            }).then(res => res.json())
                            .then(messages => {
                                const message_container = document.querySelector(".message_container");
                                const message = messages.message;
                                const chatBox = document.querySelector(".chatBox");
                                
                                // Clear previous messages
                                message_container.innerHTML = "";
                                
                                message.forEach((msg, index) => {
                                    function scrollToBottom() {
                                        gsap.to(chatBox, {
                                            scrollTop: chatBox.scrollHeight,
                                            duration: 0.3,
                                            ease: "power2.out"
                                        });
                                    }
                                    
                                    if (msg.sender__username == loggedUser) {
                                        const sender = document.createElement("div");
                                        sender.className = "sender";
                                        const sender_name = document.createElement("strong");
                                        const span_msg = document.createElement("span");
                                        sender_name.innerText = msg.sender__username;
                                        span_msg.textContent = msg.message;
                                        sender.append(sender_name, span_msg);
                                        message_container.append(sender);
                                        
                                        // Animate sent messages
                                        gsap.from(sender, {
                                            x: 50,
                                            opacity: 0,
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            ease: "back.out(1.5)"
                                        });
                                    } else {
                                        const receive = document.createElement("div");
                                        receive.className = "receive";
                                        const receive_name = document.createElement("strong");
                                        const span_msg = document.createElement("span");
                                        receive_name.innerText = msg.sender__username;
                                        span_msg.textContent = msg.message;
                                        receive.append(receive_name, span_msg);
                                        message_container.append(receive);
                                        
                                        // Animate received messages
                                        gsap.from(receive, {
                                            x: -50,
                                            opacity: 0,
                                            duration: 0.3,
                                            delay: index * 0.05,
                                            ease: "back.out(1.5)"
                                        });
                                    }
                                    scrollToBottom();
                                });
                                scrollBottom();
                            });

                            function scrollBottom() {
                                const anchor = document.getElementById("anchor");
                                if (anchor) {
                                    gsap.to(window, {
                                        duration: 0.1,
                                        onComplete: () => {
                                            anchor.scrollIntoView({ behavior: "auto", block: "end" });
                                        }
                                    });
                                }
                            }

                            document.addEventListener("DOMContentLoaded", scrollBottom);
                            window.addEventListener("load", scrollBottom);

                            // ==========================================
                            // WEBSOCKET CONNECTION
                            // ==========================================
                            const socketUrl = `ws://${window.location.host}/ws/chat/message/${profileId}`;
                            const chatSocket = new WebSocket(socketUrl);
                            const message_form = document.getElementById("message_form");
                            const message_input = document.getElementById("message_input");
                            const message_container = document.querySelector(".message_container");

                            chatSocket.addEventListener("open", function(e) {
                                console.log("Connection Established and connected");

                                message_form.addEventListener("submit", function(e) {
                                    e.preventDefault();
                                    const messageValue = message_input.value;
                                    
                                    if (messageValue.trim() !== '') {
                                        chatSocket.send(JSON.stringify({
                                            'message': messageValue
                                        }));
                                        message_form.reset();
                                        message_input.focus();
                                    }
                                });
                            });

                            chatSocket.addEventListener("message", function(e) {
                                const data = JSON.parse(e.data);
                                const chatBox = document.querySelector(".chatBox");
                                const currentUserId = JSON.parse(document.getElementById("userId").textContent);
                                const currentUser = JSON.parse(document.getElementById("user-data").textContent);

                                function scrollToBottom() {
                                    gsap.to(chatBox, {
                                        scrollTop: chatBox.scrollHeight,
                                        duration: 0.3,
                                        ease: "power2.out"
                                    });
                                }

                                if (data.user_id == currentUserId) {
                                    const senderDiv = document.createElement("div");
                                    senderDiv.innerHTML = `<div class="sender"><strong>${currentUser}</strong><span>${data.message}</span></div>`;
                                    message_container.innerHTML += senderDiv.innerHTML;
                                    
                                    // Animate new sent message
                                    const lastMsg = message_container.querySelector('.sender:last-child');
                                    gsap.from(lastMsg, {
                                        x: 50,
                                        opacity: 0,
                                        scale: 0.8,
                                        duration: 0.3,
                                        ease: "back.out(1.5)"
                                    });
                                } else {
                                    const receiveDiv = document.createElement("div");
                                    receiveDiv.innerHTML = `<div class="receive"><strong>${data.username || 'User'}</strong><span>${data.message}</span></div>`;
                                    message_container.innerHTML += receiveDiv.innerHTML;
                                    
                                    // Animate new received message
                                    const lastMsg = message_container.querySelector('.receive:last-child');
                                    gsap.from(lastMsg, {
                                        x: -50,
                                        opacity: 0,
                                        scale: 0.8,
                                        duration: 0.3,
                                        ease: "back.out(1.5)"
                                    });
                                }
                                scrollToBottom();
                            });

                            chatSocket.addEventListener("close", function(e) {
                                console.log("Connection closed");
                            });

                            chatSocket.addEventListener("error", function(e) {
                                console.error("WebSocket error:", e);
                            });
                        }
                    });
                });
            });
        });
    });
});


// ==========================================
// CHAT LIST HOVER ANIMATIONS
// ==========================================
document.querySelectorAll('.recent_message a').forEach(chatItem => {
    chatItem.addEventListener('mouseenter', () => {
        gsap.to(chatItem, {
            x: 5,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    chatItem.addEventListener('mouseleave', () => {
        gsap.to(chatItem, {
            x: 0,
            duration: 0.2,
            ease: "power2.out"
        });
    });
});


// ==========================================
// MESSAGE INPUT FOCUS ANIMATION
// ==========================================
const messageInput = document.getElementById("message_input");
const messageForm = document.querySelector(".form");

if (messageInput) {
    messageInput.addEventListener('focus', () => {
        gsap.to(messageForm, {
            boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.2)',
            duration: 0.3
        });
    });

    messageInput.addEventListener('blur', () => {
        gsap.to(messageForm, {
            boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.1)',
            duration: 0.3
        });
    });
}


// ==========================================
// CHAT OPTIONS ICONS HOVER
// ==========================================
document.querySelectorAll('.chats_option svg').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            scale: 1.15,
            rotation: 15,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
    });

    icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.2,
            ease: "power2.out"
        });
    });
});