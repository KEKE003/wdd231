const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('open');
        menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
}

const results = document.querySelector('#results');

if (results) {
    const params = new URLSearchParams(window.location.search);
    const fields = [
        ['First Name', 'fname'],
        ['Last Name', 'lname'],
        ['Email Address', 'email'],
        ['Mobile Phone', 'phone'],
        ['Business / Organization', 'organization'],
        ['Membership Level', 'membership'],
        ['Submitted', 'timestamp']
    ];

    const list = document.createElement('dl');

    fields.forEach(([label, name]) => {
        const term = document.createElement('dt');
        const description = document.createElement('dd');
        term.textContent = label;
        description.textContent = params.get(name) || 'Not provided';
        list.append(term, description);
    });

    results.replaceChildren(list);
}

const currentYear = document.querySelector('#current-year');
const lastModified = document.querySelector('#lastModified');

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent = document.lastModified;
}
