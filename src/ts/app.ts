/*
  Copyright 2025 Zeta Paste Authors.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { marked } from "marked";
import { parseIterations, encryptMessage, decryptMessage } from "./encrypt-decrypt";
import { createQRCodeAsImage } from "./qr-code-generator";
import "./copy-to-clipboard";

const btns = {
  edit: document.getElementById("edit") as HTMLButtonElement,
  markdown: document.getElementById("markdown") as HTMLButtonElement,
  encrypt: document.getElementById("encrypt") as HTMLButtonElement,
  decrypt: document.getElementById("decrypt") as HTMLButtonElement,
  qr: document.getElementById("qr") as HTMLLabelElement,
  wide_control: document.getElementById("wide_control") as HTMLButtonElement,
  password: document.getElementById("password") as HTMLLabelElement,
  enc_suc_link: document.getElementById("enc_suc_link") as HTMLButtonElement,
  enc_suc_close: document.getElementById("enc_suc_close") as HTMLButtonElement,
  manual_enter: document.getElementById("manual_enter") as HTMLButtonElement,
};

const elements = {
  container: document.querySelector(".container") as HTMLDivElement,
  message: document.getElementById("message") as HTMLTextAreaElement,
  preview: document.getElementById("preview") as HTMLDivElement,
  preview_text: document.querySelector("#preview > div") as HTMLDivElement,
  qr_image: document.getElementById("qr_image") as HTMLImageElement,
  qr_fail: document.getElementById("qr_fail") as HTMLDivElement,
  qr_fail_err: document.getElementById("qr_fail_err") as HTMLElement,
  password_input: document.getElementById("password_input") as HTMLInputElement,
  iterations_input: document.getElementById("iterations_input") as HTMLInputElement,
};

// ======================================================
// --- \ Misc -------------------------------------------
// ======================================================
// Get Hash
const getHash = (): string => {
  return window.location.hash.trim();
};

// Password input focus
btns.password.addEventListener("click", () => {
  setTimeout(() => {
    elements.password_input.focus();
  }, 20);
});

// Handle Hashchange
window.addEventListener("hashchange", function () {
  if (window.location.hash) {
    checkQRCodeBtn();
    checkDecryptBtn();
  }
});
// ======================================================
// END \ Misc -------------------------------------------
// ======================================================

// ======================================================
// --- \ Edit & Preview ---------------------------------
// ======================================================
const updPreview = async (): Promise<void> => {
  const mdText = elements.message.value;
  elements.preview_text.innerHTML = await marked.parse(mdText);

  const links = document.querySelectorAll("#preview a");
  for (const el of links) {
    const a = el as HTMLAnchorElement;
    a.classList.add("link");
    a.rel = "noreferrer nofollow noopener";
    a.href = `https://href.li/?${a.href}`;
  }
};

const preparePreview = (): void => {
  elements.preview.classList.add("h-full");
  elements.preview.classList.remove("items-center");
  elements.preview_text.classList.remove("flex", "flex-wrap", "justify-center");
  elements.container.classList.remove("justify-center");
};

let is_editing: boolean = false;

const modeState = (): void => {
  let is_message_not_empty: boolean = elements.message.value.trim() !== ""; // If textarea empty = false (so, by default)

  if (is_editing) {
    btns.markdown.disabled = !is_message_not_empty;
    btns.markdown.style.display = "flex";
    btns.edit.style.display = "none";
    elements.message.focus();
    if (!is_message_not_empty) {
      preparePreview();
    }
  } else {
    btns.markdown.style.display = "none";
    btns.edit.style.display = "flex";
  }
};

const handleModeClick = (): void => {
  is_editing = !is_editing;
  elements.preview.style.display = is_editing ? "none" : "flex";
  elements.message.style.display = is_editing ? "flex" : "none";

  if (!is_editing) updPreview();
  modeState();
};

elements.message.addEventListener("input", modeState);
btns.edit.addEventListener("click", handleModeClick);
btns.markdown.addEventListener("click", handleModeClick);
// ======================================================
// END \ Edit & Preview ---------------------------------
// ======================================================

// ======================================================
// --- \ QR Code ----------------------------------------
// ======================================================
// Check QR Code button
const checkQRCodeBtn = (): void => {
  const is_hash_not_empty = getHash() !== "";

  if (is_hash_not_empty) {
    btns.qr.classList.remove("pointer-events-none", "opacity-25");
  } else {
    btns.qr.classList.add("pointer-events-none", "opacity-25");
  }
};

checkQRCodeBtn();

// Generate QR Code
const generateQRCode = async (): Promise<void> => {
  elements.qr_fail.parentElement?.parentElement?.classList.add("max-w-none", "w-auto");
  elements.qr_image.classList.remove("hidden");
  elements.qr_fail.classList.add("hidden");
  elements.qr_fail_err.textContent = "";

  try {
    const qr_data_url = await createQRCodeAsImage(window.location.href);
    elements.qr_image.src = qr_data_url;
  } catch (error) {
    elements.qr_fail_err.textContent = String(error);
    elements.qr_fail.parentElement?.parentElement?.classList.remove("max-w-none", "w-auto");
    elements.qr_image.classList.add("hidden");
    elements.qr_fail.classList.remove("hidden");
  }
};

btns.qr.addEventListener("click", generateQRCode);
// ======================================================
// END \ QR Code ----------------------------------------
// ======================================================

// ======================================================
// --- \ Preview/Edit Wide Control ----------------------
// ======================================================
// List of width classes
const wide_control_sizes = ["md:max-w-lg", "md:max-w-xl", "md:max-w-2xl", "md:max-w-4xl", "md:max-w-full"];

// Index to track current width class
let wide_control_index = 1;

// Remove all width classes
const removeAllWideClasses = (): void => {
  wide_control_sizes.forEach((cls) => elements.container.classList.remove(cls));
};

// Apply width class and update index
const applyWideClass = (index: number): void => {
  const current_class = wide_control_sizes[index];
  removeAllWideClasses();
  elements.container.classList.add(current_class);
  localStorage.setItem("wide", current_class);
  wide_control_index = (index + 1) % wide_control_sizes.length;
};

// Click handler to cycle in width classes
const handleWideControlClick = (): void => {
  applyWideClass(wide_control_index);
};

// On page load, check localStorage and apply saved width class if exists
const saved_wide = localStorage.getItem("wide");
if (saved_wide && wide_control_sizes.includes(saved_wide)) {
  const saved_index = wide_control_sizes.indexOf(saved_wide);
  applyWideClass(saved_index);
}

btns.wide_control.addEventListener("click", handleWideControlClick);
// ======================================================
// END \ Preview/Edit Wide Control ----------------------
// ======================================================

// ======================================================
// --- \ Manual Enter for Decrypt -----------------------
// ======================================================
const manual_enter = {
  hash_input: document.getElementById("hash_input") as HTMLInputElement,
  salt_input: document.getElementById("salt_input") as HTMLInputElement,
  iv_input: document.getElementById("iv_input") as HTMLInputElement,
  data_input: document.getElementById("data_input") as HTMLInputElement,
};

// Manual Enter for Decrypt: SALT, IV, DATA
const manualEnterCheck = (): void => {
  let hash: string | null = manualEnterExtractHash(manual_enter.hash_input.value);

  let salt_iv_data: boolean =
    manual_enter.salt_input.value !== "" &&
    manual_enter.iv_input.value !== "" &&
    manual_enter.data_input.value !== "";

  if (salt_iv_data || hash) {
    btns.manual_enter.classList.remove("pointer-events-none", "opacity-25");
  } else {
    btns.manual_enter.classList.add("pointer-events-none", "opacity-25");
  }
};

document.querySelectorAll("#manual_enter_inputs input").forEach((input) => {
  input.addEventListener("input", () => {
    manualEnterCheck();
  });
});

const manualEnter = (): void => {
  let salt_iv_data: boolean =
    manual_enter.salt_input.value !== "" &&
    manual_enter.iv_input.value !== "" &&
    manual_enter.data_input.value !== "";

  if (salt_iv_data) {
    window.location.hash = `${manual_enter.salt_input.value}:${manual_enter.iv_input.value}:${manual_enter.data_input.value}`;
  }

  let hash: string | null = manualEnterExtractHash(manual_enter.hash_input.value);

  if (hash) {
    window.location.hash = hash;
  }

  manual_enter.salt_input.value = "";
  manual_enter.iv_input.value = "";
  manual_enter.data_input.value = "";
  manual_enter.hash_input.value = "";
};

btns.manual_enter.addEventListener("click", manualEnter);
// ======================================================
// END \ Manual Enter for Decrypt -----------------------
// ======================================================

// ======================================================
// --- \ Encryption -------------------------------------
// ======================================================
const encryption = {
  enc_suc: document.getElementById("enc_suc_modal") as HTMLInputElement,
  enc_suc_iterations_r: document.getElementById("enc_suc_iterations_r") as HTMLSpanElement,
  enc_suc_iterations: document.getElementById("enc_suc_iterations") as HTMLSpanElement,
  enc_suc_salt: document.getElementById("enc_suc_salt") as HTMLElement,
  enc_suc_salt_sk: document.getElementById("enc_suc_salt_sk") as HTMLElement,
  enc_suc_iv: document.getElementById("enc_suc_iv") as HTMLElement,
  enc_suc_iv_sk: document.getElementById("enc_suc_iv_sk") as HTMLElement,
  enc_suc_data: document.getElementById("enc_suc_data") as HTMLElement,
  enc_suc_data_sk: document.getElementById("enc_suc_data_sk") as HTMLElement,
  enc_suc_aio: document.getElementById("enc_suc_aio") as HTMLElement,
  enc_suc_aio_sk: document.getElementById("enc_suc_aio_sk") as HTMLElement,
  enc_fail: document.getElementById("enc_fail_modal") as HTMLInputElement,
  enc_fail_err: document.getElementById("enc_fail_err") as HTMLElement,
  enc_status: document.getElementById("enc_status_modal") as HTMLInputElement,
};

// Check Encrypt button enabled or disabled
const checkEncryptBtn = (): void => {
  const is_message_not_empty: boolean = elements.message.value.trim() !== "";
  const is_password_not_empty: boolean = elements.password_input.value.length >= 6;

  if (is_message_not_empty && is_password_not_empty) {
    btns.encrypt.classList.remove("pointer-events-none", "opacity-25");
  } else {
    btns.encrypt.classList.add("pointer-events-none", "opacity-25");
  }
};

elements.message.addEventListener("input", checkEncryptBtn);
elements.password_input.addEventListener("input", checkEncryptBtn);

// // Click to unhide SALT, IV, DATA after Encrypt Success
// Hide one element and show another
function unhideSaltIVData(hideElement: HTMLElement, showElement: HTMLElement) {
  hideElement.classList.add("hidden");
  showElement.classList.remove("hidden");
}

// List of elements to handle click events for showing/hiding
const saltIVDataClickHandlers = [
  { hide: encryption.enc_suc_salt_sk, show: encryption.enc_suc_salt },
  { hide: encryption.enc_suc_iv_sk, show: encryption.enc_suc_iv },
  { hide: encryption.enc_suc_data_sk.parentElement!, show: encryption.enc_suc_data.parentElement! },
  { hide: encryption.enc_suc_aio_sk.parentElement!, show: encryption.enc_suc_aio.parentElement! },
];

// Click event listeners to handle showing/hiding elements
saltIVDataClickHandlers.forEach(({ hide, show }) => {
  hide.addEventListener("click", () => unhideSaltIVData(hide, show));
});

// // Encrypt
btns.encrypt.addEventListener("click", async () => {
  encryption.enc_status.checked = true;

  await new Promise((a) => setTimeout(a, 1000)); // Wait for 1 second before start encryption

  const password: string = elements.password_input.value;
  elements.password_input.value = ""; // Clear password before start encryption

  try {
    const encryptedMessage: string = encryptMessage(
      elements.message.value,
      password,
      parseIterations(elements.iterations_input.value)
    );

    // Put hash in address bar
    window.location.hash = encryptedMessage;

    const [salt, iv, data] = encryptedMessage.split(":");

    encryption.enc_suc_iterations_r.textContent = elements.iterations_input.value;
    encryption.enc_suc_iterations.textContent = parseIterations(elements.iterations_input.value).toString();
    encryption.enc_suc_salt.textContent = salt;
    encryption.enc_suc_iv.textContent = iv;
    encryption.enc_suc_data.textContent = data;
    encryption.enc_suc_aio.textContent = `SALT: ${salt}\nIV: ${iv}\nDATA: ${data}`;

    encryption.enc_status.checked = false;
    encryption.enc_suc.checked = true;

    checkQRCodeBtn();
    checkDecryptBtn();
    checkEncryptBtn();
  } catch (error) {
    encryption.enc_fail_err.textContent = String(error);
    encryption.enc_status.checked = false;
    encryption.enc_fail.checked = true;
  }
});

// Button for close Encryption Success
btns.enc_suc_close.addEventListener("click", () => {
  encryption.enc_suc.checked = false;
});

// Button for copy url to clipboard from Encryption Success
btns.enc_suc_link.addEventListener("click", () => {
  navigator.clipboard.writeText(window.location.href);
});
// ======================================================
// END \ Encryption--------------------------------------
// ======================================================

// ======================================================
// --- \ Decryption -------------------------------------
// ======================================================
const decryption = {
  dec_fail: document.getElementById("dec_fail_modal") as HTMLInputElement,
  dec_fail_err: document.getElementById("dec_fail_err") as HTMLElement,
  dec_status: document.getElementById("dec_status_modal") as HTMLInputElement,
};

const checkDecryptBtn = (): void => {
  let hash_not_empty: boolean = getHash() !== "";
  let is_password_not_empty: boolean = elements.password_input.value.length >= 6;

  if (hash_not_empty && is_password_not_empty) {
    btns.decrypt.classList.remove("pointer-events-none", "opacity-25");
  } else {
    btns.decrypt.classList.add("pointer-events-none", "opacity-25");
  }
};

elements.password_input.addEventListener("input", checkDecryptBtn);

const manualEnterExtractHash = (input: string): string | null => {
  // Regex for extraction "x:y:z"
  const regex = /(?:https?:\/\/[^\/\s]+)?\/?#([^:]+:[^:]+:[^:]+)$/;
  const match = input.match(regex);

  // If match, return result
  return match?.[1] || null;
};

// // Decrypt
btns.decrypt.addEventListener("click", async () => {
  decryption.dec_fail_err.textContent = "";

  const hash: string = getHash().slice(1);
  decryption.dec_status.checked = true;

  await new Promise((a) => setTimeout(a, 1000)); // Wait for 1 second before decryption

  let password: string = elements.password_input.value;
  elements.password_input.value = "";

  try {
    const decryptedMessage: string = decryptMessage(
      hash,
      password,
      parseIterations(elements.iterations_input.value)
    );

    elements.message.value = decryptedMessage;
    preparePreview();
    updPreview();
    checkDecryptBtn();
    checkEncryptBtn();
    decryption.dec_status.checked = false;
  } catch (error) {
    checkDecryptBtn();
    checkEncryptBtn();
    decryption.dec_status.checked = false;
    decryption.dec_fail_err.textContent = String(error);
    decryption.dec_fail.checked = true;
  }
});
// ======================================================
// END \ Decryption--------------------------------------
// ======================================================
