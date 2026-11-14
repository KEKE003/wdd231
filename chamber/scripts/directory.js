const container = document.querySelector('#directory-container');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

const jsonPath = 'data/members.json';

async function getMembers() {
    try{
        const response = await AppFetch(jsonPath);
        if (!response.ok) 
            throw new Error('Network response failure');

        const data = await response.json();
        displayMembers(data);
    }
    catch (error) {
        console.error('Error getting directory metrics:', error);
        container.innerHTML = <p class="error">Unable to load directory at this time.</p>;
    }
}

async function AppFetch(url) {
    return await fetch(url);
}

function displayMembers(members) {
    container.innerHTML = "";
  
    members.forEach((member) => {
        const section = document.createElement('section');

        const membershipTypes = {1: 'Member', 2:'Silver', 3:'Gold'};
        const tierName = membershipTypes[member.membership].toLowerCase();

        section.className = `member-card tier-${tierName}`;

        section.innerHTML = `<img src="images/${member.image}" alt="${member.name} Logo" loading="lazy" width="150" height="150">
        <h3>${member.name}</h3>
        <p class="tagline"><em>"${member.tagline}"</em></p>
        <hr>
        <p class="address">${member.address}</p>
        <p class="phone">${member.phone}</p>
        <p class="url"><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
        <span class="badge ${tierName}">${membershipTypes[member.membership]} Tier</span>
        `;
        container.appendChild(section);
    });
}

gridBtn.addEventListener('click', () => {
    container.classList.add('grid-view');
    container.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    container.classList.add('list-view');
    container.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});

menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
    menuToggle.innerHTML = primaryNav.classList.contains('open')? '&#10005;': '&#9776;';
});

document.getElementById('current-year').textContent = newDate().getFullYear();
document.getElementById(lastModified).textContent = document.lastModified;

getMembers();