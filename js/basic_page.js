
window.addEventListener('DOMContentLoaded', () => {
  // fetch all reused html sections
  Promise.all([
    fetch("p_header.html").then(res => res.text()),
    fetch("p_hero.html").then(res => res.text()),
    fetch("p_footer.html").then(res => res.text())
  ]).then(([headerHtml, heroHtml, footerHtml]) => {
    const header = document.getElementById("header");
    if (header) header.innerHTML = headerHtml;

    const hero = document.getElementById("hero");
    if (hero) hero.innerHTML = heroHtml;

    const footerWrapper = document.createElement("div");
    footerWrapper.innerHTML = footerHtml;
    document.body.appendChild(footerWrapper.firstElementChild);

    // obfuscate contact info
    const phone = "0492 891 027";
    const email = "enquiries" + "@" + "reasonetix.com";

    document.querySelectorAll("#rx_phone").forEach(el => {
      el.textContent = phone;
    });

    document.querySelectorAll("#rx_email").forEach(el => {
      const emailLink = document.createElement("a");
      emailLink.href = "mailto:" + email;
      emailLink.textContent = email;
      el.textContent = ""; // clear fallback
      el.appendChild(emailLink);
    });

    // unhide page
    document.body.classList.remove("deferred");
    document.body.classList.add("loaded");
  });
});

