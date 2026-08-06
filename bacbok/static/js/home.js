// ==========================================
// GSAP ANIMATIONS - HOME PAGE
// ==========================================

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// 1. PAGE LOAD ENTRANCE ANIMATIONS
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

    // Left sidebar fades in from left
    .from('.container main .first', {
        duration: 0.7,
        x: -60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.3")

    // Post input box scales up
    .from('.post', {
        duration: 0.6,
        scale: 0.9,
        opacity: 0,
        y: 30,
        ease: "back.out(1.7)"
    }, "-=0.4")

    // Status stories slide in
    .from('.status_container', {
        duration: 0.5,
        x: 60,
        opacity: 0,
        ease: "power2.out"
    }, "-=0.3")

    // Right sidebar fades in
    .from('.container main .third', {
        duration: 0.7,
        x: 60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.4")

    // Sidebar menu items stagger
    .from('.container main .first ul a', {
        duration: 0.4,
        x: -30,
        opacity: 0,
        stagger: 0.05,
        ease: "power2.out"
    }, "-=0.3")

    // Status wrapper images stagger
    .from('.status_wrapper', {
        duration: 0.5,
        scale: 0,
        opacity: 0,
        stagger: 0.08,
        ease: "back.out(1.7)"
    }, "-=0.2");
});


// 2. SCROLL-TRIGGERED POST APPEARANCES
// Each post fades and slides up as you scroll
const postContainers = document.querySelectorAll('.post_container');
postContainers.forEach((post, index) => {
    gsap.fromTo(post, 
        { 
            opacity: 0, 
            y: 60,
            scale: 0.95
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
                trigger: post,
                start: "top bottom-=100px",
                toggleActions: "play none none reverse"
            },
            delay: index * 0.05 // Stagger effect
        }
    );
});


// 3. NAVBAR SCROLL EFFECT
// Add shadow and reduce opacity on scroll
ScrollTrigger.create({
    start: "top -80",
    end: 99999,
    onUpdate: (self) => {
        if (self.direction === 1 && self.scrollY > 50) {
            gsap.to('.navbar', {
                boxShadow: '0 5px 30px rgba(0, 0, 0, 0.3)',
                background: 'rgba(10, 14, 39, 0.98)',
                duration: 0.3
            });
        } else if (self.direction === -1 && self.scrollY < 50) {
            gsap.to('.navbar', {
                boxShadow: '0 1px 0 rgba(108, 92, 231, 0.15)',
                background: 'rgba(10, 14, 39, 0.85)',
                duration: 0.3
            });
        }
    }
});


// 4. CREATE POST BUTTON PULSE
// Gentle pulse to attract attention
const createPostBtn = document.querySelector('#create_post');
if (createPostBtn) {
    gsap.to(createPostBtn, {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        boxShadow: '0 0 20px rgba(108, 92, 231, 0.5)'
    });
}


// ==========================================
// LIKE SYSTEM WITH COLOR TOGGLE
// ==========================================
const liked = document.querySelectorAll("#liked");
liked.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.href;
        const urlString = String(url).split("/");
        const post_id = Number(urlString[urlString.length - 1]);
        const likedcount = document.querySelector(`#likedcount-${post_id}`);

        // Toggle liked state
        btn.classList.toggle('liked');

        // Heart burst animation
        const heartIcon = btn.querySelector('svg');
        gsap.timeline()
            .to(heartIcon, {
                scale: 1.4,
                duration: 0.15,
                ease: "power2.out"
            })
            .to(heartIcon, {
                scale: 1,
                duration: 0.3,
                ease: "elastic.out(1, 0.5)"
            });

        // Number count animation
        gsap.from(likedcount, {
            scale: 1.5,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        fetch(url, { method: "GET" })
            .then(response => response.text())
            .then(data => {
                result = JSON.parse(data);
                likedcount.innerText = result.post_likes;
            });
    });
});




// ==========================================
// VIDEO LIKE WITH ANIMATION
// ==========================================

