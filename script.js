document.addEventListener("DOMContentLoaded", () => {
  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Lightbox elements
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("close");

  // If any of these are missing, don't crash the page
  if (!lightbox || !lightboxImg || !closeBtn) return;

  // Open lightbox when clicking a card
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-full") || card.querySelector("img")?.getAttribute("src");
      if (!src) return;

      lightboxImg.src = src;
      lightbox.classList.add("show");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  // Close helpers
  const closeLightbox = () => {
    lightbox.classList.remove("show");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = ""; // stop loading / free memory
  };

  closeBtn.addEventListener("click", closeLightbox);

  // Click outside the image closes
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("show")) {
      closeLightbox();
    }
  });
});
