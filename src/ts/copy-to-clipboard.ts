const copy_btns = document.querySelectorAll(".copy-btn");
copy_btns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Get element ID copy from
    const target_id = btn.getAttribute("copy-target");
    const content_to_copy = document.getElementById(target_id!) as HTMLElement;

    // Copy content
    navigator.clipboard
      .writeText(content_to_copy.textContent || "")
      .then(() => {
        // pass
        // alert("Content copied!");
      })
      .catch((err) => {
        console.error("Copy to clipboard error:", err);
      });
  });
});
