const burger = document.querySelector('.burger');
const burgerIcon = burger.querySelector('i');
const sidebar = document.querySelector('.sidebar');

burger.addEventListener('click', () => {
  sidebar.classList.toggle('show');

  if (sidebar.classList.contains('show')) {
    burger.classList.add('active');
    burgerIcon.classList.replace('fa-bars', 'fa-xmark');
  } else {
    burger.classList.remove('active');
    burgerIcon.classList.replace('fa-xmark', 'fa-bars');
  }
});



// Event delegation: works with dynamic <li>
sidebar.addEventListener('click', (e) => {
  if (e.target.closest('li')) {
    sidebar.classList.remove('show');
    burger.classList.remove('active');
    burgerIcon.classList.replace('fa-xmark', 'fa-bars');
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("js/project.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("project-container");

      data.categories.forEach(category => {
        // Create wrapper
        const wrapper = document.createElement("div");
        wrapper.classList.add("background");

        // Create section div
        const section = document.createElement("div");
        section.classList.add(category.title.toLowerCase().replace(/\s+/g, "-"));

        // Create toggle
        const toggle = document.createElement("h1");
        toggle.classList.add("dropdown-toggle");
        toggle.innerHTML = `<i class="fa-solid fa-chevron-right"></i> ${category.title}`;

        // Create dropdown content
        const dropdown = document.createElement("div");
        dropdown.classList.add("dropdown-content");

        const ul = document.createElement("ul");
        category.projects.forEach(project => {
          const li = document.createElement("li");
          li.classList.add("search-item");
          li.setAttribute("data-value", project);
          li.textContent = project;
          ul.appendChild(li);
        });

        dropdown.appendChild(ul);
        section.appendChild(toggle);
        section.appendChild(dropdown);
        wrapper.appendChild(section);
        container.appendChild(wrapper);
      });

      // Attach toggle listeners
      document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', () => {
          const content = toggle.nextElementSibling;

          if (!content.classList.contains('active')) {
            content.classList.add('active');
            toggle.classList.add('active');
          } else {
            content.classList.remove('active');
            setTimeout(() => {
              toggle.classList.remove('active');
            }, 300);
          }
        });
      });

    })
    .catch(err => console.error("Error loading projects.json", err));
});



function adjustContentLayout() {
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  if (!sidebar || !content) return;

  if (window.innerWidth <= 992) {
    // ✅ On mobile: content takes full width, no margin
    content.style.marginLeft = "0";
    content.style.width = "100%";
  } else {
    // ✅ On desktop: push content by sidebar width
    const sidebarWidth = sidebar.offsetWidth;
    const newWidth = window.innerWidth - sidebarWidth;

    content.style.marginLeft = `${sidebarWidth}px`;
    content.style.width = `${newWidth}px`;
  }
}

// Run on load + resize
window.addEventListener("DOMContentLoaded", adjustContentLayout);
window.addEventListener("resize", adjustContentLayout);

