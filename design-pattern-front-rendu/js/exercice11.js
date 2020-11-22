let returnedValue = (function() {
    async function getApi(url){
       const res = await fetch(url)
        return res.json();
    }

    return{
        getApi:getApi
    }
})()

let object = returnedValue.getApi('https://api-ratp.pierre-grimaud.fr/v4/lines/metros');

let select = document.getElementById('metro');

let selectStations = document.getElementById('stations');

let liste = document.getElementById('liste');

object.then(data => {data.result.metros.forEach( (value) => {
    let option = document.createElement('option');
    option.value =value.code;
    option.innerHTML += value.name;
    select.appendChild(option);
    });

    select.addEventListener("change", function(){
        station(select.value)
    });
})

function station(code) {

    selectStations.style.display = 'block';
    object = returnedValue.getApi('https://api-ratp.pierre-grimaud.fr/v4/stations/metros/'+code)
    object.then(data => {data.result.stations.forEach( (value) => {
        let option = document.createElement('option');
        option.value = value.slug;
        option.innerHTML += value.name;
        selectStations.appendChild(option);
    });

        selectStations.addEventListener("change", function(){
            horaires(select.value, selectStations.value);
        });
})
}

function horaires(code, station) {

    liste.innerHTML = '';

    liste.style.display = 'block';
    object = returnedValue.getApi('https://api-ratp.pierre-grimaud.fr/v4/schedules/metros/'+code+'/'+station+'/A%2BR')

    object.then(data => {data.result.schedules.forEach( (value) => {
        let li = document.createElement('li');
        li.innerHTML += 'Destination : '+value.destination +' prochain train dans '+ value.message;
       liste.appendChild(li);
    });
    })
}
setInterval( function() { horaires(select.value, selectStations.value); }, 30000 );




