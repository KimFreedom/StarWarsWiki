// https://swapi.co/api/

function _getResources(baseURL) {
    resources = fetch(baseURL).then(result => result.json()).catch(err => console.log(err));
    return resources;
}


_onClickStart = async () => {
    const URL = document.getElementById("BaseURL").value;
    if(URL.length > 0) {
        var startTime = new Date().getTime();
        const Wiki_Area = document.getElementById("Wiki_Area");
        const resources_url = await _getResources(URL);
        for(let resource in resources_url) {
            const div_resource = document.createElement('div');
            const title = document.createElement('h1');
            title.innerText = resource;
            const loading_message = document.createElement('h5');
            loading_message.innerText = "Loading data...";
            Wiki_Area.appendChild(div_resource);
            div_resource.appendChild(title);
            div_resource.appendChild(loading_message);
            
            const resource_data = await _getResources(resources_url[resource]);
            const table = document.createElement('table');
            
            // Table header
            const results = resource_data.results;
            const row_header = document.createElement('tr');
            for(let header in results[0]) {
                const col_header = document.createElement('th');
                col_header.innerHTML = header;
                row_header.appendChild(col_header);
            }
            table.appendChild(row_header);
            let resultCount = 0;
            const resultTotal = resource_data.count;

            // Table content
            for(let data in results) {
                const row_content = document.createElement('tr');
                for(let item in results[data]) {
                    const col_item = document.createElement('td');
                    col_item.innerHTML = results[data][item];
                    row_content.appendChild(col_item);
                }
                table.appendChild(row_content);
                resultCount++;
            }
            if(resultCount == resultTotal) {
                div_resource.removeChild(loading_message);
                div_resource.appendChild(table);

                var endTime = new Date().getTime();
                console.log(resource + ' end ' + (endTime - startTime));
            }
            else {
                loading_message.innerText = "Loading data...(" + resultCount + "/" + resultTotal + ")";

                let swWorker = new Worker('Worker.js');
                swWorker.onmessage = function(e) {
                    for(let data in e.data) {
                        const row_content = document.createElement('tr');
                        for(let item in e.data[data]) {
                            const col_item = document.createElement('td');
                            col_item.innerHTML = e.data[data][item];
                            row_content.appendChild(col_item);
                        }
                        table.appendChild(row_content);
                        resultCount++;
                    }
                    if(resultCount == resultTotal) {
                        div_resource.removeChild(loading_message);
                        div_resource.appendChild(table);
                        swWorker.terminate();

                        var endTime = new Date().getTime();
                        console.log(resource + ' end ' + (endTime - startTime));
                    }
                    else {
                        loading_message.innerText = "Loading data...(" + resultCount + "/" + resultTotal + ")";
                    }
                };
                swWorker.postMessage(resource_data.next);
            }
        }
    }
}


/*
_onClickStart = async () => {
    const URL = document.getElementById("BaseURL").value;
    if(URL.length > 0) {
        var startTime = new Date().getTime();
        const Wiki_Area = document.getElementById("Wiki_Area");
        const resources_url = await _getResources(URL);
        for(let resource in resources_url) {
            const title = document.createElement('h1');
            title.innerText = resource;
            Wiki_Area.appendChild(title);
            //console.log(resources_url[resource]);
            const resource_data = await _getResources(resources_url[resource]);
            const table = document.createElement('table');
            
            // Table header
            const results = resource_data.results;
            const row_header = document.createElement('tr');
            for(let header in results[0]) {
                const col_header = document.createElement('th');
                //col_header.value = header;
                col_header.innerHTML = header;
                row_header.appendChild(col_header);
            }
            table.appendChild(row_header);

            // Table content
            for(let data in results) {
                const row_content = document.createElement('tr');
                for(let item in results[data]) {
                    const col_item = document.createElement('td');
                    //col_item.value = data[item];
                    col_item.innerHTML = results[data][item];
                    row_content.appendChild(col_item);
                }
                table.appendChild(row_content);
            }

            let next_url = resource_data.next;

            while(next_url != null) {
                //console.log('fetch ' + next_url);
                const resource_data_next = await _getResources(next_url);
                const results_next = resource_data_next.results;
                for(let data in results_next) {
                    const row_content = document.createElement('tr');
                    for(let item in results_next[data]) {
                        const col_item = document.createElement('td');
                        //col_item.value = results_next[data][item];
                        col_item.innerHTML = results_next[data][item];
                        row_content.appendChild(col_item);
                    }
                    table.appendChild(row_content);
                }
                next_url = resource_data_next.next;
            }

            Wiki_Area.appendChild(table);
            var endTime = new Date().getTime();
            console.log(resource + ' end ' + (endTime - startTime));
        }
    }
}
*/