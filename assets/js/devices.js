let inputBusqueda = document.getElementById('iSearch');
let itemsLoader = document.querySelector('.lds-ellipsis');
let items = document.querySelector('.items');
let itemModal = document.querySelector('.itemModal');

let myDevices = [];

inputBusqueda.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let device = encodeURI(inputBusqueda.value)
        closeModal();
        getData();
        async function getData() {
            itemsLoader.classList.remove('hidden');
            inputBusqueda.classList.add('hidden');
            items.classList.add('hidden');
            const dataApi = await fetch(`https://sicsystem-devices.cyclic.app/search/${device}`);
            const dataJson = await dataApi.json();
            await filterByText(dataJson)
        }
        function filterByText(array) {
            let htmlData = ''
            items.innerHTML = htmlData;
            array.forEach(element => {
                htmlData += `<div class="item" title="${element.name}">
                <div class="imgContainer">
                    <div class="backImg">
                        <img src="${element.img}" alt="" srcset="">
                    </div>
                </div>
                <div class="cardContent">
                    <h1>${element.name}</h1>
                    <div class="cardButtons">
                        <button class="itemButton buttonVer" title="Ver"><i class="fa-solid fa-eye"></i></i></button>
                        <!-- <button class="itemButton" title="Comparar"><i class="fa-solid fa-scale-balanced"></i></button> -->
                    </div>
                </div>
            </div>`
            })
            items.innerHTML = htmlData;
            itemsLoader.classList.add('hidden');
            inputBusqueda.classList.remove('hidden');
            items.classList.remove('hidden');
            slider()

            // Sacar la info
            var buttons = document.getElementsByClassName("buttonVer");
            for (let index = 0; index < buttons.length; index++) {
                buttons[index].onclick = function () {
                    getDeviceData('ver', array[index].url)
                }
            }
        }

    }
})
async function getDeviceData(proceso, device_url) {
    const dataApi = await fetch(`https://sicsystem-devices.cyclic.app/device/${device_url}`);
    const dataJson = await dataApi.json();
    let htmlData = '';
    if (proceso == 'ver') {
        htmlData += `<div class="item">
        <div class="imgContainer">
            <div class="backImg">
                <img src="${dataJson.img}" alt="${dataJson.title}">
            </div>
        </div>
        <div class="cardContent">
            <h2>${dataJson.title}</h2>
            <table>
                <tbody>
                    <tr>
                        <td><h3>Lanzamiento</h3></td>
                        <td>${dataJson.spec_detail[1].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Tamaño</h3></td>
                        <td>${dataJson.spec_detail[2].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Red</h3></td>
                        <td>${dataJson.spec_detail[0].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>SIM</h3></td>
                        <td>${dataJson.spec_detail[2].specs[3].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>CPU</h3></td>
                        <td>${dataJson.spec_detail[4].specs[2].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Chipset</h3></td>
                        <td>${dataJson.spec_detail[4].specs[1].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Almacenamiento</h3></td>
                        <td>${dataJson.spec_detail[5].specs[1].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Pantalla</h3></td>
                        <td>${dataJson.spec_detail[3].specs[2].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Sistema Operativo</h3></td>
                        <td>${dataJson.spec_detail[4].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Cámara Frontal</h3></td>
                        <td>${dataJson.spec_detail[7].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Camara Principal</h3></td>
                        <td>${dataJson.spec_detail[6].specs[0].name||''} - ${dataJson.spec_detail[6].specs[0].value||''}</td>
                    </tr>
                    <tr>
                        <td><h3>Bateria</h3></td>
                        <td>${dataJson.spec_detail[11].specs[0].value||''}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="buttonCloseModal" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>`
    itemModal.innerHTML = htmlData;
    itemModal.classList.remove('hidden');
    } else if (proceso == 'comparar') {

    }
}

function slider() {
    // Funcion Slider
    let isDown = false;
    let startX;
    let scrollLeft;
    const slider = document.querySelector('.items');
    slider.scrollLeft = 0;


    const end = () => {
        isDown = false;
        slider.classList.remove('active');
    }

    const start = (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX || e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }

    const move = (e) => {
        if (!isDown) return;

        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX - slider.offsetLeft;
        const dist = (x - startX);
        slider.scrollLeft = scrollLeft - dist;
    }

    (() => {
        slider.addEventListener('mousedown', start);
        slider.addEventListener('touchstart', start);

        slider.addEventListener('mousemove', move);
        slider.addEventListener('touchmove', move);

        slider.addEventListener('mouseleave', end);
        slider.addEventListener('mouseup', end);
        slider.addEventListener('touchend', end);
    })();

}

function closeModal() {
    itemModal.classList.add('hidden');
}
