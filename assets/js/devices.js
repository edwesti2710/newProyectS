let inputBusqueda = document.getElementById('iSearch');
inputBusqueda.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let device = encodeURI(inputBusqueda.value)
        console.log(device);
        getData();
        async function getData() {
            const dataApi = await fetch(`https://sicsystem-devices.cyclic.app/search/${device}`);
            console.log(`https://sicsystem-devices.cyclic.app/search/${device}`);

            const dataJson = await dataApi.json();
            // data = JSON.parse(dataJson);
            console.log(dataJson);
            await filterByText(dataJson)
        }
        function filterByText(array) {
            let htmlData = ''
            array.forEach(element => {
                console.log(element)
                htmlData += `            <div class="card">
                <a href="#" onclick="getDeviceData('${element.url}')">
                    <img src="${element.img}" alt="" srcset="">
                    <h3>${element.name}</h3>
                </a>
            </div>`
            })
            document.querySelector('.content').innerHTML = htmlData;
        }

    }
})
async function getDeviceData(device_url) {
    const dataApi = await fetch(`https://sicsystem-devices.cyclic.app/device/${device_url}`);
    console.log(`https://sicsystem-devices.cyclic.app/device/${device_url}`);
    const dataJson = await dataApi.json();
    // data = JSON.parse(dataJson);
    console.log(dataJson);
}