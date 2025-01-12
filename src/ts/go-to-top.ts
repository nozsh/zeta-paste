const go_to_top_btn = document.getElementById("go_to_top");

if (go_to_top_btn) {
  const checkGoToTopBtn = () => {
    if (window.scrollY > 900) {
      go_to_top_btn.style.display = "block";
    } else {
      go_to_top_btn.style.display = "none";
    }
  };

  go_to_top_btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  checkGoToTopBtn();
  window.addEventListener("scroll", checkGoToTopBtn);
}
