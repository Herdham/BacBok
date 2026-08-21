const liked = document.querySelectorAll("#liked")
console.time("like")
//like system logic
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
            console.timeEnd("like")
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
        if(post_option_container.classList.contains("display")){
            post_option_container.classList.remove("display")
        }else{
            post_option_container.classList.add("display")
        }

        if(no_image){
            if (no_image.classList.contains("show")) {
                no_image.classList.remove("show")
            }else{
                no_image.classList.add("show")
            }
        }
    })
})

//postCaption Expand
const post_caption = document.querySelectorAll(".caption_container .post_caption")
if(post_caption){
    post_caption.forEach(caption => {
        const parent = caption.closest(".post_container")
        const postCaption = parent.querySelector(".caption_container .post_caption").textContent
        const shortPostCaption = parent.querySelector(".caption_container .post_caption").textContent
        if(postCaption.length > 200){
            caption.innerText = shortPostCaption.slice(0, 150) + "...seemore"
            caption.addEventListener("click", function(e){
                let expanded = false
                function remember() {
                    if (expanded) {
                        caption.innerText = shortPostCaption.slice(0, 150) + "...seemore"
                        expanded = false
                    }else{
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
            }else{
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
        }else{
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
                navigator.share({title: "BacBok Post", text: postCaption.innerText, url: sharepost.href})
                .then(res => res)
                .then(body => body)
            })
        }
    })

    const shareModalClose = parent.closest(".post_option_container").closest(".post_container").querySelector(".sharePost .share_post_modal_close")
    if(shareModalClose){
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

//status_scroll control
const status_count = JSON.parse(document.getElementById("status_count").textContent)
const status_chevback = document.getElementById("status_chevback")
const status_chevfront = document.getElementById("status_chevfront")

if (status_count > 4) {
    status_chevback.style.display = "block"
    status_chevback.addEventListener("click", (e) => {
        const status_box = document.querySelector(".status_box")
        status_box.scrollLeft -= status_box.clientWidth
    })
}

if (status_count > 4) {
    status_chevfront.style.display = "block"
    status_chevfront.addEventListener("click", (e) => {
        const status_box = document.querySelector(".status_box")
        status_box.scrollLeft += status_box.clientWidth
    })
}

//video_liked control
const video_liked = document.querySelectorAll(".video_liked")
video_liked.forEach(videoliked => {
    videoliked.addEventListener("click", function(e){
        e.preventDefault()
        const parent = videoliked.closest(".post_wrapper_option")
        const likedBtn = parent.querySelector(".video_liked")
        const url = likedBtn.href
        const liked_count = likedBtn.querySelector("#liked_count")
        fetch(url, {
            method: "GET"
        })
        .then(res => res.json())
        .then(data => {
            liked_count.innerText = data.video_count
        })
    })
})



//image scroll

const chevfront = document.querySelectorAll("#chevfront")
if(chevfront){
    chevfront.forEach((cf) => {
        cf.addEventListener('click', function(e){
            const postContainer = cf.closest(".post_wrapper")
            const wrapper = postContainer.querySelector('.image_wrapper')
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft + wrapper.clientWidth,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            })
        })
    })
}

const chevback = document.querySelectorAll("#chevback")
if(chevback){
    chevback.forEach((cv) => {
        cv.addEventListener('click', (e) => {
            const postContainer = cv.closest(".post_wrapper")
            const wrapper = postContainer.querySelector(".image_wrapper")
            gsap.to(wrapper, {
                scrollLeft: wrapper.scrollLeft - wrapper.clientWidth,
                ease: "power2.out",
                duration: 0.8,
                delay: 0.1
            })
        })
    })
}


//upload_popup

const photo_btn = document.getElementById("photo_btn")
photo_btn.addEventListener('click', function(e){
    const popup = document.querySelector(".popup")
    popup.style.display = "block"
})

//popup close btn
const popclosebtn = document.getElementById("popclosebtn")
popclosebtn.addEventListener("click", function(e){
    const popup = document.querySelector(".popup")
    popup.style.display = "none"
})

const create_post = document.querySelector(".first #create_post")
create_post.addEventListener("click", (e) => {
    e.preventDefault()
    const popup = document.querySelector(".popup")
    popup.style.display = "block"
})



//multiple post image preview
const contentimage = document.getElementById("contentimage")
console.log(contentimage)
const image_cancle = document.getElementById("image_cancle")
const imgwrapper = document.querySelector(".showimage_wrapper")

contentimage.addEventListener("change", function(e){
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

        image_cancle.addEventListener('click', function(e){
            newImg.style.display = "none"
            image_cancle.style.display = "none" 
            contentimage.value = ""     
        })
    })
    
})



