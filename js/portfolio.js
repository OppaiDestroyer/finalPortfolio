
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const content = toggle.nextElementSibling;
        content.classList.toggle('active');
    });
});


function adjustContentLayout() {
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    if (sidebar && content) {
      const sidebarWidth = sidebar.offsetWidth;
      const newWidth = window.innerWidth - sidebarWidth;

      content.style.marginLeft = `${sidebarWidth}px`;
      content.style.width = `${newWidth}px`;
    }
  }
window.addEventListener('DOMContentLoaded', () => {
  adjustContentLayout();

  const content = document.getElementById('main-content');

  // Show welcome page initially
  const welcome = document.createElement('div');
  welcome.className = 'welcome-page';
  welcome.innerHTML = `<h1>Welcome to my portfolio</h1>`;
  content.appendChild(welcome);

  // Add click event to all project items
  document.querySelectorAll('.search-item').forEach(item => {
    item.addEventListener('click', () => {
      const projectName = item.getAttribute('data-value');

      // Clear old content
      content.innerHTML = '';

   fetch('js/portfolio.json')

        .then(response => response.json())
        .then(projects => {
          // If JSON is an array of projects
          const project = Array.isArray(projects)
            ? projects.find(p => p.title === projectName)
            : (projects.title === projectName ? projects : null);

          if (!project) {
            content.innerHTML = `<div class="not-found"><h1>No project found.</h1></div>`;
            return;
          }

          // Create project content
          const container = document.createElement('div');
          container.className = 'contents-container';

          const imgSection = document.createElement('section');
          imgSection.className = 'image';
          imgSection.innerHTML = `<img src="${project.image || 'pictures/portfolio/thesis1.png'}" alt="Project Image">`;
          container.appendChild(imgSection);

          const title = document.createElement('h1');
          title.className = 'title';
          title.textContent = project.title;
          container.appendChild(title);

          const skillsSection = document.createElement('section');
          skillsSection.className = 'skills';
          skillsSection.innerHTML = `<h2>Skills Applied</h2><ul>${project.skills.map(skill => `<li class="skills-name">${skill}</li>`).join('')}</ul>`;
          container.appendChild(skillsSection);

          const descSection = document.createElement('section');
          descSection.className = 'description';
          descSection.innerHTML = `<h2>Description</h2><p>${project.description}</p>`;
          container.appendChild(descSection);

          const teamSection = document.createElement('section');
          teamSection.className = 'team-members';
          teamSection.innerHTML = `<h2>Team Members</h2><ul>${
            project.teamMembers.map(member =>
              `<li><a href="${member.link}" target="_blank">${member.name}</a></li>`).join('')
          }</ul>`;
          container.appendChild(teamSection);

          content.appendChild(container);
        })
        .catch(error => {
          console.error('Error loading JSON:', error);
          content.innerHTML = `<div class="error"><h1>Failed to load project.</h1></div>`;
        });
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