function adjustContentLayout() {
  const sidebar = document.querySelector('.sidebar');
  const contentDivs = document.querySelectorAll('.content ');
  const wholeInfoContainer = document.querySelector('.whole-info-container');
  const footer = document.querySelector('.footer');

  if (sidebar) {
    const sidebarWidth = sidebar.offsetWidth;
    const newWidth = window.innerWidth - sidebarWidth;

    // Adjust width of each .content > div
    contentDivs.forEach(div => {
      div.style.width = `${newWidth}px`;
    });

    // Adjust width of .whole-info-container
    if (wholeInfoContainer) {
      wholeInfoContainer.style.width = `${newWidth}px`;
    }

    // Adjust footer width
    if (footer) {
      footer.style.width = `${newWidth}px`;
    }
  }
}

window.addEventListener('DOMContentLoaded', adjustContentLayout);
window.addEventListener('resize', adjustContentLayout);
