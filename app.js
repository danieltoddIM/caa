(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    document.documentElement.classList.add("reveal-ready");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  function setupCalculator() {
    var slider = document.getElementById("mauRange");
    var mauText = document.getElementById("mauText");
    var shareText = document.getElementById("shareText");
    var presetWrap = document.getElementById("presets");
    if (!slider || !mauText || !shareText || !presetWrap) return;

    var revenuePerMauMonth = 5.5;
    var costAllowance = 0.25;
    var talentSplit = 0.5;
    var buttons = Array.prototype.slice.call(presetWrap.querySelectorAll("button"));

    function formatMoney(value) {
      if (value >= 1000000) {
        return "$" + (value / 1000000).toFixed(1).replace(".0", "") + "M";
      }
      return "$" + Math.round(value / 1000) + "K";
    }

    function updateCalculator() {
      var players = Number(slider.value);
      var annualShare = players * revenuePerMauMonth * 12 * (1 - costAllowance) * talentSplit;

      mauText.textContent = players.toLocaleString("en-US");
      shareText.textContent = "~" + formatMoney(annualShare);

      buttons.forEach(function (button) {
        button.setAttribute("aria-pressed", String(Number(button.dataset.value) === players));
      });
    }

    slider.addEventListener("input", updateCalculator);
    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        slider.value = button.dataset.value;
        updateCalculator();
        slider.focus({ preventScroll: true });
      });
    });

    updateCalculator();
  }

  function setupHeroVideo() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var videos = Array.prototype.slice.call(document.querySelectorAll(".hero-video"));
    if (!videos.length || reduceMotion) return;

    videos.forEach(function (video) {
      var wrapper = video.closest(".hero-video-wrap");
      var source = video.getAttribute("data-src");
      if (!source) return;

      video.addEventListener("canplay", function () {
        if (wrapper) wrapper.classList.add("video-playing");
      }, { once: true });

      video.addEventListener("error", function () {
        if (wrapper) wrapper.classList.remove("video-playing");
      });

      video.src = source;
      video.load();
      var playAttempt = video.play();
      if (playAttempt && playAttempt.catch) {
        playAttempt.catch(function () {
          if (wrapper) wrapper.classList.remove("video-playing");
        });
      }
    });
  }

  setupReveal();
  setupCalculator();
  setupHeroVideo();
})();
