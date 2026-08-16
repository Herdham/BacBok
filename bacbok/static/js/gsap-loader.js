// Safe GSAP loader: dynamically load GSAP core and ScrollTrigger, register plugin.
// Usage: loadGsap().then(gsap => { /* use gsap */ })
(function (global) {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        // already present
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error("Failed to load " + src));
      };
      document.head.appendChild(s);
    });
  }

  function loadGsap() {
    // Respect reduced motion
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return Promise.resolve(null);
    }

    // If gsap already loaded, ensure ScrollTrigger registered
    if (window.gsap && window.gsap.registerPlugin) {
      return Promise.resolve(window.gsap);
    }

    // Load core then ScrollTrigger
    var coreSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    var stSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js";

    return loadScript(coreSrc)
      .then(function () {
        return loadScript(stSrc);
      })
      .then(function () {
        try {
          if (
            window.gsap &&
            window.ScrollTrigger &&
            window.gsap.registerPlugin
          ) {
            window.gsap.registerPlugin(window.ScrollTrigger);
          }
        } catch (e) {
          /* ignore */
        }
        return window.gsap;
      });
  }

  global.loadGsap = loadGsap;
})(window);
