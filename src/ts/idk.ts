const idk_logo = document.getElementById("logo") as HTMLElement;
const idk_modal = document.getElementById("idk_modal") as HTMLInputElement;
const idk_img = document.getElementById("idk_img") as HTMLImageElement;

const click_threshold = 10;
const time_threshold = 5000;

let click_count = 0;
let first_click_time = 0;

if (idk_logo && idk_modal && idk_img) {
  idk_logo.addEventListener("click", () => {
    const currentTime = new Date().getTime();

    if (currentTime - first_click_time > time_threshold) {
      click_count = 0;
      first_click_time = currentTime;
    }

    click_count++;

    if (click_count === 1) {
      first_click_time = currentTime;
    }

    if (click_count >= click_threshold) {
      idk_modal.checked = true;
      click_count = 0;
    }
  });

  idk_img.addEventListener("click", () => {
    idk_modal.checked = false;
  });
}