const video_liked = document.querySelectorAll(".video_liked");
video_liked.forEach(videoliked => {
    videoliked.addEventListener("click", function(e) {
        e.preventDefault();
        const parent = videoliked.closest(".post_wrapper_option");
        const likedBtn = parent.querySelector(".video_liked");
        const url = likedBtn.href;
        const liked_count = likedBtn.querySelector("#liked_count");

        // Toggle liked state
        likedBtn.classList.toggle('liked');

        // Heart animation
        const heartIcon = likedBtn.querySelector('svg');
        gsap.timeline()
            .to(heartIcon, { scale: 1.4, duration: 0.15 })
            .to(heartIcon, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });

        gsap.from(liked_count, {
            scale: 1.5,
            duration: 0.3,
            ease: "back.out(1.7)"
        });

        fetch(url, { method: "GET" })
            .then(res => res.json())
            .then(data => {
                liked_count.innerText = data.video_count;
            });
    });
});


// ==========================================
// POST OPTIONS DROPDOWN WITH ANIMATION
// ==========================================
const post_option = document.querySelectorAll(".post_option");
post_option.forEach(post_btn => {
    const parent = post_btn.closest(".post_owner");
    const postBtn = parent.querySelector(".post_option");
    const post_option_container = postBtn.closest(".post_owner").closest(".post_container").querySelector(".post_option_container");
    const no_image = parent.closest(".post_container").querySelector(".post_wrapper .no_image");
    
    postBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent bubbling
        
        // Close all other dropdowns first
        document.querySelectorAll('.post_option_container.display').forEach(dropdown => {
            if (dropdown !== post_option_container) {
                dropdown.classList.remove("display");
            }
        });
        
        if (post_option_container.classList.contains("display")) {
            // Close with animation
            post_option_container.classList.remove("display");
        } else {
            // Open with animation
            post_option_container.classList.add("display");
            
            // GSAP animation for dropdown items
            const items = post_option_container.querySelectorAll('ul a');
            gsap.fromTo(items, 
                { opacity: 0, x: -15 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.3, 
                    stagger: 0.04,
                    ease: "back.out(1.5)"
                }
            );
        }

        if (no_image) {
            if (no_image.classList.contains("show")) {
                no_image.classList.remove("show");
            } else {
                no_image.classList.add("show");
            }
        }
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.post_option') && !e.target.closest('.post_option_container')) {
        document.querySelectorAll('.post_option_container.display').forEach(dropdown => {
            dropdown.classList.remove("display");
        });
    }
});


// ==========================================
// POST CAPTION EXPAND
// ==========================================
const post_caption = document.querySelectorAll(".caption_container .post_caption");
if (post_caption) {
    post_caption.forEach(caption => {
        const parent = caption.closest(".post_container");
        const postCaption = parent.querySelector(".caption_container .post_caption").textContent;
        const shortPostCaption = parent.querySelector(".caption_container .post_caption").textContent;
        
        if (postCaption.length > 200) {
            caption.innerText = shortPostCaption.slice(0, 150) + "...seemore";
            caption.addEventListener("click", function(e) {
                let expanded = false;
                function remember() {
                    if (expanded) {
                        caption.innerText = shortPostCaption.slice(0, 150) + "...seemore";
                        expanded = false;
                        gsap.to(caption, { scale: 1, duration: 0.2 });
                    } else {
                        caption.innerText = postCaption;
                        expanded = true;
                        gsap.from(caption, { scale: 0.95, duration: 0.3, ease: "back.out(1.5)" });
                    }
                }
                return remember;
            }());
        }
    });
}


// ==========================================
// POST DELETE CONFIRMATION MODAL
// ==========================================
const postDelete = document.querySelectorAll(".deletepost");
postDelete.forEach(post => {
    const parent = post.closest("ul");
    const deletePost = parent.querySelector("a");

    deletePost.addEventListener("click", (e) => {
        if (deletePost) {
            e.preventDefault();
            const postModal = e.currentTarget.parentElement.parentElement.parentElement.querySelector(".post_sure_modal");
            const postVideoModal = e.currentTarget.parentElement.parentElement.parentElement.querySelector(".post_video_sure_modal");
            
            if (postModal) {
                postModal.style.display = "flex";
                // Scale in animation
                gsap.fromTo(postModal.querySelector('.post_sure_container'), 
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            } else {
                postVideoModal.style.display = "flex";
                gsap.fromTo(postVideoModal.querySelector('.post_sure_container'),
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        }
    });

    const discardDelete = parent.parentElement.parentElement.querySelector(".post_btn");
    discardDelete.addEventListener("click", (e) => {
        const postModal = e.currentTarget.parentElement.parentElement.parentElement;
        const postVideoModal = e.currentTarget.parentElement.parentElement.parentElement;
        
        if (postModal) {
            gsap.to(postModal, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    postModal.style.display = "none";
                    postModal.style.opacity = 1;
                }
            });
        } else {
            gsap.to(postVideoModal, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    postVideoModal.style.display = "none";
                    postVideoModal.style.opacity = 1;
                }
            });
        }
    });
});


