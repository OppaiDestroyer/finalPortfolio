
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

    // Inject Welcome Page
    const welcome = document.createElement('div');
    welcome.className = 'welcome-page';
    welcome.innerHTML = `<h1>Welcome to my portfolio</h1>`;
    content.appendChild(welcome);

    // Load portfolio data
    fetch('portfolio.json')
      .then(response => response.json())
      .then(data => {
        const container = document.createElement('div');
        container.className = 'contents-container';

        // Manually set image (or skip if not needed here)
        const imgSection = document.createElement('section');
        imgSection.className = 'image';
        imgSection.innerHTML = `<img src="pictures/portfolio/thesis1.png" alt="Project Image">`;
        container.appendChild(imgSection);

        // Title
        const title = document.createElement('h1');
        title.className = 'title';
        title.textContent = data.title;
        container.appendChild(title);

        // Skills
        const skillsSection = document.createElement('section');
        skillsSection.className = 'skills';
        skillsSection.innerHTML = `<h2>Skills Applied</h2><ul>${data.skills.map(skill => `<li class="skills-name">${skill}</li>`).join('')}</ul>`;
        container.appendChild(skillsSection);

        // Description
        const descSection = document.createElement('section');
        descSection.className = 'description';
        descSection.innerHTML = `<h2>Description</h2><p>${data.description}</p>`;
        container.appendChild(descSection);

        // Team Members
        const teamSection = document.createElement('section');
        teamSection.className = 'team-members';
        teamSection.innerHTML = `<h2>Team Members</h2><ul>${
          data.teamMembers.map(member =>
            `<li><a href="${member.link}">${member.name}</a></li>`).join('')
        }</ul>`;
        container.appendChild(teamSection);

        content.appendChild(container);
      });
  });

  window.addEventListener('resize', adjustContentLayout);