const form = document.querySelector(".content form")
const form_submit = document.querySelector(".content form input[type='submit']")

form.addEventListener('submit', function(e){
    const inputText = document.querySelector(".content form input[type='text']").value
    const file = document.getElementById('contentimage').files
    const error = document.getElementById('errors')
    if (inputText === '' && file.length == 0){
        e.preventDefault()
        error.innerText = "Post must contain text or image"
        return false
    }
    else{
        return true
    }
})



// const comment_btn = document.querySelectorAll("#comment")
// comment_btn.forEach(btn => {
//     const btnclick = btn.closest("ul")
//     btnclick.addEventListener("click", (e) => {
        
//     })
// })




//status modal and adding of images and text
const status_add = document.getElementById("status_add")
const status_modal = document.querySelector(".status_modal")
const status_modal_close = document.querySelector(".status_modal_close svg")
status_add.addEventListener("click", function(e){
    status_modal.style.display = "block"

    status_modal_close.addEventListener("click", (e) => {
        status_modal.style.display = "none"
    })
})


const status_image = document.getElementById("status_image")
const status_preview = document.getElementById("status_preview")
status_image.addEventListener("change", function(e){
    const file = e.target.files
    const status_story = document.getElementById("status_story")
        const wrapper = document.querySelector(".status_preview")
        const imageUrl = URL.createObjectURL(file[0])
        const img = document.createElement("img")
        const add_text = document.querySelector(".add_text")
        const image_discard = document.getElementById("image_discard")

        img.src = imageUrl
        wrapper.append(img)
        wrapper.style.width = "300px"
        wrapper.style.height = "auto"
        img.style.width = "250px"
        img.style.height = "300px"
        img.style.marginRight = "5px"
        img.style.marginTop = "7px"
        img.style.borderRadius = "5px"
        img.style.alignSelf = "flex start"
        image_discard.style.display = "block"
        add_text.style.display = "flex"

        
        image_discard.addEventListener("click", function(e){
            img.style.display = "none"
            image_discard.style.display = "none"
            add_text.style.display = "none"
            wrapper.style.width = "0px"
            wrapper.style.height = "auto"
            status_image.value = ""
        })

})


const home_follow = document.querySelectorAll(".home_followBtn")
if(home_follow){
    home_follow.forEach((follow) => {
        follow.addEventListener('click', (e) => {
            e.preventDefault()
            const follows = e.currentTarget.closest(".follow_container")
            const url = e.currentTarget.href
            
            fetch(url, {
                method: "GET"
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if(!data.is_follow){
                    follow.innerText = "Follow"
                    follow.style.backgroundColor = "#3B82F6"
                }else{
                    follow.innerText = "Following"
                    follow.style.backgroundColor = "#ccc"
                }
            })
        })
    })
}

//Video Modal Display
const video_click = document.querySelector("#video_btn")
const video_modal = document.querySelector(".video_modal")
video_click.addEventListener("click", function(e){
    video_modal.style.display = "block"
})

//Video MOdal Close
const close_modal = document.querySelector("#close_modal")
close_modal.addEventListener("click", function(e){
    video_modal.style.display = "none"
})

//Video Display Preview
const video_upload = document.querySelector("#video_upload")
video_upload.addEventListener("change", function(e) {
    const video = e.currentTarget.files[0]
    const videoUrl = URL.createObjectURL(video)
    const video_preview = document.getElementById("video_preview")
    const video_discard = document.getElementById("video_discard")
    const video_caption = document.getElementById("video_caption")
    const error = document.getElementById("error")
    console.log(video.name)
    if (video.name.endsWith(".mp4")) {
        video_preview.src = videoUrl
        video_preview.style.display = "block"
        video_preview.style.width = "380px"
        video_preview.style.height = "200px"
        video_preview.style.marginBottom = "8px"
        video_preview.style.borderRadius = "5px"
        video_discard.style.display = "block"
        video_caption.style.display = "block"
        error.innerText = ""
    }else{
        error.innerText = "Only Video File is allowed e.g mp4 file"
        error.style.textAlign = "center"
        error.style.color = "red"
        error.style.fontSize = "12px"
        error.style.marginBottom = "4px"
    }
    
    video_discard.addEventListener("click", (e) => {
        video_preview.style.display = "none"
        video_discard.style.display = "none"
        video_caption.style.display = "none"
        video_upload.value = ""
        video_caption.value = ""

    })
})