// ==========================================
// EDIT POST MODAL
// ==========================================
const editPost = document.querySelectorAll(".editpost");
editPost.forEach(post => {
    const parent = post.closest("ul");
    const editpost = parent.querySelector(".editpost");
    
    editpost.addEventListener("click", (e) => {
        if (editPost) {
            e.preventDefault();
            const editModal = editpost.parentElement.parentElement.parentElement.querySelector(".edit_post");
            if (editModal) {
                editModal.style.display = "block";
                // Scale in animation
                gsap.fromTo(editModal, 
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
                );
            }
        }
    });

    const editCloseModal = parent.parentElement.parentElement.querySelector(".edit_post .edit_post_modal_close svg");
    if (editCloseModal) {
        editCloseModal.addEventListener("click", (e) => {
            const editModal = parent.parentElement.parentElement.querySelector(".edit_post");
            if (editModal) {
                gsap.to(editModal, {
                    opacity: 0,
                    scale: 0.8,
                    duration: 0.2,
                    onComplete: () => {
                        editModal.style.display = "none";
                        editModal.style.opacity = 1;
                        editModal.style.transform = "scale(1)";
                    }
                });
            }
        });
    }

    const form = parent.parentElement.parentElement.querySelector(".edit_post form");
    const inputText = form.querySelector(".input_text");
    const editable = form.querySelector(".post_caption");
    
    editable.addEventListener("input", (e) => {
        inputText.value = editable.innerText;
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const Form = new FormData(form);
        fetch(editpost.href, {
            method: "POST",
            body: Form,
            headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(res => res.json())
        .then(body => {
            const postCaption = e.target.parentElement.parentElement.querySelector(".caption_container .post_caption");
            postCaption.innerText = body.caption;
            // Success animation
            gsap.from(postCaption, { scale: 1.1, color: '#00cec9', duration: 0.5, ease: "elastic.out(1, 0.5)" });
            alert(body.success);
        });
    });
});


// ==========================================
// SHARE POST MODAL
// ==========================================
const sharePost = document.querySelectorAll(".sharepost");
sharePost.forEach(post => {
    const parent = post.closest("ul");
    const sharepost = parent.querySelector(".sharepost");
    
    sharepost.addEventListener("click", (e) => {
        if (sharepost) {
            e.preventDefault();
            const shareModal = e.target.closest("ul").closest(".post_option_container").closest(".post_container").querySelector(".sharePost");
            const otherApps = shareModal.querySelector(".share_container button");
            
            shareModal.style.display = "block";
            // Slide up animation
            gsap.fromTo(shareModal,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
            
            const postCaption = shareModal.closest(".post_container").querySelector(".caption_container .post_caption");
            otherApps.addEventListener("click", (e) => {
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href })
                    .then(res => res)
                    .then(body => body);
            });
        }
    });

    const shareModalClose = parent.closest(".post_option_container").closest(".post_container").querySelector(".sharePost .share_post_modal_close");
    if (shareModalClose) {
        shareModalClose.addEventListener("click", (e) => {
            const shareModal = e.target.closest(".share_post_modal_close").closest(".sharePost");
            gsap.to(shareModal, {
                opacity: 0,
                y: 50,
                duration: 0.2,
                onComplete: () => {
                    shareModal.style.display = "none";
                    shareModal.style.opacity = 1;
                    shareModal.style.transform = "translateY(0)";
                }
            });
        });
    }
});

// Share button in post options bar
const sharePost2 = document.querySelectorAll(".sharepost2");
sharePost2.forEach(post => {
    const parent = post.closest("ul");
    const sharepost = parent.querySelector(".sharepost2");
    
    sharepost.addEventListener("click", (e) => {
        if (sharepost) {
            e.preventDefault();
            const shareModal = e.target.closest("ul").closest(".post_container").querySelector(".sharePost");
            const otherApps = shareModal.querySelector(".share_container button");
            
            shareModal.style.display = "block";
            gsap.fromTo(shareModal,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
            
            const postCaption = shareModal.closest(".post_container").querySelector(".caption_container .post_caption");
            otherApps.addEventListener("click", (e) => {
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href })
                    .then(res => res)
                    .then(body => body);
            });
        }
    });

    const shareModalClose = parent.closest(".post_container").querySelector(".sharePost .share_post_modal_close");
    shareModalClose.addEventListener("click", (e) => {
        const shareModal = e.target.closest(".share_post_modal_close").closest(".sharePost");
        gsap.to(shareModal, {
            opacity: 0,
            y: 50,
            duration: 0.2,
            onComplete: () => {
                shareModal.style.display = "none";
                shareModal.style.opacity = 1;
            }
        });
    });
});


