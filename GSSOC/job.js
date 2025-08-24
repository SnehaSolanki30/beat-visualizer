// Auto-update year
document.addEventListener("DOMContentLoaded", function () {
  const yearSpan = document.querySelector(".footer-bottom p");
  if (yearSpan) {
    const currentYear = new Date().getFullYear();
    yearSpan.innerHTML = `© ${currentYear} JobSync. All rights reserved.`;
  }
});