const video_form = document.getElementById("video_form")
video_form.addEventListener("submit", function(e){
    const video_caption = document.getElementById("video_caption").value
    const video_upload = document.querySelector("#video_upload").files
    const error = document.getElementById("error")
    if (video_upload.length == 0) {
        e.preventDefault()
        error.innerText = "Click the upload icon to upload a video"
        error.style.textAlign = "center"
        error.style.color = "red"
        error.style.fontSize = "12px"
        error.style.marginBottom = "4px"
    }
})


const post_video = document.querySelectorAll(".post_video")
const observe = new IntersectionObserver(function(entries){
entries.forEach(entry => {
    const iconPaths = {
        pause: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />',
        play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />'
    };
    if (entry.intersectionRatio >= 0.7) {     
        entry.target.play()
        entry.target.muted = false 
        UpdateIcon(entry.target, iconPaths.play = null)
    }else{
        entry.target.muted = true
        entry.target.pause()
        UpdateIcon(entry.target, iconPaths.pause)
    }
})
}, { threshold: 0.7 })

post_video.forEach(video => {
    const parent = video.closest(".video_wrapper")
    const vd = parent.querySelector("video")
    video.addEventListener("click", function (e) {

        const videoContainer = e.target;
        const iconPaths = {
            pause: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />',
            play: '<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />'
        };
        if (e.target.paused) {
            e.target.play()
            e.target.muted = false
            UpdateIcon(videoContainer, iconPaths.play = null)
        } else {
            e.target.pause()
            e.target.muted = true
            UpdateIcon(videoContainer, iconPaths.pause)
        }
    })
    observe.observe(vd)
})

function UpdateIcon(clickedVideo, iconName) {
    const container = clickedVideo.closest(".video_wrapper") || clickedVideo.parentElement;
    const ps = container.querySelector(".pause");

    if (ps) {
        ps.style.display = "block";
        ps.innerHTML = iconName
    }
    if(iconName == null){
        ps.style.display = "none"
    }
}

const allvideos = document.querySelectorAll(".post_video")
const pause = document.querySelectorAll(".pause")
pause.forEach(ele => {
    const parent = ele.closest(".video_pause")
    const pauseBtn = parent.querySelector(".pause")
    pauseBtn.addEventListener("click", (e) => {
        const post_video = parent.closest(".video_wrapper").querySelector(".post_video")
        if (post_video.paused) {
            post_video.play()
            post_video.muted = false
            pauseBtn.style.display = "none"
        }else{
            post_video.pause()
            post_video.muted = true
            pauseBtn.style.display = "block"
        }
    })
})

const message_btn = document.getElementById("message_btn")
const message_dropdown = document.querySelector(".message_dropdown");
message_btn.addEventListener("click", function(e){
    e.preventDefault()
   if(message_dropdown.classList.contains("open")){
        message_dropdown.classList.remove("open")
   }else{
        message_dropdown.classList.add("open")
   }
})

//follow info
const followInfoFullname = document.querySelectorAll(".follow_info h5")
followInfoFullname.forEach(name => {
    const parent = name.closest(".follow_info")
    const originName = parent.querySelector("h5")
    const fullname = parent.querySelector("h5").textContent
    const shortPart = fullname.slice(0, 10)
    if (fullname.length > 10) {
        originName.innerText = shortPart + "....."
    }
})

/* unmute <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg> */

/* mute <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
</svg> */

/* play <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>
 */

/* pause <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
</svg>
 */


//     < svg style = "display: none;" >
//   <symbol id="icon-pause" viewBox="0 0 24 24">
//     <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
//   </symbol>
//   <symbol id="icon-play" viewBox="0 0 24 24">
//     <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
//   </symbol>
// </svg >

//     <div class="video-container" style="position: relative; width: 300px;">
//         <video id="my-video" width="300" src="your-video-file.mp4" muted loop></video>

//         <button id="video-btn" style="position: absolute; bottom: 10px; left: 10px; background: rgba(0,0,0,0.5); border: none; cursor: pointer; border-radius: 50%; padding: 8px;">
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="1.5" style="width: 24px; height: 24px;">
//                 <use id="icon-state" href="#icon-play"></use>
//             </svg>
//         </button>
//     </div>