// ==========================================
// COPY LINK
// ==========================================
const copyLinkPost = document.querySelectorAll(".copylink");
copyLinkPost.forEach(post => {
    const parent = post.closest("ul");
    const copyLink = parent.querySelector(".copylink");
    copyLink.addEventListener("click", (e) => {
        if (copyLink) {
            e.preventDefault();
            navigator.clipboard.writeText(copyLink.href);
            
            // Copied animation
            gsap.fromTo(copyLink.querySelector('p'), 
                { scale: 1.2, color: '#00cec9' },
                { scale: 1, color: '', duration: 0.5, ease: "elastic.out(1, 0.5)" }
            );
            alert("link copied");
        }
    });
});

// ==========================================
// THEME TOGGLE - DARK/LIGHT MODE
// ==========================================
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');

// Check saved theme or default to dark
const savedTheme = localStorage.getItem('bacbok-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateIcons(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Animate the transition
    gsap.to('body', {
        opacity: 0.8,
        duration: 0.15,
        onComplete: () => {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('bacbok-theme', newTheme);
            updateIcons(newTheme);
            
            gsap.to('body', {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
    
    // Button animation
    gsap.timeline()
        .to(themeToggle, { scale: 0.8, duration: 0.1 })
        .to(themeToggle, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
});

function updateIcons(theme) {
    if (theme === 'dark') {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// ==========================================
// STATUS SCROLL CONTROL
// ==========================================
const status_count = JSON.parse(document.getElementById("status_count").textContent);
const status_chevback = document.getElementById("status_chevback");
const status_chevfront = document.getElementById("status_chevfront");

if (status_count > 4) {
    status_chevback.style.display = "block";
    status_chevback.addEventListener("click", (e) => {
        const status_box = document.querySelector(".status_box");
        gsap.to(status_box, {
            scrollLeft: status_box.scrollLeft - status_box.clientWidth,
            duration: 0.6,
            ease: "power2.out"
        });
    });
}

if (status_count > 4) {
    status_chevfront.style.display = "block";
    status_chevfront.addEventListener("click", (e) => {
        const status_box = document.querySelector(".status_box");
        gsap.to(status_box, {
            scrollLeft: status_box.scrollLeft + status_box.clientWidth,
            duration: 0.6,
            ease: "power2.out"
        });
    });
}


// ==========================================
// IMAGE CAROUSEL SCROLL
// ==========================================
const chevfront = document.querySelectorAll("#chevfront");
if (chevfront) {
    chevfront.forEach((cf) => {
        cf.addEventListener('click', function(e) {
            const postContainer = cf.closest(".post_wrapper");
            const wrapper = postContainer.querySelector('.image_wrapper');
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft + wrapper.clientWidth,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            });
        });
    });
}

const chevback = document.querySelectorAll("#chevback");
if (chevback) {
    chevback.forEach((cv) => {
        cv.addEventListener('click', (e) => {
            const postContainer = cv.closest(".post_wrapper");
            const wrapper = postContainer.querySelector(".image_wrapper");
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft - wrapper.clientWidth,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            });
        });
    });
}


// ==========================================
// POPUP MODAL - UPLOAD POST
// ==========================================
const photo_btn = document.getElementById("photo_btn");
photo_btn.addEventListener('click', function(e) {
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
    // Scale in animation
    gsap.fromTo(popup,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
    gsap.fromTo(popup.querySelector('.content'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power3.out" }
    );
});

// Popup close button
const popclosebtn = document.getElementById("popclosebtn");
popclosebtn.addEventListener("click", function(e) {
    const popup = document.querySelector(".popup");
    gsap.to(popup, {
        opacity: 0,
        scale: 0.8,
        duration: 0.2,
        onComplete: () => {
            popup.style.display = "none";
            popup.style.opacity = 1;
            popup.style.transform = "scale(1)";
        }
    });
});

// Create post button in sidebar
const create_post = document.querySelector(".first #create_post");
create_post.addEventListener("click", (e) => {
    e.preventDefault();
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
    gsap.fromTo(popup,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
});


// ==========================================
// MULTIPLE IMAGE PREVIEW
// ==========================================
const contentimage = document.getElementById("contentimage");
const image_cancel = document.getElementById("image_cancel");
const imgwrapper = document.querySelector(".showimage_wrapper");

contentimage.addEventListener("change", function(e) {
    const files = e.target.files;
    Array.from(files).forEach(file => {
        const imgUrl = URL.createObjectURL(file);
        const newImg = document.createElement("img");
        newImg.src = imgUrl;
        newImg.style.width = "70px";
        newImg.style.height = "70px";
        newImg.style.marginRight = "8px";
        newImg.style.borderRadius = "5px";
        image_cancel.style.display = "block";
        imgwrapper.appendChild(newImg);

        // Pop-in animation
        gsap.from(newImg, { scale: 0, duration: 0.4, ease: "back.out(1.7)" });

        image_cancel.addEventListener('click', function(e) {
            gsap.to(newImg, {
                scale: 0,
                duration: 0.3,
                onComplete: () => {
                    newImg.style.display = "none";
                    image_cancel.style.display = "none";
                    contentimage.value = "";
                }
            });
        });
    });
});


// ==========================================
// FORM VALIDATION
// ==========================================
const form = document.querySelector(".content form");
form.addEventListener('submit', function(e) {
    const inputText = document.querySelector(".content form input[type='text']").value;
    const file = document.getElementById('contentimage').files;
    const error = document.getElementById('errors');
    if (inputText === '' && file.length == 0) {
        e.preventDefault();
        error.innerText = "Post must contain text or image";
        // Shake animation
        gsap.fromTo(error, 
            { x: -10 },
            { x: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" }
        );
        return false;
    } else {
        return true;
    }
});


// ==========================================
// STATUS MODAL - CREATE STORY
// ==========================================
const status_add = document.getElementById("status_add");
const status_modal = document.querySelector(".status_modal");
const status_modal_close = document.querySelector(".status_modal_close svg");

status_add.addEventListener("click", function(e) {
    status_modal.style.display = "block";
    // Slide up from bottom
    gsap.fromTo(status_modal,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo(status_modal.querySelector('.status_post'),
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
    );

    status_modal_close.addEventListener("click", (e) => {
        gsap.to(status_modal, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                status_modal.style.display = "none";
                status_modal.style.opacity = 1;
            }
        });
    });
});


const status_image = document.getElementById("status_image");
status_image.addEventListener("change", function(e) {
    const file = e.target.files;
    const wrapper = document.querySelector(".status_preview");
    const imageUrl = URL.createObjectURL(file[0]);
    const img = document.createElement("img");
    const add_text = document.querySelector(".add_text");
    const image_discard = document.getElementById("image_discard");

    img.src = imageUrl;
    wrapper.append(img);
    wrapper.style.width = "300px";
    wrapper.style.height = "auto";
    img.style.width = "250px";
    img.style.height = "300px";
    img.style.marginRight = "5px";
    img.style.marginTop = "7px";
    img.style.borderRadius = "5px";
    img.style.alignSelf = "flex start";
    image_discard.style.display = "block";
    add_text.style.display = "flex";

    // Pop-in animation
    gsap.from(img, { scale: 0.5, opacity: 0, duration: 0.5, ease: "back.out(1.7)" });
    gsap.from(add_text, { y: 20, opacity: 0, duration: 0.4, delay: 0.2 });

    image_discard.addEventListener("click", function(e) {
        gsap.to(img, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                img.style.display = "none";
                image_discard.style.display = "none";
                add_text.style.display = "none";
                wrapper.style.width = "0px";
                wrapper.style.height = "auto";
                status_image.value = "";
            }
        });
    });
});


// ==========================================
// FOLLOW BUTTON
// ==========================================
const home_follow = document.querySelectorAll(".home_follow");
if (home_follow) {
    home_follow.forEach((follow) => {
        follow.addEventListener('click', (e) => {
            e.preventDefault();
            const url = e.currentTarget.href;
            
            // Button press animation
            gsap.to(follow, { scale: 0.9, duration: 0.1, onComplete: () => {
                gsap.to(follow, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
            }});
            
            fetch(url, { method: "GET" })
                .then(res => res.json())
                .then(data => {
                    if (!data.is_follow) {
                        follow.innerText = "Follow";
                        gsap.to(follow, { backgroundColor: "#00cec9", duration: 0.3 });
                    } else {
                        follow.innerText = "Following";
                        gsap.to(follow, { backgroundColor: "#6C5CE7", duration: 0.3 });
                    }
                });
        });
    });
}


// ==========================================
// VIDEO MODAL
// ==========================================
const video_click = document.querySelector("#video_btn");
const video_modal = document.querySelector(".video_modal");

video_click.addEventListener("click", function(e) {
    video_modal.style.display = "block";
    gsap.fromTo(video_modal,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
    );
    gsap.fromTo(video_modal.querySelector('.upload_container'),
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );
});

const close_modal = document.querySelector("#close_modal");
close_modal.addEventListener("click", function(e) {
    gsap.to(video_modal, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
            video_modal.style.display = "none";
            video_modal.style.opacity = 1;
        }
    });
});


// ==========================================
// VIDEO UPLOAD PREVIEW
// ==========================================
const video_upload = document.querySelector("#video_upload");
video_upload.addEventListener("change", function(e) {
    const video = e.currentTarget.files[0];
    const videoUrl = URL.createObjectURL(video);
    const video_preview = document.getElementById("video_preview");
    const video_discard = document.getElementById("video_discard");
    const video_caption = document.getElementById("video_caption");
    const error = document.getElementById("error");
    
    if (video.name.endsWith(".mp4")) {
        video_preview.src = videoUrl;
        video_preview.style.display = "block";
        video_preview.style.width = "380px";
        video_preview.style.height = "200px";
        video_preview.style.marginBottom = "8px";
        video_preview.style.borderRadius = "5px";
        video_discard.style.display = "block";
        video_caption.style.display = "block";
        error.innerText = "";
        
        // Fade in animation
        gsap.from(video_preview, { opacity: 0, y: 20, duration: 0.4 });
        gsap.from(video_caption, { opacity: 0, y: 10, duration: 0.3, delay: 0.1 });
    } else {
        error.innerText = "Only Video File is allowed e.g mp4 file";
        error.style.textAlign = "center";
        error.style.color = "red";
        error.style.fontSize = "12px";
        error.style.marginBottom = "4px";
        gsap.from(error, { x: -10, duration: 0.3, ease: "elastic.out(1, 0.3)" });
    }
    
    video_discard.addEventListener("click", (e) => {
        gsap.to([video_preview, video_caption], {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
                video_preview.style.display = "none";
                video_discard.style.display = "none";
                video_caption.style.display = "none";
                video_upload.value = "";
                video_caption.value = "";
            }
        });
    });
});


// ==========================================
// VIDEO PLAY/PAUSE WITH INTERSECTION OBSERVER
// ==========================================
const post_video = document.querySelectorAll(".post_video");
const observe = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        const iconPaths = {
            pause: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />',
            play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />'
        };
        if (entry.intersectionRatio >= 0.7) {
            entry.target.play();
            entry.target.muted = false;
            UpdateIcon(entry.target, null);
        } else {
            entry.target.muted = true;
            entry.target.pause();
            UpdateIcon(entry.target, iconPaths.pause);
        }
    });
}, { threshold: 0.7 });

