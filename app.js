(function () {
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setupReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;

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
    var celebritySplit = 0.5;
    var buttons = Array.prototype.slice.call(presetWrap.querySelectorAll("button"));

    function formatMoney(value) {
      if (value >= 1000000) {
        return "$" + (value / 1000000).toFixed(1).replace(".0", "") + "M";
      }
      return "$" + Math.round(value / 1000) + "K";
    }

    function updateCalculator() {
      var players = Number(slider.value);
      var annualShare = players * revenuePerMauMonth * 12 * (1 - costAllowance) * celebritySplit;

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

  setupReveal();
  setupCalculator();
})();
