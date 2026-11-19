const container = document.querySelector('#directory-container');
const gridBtn = document.querySelector('#grid-btn');
const listBtn = document.querySelector('#list-btn');
const menuToggle = document.querySelector('#menu-toggle');
const primaryNav = document.querySelector('#primary-nav');
const weatherContainer = document.querySelector('#weather-container');
const spotlightContainer = document.querySelector('#spotlight-container');

const jsonPath = 'data/members.json';
const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=-33.9249&longitude=18.4241&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=Africa%2FJohannesburg&forecast_days=3';

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

async function getWeather() {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`Weather request failed with status ${response.status}`);
        }

        const weather = await response.json();
        displayWeather(weather);
    } catch (error) {
        console.error('Error getting weather:', error);
        weatherContainer.innerHTML = '<p>Weather information is currently unavailable.</p>';
    }
}

function displayWeather(weather) {
    const currentTemperature = Math.round(weather.current.temperature_2m);
    const forecast = weather.daily.time.map((date, index) => ({
        date,
        high: Math.round(weather.daily.temperature_2m_max[index]),
        low: Math.round(weather.daily.temperature_2m_min[index])
    }));

    weatherContainer.innerHTML = `
        <p class="current-weather"><strong>Current:</strong> ${currentTemperature}&deg;C</p>
        <div class="forecast">
            ${forecast.map(day => `
                <p><strong>${new Date(`${day.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' })}</strong>: ${day.high}&deg;C / ${day.low}&deg;C</p>
            `).join('')}
        </div>`;
}

function displaySpotlights(members) {
    const eligibleMembers = members.filter(member => member.membership >= 2);
    const shuffledMembers = [...eligibleMembers];

    for (let index = shuffledMembers.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [shuffledMembers[index], shuffledMembers[randomIndex]] = [shuffledMembers[randomIndex], shuffledMembers[index]];
    }

    const spotlightCount = Math.min(3, shuffledMembers.length);
    spotlightContainer.innerHTML = shuffledMembers
        .slice(0, spotlightCount)
        .map(member => `
            <section class="spotlight-card">
                <h3>${member.name}</h3>
                <p>${member.tagline}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener noreferrer">Visit Website</a>
            </section>`)
        .join('');
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

getMembers();
getWeather();