const burger = document.querySelector('.burger');
const burgerIcon = burger.querySelector('i');
const sidebar = document.querySelector('.sidebar');

burger.addEventListener('click', () => {
  sidebar.classList.toggle('show');

  if (sidebar.classList.contains('show')) {
    burgerIcon.classList.replace('fa-bars', 'fa-xmark');
  } else {
    burgerIcon.classList.replace('fa-xmark', 'fa-bars');
  }
});

// Optional: Close sidebar when clicking menu item
document.querySelectorAll('.sidebar ul li').forEach(item => {
  item.addEventListener('click', () => {
    sidebar.classList.remove('show');
    burgerIcon.classList.replace('fa-xmark', 'fa-bars');
  });
});


const sectionIds = [
  "#home",
  "#portfolio",
  "#skills",
  "#inquiries"
];

const sidebarItems = document.querySelectorAll('.sidebar ul li');

// Set active item
function setActive(index) {
  sidebarItems.forEach(item => item.classList.remove('active'));
  sidebarItems[index].classList.add('active');
}

// Click navigation
sidebarItems.forEach((li, index) => {
  li.addEventListener('click', () => {
    const targetElement = document.querySelector(sectionIds[index]);
    if (targetElement) {
      if (index === 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Scroll tracking (stable)
window.addEventListener('scroll', () => {
  let currentIndex = 0;
  const scrollPos = window.scrollY + 150; // 150px offset for earlier activation

  sectionIds.forEach((id, index) => {
    const section = document.querySelector(id);
    if (section.offsetTop <= scrollPos) {
      currentIndex = index;
    }
  });

  setActive(currentIndex);
});


setActive(0);

document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();

  }
});


document.querySelectorAll('img').forEach(img => {
  img.setAttribute('draggable', 'false');
});




function adjustContentLayout() {
  const sidebar = document.querySelector('.sidebar');
  const contentDivs = document.querySelectorAll('.content');
  const wholeInfoContainer = document.querySelector('.whole-info-container');
  const footer = document.querySelector('.footer');
  const homeTitle = document.querySelector('.home'); // ✅ add this line
  // ✅ Stop adjusting on mobile
  if (window.innerWidth <= 992) {
    // reset widths when in mobile view
    contentDivs.forEach(div => div.style.width = "100%");
    if (wholeInfoContainer) wholeInfoContainer.style.width = "100%";
    if (homeTitle) homeTitle.style.width = "100%";
    if (footer) footer.style.width = "100%";
    return; // exit early
  }
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
  // Load EmailJS config from external JSON
  fetch("js/api.json")
    .then(res => res.json())
    .then(config => {
      const form = document.getElementById("contact-form");
      const loadingScreen = document.getElementById("loading-screen");
      const submitBtn = form.querySelector("button[type='submit']");

      // Form submit event
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Prevent multiple clicks
        if (submitBtn.disabled) return;

        // Disable button + show loading screen
        submitBtn.disabled = true;
        loadingScreen.classList.add("active");

        // Prepare data for EmailJS
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

        // Send email using EmailJS API
        $.ajax("https://api.emailjs.com/api/v1.0/email/send", {
          type: "POST",
          data: JSON.stringify(data),
          contentType: "application/json"
        })
          .done(() => {
            // Success → reset form and hide loading first
            form.reset();
            loadingScreen.classList.remove("active");

            // Delay before showing alert
            setTimeout(() => {
              alert("✅ Your mail has been sent!");
            }, 500); // 500ms delay
          })
          .fail(error => {
            // Failure → reset form and hide loading first
            form.reset();
            loadingScreen.classList.remove("active");

            // Delay before showing alert
            setTimeout(() => {
              alert("❌ Your email has error sending");
            }, 500);
          })
          .always(() => {
            // Re-enable submit button
            submitBtn.disabled = false;
          });
      });
    });
});