post_video.forEach(video => {
    const parent = video.closest(".video_wrapper");
    const vd = parent.querySelector("video");
    
    video.addEventListener("click", function(e) {
        const videoContainer = e.target;
        const iconPaths = {
            pause: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />',
            play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />'
        };
        if (e.target.paused) {
            e.target.play();
            e.target.muted = false;
            UpdateIcon(videoContainer, null);
        } else {
            e.target.pause();
            e.target.muted = true;
            UpdateIcon(videoContainer, iconPaths.pause);
        }
    });
    observe.observe(vd);
});

function UpdateIcon(clickedVideo, iconName) {
    const container = clickedVideo.closest(".video_wrapper") || clickedVideo.parentElement;
    const ps = container.querySelector(".pause");
    if (ps) {
        if (iconName) {
            ps.style.display = "block";
            ps.innerHTML = iconName;
            gsap.from(ps, { scale: 0, duration: 0.3, ease: "back.out(1.7)" });
        } else {
            gsap.to(ps, {
                scale: 0,
                duration: 0.2,
                onComplete: () => {
                    ps.style.display = "none";
                }
            });
        }
    }
}


// ==========================================
// PAUSE BUTTON CLICK
// ==========================================
const pause = document.querySelectorAll(".pause");
pause.forEach(ele => {
    const parent = ele.closest(".video_pause");
    const pauseBtn = parent.querySelector(".pause");
    pauseBtn.addEventListener("click", (e) => {
        const post_video = parent.closest(".video_wrapper").querySelector(".post_video");
        if (post_video.paused) {
            post_video.play();
            post_video.muted = false;
            gsap.to(pauseBtn, { scale: 0, duration: 0.2, onComplete: () => {
                pauseBtn.style.display = "none";
            }});
        } else {
            post_video.pause();
            post_video.muted = true;
            pauseBtn.style.display = "block";
            gsap.from(pauseBtn, { scale: 0, duration: 0.3, ease: "back.out(1.7)" });
        }
    });
});


