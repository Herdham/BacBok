const liked = document.querySelectorAll("#liked")

//like system login
liked.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()

        const url = btn.href
        const urlString = String(url).split("/")
        const post_id = Number(urlString[urlString.length - 1])
        const likedcount = document.querySelector(`#likedcount-${post_id}`)

        fetch(url, {
            method: "GET"
        })
            .then(response => response.text())
            .then(data => {
                result = JSON.parse(data)
                likedcount.innerText = result.post_likes
            })
    })
})

//post_user_option
const post_option = document.querySelectorAll(".post_option")
post_option.forEach(post_btn => {
    const parent = post_btn.closest(".post_owner")
    const postBtn = parent.querySelector(".post_option")
    const post_option_container = postBtn.closest(".post_owner").closest(".post_container").querySelector(".post_option_container");
    const no_image = parent.closest(".post_container").querySelector(".post_wrapper .no_image")
    postBtn.addEventListener("click", (e) => {
        if (post_option_container.classList.contains("display")) {
            post_option_container.classList.remove("display")
        } else {
            post_option_container.classList.add("display")
        }

        if (no_image) {
            if (no_image.classList.contains("show")) {
                no_image.classList.remove("show")
            } else {
                no_image.classList.add("show")
            }
        }
    })
})

//postCaption Expand
const post_caption = document.querySelectorAll(".caption_container .post_caption")
if (post_caption) {
    post_caption.forEach(caption => {
        const parent = caption.closest(".post_container")
        const postCaption = parent.querySelector(".caption_container .post_caption").textContent
        const shortPostCaption = parent.querySelector(".caption_container .post_caption").textContent
        if (postCaption.length > 200) {
            caption.innerText = shortPostCaption.slice(0, 150) + "...seemore"
            caption.addEventListener("click", function (e) {
                let expanded = false
                function remember() {
                    if (expanded) {
                        caption.innerText = shortPostCaption.slice(0, 150) + "...seemore"
                        expanded = false
                    } else {
                        caption.innerText = postCaption
                        expanded = true
                    }
                }
                return remember
            }())
        }
    })
}


//postDelete
const postDelete = document.querySelectorAll(".deletepost")
postDelete.forEach(post => {
    const parent = post.closest("ul")
    const deletePost = parent.querySelector("a")
    const post_btn = document.querySelectorAll(".post_btn")
    const post_sure_modal = document.querySelectorAll(".post_sure_modal")

    deletePost.addEventListener("click", (e) => {
        if (deletePost) {
            e.preventDefault()
            const postModal = e.currentTarget.parentElement.parentElement.parentElement.querySelector(".post_sure_modal")
            const postVideoModal = e.currentTarget.parentElement.parentElement.parentElement.querySelector(".post_video_sure_modal")
            if (postModal) {
                postModal.style.display = "flex"
            } else {
                postVideoModal.style.display = "flex"
            }
        }
    })

    const discardDelete = parent.parentElement.parentElement.querySelector(".post_btn")
    discardDelete.addEventListener("click", (e) => {
        const postModal = e.currentTarget.parentElement.parentElement.parentElement
        const postVideoModal = e.currentTarget.parentElement.parentElement.parentElement
        if (postModal) {
            postModal.style.display = "none"
        } else {
            postVideoModal.style.display = "none"
        }
    })

})

//editPost
const editPost = document.querySelectorAll(".editpost")
editPost.forEach(post => {
    const parent = post.closest("ul")
    const editpost = parent.querySelector(".editpost")
    editpost.addEventListener("click", (e) => {
        if (editPost) {
            e.preventDefault()
            const editModal = editpost.parentElement.parentElement.parentElement.querySelector(".edit_post")
            if (editModal) {
                editModal.style.display = "block"
            }
        }
    })

    const editCloseModal = parent.parentElement.parentElement.querySelector(".edit_post .edit_post_modal_close svg")
    if (editCloseModal) {
        editCloseModal.addEventListener("click", (e) => {
            const editModal = parent.parentElement.parentElement.querySelector(".edit_post")
            if (editModal) {
                editModal.style.display = "none"
            }
        })
    }

    const form = parent.parentElement.parentElement.querySelector(".edit_post form")
    const inputText = form.querySelector(".input_text")
    const editable = form.querySelector(".post_caption")
    editable.addEventListener("input", (e) => {
        inputText.value = editable.innerText
    })

    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const Form = new FormData(form)
        fetch(editpost.href, {
            method: "POST",
            body: Form,
            headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(res => res.json())
            .then(body => {
                const postCaption = e.target.parentElement.parentElement.querySelector(".caption_container .post_caption")
                postCaption.innerText = body.caption
                alert(body.success)
            })
    })
})

