let inputBusqueda = document.getElementById('iSearch');
inputBusqueda.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let device = encodeURI(inputBusqueda.value)
        getData();
        async function getData() {
            const dataApi = await fetch(`https://phone-specs-api.azharimm.dev/v2/search?query=${device}`);
            const dataJson = await dataApi.json();
            console.log(dataJson.data.phones);
            await filterByText(dataJson.data.phones)
        }
        function filterByText(array){
            let htmlData = ''
            array.forEach(element => {
                console.log(element)
                htmlData += `            <div class="card">
                <a href="#">
                    <img src="${element.image}" alt="" srcset="">
                    <h3>${element.phone_name}</h3>
                </a>
            </div>`
            })
            document.querySelector('.content').innerHTML = htmlData;
        }
    }
})