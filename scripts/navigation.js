const container = document.getElementById('course-container');
const totalCreditsElement = document.getElementById('total-credits');
const filterButtons = document.querySelectorAll('.filter-buttons .btn');

function displayCourses(filteredCourses) {
    if (!container || !totalCreditsElement) return;

    container.replaceChildren();

    filteredCourses.forEach(course => {
        const card = document.createElement('div');
        card.className = `course-card ${course.completed ? 'completed' : 'incomplete'}`;
        card.textContent = `${course.subject} ${course.number} - ${course.title}`;
        container.appendChild(card);
    });

    const totalCredits = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = totalCredits;
}

function filterCourses(subject) {
    const activeFilterId = `filter-${subject.toLowerCase()}`;
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.id === activeFilterId);
    });

    const filteredCourses = subject === 'all'
        ? courses
        : courses.filter(course => course.subject.toLowerCase() === subject.toLowerCase());

    displayCourses(filteredCourses);
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => filterCourses(button.id.replace('filter-', '')));
});

const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

filterCourses('all');