//sharePost
const sharePost = document.querySelectorAll(".sharepost")
sharePost.forEach(post => {
    const parent = post.closest("ul")
    const sharepost = parent.querySelector(".sharepost")
    sharepost.addEventListener("click", (e) => {
        if (sharepost) {
            e.preventDefault()
            const shareModal = e.target.closest("ul").closest(".post_option_container").closest(".post_container").querySelector(".sharePost")
            const otherApps = shareModal.querySelector(".share_container button")
            shareModal.style.display = "block"
            const postCaption = shareModal.closest(".post_container").querySelector(".caption_container .post_caption")
            otherApps.addEventListener("click", (e) => {
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href })
                    .then(res => res)
                    .then(body => body)
            })
        }
    })

    const shareModalClose = parent.closest(".post_option_container").closest(".post_container").querySelector(".sharePost .share_post_modal_close")
    if (shareModalClose) {
        shareModalClose.addEventListener("click", (e) => {
            const shareModal = e.target.closest(".share_post_modal_close").closest(".sharePost")
            shareModal.style.display = "none"
        })
    }
})

//post_wrapper_option shareBtn
const sharePost2 = document.querySelectorAll(".sharepost2")
sharePost2.forEach(post => {
    const parent = post.closest("ul")
    const sharepost = parent.querySelector(".sharepost2")
    sharepost.addEventListener("click", (e) => {
        if (sharepost) {
            e.preventDefault()
            const shareModal = e.target.closest("ul").closest(".post_container").querySelector(".sharePost")
            const otherApps = shareModal.querySelector(".share_container button")
            shareModal.style.display = "block"
            const postCaption = shareModal.closest(".post_container").querySelector(".caption_container .post_caption")
            otherApps.addEventListener("click", (e) => {
                navigator.share({ title: "BacBok Post", text: postCaption.innerText, url: sharepost.href })
                    .then(res => res)
                    .then(body => body)
            })
        }
    })

    const shareModalClose = parent.closest(".post_container").querySelector(".sharePost .share_post_modal_close")
    shareModalClose.addEventListener("click", (e) => {
        const shareModal = e.target.closest(".share_post_modal_close").closest(".sharePost")
        shareModal.style.display = "none"
    })
})

//copyLink
const copyLinkPost = document.querySelectorAll(".copylink")
copyLinkPost.forEach(post => {
    const parent = post.closest("ul")
    const copyLink = parent.querySelector(".copylink")
    copyLink.addEventListener("click", (e) => {
        if (copyLink) {
            e.preventDefault()
            navigator.clipboard.writeText(copyLink.href)
            alert("link copied")
        }
    })
})


//image scroll

const chevfront = document.querySelectorAll("#chevfront")
if (chevfront) {
    chevfront.forEach((cf) => {
        cf.addEventListener('click', function (e) {
            const postContainer = cf.closest(".post_wrapper")
            const wrapper = postContainer.querySelector('.image_wrapper')
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft + 500,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            })
        })
    })
}

const chevback = document.querySelectorAll("#chevback")
if (chevback) {
    chevback.forEach((cv) => {
        cv.addEventListener('click', (e) => {
            const postContainer = cv.closest(".post_wrapper")
            const wrapper = postContainer.querySelector(".image_wrapper")
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft - 500,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            })
        })
    })
}



const contentimage = document.getElementById("contentimage")
console.log(contentimage)
const image_cancle = document.getElementById("image_cancle")
const imgwrapper = document.querySelector(".showimage_wrapper")

contentimage.addEventListener("change", function (e) {
    const files = e.target.files
    console.log(Array.from(files))
    Array.from(files).forEach(file => {
        const imgUrl = URL.createObjectURL(file);
        const newImg = document.createElement("img")
        newImg.src = imgUrl
        newImg.style.width = "70px"
        newImg.style.height = "70px"
        newImg.style.marginRight = "8px"
        newImg.style.borderRadius = "5px"
        image_cancle.style.display = "block"
        imgwrapper.appendChild(newImg)

        image_cancle.addEventListener('click', function (e) {
            newImg.style.display = "none"
            image_cancle.style.display = "none"
            contentimage.value = ""
        })
    })

})



const form = document.querySelector(".content form")
const form_submit = document.querySelector(".content form input[type='submit']")

form.addEventListener('submit', function (e) {
    const inputText = document.querySelector(".content form input[type='text']").value
    const file = document.getElementById('contentimage').files
    const error = document.getElementById('errors')
    if (inputText === '' && file.length == 0) {
        e.preventDefault()
        error.innerText = "Post must contain text or image"
        return false
    }
    else {
        return true
    }
})


//comment Section
const comment_btn = document.querySelector("#comment")
console.log(comment_btn)
const comment_form = document.querySelector("#comment_form")
const display = document.querySelector(".display")
comment_form.addEventListener("submit", (e) => {
    const form = new FormData(comment_form)
    if(form.get("comment") === ""){
        e.preventDefault()
        alert("Type Somthing")
    }else{
        e.preventDefault()
        fetch(comment_btn.href, {
            method: "POST",
            body: form,
            headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        })
        .then(res => res.json())
        .then(body => {
            const comment_display = document.querySelector(".comment_display")
            const newElement = `<div class="comment_inner">
                            <a href="{% url 'profile' ${body.username} %}">
                                <img width="30px" height="30px"src="${body.image}" alt="">
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
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </div>
                        </div>`
            comment_display.insertAdjacentHTML('afterbegin', newElement)
            console.log(body)
        })
    }
    comment_form.reset()
})