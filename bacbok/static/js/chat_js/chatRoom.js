// ==========================================
// GSAP ANIMATIONS - CHAT PAGE
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

        // Chat area scales in
        .from('.main_container .second', {
            duration: 0.5,
            scale: 0.95,
            opacity: 0,
            ease: "back.out(1.5)"
        }, "-=0.3")

        // Right sidebar slides in
        .from('.main_container .third', {
            duration: 0.6,
            x: 60,
            opacity: 0,
            ease: "power3.out"
        }, "-=0.4")

        // Chat list items stagger
        .from('.recent_message a', {
            duration: 0.4,
            x: -30,
            opacity: 0,
            stagger: 0.05,
            ease: "power2.out"
        }, "-=0.2")

        // Message input slides up
        .from('.inbox', {
            duration: 0.5,
            y: 30,
            opacity: 0,
            ease: "power2.out"
        }, "-=0.2");
});


// ==========================================
// WEBSOCKET CONNECTION
// ==========================================
const messageForm = document.getElementById("messageForm");
const UserId = JSON.parse(document.getElementById("user-id").textContent);
const webSocketUrl = `ws://${window.location.host}/ws/chat/message/${UserId}`;
const chatSocket = new WebSocket(webSocketUrl);

chatSocket.addEventListener("open", function (e) {
    console.log("Connection Established");

    messageForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const messageInput = document.getElementById("messageInput").value;

        if (messageInput.trim() !== '') {
            chatSocket.send(JSON.stringify({
                "message": messageInput
            }));
            messageForm.reset();

            // Focus back on input
            document.getElementById("messageInput").focus();
        }
    });
});

chatSocket.addEventListener("message", function (e) {
    const data = JSON.parse(e.data);
    const username = JSON.parse(document.getElementById("user-data").textContent);
    const receiver_username = JSON.parse(document.getElementById("receiver_username").textContent);
    const currentUserId = JSON.parse(document.getElementById("currentId").textContent);
    const messages = document.querySelector(".messages");
    const message = document.querySelector(".message");

    function scrollBottomMessage() {
        gsap.to(messages, {
            scrollTop: messages.scrollHeight,
            duration: 0.3,
            ease: "power2.out"
        });
    }

    if (data.user_id == currentUserId) {
        message.innerHTML += `<div class="sender_message">
                                    <strong>${username}</strong>
                                    <span>${data.message}</span>
                              </div>`;

        // Animate new sent message
        const lastMessage = message.querySelector('.sender_message:last-child');
        gsap.from(lastMessage, {
            x: 50,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "back.out(1.5)"
        });
    } else {
        message.innerHTML += `<div class="receiver_message">
                                    <strong>${receiver_username}</strong>
                                    <span>${data.message}</span>
                              </div>`;

        // Animate new received message
        const lastMessage = message.querySelector('.receiver_message:last-child');
        gsap.from(lastMessage, {
            x: -50,
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: "back.out(1.5)"
        });
    }
    scrollBottomMessage();
});


// ==========================================
// SCROLL TO BOTTOM ON LOAD
// ==========================================
function scrollBottom() {
    const anchor = document.getElementById("scroll-anchor");
    if (anchor) {
        gsap.to(window, {
            duration: 0.1,
            onComplete: () => {
                anchor.scrollIntoView({ behavior: "auto", block: "end" });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(scrollBottom, 30);
});

window.addEventListener("load", scrollBottom);


// ==========================================
// MESSAGE INPUT FOCUS ANIMATION
// ==========================================
const messageInput = document.getElementById("messageInput");
const inboxForm = document.querySelector(".inbox form");

if (messageInput) {
    messageInput.addEventListener('focus', () => {
        gsap.to(inboxForm, {
            borderColor: 'rgba(108, 92, 231, 0.6)',
            boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.1)',
            duration: 0.3
        });
    });

    messageInput.addEventListener('blur', () => {
        gsap.to(inboxForm, {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'none',
            duration: 0.3
        });
    });
}


// ==========================================
// SEND BUTTON ANIMATION
// ==========================================
const sendButton = document.querySelector(".inbox form button[type='submit']");
if (sendButton) {
    sendButton.addEventListener('click', function () {
        gsap.timeline()
            .to(sendButton, {
                scale: 0.8,
                duration: 0.1,
                ease: "power2.in"
            })
            .to(sendButton, {
                scale: 1,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
    });
}


// ==========================================
// CHAT LIST HOVER ANIMATIONS
// ==========================================
document.querySelectorAll('.recent_message a').forEach(chatItem => {
    chatItem.addEventListener('mouseenter', () => {
        gsap.to(chatItem, {
            x: 5,
            backgroundColor: 'rgba(108, 92, 231, 0.15)',
            duration: 0.2,
            ease: "power2.out"
        });
    });

    chatItem.addEventListener('mouseleave', () => {
        gsap.to(chatItem, {
            x: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            duration: 0.2,
            ease: "power2.out"
        });
    });
});


// ==========================================
// CHAT OPTIONS ICON HOVER
// ==========================================
document.querySelectorAll('.chats_option svg, .user_options a svg').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
            scale: 1.15,
            duration: 0.2,
            ease: "back.out(1.7)"
        });
    });

    icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out"
        });
    });
});


// ==========================================
// CHAT INFO LIST ITEMS HOVER
// ==========================================
document.querySelectorAll('.second_list li').forEach(item => {
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            x: 5,
            duration: 0.2,
            ease: "power2.out"
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            x: 0,
            duration: 0.2,
            ease: "power2.out"
        });
    });
});


// ==========================================
// MESSAGE CATEGORY TABS
// ==========================================
document.querySelectorAll('.message_option ul a').forEach(tab => {
    tab.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active from all
        document.querySelectorAll('.message_option ul a').forEach(t => {
            t.style.background = 'transparent';
            t.style.color = 'var(--text-secondary)';
        });

        // Set active
        this.style.background = 'rgba(108, 92, 231, 0.3)';
        this.style.color = 'var(--text-main)';

        // Click animation
        gsap.fromTo(this,
            { scale: 0.9 },
            { scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    });
});


// ==========================================
// WEBSOCKET CONNECTION STATUS INDICATOR
// ==========================================
chatSocket.addEventListener("close", function (e) {
    console.log("Connection closed");
});

chatSocket.addEventListener("error", function (e) {
    console.error("WebSocket error:", e);
});