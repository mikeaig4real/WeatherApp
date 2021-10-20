// variables 
const currDate = document.querySelector('.date-time');
const cityCount = document.querySelector('.city');
const bigIcon = document.querySelector('.big');
const currTemp = document.querySelector('.cel');
const minTemp = document.querySelector('.min');
const hum = document.querySelector('.hum');
const wind = document.querySelector('.wind');
const pres = document.querySelector('.pres');
const foreCastDom = document.querySelector('.other-days');


//INFO

class INFO {
    //get ip,locale,weather
    async getIt(){
        const fetchIp = await fetch('https://api.ipify.org?format=json');
        const jsonIp = await fetchIp.json();
        const ip = jsonIp.ip;
        const locale = await this.getLocale(ip);
        const wetInfo = await this.getWet(locale);
        console.log(wetInfo);
        const { current_weather, daily,hourly,hourly_units } = wetInfo;
        const { windspeed, temperature } = current_weather;
        const { dewpoint_2m,precipitation,relativehumidity_2m } = hourly;
        const { time, temperature_2m_min, temperature_2m_max } = daily;
        return [locale[2],locale[3],windspeed+'km/h',dewpoint_2m[0]+hourly_units.dewpoint_2m,precipitation[0]+hourly_units.precipitation,relativehumidity_2m[0]+hourly_units.relativehumidity_2m,temperature+hourly_units.temperature_2m,time.map(time=> new Date(time).toString().slice(0,3)),temperature_2m_min,temperature_2m_max];
    }

    async getLocale(ip) {
        const fetchLoc = await fetch(`http://ip-api.com/json/${ip}`);
        const jsonLoc = await fetchLoc.json();
        const { lon, lat } = jsonLoc;
        const [conti, count] = jsonLoc.timezone.split('/');
        return [lat, lon, conti, count];
    }

    async getWet(locale) {
        const fetchWet = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${locale[0]}&longitude=${locale[1]}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,precipitation&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=${locale[2]}%2F${locale[3]}`);
        const jsonWet = await fetchWet.json();
        return jsonWet;
    }
}


// UI

class UI {
    //parent function
    loadUI(data) {
        let date = new Date();
        let day = date.toString().slice(0, 3);
        let hours, period;
        let hour = date.getHours();
        hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        period = date.getHours() >= 12 ? 'PM' : 'AM';
        let mins = date.getMinutes();
        let dateTime = `${day} ${hours}:${mins<10?'0'+mins:mins} ${period}`;

        // load time and date
        currDate.innerText = dateTime;

        // change bg and icon by time
        this.cbyH(hour);

        // load country and city
        cityCount.innerText = `${data[1]}, ${data[0]}`;

        // load current temp
        const h2 = document.createElement('h2');
        h2.classList.add('cel');
        h2.innerHTML = `${data[6].slice(0, -2)}<span class="sym">°C</span>`;
        currTemp.innerHTML = h2.innerHTML;

        // load min temp
        minTemp.innerText = `MIN ${data[8][0]}`;

        // load rhum,wind,presp

        // relative humidity

        const curHum = document.createElement('p');
        curHum.classList.add('hum');
        curHum.innerHTML = `<i class="lni lni-drop"></i>${data[5]}`;
        hum.innerHTML = curHum.innerHTML;

        // wind

        const curWind = document.createElement('p');
        curWind.classList.add('wind');
        curWind.innerHTML = `<i class="fas fa-wind"></i>${data[2]}`;
        wind.innerHTML = curWind.innerHTML;

        // precipitation

        const curPres = document.createElement('p');
        curPres.classList.add('pres');
        curPres.innerHTML = `<i class="uil uil-raindrops-alt"></i>${data[4]}`;
        pres.innerHTML = curPres.innerHTML;


        // forecast

        data[7].forEach((day, id) => {
            const foreDiv = document.createElement('div');
            foreDiv.innerHTML = `<p class="day">${day}</p>
                                <i class="${this.ibyD(Math.round((data[8][id]+data[9][id])/2))}"></i>
                                <p class="sInfo">${Math.round(data[8][id])}°/${Math.round(data[9][id])}°</p>
                                `;
            foreCastDom.appendChild(foreDiv);
        })
    }

    // helper functions
    cbyH(hour) {
        if (hour <= 11) {
            console.log('mon');
            document.body.style.backgroundImage = 'url(./mon.jpg)';
            bigIcon.classList.toggle('fas');
            bigIcon.classList.toggle('fa-cloud');
        } else if (hour <= 16) {
            document.body.style.backgroundImage = 'url(./aft.jpg)';
            bigIcon.classList.toggle('far');
            bigIcon.classList.toggle('fa-sun');
        } else if (hour <= 20) {
            document.body.style.backgroundImage = 'url(./eve.jpg)';
            bigIcon.classList.toggle('far');
            bigIcon.classList.toggle('fa-moon');
        } else {
            body.style.backgroundImage = 'url(./nig.jpg)';
            bigIcon.classList.toggle('far');
            bigIcon.classList.toggle('fa-cloud-moon');
        }
    }

    ibyD(temp) {
        if (temp <= 14) {
            return 'fas fa-cloud';
        } else if (temp <= 21) {
            return 'fas fa-cloud-sun';
        } else {
            return 'fas fa-sun';
        }
    }
}
// STORAGE

class Storage {

}


// Content Loaded 

document.addEventListener('DOMContentLoaded', () => {
    const info = new INFO();
    const ui = new UI();
    info.getIt().then(response => {
        ui.loadUI(response);
    });
})
