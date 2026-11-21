const container = document.querySelector('#directory-container');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

const jsonPath = 'data/members.json';

async function getWeather() {
    const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-33.9258&longitude=18.4232&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Africa%2FJohannesburg&forecast_days=3';

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`Weather request failed with status ${response.status}`);
        }

        const weather = await response.json();
        const currentWeather = document.querySelector('#current-weather');
        const forecast = document.querySelector('#weather-forecast');

        currentWeather.innerHTML = `<p><strong>Current:</strong> ${Math.round(weather.current.temperature_2m)}&deg;C</p>`;

        const forecastItems = weather.daily.time.slice(0, 3).map((date, index) => {
            const day = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
            return `<li><strong>${day}:</strong> ${Math.round(weather.daily.temperature_2m_min[index])}&deg;C - ${Math.round(weather.daily.temperature_2m_max[index])}&deg;C</li>`;
        });

        forecast.innerHTML = `<h3>Three-Day Forecast</h3><ul>${forecastItems.join('')}</ul>`;
    } catch (error) {
        console.error('Error getting weather:', error);
        document.querySelector('#current-weather').textContent = 'Weather is currently unavailable.';
        document.querySelector('#weather-forecast').textContent = '';
    }
}

async function getMembers() {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`Directory request failed with status ${response.status}`);
        }

        const data = await response.json();
        displayMembers(data);
        displaySpotlights(data);
    } catch (error) {
        console.error('Error getting directory members:', error);
        container.innerHTML = '<p class="error">Unable to load directory at this time.</p>';
    }
}

function displaySpotlights(members) {
    const eligibleMembers = members.filter((member) => member.membership >= 2);
    const selectedMembers = [];

    while (selectedMembers.length < Math.min(3, eligibleMembers.length)) {
        const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
        const member = eligibleMembers[randomIndex];

        if (!selectedMembers.includes(member)) {
            selectedMembers.push(member);
        }
    }

    const container = document.querySelector('#spotlight-container');
    container.innerHTML = selectedMembers.map((member) => {
        const membershipTypes = { 2: 'Silver', 3: 'Gold' };
        return `
            <article class="spotlight-card">
                <h3>${member.name}</h3>
                <p>${member.tagline}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
                <p><strong>${membershipTypes[member.membership]} Member</strong></p>
            </article>`;
    }).join('');
}

function displayMembers(members) {
    container.innerHTML = '';

    members.forEach((member) => {
        const section = document.createElement('section');
        const membershipTypes = { 1: 'Member', 2: 'Silver', 3: 'Gold' };
        const tierName = (membershipTypes[member.membership] || 'Member').toLowerCase();

        section.className = `member-card tier-${tierName}`;
        section.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy" width="150" height="150">
            <h3>${member.name}</h3>
            <p class="tagline"><em>"${member.tagline}"</em></p>
            <hr>
            <p class="address">${member.address}</p>
            <p class="phone">${member.phone}</p>
            <p class="url"><a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a></p>
            <span class="badge ${tierName}">${membershipTypes[member.membership] || 'Member'} Tier</span>`;

        const logo = section.querySelector('img');
        logo.addEventListener('error', () => {
            logo.hidden = true;
        });

        container.appendChild(section);
    });
}

gridBtn.addEventListener('click', () => {
    container.classList.add('grid-view');
    container.classList.remove('list-view');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
});

listBtn.addEventListener('click', () => {
    container.classList.add('list-view');
    container.classList.remove('grid-view');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.setAttribute('aria-pressed', 'false');
});

menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.getElementById('current-year').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

getWeather();
getMembers();