window.addEventListener('DOMContentLoaded', () => {
  adjustContentLayout();

  const content = document.getElementById('main-content');

  // Show welcome page initially
  const welcome = document.createElement('div');
  welcome.className = 'welcome-page';
  welcome.innerHTML = `<h1>Welcome to my <span>Portfolio</span></h1>`;
  content.appendChild(welcome);

  // Use event delegation for search items
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('search-item')) return;

    const keyword = e.target.getAttribute('data-value').toLowerCase();
    content.innerHTML = '';

    Promise.all([
      fetch('js/portfolio.json').then(res => res.json()),
      fetch('js/team-members.json').then(res => res.json())
    ])
      .then(([projects, allTeamMembers]) => {
        const projectArray = Array.isArray(projects) ? projects : [projects];
        const matchingProjects = projectArray.filter(p =>
          (p.title || '').toLowerCase().includes(keyword.trim().toLowerCase())
        );

        if (matchingProjects.length === 0) {
          content.innerHTML = `<div class="not-found"><h1>No <span>Project</span> Found</h1></div>`;
          return;
        }

        matchingProjects.forEach(project => {
          const container = document.createElement('div');
          container.className = 'contents-container';

          // ---------- IMAGE ----------
          const imgSection = document.createElement('section');
          imgSection.className = 'image';
          imgSection.innerHTML = `<img src="${project.image || 'pictures/portfolio/thesis1.png'}" alt="Project Image">`;
          container.appendChild(imgSection);

          // ---------- TITLE ----------
          const title = document.createElement('h1');
          title.className = 'title';
          title.textContent = project.title || 'Untitled Project';
          container.appendChild(title);

          // ---------- SKILLS ----------
          const skillsSection = document.createElement('section');
          skillsSection.className = 'skills-container';

          const skills = Array.isArray(project.skills) ? project.skills : [];
          skillsSection.innerHTML = `
            <div class="skills-header-container">
              <h2 class="title-header">Skills Applied</h2>
            </div>
            <div class="skills-scroll-wrapper">
              <div class="skill-icon-container">
                ${skills.map(skill => {
            const iconFile = String(skill)
              .toLowerCase()
              .replace(/[\s_]+/g, '-')
              .replace(/[^a-z0-9\-]/g, '');
            return `
                    <div class="skills-icon-boxes">
                      <img src="pictures/icons/skills/${iconFile}.svg" alt="${skill} icon" class="skill-icon">
                      <div class="skills-title-boxes"><h2>${skill}</h2></div>
                    </div>
                  `;
          }).join('')}
              </div>
            </div>`;
          container.appendChild(skillsSection);

          // ---------- REUSABLE RENDERING UTILITIES ----------
          function el(tag, attrs = {}, ...children) {
            const node = document.createElement(tag);
            Object.entries(attrs).forEach(([k, v]) => {
              if (k === "class") node.className = v;
              else if (k === "html") node.innerHTML = v;
              else node.setAttribute(k, v);
            });
            children.flat().forEach(child => {
              if (child == null) return;
              node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
            });
            return node;
          }

          function createSection(title, contentNodes = []) {
            return el(
              "section",
              { class: "description__section" },
              el("h2", { class: "description__title" }, title),
              ...contentNodes
            );
          }

          function createParagraph(text = "") {
            return el("p", { class: "description__text" }, text || "—");
          }

          // Components list: bullet + text + centered image
          function createListWithImages(items = []) {
            const ul = el("ul", { class: "description__list" });

            items.forEach(raw => {
              const item = typeof raw === "string" ? { label: raw } : raw || {};
              const li = el("li", { class: "description__list-item" });

              // bullet dot (real element to lock alignment)
              const dot = el("span", { class: "description__dot", "aria-hidden": "true" });

              // text
              const textBox = el("div", { class: "description__text-box" },
                el("div", { class: "description__item-main" }, item.label || "Untitled"),
                item.note ? el("div", { class: "description__item-note" }, item.note) : null
              );

              // media (centered)
              const mediaWrap = el("div", { class: "description__media" });
              let media;
              if (item.img) {
                media = el("img", { class: "description__img", src: item.img, alt: item.label || "component" });
              } else {
                media = el("div", { class: "description__img--placeholder" }, "[Insert image here]");
              }
              mediaWrap.appendChild(media);

              li.appendChild(dot);
              li.appendChild(textBox);
              li.appendChild(mediaWrap);
              ul.appendChild(li);
            });

            return ul;
          }

          function renderProjectDetails(container, project) {
            const root = el("section", { class: "description" });

            // Project Description
            root.appendChild(createSection("Documentation", [
              createParagraph(project.description)
            ]));

            // Role (string or array)
            const roleContent = Array.isArray(project.role)
              ? el("ul", { class: "description__bullets" }, ...project.role.map(r => el("li", {}, r)))
              : createParagraph(project.role || "Your role goes here...");
            root.appendChild(createSection("", [roleContent]));

           
            // Methodology -> plain paragraph(s), no numbers
            const methNodes = Array.isArray(project.methodology)
              ? project.methodology.map(t => createParagraph(t))
              : [createParagraph(project.methodology || "Explain the workflow, steps, and approach here.")];
            root.appendChild(createSection("", methNodes));

            // Challenges & Limitations -> plain paragraph(s), no bullets
            const challNodes = Array.isArray(project.challenges)
              ? project.challenges.map(t => createParagraph(t))
              : [createParagraph(project.challenges || "Discuss difficulties, connectivity issues, and hardware/software limits here.")];
            root.appendChild(createSection("", challNodes));
 // Components & Tools
            const componentsList = createListWithImages(
              project.components && project.components.length ? project.components : []
            );
            root.appendChild(createSection("Components and Tools", [componentsList]));

            container.appendChild(root);
          }


          // 🔥 actually render the details here
          renderProjectDetails(container, project);

          // ---------- TEAM MEMBERS ----------
          const teamSection = document.createElement('section');
          teamSection.className = 'team-members-container';

          const teamHTML = (project.teamMembers || []).map(memberRef => {
            const fullMember = (allTeamMembers || []).find(tm => tm.name === memberRef.name) || {};
            const hasProfile = fullMember.profile && String(fullMember.profile).trim() !== '';

            return `
              <div class="team-icon-boxes">
                ${hasProfile
                ? `<img src="${fullMember.profile}" alt="${fullMember.name || memberRef.name} profile" class="team-profile-icon">`
                : `<i class="fa-solid fa-circle-user team-profile-icon" style="font-size:60px;color:#666;"></i>`}
                <div class="team-title-boxes">
                  <h2>${fullMember.name || memberRef.name}</h2>
                  <p class="team-role">${memberRef.role || fullMember.role || 'No role specified'}</p>
                  <p class="team-email">${fullMember.email || ''}</p>
                  ${fullMember.portfolio && String(fullMember.portfolio).trim() !== ''
                ? `<a href="${fullMember.portfolio}" target="_blank" class="team-portfolio">Portfolio</a>`
                : ''}
                </div>
              </div>
            `;
          }).join('');

          teamSection.innerHTML = `
            <div class="team-header-container">
              <h2 class="title-header">Team Members</h2>
            </div>
            <div class="team-scroll-wrapper">
              <div class="team-icon-container">
                ${teamHTML}
              </div>
            </div>`;
          container.appendChild(teamSection);

          // ---------- SCROLL BEHAVIOR ----------
          const scrollWrappers = container.querySelectorAll('.skills-scroll-wrapper, .team-scroll-wrapper');
          const scrollSpeed = 2.5;
          scrollWrappers.forEach(scrollWrapper => {
            scrollWrapper.setAttribute('tabindex', '0');
            scrollWrapper.addEventListener('wheel', (e) => {
              if (scrollWrapper.matches(':hover')) {
                e.preventDefault();
                scrollWrapper.scrollBy({
                  left: e.deltaY * scrollSpeed,
                  behavior: 'smooth'
                });
              }
            }, { passive: false });

            scrollWrapper.addEventListener('keydown', (e) => {
              const step = 80;
              if (e.key === 'ArrowRight') scrollWrapper.scrollBy({ left: step, behavior: 'smooth' });
              if (e.key === 'ArrowLeft') scrollWrapper.scrollBy({ left: -step, behavior: 'smooth' });
            });
          });

          // append all to content
          content.appendChild(container);
        });
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
        content.innerHTML = `<div class="error"><h1>Failed to load project.</h1></div>`;
      });
  });
});

window.addEventListener('resize', adjustContentLayout);




document.addEventListener('DOMContentLoaded', () => {
  const backButton = document.querySelector('.back-button');

  if (backButton) {
    backButton.addEventListener('click', () => {
      const link = backButton.getAttribute('data-backlink');
      if (link) {
        window.location.href = link;
      } else {
        window.history.back(); // fallback to browser history
      }
    });
  }
});
