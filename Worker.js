function _getResources(baseURL) {
    resources = fetch(baseURL).then(result => result.json()).catch(err => console.log(err));
    return resources;
}

onmessage = async function(e) {
    let next_url = e.data;

    while(next_url != null) {
        const resource_data_next = await _getResources(next_url);
        const results_next = resource_data_next.results;
        postMessage(resource_data_next.results);
        next_url = resource_data_next.next;
    }
}