const card_btn = document.querySelectorAll(".card_btn")

card_btn.forEach(card => {
    const parent = card.closest(".card_info")
    const cardBtn = parent.querySelector(".card_btn")

    cardBtn.addEventListener("click", function(e){
        cardBtn.style.backgroundColor = "#dddddd"
        cardBtn.style.color = "#000"
    })
})