document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".navbar") as HTMLElement;
  const header_height = header ? header.offsetHeight : 0;

  // Scroll to element with hash, respect header height
  const scrollToAnchor = (hash: string, behavior: ScrollBehavior = "smooth") => {
    const target_element = document.querySelector(hash) as HTMLElement;
    if (target_element) {
      const target_position = target_element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: target_position - header_height,
        behavior: behavior,
      });
    }
  };

  // Handle anchor link clicks
  const handleAnchorClick = (event: Event) => {
    const target = event.target as HTMLAnchorElement;
    if (target && target.hash) {
      event.preventDefault();
      const hash = target.hash;

      // Update URL with new hash
      history.pushState(null, "", hash);

      // Scroll to element
      scrollToAnchor(hash);
    }
  };

  // Manual or history hash change
  const handleHashChange = () => {
    if (window.location.hash) {
      scrollToAnchor(window.location.hash);
    }
  };

  // Attach event listeners
  const anchor_links = document.querySelectorAll('a[href^="#"]');
  anchor_links.forEach((link) => link.addEventListener("click", handleAnchorClick));
  window.addEventListener("hashchange", handleHashChange);
  window.addEventListener("load", handleHashChange); // On load

  // On load (if page loaded with hash in URL)
  if (window.location.hash) {
    // Disable auto-scroll
    const hash = window.location.hash;
    history.replaceState(null, "", " "); // Temporarily remove hash

    // Restore hash and scroll manually
    setTimeout(() => {
      history.replaceState(null, "", hash);
      scrollToAnchor(hash, "instant");
    }, 0);
  }

  // Track scroll and update hash based on visible header
  const updateHashOnScroll = () => {
    const anchor_links = document.querySelectorAll('a[href^="#"]'); // Все якорные ссылки
    const target_ids = new Set<string>();

    // Collect all ids referenced by anchor links
    anchor_links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        target_ids.add(href.substring(1)); // Убираем "#" и добавляем id в Set
      }
    });

    let current_hash = "";

    // Check visibility of elements referenced by anchor links
    target_ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        const is_visible = rect.top <= header_height && rect.bottom >= header_height;

        if (is_visible) {
          current_hash = `#${id}`;
        }
      }
    });

    // Update hash if it has changed
    if (current_hash && window.location.hash !== current_hash) {
      history.replaceState(null, "", current_hash);
    }
  };

  window.addEventListener("scroll", updateHashOnScroll);
});
