"use strict";

// These expressions enforce the laboratory's specified syntax, not mailbox or number ownership.
const PHONE_REGEX = /^\+380\d{9}$/;
const EMAIL_REGEX = /^[^\s@.]+(?:\.[^\s@.]+)*@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;
const NAME_REGEX = /^[\p{L}\p{M}]+(?:[ '\u2019-][\p{L}\p{M}]+)*$/u;

function countCharacters(value) {
  return Array.from(value.normalize("NFC")).length;
}

function validateName(value) {
  const name = value.trim().normalize("NFC");
  if (!name) return "Введіть ім’я.";
  if (countCharacters(name) < 2 || countCharacters(name) > 80) return "Ім’я має містити від 2 до 80 символів.";
  if (!NAME_REGEX.test(name)) return "Використайте літери, пробіл, дефіс або апостроф.";
  return "";
}

function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Введіть електронну адресу.";
  if (email.length > 254 || !EMAIL_REGEX.test(email)) return "Введіть адресу у форматі user@example.com.";
  return "";
}

function validatePhone(value) {
  if (!value.trim()) return "Введіть номер телефону.";
  if (!PHONE_REGEX.test(value)) return "Введіть номер у форматі +380501234567 без пробілів.";
  return "";
}

function validateMessage(value) {
  const message = value.trim();
  if (!message) return "Введіть повідомлення.";
  const length = countCharacters(message);
  if (length < 10 || length > 2000) return "Повідомлення має містити від 10 до 2000 символів.";
  return "";
}

function validateAgreement(checked) {
  return checked ? "" : "Підтвердьте згоду з демонстраційною політикою.";
}

const feedbackForm = document.getElementById("feedbackForm");

if (feedbackForm) {
  const fields = {
    username: feedbackForm.elements.namedItem("username"),
    email: feedbackForm.elements.namedItem("email"),
    phone: feedbackForm.elements.namedItem("phone"),
    message: feedbackForm.elements.namedItem("message"),
    agreement: feedbackForm.elements.namedItem("agreement"),
  };
  const errors = {
    username: document.getElementById("usernameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    message: document.getElementById("messageError"),
    agreement: document.getElementById("agreementError"),
  };
  const validators = {
    username: () => validateName(fields.username.value),
    email: () => validateEmail(fields.email.value),
    phone: () => validatePhone(fields.phone.value),
    message: () => validateMessage(fields.message.value),
    agreement: () => validateAgreement(fields.agreement.checked),
  };
  const submitButton = feedbackForm.querySelector('[type="submit"]');
  const status = document.getElementById("feedbackStatus");
  const dialog = document.getElementById("feedbackSuccessDialog");
  const dialogClose = document.getElementById("feedbackDialogClose");

  function showError(name, message) {
    const field = fields[name];
    const error = errors[name];
    field.setAttribute("aria-invalid", "true");
    field.classList.remove("is-valid", "border-green-500");
    field.classList.add("is-invalid", "border-red-500");
    error.textContent = message;
    error.hidden = false;
  }

  function showSuccess(name) {
    const field = fields[name];
    const error = errors[name];
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("is-invalid", "border-red-500");
    field.classList.add("is-valid", "border-green-500");
    error.textContent = "";
    error.hidden = true;
  }

  function clearError(name) {
    const field = fields[name];
    const error = errors[name];
    field.setAttribute("aria-invalid", "false");
    field.classList.remove("is-invalid", "is-valid", "border-red-500", "border-green-500");
    error.textContent = "";
    error.hidden = true;
  }

  function checkField(name) {
    const message = validators[name]();
    if (message) showError(name, message);
    else showSuccess(name);
    return !message;
  }

  for (const [name, field] of Object.entries(fields)) {
    const eventName = name === "agreement" ? "change" : "input";
    field.addEventListener(eventName, () => checkField(name));
    field.addEventListener("blur", () => checkField(name));
  }

  feedbackForm.addEventListener("submit", (event) => {
    event.preventDefault(); // No backend is connected; never send form values.
    status.hidden = true;
    status.textContent = "";
    let firstInvalid = null;
    for (const name of Object.keys(fields)) {
      if (!checkField(name) && !firstInvalid) firstInvalid = fields[name];
    }
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    feedbackForm.reset();
    for (const name of Object.keys(fields)) clearError(name);
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
      dialogClose.focus();
    } else {
      status.textContent = "Форма пройшла клієнтську валідацію. Це демонстрація; дані не надсилалися.";
      status.hidden = false;
      submitButton.focus();
    }
  });

  if (dialog && dialogClose) {
    dialogClose.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => submitButton.focus());
    dialog.addEventListener("click", (event) => {
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) {
        dialog.close();
      }
    });
  }

  // Disabled in HTML so an unavailable script cannot submit personal input as a GET request.
  submitButton.disabled = false;
}
