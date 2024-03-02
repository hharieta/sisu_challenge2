
async function postData(url = '', data = {}) {
    console.log(data);
    const response = await fetch(
        url,
        {
            mode: 'cors',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }
    );

    const retrieveData = await response.json();
    return retrieveData;
    
};

async function getData(url = '') {
    const response = await fetch(
        url,
        {
            mode: 'cors',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
    const data = await response.json();
    return data
  };

async function defaultOption(idElement, dropdown){
    const defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select a ' + idElement;
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true; 
    dropdown.appendChild(defaultOption);

    return dropdown
};

async function fillDropdown(data, idDropdown){

    const Dropdown = document.getElementById(idDropdown);
    Dropdown.innerHTML = '';

    defaultOption(idDropdown, Dropdown)
    // Add new options based on states data
    data.forEach(element => {
        const option = document.createElement('option');
        option.value = element.id;
        option.textContent = element.nombre;
        Dropdown.appendChild(option);
    });

};

async function loadData(url, id, idDropdown){

    const data = await postData(url, id);
    fillDropdown(data, idDropdown);

};

async function sentToDropdown() {
    try {

       
        const countries = await getData("http://localhost:8080/servicio/paises");

        const countryDropdown = document.getElementById('country');
        const stateDropdown = document.getElementById('state');
        const cityDropdown = document.getElementById('city');
    

        defaultOption('country', countryDropdown);
        defaultOption('state', stateDropdown);
        defaultOption('city', cityDropdown);
        
        countries.forEach(element => {
            const option = document.createElement('option');
            option.value = element.id;
            option.textContent = element.nombre;

            countryDropdown.appendChild(option);
        });

        countryDropdown.addEventListener(
            'change', function() {
                // const stateDropdown = document.getElementById('state');
                if (this.value) {
                    stateDropdown.disabled = false;
                    loadData("http://localhost:8080/servicio/estados", this.value, 'state')

                } else {
                    stateDropdown.disabled = true;
                }

                cityDropdown.disabled = true;
            });
        
        stateDropdown.addEventListener(
            'change', function(){
                if (this.value) {
                    cityDropdown.disabled = false;
                    loadData("http://localhost:8080/servicio/ciudades", this.value, 'city')
                } else {
                    cityDropdown.disabled = true;
                }
            }
        );

    }
    catch (error){
        console.log('Faild to sent data to dropdown: ', error)
    }
}

sentToDropdown();

document.addEventListener('DOMContentLoaded', (event)=>{

    const registerForm = document.getElementById('register');

    if (registerForm) {
        registerForm.addEventListener(
            'submit', async function(event){
                event.preventDefault();
        
                let fields = {};
        
                fields['nombre'] = document.getElementById('name').value;
                fields['edad'] = document.getElementById('age').value;
                // fields['país'] = document.getElementById('country').value;
                // fields['estado'] = document.getElementById('state').value;
                fields['ciudadId'] = document.getElementById('city').value;

                if (!fields['nombre'].trim() || !fields['edad'].trim() || !fields['ciudadId'].trim()) {
                    alert('Please fill out all required fields.');
                    return;
                }
                
                fields['edad'] = parseInt(fields['edad']);
                fields['ciudadId'] = parseInt(fields['ciudadId']);
                
                const finalResponse = await postData('http://localhost:8080/servicio/guardar', fields);
                console.log(finalResponse.resultado);
         });
    }
});


