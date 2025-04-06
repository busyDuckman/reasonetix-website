
// window.addEventListener('DOMContentLoaded', () => {
//     // Fetch all parts
//     Promise.all([
//       fetch("p_header.html").then(res => res.text()),
//       fetch("p_hero.html").then(res => res.text()),
//       fetch("p_footer.html").then(res => res.text())
//     ]).then(([headerHtml, heroHtml, footerHtml]) => {
//       const header = document.getElementById("header");
//       if (header) header.innerHTML = headerHtml;
  
//       const hero = document.getElementById("hero");
//       if (hero) hero.innerHTML = heroHtml;
  
//       const footerWrapper = document.createElement("div");
//       footerWrapper.innerHTML = footerHtml;
//       document.body.appendChild(footerWrapper.firstElementChild);
  
//       // Reveal the page once everything's loaded
//       document.body.classList.remove("deferred");
//       document.body.classList.add("loaded");
//     });
//   });
  
//   document.addEventListener("DOMContentLoaded", () => {
//     const phone = "0492 891 027";
//     const email = "enquiries" + "@" + "reasonetix.com";
  
//     const phoneSpan = document.getElementById("rx_phone");
//     if (phoneSpan) phoneSpan.textContent = phone;
  
//     const emailSpan = document.getElementById("rx_email");
//     if (emailSpan) {
//       const emailLink = document.createElement("a");
//       emailLink.href = "mailto:" + email;
//       emailLink.textContent = email;
//       emailSpan.textContent = ""; // slear fallback
//       emailSpan.appendChild(emailLink);
//     }
//   });


window.addEventListener('DOMContentLoaded', () => {
  // Fetch all parts
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

    const phoneSpan = document.getElementById("rx_phone");
    if (phoneSpan) phoneSpan.textContent = phone;

    const emailSpan = document.getElementById("rx_email");
    if (emailSpan) {
      const emailLink = document.createElement("a");
      emailLink.href = "mailto:" + email;
      emailLink.textContent = email;
      emailSpan.textContent = ""; // clear fallback
      emailSpan.appendChild(emailLink);
    }

    // unhide page
    document.body.classList.remove("deferred");
    document.body.classList.add("loaded");
  });
});