// ==========================================
// MESSAGE DROPDOWN
// ==========================================
const message_btn = document.getElementById("message_btn");
const message_dropdown = document.querySelector(".message_dropdown");

message_btn.addEventListener("click", function(e) {
    e.preventDefault();
    if (message_dropdown.classList.contains("open")) {
        gsap.to(message_dropdown, {
            opacity: 0,
            y: -20,
            duration: 0.2,
            onComplete: () => {
                message_dropdown.classList.remove("open");
                message_dropdown.style.opacity = 1;
            }
        });
    } else {
        message_dropdown.classList.add("open");
        gsap.fromTo(message_dropdown,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );
    }
});


// ==========================================
// FOLLOW INFO NAME TRUNCATION
// ==========================================
const followInfoFullname = document.querySelectorAll(".follow_info h5");
followInfoFullname.forEach(name => {
    const parent = name.closest(".follow_info");
    const originName = parent.querySelector("h5");
    const fullname = parent.querySelector("h5").textContent;
    const shortPart = fullname.slice(0, 10);
    if (fullname.length > 10) {
        originName.innerText = shortPart + ".....";
    }
});


// ==========================================
// VIDEO FORM VALIDATION
// ==========================================
const video_form = document.getElementById("video_form");
video_form.addEventListener("submit", function(e) {
    const video_caption = document.getElementById("video_caption").value;
    const video_upload = document.querySelector("#video_upload").files;
    const error = document.getElementById("error");
    if (video_upload.length == 0) {
        e.preventDefault();
        error.innerText = "Click the upload icon to upload a video";
        error.style.textAlign = "center";
        error.style.color = "red";
        error.style.fontSize = "12px";
        error.style.marginBottom = "4px";
        gsap.from(error, { x: -10, duration: 0.3, ease: "elastic.out(1, 0.3)" });
    }
});


// ==========================================
// MOBILE BOTTOM NAV - ACTIVE STATE
// ==========================================
const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        mobileNavLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Bounce animation
        gsap.fromTo(this,
            { y: 5 },
            { y: -5, duration: 0.3, ease: "power2.out", yoyo: true, repeat: 1 }
        );
    });
});


// ==========================================
// HOVER ANIMATIONS FOR POST ACTION BUTTONS
// ==========================================
document.querySelectorAll('.post_wrapper_option a').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power2.out" });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
    });
});


// ==========================================
// INPUT FOCUS ANIMATIONS
// ==========================================
document.querySelectorAll('.form-input, input[type="text"], input[type="email"], input[type="password"]').forEach(input => {
    input.addEventListener('focus', () => {
        gsap.to(input, { 
            borderColor: '#6C5CE7',
            boxShadow: '0 0 0 4px rgba(108, 92, 231, 0.1)',
            duration: 0.3 
        });
    });
    input.addEventListener('blur', () => {
        gsap.to(input, { 
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: 'none',
            duration: 0.3 
        });
    });
});