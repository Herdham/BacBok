/* Per-page animation initializers.
   Exposes: initHomeAnimations(), initLoginAnimations()
   Each initializer calls loadGsap() safely and respects prefers-reduced-motion.
*/
(function (global) {
  function withGsap(cb) {
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return Promise.resolve(null);
    }
    if (typeof loadGsap !== "function") {
      return Promise.resolve(null);
    }
    return loadGsap()
      .then(function (gsap) {
        if (!gsap) return null;
        try {
          cb(gsap);
        } catch (e) {
          console.error(e);
        }
        return gsap;
      })
      .catch(function () {
        return null;
      });
  }

  function initHomeAnimations() {
    withGsap(function (gsap) {
      if (!gsap || !gsap.utils) return;
      var selector = ".post-card, .post, .status-card, .feed-item";
      var items = document.querySelectorAll(selector);
      if (!items.length) return;
      items.forEach(function (el) {
        try {
          gsap.fromTo(
            el,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        } catch (e) {}
      });
    });
  }

  function initLoginAnimations() {
    withGsap(function (gsap) {
      if (!gsap) return;
      // subtle floating background shapes
      var blobs = document.querySelectorAll(
        ".bg-shape, .bg-shape-1, .bg-shape-2, .bg-shape-3",
      );
      if (blobs.length) {
        try {
          gsap.to(blobs, {
            y: "+=30",
            yoyo: true,
            repeat: -1,
            duration: 8,
            ease: "sine.inOut",
            stagger: 2,
          });
        } catch (e) {}
      }

      // submit button micro-interaction
      var submit = document.querySelector(".submit-btn");
      if (submit) {
        submit.addEventListener("click", function () {
          try {
            gsap.to(submit, {
              scale: 0.98,
              duration: 0.08,
              yoyo: true,
              repeat: 1,
            });
          } catch (e) {}
        });
      }
    });
  }

  function initVerifyAnimations() {
    withGsap(function (gsap) {
      if (!gsap) return;
      var icon = document.querySelector('.email-icon');
      var container = document.querySelector('.container');
      if (icon) {
        try {
          gsap.fromTo(icon, { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.2)' });
        } catch (e) {}
      }
      if (container) {
        try {
          gsap.from(container, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
        } catch (e) {}
      }
    });
  }

  global.initHomeAnimations = initHomeAnimations;
  global.initLoginAnimations = initLoginAnimations;
  global.initVerifyAnimations = initVerifyAnimations;
})(window);
