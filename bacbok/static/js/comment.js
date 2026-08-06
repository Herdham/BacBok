// ==========================================
// GSAP ANIMATIONS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    tl.from('.navbar', {
        duration: 0.6,
        y: -80,
        opacity: 0,
        ease: "power2.out"
    })
    .from('.container main .first', {
        duration: 0.6,
        x: -60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.3")
    .from('.post_container', {
        duration: 0.5,
        scale: 0.95,
        opacity: 0,
        y: 30,
        ease: "back.out(1.5)"
    }, "-=0.3")
    .from('.container main .third', {
        duration: 0.6,
        x: 60,
        opacity: 0,
        ease: "power3.out"
    }, "-=0.4");
});


// ==========================================
// LIKE SYSTEM
// ==========================================
const liked = document.querySelectorAll("#liked");
liked.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.href;
        const urlString = String(url).split("/");
        const post_id = Number(urlString[urlString.length - 1]);
        const likedcount = document.querySelector(`#likedcount-${post_id}`);

        // Heart burst animation
        const heartIcon = btn.querySelector('svg');
        gsap.timeline()
            .to(heartIcon, { scale: 1.4, duration: 0.15 })
            .to(heartIcon, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });

        gsap.from(likedcount, { scale: 1.5, duration: 0.3, ease: "back.out(1.7)" });

        fetch(url, { method: "GET" })
            .then(response => response.text())
            .then(data => {
                result = JSON.parse(data);
                likedcount.innerText = result.post_likes;
            });
    });
});


// ==========================================
// POST OPTIONS DROPDOWN
// ==========================================
const post_option = document.querySelectorAll(".post_option");
post_option.forEach(post_btn => {
    const parent = post_btn.closest(".post_owner");
    const postBtn = parent.querySelector(".post_option");
    const post_option_container = postBtn.closest(".post_owner").closest(".post_container").querySelector(".post_option_container");
    const no_image = parent.closest(".post_container").querySelector(".post_wrapper .no_image");
    
    postBtn.addEventListener("click", (e) => {
        if (post_option_container.classList.contains("display")) {
            gsap.to(post_option_container, {
                opacity: 0,
                y: -10,
                duration: 0.2,
                onComplete: () => post_option_container.classList.remove("display")
            });
        } else {
            post_option_container.classList.add("display");
            gsap.fromTo(post_option_container,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }

        if (no_image) {
            no_image.classList.toggle("show");
        }
    });
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
// POST DELETE
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
                gsap.fromTo(postModal.querySelector('.post_sure_container'),
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            } else if (postVideoModal) {
                postVideoModal.style.display = "flex";
                gsap.fromTo(postVideoModal.querySelector('.post_sure_container'),
                    { scale: 0.5, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            }
        }
    });

    const discardDelete = parent.parentElement.parentElement.querySelector(".post_btn");
    if (discardDelete) {
        discardDelete.addEventListener("click", (e) => {
            const postModal = e.currentTarget.parentElement.parentElement.parentElement;
            gsap.to(postModal, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    postModal.style.display = "none";
                    postModal.style.opacity = 1;
                }
            });
        });
    }
});


// ==========================================
// EDIT POST
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
        }).then(res => res.json())
        .then(body => {
            const postCaption = e.target.parentElement.parentElement.querySelector(".caption_container .post_caption");
            postCaption.innerText = body.caption;
            gsap.from(postCaption, { scale: 1.1, color: '#00cec9', duration: 0.5, ease: "elastic.out(1, 0.5)" });
            alert(body.success);
        });
    });
});


// ==========================================
// SHARE POST
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
            gsap.fromTo(shareModal,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
            );
            
            const postCaption = shareModal.closest(".post_container").querySelector(".caption_container .post_caption");
            otherApps.addEventListener("click", (e) => {
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href });
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
                }
            });
        });
    }
});


// ==========================================
// SHARE POST 2 (action bar)
// ==========================================
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
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href });
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
            gsap.fromTo(copyLink.querySelector('p'),
                { scale: 1.2, color: '#00cec9' },
                { scale: 1, color: '', duration: 0.5, ease: "elastic.out(1, 0.5)" }
            );
            alert("link copied");
        }
    });
});


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
                duration: 0.8
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
                duration: 0.8
            });
        });
    });
}


// ==========================================
// IMAGE PREVIEW
// ==========================================
const contentimage = document.getElementById("contentimage");
const image_cancle = document.getElementById("image_cancle");
const imgwrapper = document.querySelector(".showimage_wrapper");

if (contentimage) {
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
            image_cancle.style.display = "block";
            imgwrapper.appendChild(newImg);

            gsap.from(newImg, { scale: 0, duration: 0.4, ease: "back.out(1.7)" });

            image_cancle.addEventListener('click', function(e) {
                gsap.to(newImg, {
                    scale: 0,
                    duration: 0.3,
                    onComplete: () => {
                        newImg.style.display = "none";
                        image_cancle.style.display = "none";
                        contentimage.value = "";
                    }
                });
            });
        });
    });
}


// ==========================================
// FORM VALIDATION
// ==========================================
const form = document.querySelector(".content form");
if (form) {
    form.addEventListener('submit', function(e) {
        const inputText = document.querySelector(".content form input[type='text']").value;
        const file = document.getElementById('contentimage').files;
        const error = document.getElementById('errors');
        if (inputText === '' && file.length == 0) {
            e.preventDefault();
            error.innerText = "Post must contain text or image";
            gsap.fromTo(error,
                { x: -10 },
                { x: 0, duration: 0.3, ease: "elastic.out(1, 0.3)" }
            );
            return false;
        }
        return true;
    });
}


// ==========================================
// COMMENT SECTION
// ==========================================
const comment_btn = document.querySelector("#comment");
const comment_form = document.querySelector("#comment_form");

if (comment_form) {
    comment_form.addEventListener("submit", (e) => {
        const formData = new FormData(comment_form);
        if (formData.get("comment") === "") {
            e.preventDefault();
            alert("Type Something");
        } else {
            e.preventDefault();
            fetch(comment_btn.href, {
                method: "POST",
                body: formData,
                headers: {
                    "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(res => res.json())
            .then(body => {
                const comment_display = document.querySelector(".comment_display");
                const newElement = `
                    <div class="comment_inner" style="display: none;">
                        <a href="/profile/${body.username}">
                            <img width="30px" height="30px" src="${body.image}" alt="">
                        </a>
                        <div class="comment_option">
                            <div class="comment_info">
                                <h5>${body.fullname}</h5>
                                <p>${body.comment_text}</p>
                                <div class="inner_option">
                                    <a href="#">like</a>
                                    <a href="#">reply</a>
                                </div>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                            </svg>
                        </div>
                    </div>`;
                
                comment_display.insertAdjacentHTML('afterbegin', newElement);
                
                // Animate new comment
                const newComment = comment_display.querySelector('.comment_inner:first-child');
                gsap.fromTo(newComment,
                    { opacity: 0, y: -20, height: 0 },
                    { opacity: 1, y: 0, height: "auto", duration: 0.4, ease: "power3.out" }
                );
            });
        }
        comment_form.reset();
    });
}


// ==========================================
// POPUP MODAL
// ==========================================
const popclosebtn = document.getElementById("popclosebtn");
if (popclosebtn) {
    popclosebtn.addEventListener("click", function(e) {
        const popup = document.querySelector(".popup");
        gsap.to(popup, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            onComplete: () => {
                popup.style.display = "none";
                popup.style.opacity = 1;
            }
        });
    });
}