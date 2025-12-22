const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const closeBtn = document.getElementById("close");

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".card").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-full");
    lightboxImg.src = src;
    lightbox.classList.add("show");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox(){
  lightbox.classList.remove("show");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
