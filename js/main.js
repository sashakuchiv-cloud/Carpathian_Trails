"use strict";

const menuButton = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-navigation");

if (menuButton && mobileNav) {
  const closeMenu = (returnFocus = false) => {
    mobileNav.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Відкрити меню");
    if (returnFocus) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    const willOpen = mobileNav.hidden;
    mobileNav.hidden = !willOpen;
    menuButton.setAttribute("aria-expanded", String(willOpen));
    menuButton.setAttribute("aria-label", willOpen ? "Закрити меню" : "Відкрити меню");
  });

  mobileNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) closeMenu(true);
  });

  document.addEventListener("click", (event) => {
    if (!mobileNav.hidden && !event.target.closest(".site-header")) closeMenu();
  });

  window.matchMedia("(min-width: 1024px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const filterButtons = [...document.querySelectorAll(".filter-button")];
const routeCards = [...document.querySelectorAll(".route-card[data-difficulty]")];
const filterStatus = document.querySelector(".filter-status");

for (const button of filterButtons) {
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    for (const item of filterButtons) {
      item.setAttribute("aria-pressed", String(item === button));
    }
    let count = 0;
    for (const card of routeCards) {
      const visible = selected === "all" || card.dataset.difficulty === selected;
      card.hidden = !visible;
      if (visible) count += 1;
    }
    if (filterStatus) {
      filterStatus.textContent = count === 1 ? "Показано 1 маршрут" : `Показано ${count} маршрути`;
    }
  });
}

document.querySelectorAll('a[href="#hoverla"], a[href="#borzhava"], a[href="#synevyr"]').forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector('.filter-button[data-filter="all"]')?.click();
  });
});

const weatherButton = document.querySelector(".weather-refresh");
const weatherStatus = document.querySelector("#weather-status");
const weatherValues = document.querySelector(".weather-values");
const weatherUpdated = document.querySelector("#weather-updated");
const weatherEndpoint = "https://api.open-meteo.com/v1/forecast?latitude=48.16021&longitude=24.49994&current=temperature_2m,wind_speed_10m,precipitation&timezone=Europe%2FKyiv&forecast_days=1";

async function updateWeather() {
  if (!weatherButton || !weatherStatus || !weatherValues || !weatherUpdated) return;
  weatherButton.disabled = true;
  weatherStatus.hidden = false;
  weatherStatus.textContent = "Завантаження погодних даних…";
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(weatherEndpoint, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const current = payload.current;
    if (!current || ![current.temperature_2m, current.wind_speed_10m, current.precipitation].every(Number.isFinite)) {
      throw new Error("Неповні погодні дані");
    }
    document.querySelector("#weather-temp").textContent = `${current.temperature_2m} °C`;
    document.querySelector("#weather-wind").textContent = `${current.wind_speed_10m} км/год`;
    document.querySelector("#weather-rain").textContent = `${current.precipitation} мм`;
    weatherValues.hidden = false;
    weatherStatus.textContent = "Погодні дані оновлено.";
    weatherUpdated.textContent = `Час спостереження: ${String(current.time).replace("T", " ")} (Київ). Дані моделі для координат вершини, не локальне вимірювання.`;
  } catch (error) {
    weatherValues.hidden = true;
    weatherStatus.textContent = "Погода зараз недоступна. Перевірте з’єднання та спробуйте оновити.";
    weatherUpdated.textContent = "";
    console.info("Open-Meteo request unavailable:", error.message);
  } finally {
    window.clearTimeout(timeout);
    weatherButton.disabled = false;
  }
}

if (weatherButton) {
  weatherButton.addEventListener("click", updateWeather);
  updateWeather();
}
