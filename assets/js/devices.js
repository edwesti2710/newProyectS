let inputBusqueda = document.getElementById('iSearch');
let itemsLoader = document.querySelector('.lds-ellipsis');
let items = document.querySelector('.items');
let myDevices = [];

inputBusqueda.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        let device = encodeURI(inputBusqueda.value)
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
    let itemModal = document.querySelector('.itemModal');
    let htmlData = '';
    if (proceso == 'ver') {
        htmlData += `<div class="item">
        <div class="imgContainer">
            <div class="backImg">
                <img src="${dataJson.img}" alt=""
                    srcset="">
            </div>
        </div>
        <div class="cardContent">
            <h2>Samsung Galaxy a23 5G LTE</h2>
            <table>
                <tbody>
                    <tr>
                        <td><h3>Lanzamiento</h3></td>
                        <td>2022, January 26</td>
                    </tr>
                    <tr>
                        <td><h3>Tamaño</h3></td>
                        <td>159.9 x 73.9 x 8.1 mm (6.30 x 2.91 x 0.32 in)</td>
                    </tr>
                    <tr>
                        <td><h3>Red</h3></td>
                        <td>GSM / HSPA / LTE</td>
                    </tr>
                    <tr>
                        <td><h3>SIM</h3></td>
                        <td>Single SIM (Nano-SIM) or Hybrid Dual SIM (Nano-SIM, dual stand-by)</td>
                    </tr>
                    <tr>
                        <td><h3>CPU</h3></td>
                        <td>Octa-core (1x2.4 GHz Cortex-A78 & 3x2.2 GHz Cortex-A78 & 4x1.9 GHz Cortex-A55)</td>
                    </tr>
                    <tr>
                        <td><h3>Chipset</h3></td>
                        <td>Qualcomm SM7325 Snapdragon 778G 5G (6 nm)</td>
                    </tr>
                    <tr>
                        <td><h3>Almacenamiento</h3></td>
                        <td>128GB 4GB RAM, 128GB 6GB RAM, 128GB 8GB RAM, 256GB 6GB RAM, 256GB 8GB RAM</td>
                    </tr>
                    <tr>
                        <td><h3>Pantalla</h3></td>
                        <td>GSM / HSPA / LTE</td>
                    </tr>
                    <tr>
                        <td><h3>Sistema Operativo</h3></td>
                        <td>Android 11, upgradable to Android 12, One UI 4.1</td>
                    </tr>
                    <tr>
                        <td><h3>Cámara Frontal</h3></td>
                        <td>32 MP, f/2.2, 26mm (wide), 1/2.8", 0.8µm</td>
                    </tr>
                    <tr>
                        <td><h3>Camara Principal</h3></td>
                        <td>64 MP, f/1.8, 26mm (wide), 1/1.7\", 0.8µm, PDAF, OIS\n12 MP, f/2.2, 123˚ (ultrawide), 1.12µm\n5 MP, f/2.4, (macro)\n5 MP, f/2.4, (depth)</td>
                    </tr>
                    <tr>
                        <td><h3>Bateria</h3></td>
                        <td>Li-Ion 4500 mAh, non-removable</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="buttonCloseModal"><i class="fa-solid fa-xmark"></i></button>
    </div>`
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