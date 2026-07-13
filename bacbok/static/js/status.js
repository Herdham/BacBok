document.addEventListener("DOMContentLoaded", (event) => {
        gsap.from(".status_container", {
            "opacity": 0,
            "ease": 0.5,
            "duration": 1,
            x: -100,
        })

});


const chevfront = document.getElementById("chevfront");
const status_container = document.querySelector(".status_container")
chevfront.addEventListener("click", function(e){
    gsap.to(status_container, {
        scrollLeft: status_container.scrollLeft + 400,
        duration: 0.8,
        ease: "back.out(1.7)"
    })
})

const chevback = document.getElementById("chevback");
chevback.addEventListener("click", (e) => {
    gsap.to(status_container, {
        scrollLeft: status_container.scrollLeft - 400,
        duration: 0.8,
        ease: "power2.out"
    })
})