import "./theme-control";

const swName = "/paste/service-worker.js"; // Trick parcel :D

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(swName, { scope: "/paste/" })
      .then((registration) => {
        console.log("Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("Service Worker registration error:", error);
      });
  });
}
