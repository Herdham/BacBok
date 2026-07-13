const search_follow = document.querySelectorAll(".search_follow")

console.log(search_follow)
search_follow.forEach((follow) => {
    follow.addEventListener('click', (e) => {
        e.preventDefault()
        console.log("Is Clicking")
        const follows = e.currentTarget.closest(".last")
        const url = e.currentTarget.href

        fetch(url, {
            method: "GET"
        })
            .then(res => res.json())
            .then(data => {
                if (!data.is_follow) {
                    follow.innerText = "Follow"
                    follow.style.backgroundColor = "#3B82F6"
                } else {
                    follow.innerText = "Following"
                    follow.style.backgroundColor = "#ccc"
                }
            })
    })
})