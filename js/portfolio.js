document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const content = toggle.nextElementSibling;

    if (!content.classList.contains('active')) {
      // Expanding → rotate immediately
      content.classList.add('active');
      toggle.classList.add('active');
    } else {
      // Collapsing → rotate AFTER transition
      content.classList.remove('active');
      setTimeout(() => {
        toggle.classList.remove('active');
      }); // Match transition: 0.3s
    }
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
  welcome.innerHTML = `<h1>Welcome to my <span>Portfolio</span></h1>`;
  content.appendChild(welcome);

  // Add click event to all project items
  // Add click event to all project items
  document.querySelectorAll('.search-item').forEach(item => {
    item.addEventListener('click', () => {
      const keyword = item.getAttribute('data-value').toLowerCase();
      content.innerHTML = '';

      Promise.all([
        fetch('js/portfolio.json').then(res => res.json()),
        fetch('js/team-members.json').then(res => res.json())
      ])
        .then(([projects, allTeamMembers]) => {
          const projectArray = Array.isArray(projects) ? projects : [projects];
          const matchingProjects = projectArray.filter(p =>
            p.title.toLowerCase().includes(keyword)
          );

          if (matchingProjects.length === 0) {
            content.innerHTML = `<div class="not-found"><h1>No <span>Project</span> Found</h1></div>`;
            return;
          }

          matchingProjects.forEach(project => {
            const container = document.createElement('div');
            container.className = 'contents-container';

            // Image
            const imgSection = document.createElement('section');
            imgSection.className = 'image';
            imgSection.innerHTML = `<img src="${project.image || 'pictures/portfolio/thesis1.png'}" alt="Project Image">`;
            container.appendChild(imgSection);

            // Title
            const title = document.createElement('h1');
            title.className = 'title';
            title.textContent = project.title;
            container.appendChild(title);

            // Skills
            const skillsSection = document.createElement('section');
            skillsSection.className = 'skills-container';
            skillsSection.innerHTML = `
          <div class="skills-header-container">
            <h2 class="title-header">Skills Applied</h2>
          </div>
          <div class="skills-scroll-wrapper">
            <div class="skill-icon-container">
              ${project.skills.map(skill => {
              const iconFile = skill
                .toLowerCase()
                .replace(/[\s_]+/g, '-')
                .replace(/[^a-z0-9\-]/g, '');
              return `
                  <div class="skills-icon-boxes">
                    <img src="pictures/icons/skills/${iconFile}.svg" alt="${skill} icon" class="skill-icon">
                    <div class="skills-title-boxes">
                      <h2>${skill}</h2>
                    </div>
                  </div>
                `;
            }).join('')}
            </div>
          </div>
        `;
            container.appendChild(skillsSection);

            // Description
            const descSection = document.createElement('section');
            descSection.className = 'description';
            descSection.innerHTML = `<h2>Description</h2><p>${project.description}</p>`;
            container.appendChild(descSection);

            // Team Members
            const teamSection = document.createElement('section');
            teamSection.className = 'team-members-container';

            const teamHTML = project.teamMembers.map(memberRef => {
              const fullMember = allTeamMembers.find(tm => tm.name === memberRef.name) || {};
              const hasProfile = fullMember.profile && fullMember.profile.trim() !== '';

              return `
            <div class="team-icon-boxes">
              ${hasProfile
                  ? `<img src="${fullMember.profile}" alt="${fullMember.name} profile" class="team-profile-icon">`
                  : `<i class="fa-solid fa-circle-user team-profile-icon" style="font-size:60px;color:#666;"></i>`}
              <div class="team-title-boxes">
                <h2>${fullMember.name || memberRef.name}</h2>
                <p class="team-role">${memberRef.role || fullMember.role || 'No role specified'}</p>
                <p class="team-email">${fullMember.email || ''}</p>
                ${fullMember.portfolio && fullMember.portfolio.trim() !== ''
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
          </div>
        `;
            container.appendChild(teamSection);

            // Scroll behavior
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

            content.appendChild(container);
          });
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