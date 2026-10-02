/* ---------- Тёмная тема ---------- */
const THEME_KEY = "shop:theme";

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    const isDark = theme === "dark";
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      isDark ? "Включить светлую тему" : "Включить тёмную тему",
    );
    const icon = btn.querySelector(".theme-toggle__icon");
    if (icon) icon.textContent = isDark ? "☀" : "☾";
  });
};

const getInitialTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

// Применяем тему максимально рано
applyTheme(getInitialTheme());

const initThemeToggle = () => {
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.dataset.theme || "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  });

  // Реагируем на смену системной темы (если пользователь не выбирал вручную)
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", (e) => {
    if (localStorage.getItem(THEME_KEY)) return;
    applyTheme(e.matches ? "dark" : "light");
  });
};

initThemeToggle();

const orderDialog = document.getElementById("order-dialog");

const orderButtons = document.querySelectorAll(".product-card__button");

const closeDialogButton = document.getElementById("close-order-dialog");

const selectedProductInput = document.getElementById("selected-product");

orderButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const productName = button.dataset.product;

    selectedProductInput.value = productName;

    orderDialog.showModal();
  });
});

closeDialogButton.addEventListener("click", () => {
  orderDialog.close();
});

const orderForm = document.getElementById("order-form");

const successMessage = document.getElementById("success-message");

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute("aria-invalid");
    }
  });

  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute("aria-invalid", "true");
      }
    });

    orderForm.reportValidity();
    return;
  }
  successMessage.hidden = false;

  orderForm.reset();

  orderDialog.close();
});
