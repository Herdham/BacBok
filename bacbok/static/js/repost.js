const post_caption = document.querySelectorAll(".content .post_caption")
console.log(post_caption)
if (post_caption) {
    post_caption.forEach(caption => {
        const parent = caption.closest(".content")
        const postCaption = parent.querySelector(".post_caption").textContent
        const shortPostCaption = parent.querySelector(".post_caption").textContent
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

const repostForm = document.querySelector(".repost_container #repostForm")
// const repostBtn = document.getElementById("repostBtn")
if (repostForm) {
    repostForm.addEventListener("submit", (e) => {
        e.preventDefault()
        
        const url = window.location.href
        const form = new FormData(repostForm)
        fetch(url, {
            method: "POST",
            body: form,
            headers: {
                "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value
            }
        }).then(res => res.json())
        .then(body => {
            const success = document.getElementById("success")
            success.innerText = body.success
            alert(body.success)
        })
    })
}
