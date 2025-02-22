document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".services-container");
    const services = document.querySelectorAll(".service");

    restoreCardOrder();

    services.forEach(service => {
        service.draggable = true;

        service.addEventListener("dragstart", (e) => {
            e.target.classList.add("dragging");
        });

        service.addEventListener("dragend", (e) => {
            e.target.classList.remove("dragging");
            saveCardOrder();
        });
    });

    container.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(container, e.clientY);
        
        if (afterElement == null) {
            container.appendChild(draggingElement);
        } else {
            container.insertBefore(draggingElement, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const elements = [...container.querySelectorAll(".service:not(.dragging)")];

        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveCardOrder() {
        const serviceOrder = [...container.querySelectorAll(".service")].map(service => service.dataset.index);
        localStorage.setItem("serviceOrder", JSON.stringify(serviceOrder));
    }

    function restoreCardOrder() {
        const savedOrder = JSON.parse(localStorage.getItem("serviceOrder"));
        if (savedOrder) {
            savedOrder.forEach((index) => {
                const card = document.querySelector(`.service[data-index="${index}"]`);
                if (card) {
                    container.appendChild(card);
                }
            });
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const projectsContainer = document.querySelector(".projects");
    const projectCards = document.querySelectorAll(".project");

    let draggedCard = null;

    restoreCardOrder();

    projectCards.forEach(card => {
        card.setAttribute("draggable", "true");

        card.addEventListener("dragstart", (e) => {
            draggedCard = card;
            setTimeout(() => card.classList.add("dragging"), 0);
        });

        card.addEventListener("dragend", (e) => {
            card.classList.remove("dragging");
            if (draggedCard) {
                const afterElement = getDragAfterElement(projectsContainer, e.clientY);
                if (afterElement == null) {
                    projectsContainer.appendChild(draggedCard);
                } else {
                    projectsContainer.insertBefore(draggedCard, afterElement);
                }
                saveCardOrder();
            }
        });

        card.querySelectorAll("img").forEach(img => {
            img.addEventListener("dragstart", (e) => e.preventDefault());
        });
    });

    projectsContainer.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector(".dragging");
        const afterElement = getDragAfterElement(projectsContainer, e.clientY);

        if (afterElement == null) {
            projectsContainer.appendChild(draggingCard);
        } else {
            projectsContainer.insertBefore(draggingCard, afterElement);
        }
    });

    function getDragAfterElement(container, y) {
        const elements = [...container.querySelectorAll(".project:not(.dragging)")];

        return elements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function saveCardOrder() {
        const projectOrder = [...projectsContainer.querySelectorAll(".project")].map(project => project.dataset.index);
        localStorage.setItem("projectOrder", JSON.stringify(projectOrder));
    }

    function restoreCardOrder() {
        const savedProjectOrder = JSON.parse(localStorage.getItem("projectOrder"));
        if (savedProjectOrder) {
            savedProjectOrder.forEach((index) => {
                const card = document.querySelector(`.project[data-index="${index}"]`);
                if (card) {
                    projectsContainer.appendChild(card);
                }
            });
        }
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const services = document.querySelectorAll(".service");
    const serviceTitles = document.querySelectorAll(".service-title");

    services.forEach(service => {
        service.addEventListener("mouseenter", () => {
            service.style.transform = "scale(1.05)";
        });

        service.addEventListener("mouseleave", () => {
            service.style.transform = "";
        });
    });

    serviceTitles.forEach(title => {
        title.addEventListener("mouseenter", () => {
            title.style.color = "orange";
        });

        title.addEventListener("mouseleave", () => {
            title.style.color = "";
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const projects = document.querySelectorAll('.project');
    const projectLinks = document.querySelectorAll('.project-link');
    const btn = document.querySelector('.btn');
  
    projects.forEach(project => {
      project.addEventListener('mouseenter', function () {
        project.style.transform = 'scale(1.03)';
      });
      project.addEventListener('mouseleave', function () {
        project.style.transform = 'scale(1)';
      });
    });
  
    projectLinks.forEach(link => {
      const span = link.querySelector('span');
      link.addEventListener('mouseenter', function () {
        span.style.color = 'orange';
      });
      link.addEventListener('mouseleave', function () {
        span.style.color = '';
      });
    });
  
    if (btn) {
      btn.addEventListener('mouseenter', function () {
        btn.style.backgroundColor = '#444';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.backgroundColor = '#000';
      });
    }
  });
  
