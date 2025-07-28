function adjustContentLayout() {
  const sidebar = document.querySelector('.sidebar');
  const contentDivs = document.querySelectorAll('.content');
  const wholeInfoContainer = document.querySelector('.whole-info-container');
  const footer = document.querySelector('.footer');
  const homeTitle = document.querySelector('.home'); // ✅ add this line

  if (sidebar) {
    const sidebarWidth = sidebar.offsetWidth;
    const newWidth = window.innerWidth - sidebarWidth;

    // Adjust width of each .content
    contentDivs.forEach(div => {
      div.style.width = `${newWidth}px`;
    });

    // Adjust width of .whole-info-container
    if (wholeInfoContainer) {
      wholeInfoContainer.style.width = `${newWidth}px`;
    }

    // Adjust width of .home-title
    if (homeTitle) {
      homeTitle.style.width = `${newWidth}px`; // You can adjust % as needed
    }

    // Adjust footer width
    if (footer) {
      footer.style.width = `${newWidth}px`;
    }
  }
}

window.addEventListener('DOMContentLoaded', adjustContentLayout);
window.addEventListener('resize', adjustContentLayout);

document.addEventListener("DOMContentLoaded", () => {
  const scrollWrapper = document.querySelector(".skills-scroll-wrapper");
  const scrollSpeed = 2.5; // Increase this for higher sensitivity

  scrollWrapper.addEventListener("wheel", (e) => {
    if (scrollWrapper.matches(":hover")) {
      e.preventDefault();
      scrollWrapper.scrollBy({
        left: e.deltaY * scrollSpeed, // make it more sensitive
        behavior: "smooth" // smooth animation
      });
    }
  });
});


var typed = new Typed(".typing", {
  strings: ["", "Web Development", "Software Engineering", "AI Engineering", " Data Engineering"],
  typeSpeed: 50,
  BackSpeed: 60,
  loop: true
})

document.addEventListener("DOMContentLoaded", function () {
  fetch("js/api.json")
    .then(res => res.json())
    .then(config => {
      document.getElementById("contact-form").addEventListener("submit", function (e) {
        e.preventDefault();

        var data = {
          service_id: config.SERVICE_ID,
          template_id: config.TEMPLATE_ID,
          user_id: config.PUBLIC_KEY,
          template_params: {
            from_email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            company: document.getElementById("company").value,
            message: document.getElementById("message").value
          }
        };

        $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json"
        })
          .done(() => {
            alert("✅ Your mail has been sent!");
            document.getElementById("contact-form").reset();
          })
          .fail(error => alert("❌ Oops... " + JSON.stringify(error)));
      });
    });
});
