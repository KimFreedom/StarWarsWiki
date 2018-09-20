// https://swapi.co/api/

function _getResources(baseURL) {
    resources = fetch(baseURL).then(result => result.json()).catch(err => console.log(err));
    return resources;
}

_onClickStart = async () => {
    const URL = document.getElementById("BaseURL").value;
    if(URL.length > 0) {
        const Wiki_Area = document.getElementById("Wiki_Area");
        const resources_url = await _getResources(URL);
        for(let resource in resources_url) {
            const title = document.createElement('h1');
            title.innerText = resource;
            Wiki_Area.appendChild(title);
            //console.log(resources_url[resource]);
            const resource_data = await _getResources(resources_url[resource]);
            const table = document.createElement('table');
            //table.
        }
    }
}