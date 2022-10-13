let alohaArray;
let controlNetMovilArray;
let controlNetFijaArray;
let controlNetArray;
let movilesContables;

let asesores = [];
let operaciones = [
    { id: 1, nombreLargo: 'Prepago CASI', nombreCorto: 'CASI Pre', tipo: 'movil' },
    { id: 2, nombreLargo: 'Postpago Renueva por Fidelizaci&#243;n', nombreCorto: 'CAEQ', tipo: 'movil' },
    { id: 3, nombreLargo: 'Postpago CASI', nombreCorto: 'CASI Post', tipo: 'movil' },
    { id: 4, nombreLargo: 'Postpago Portabilidad Migraci&#243;n M4 (Or. Postpago)', nombreCorto: 'Porta M4 Post - Post', tipo: 'movil' },
    { id: 5, nombreLargo: 'Registro SAR', nombreCorto: 'SAR', tipo: 'movil' },
    { id: 6, nombreLargo: 'Telefon&#237;a Fija', nombreCorto: 'Fija', tipo: 'movil' },
    { id: 7, nombreLargo: 'Post-Venta', nombreCorto: 'Post-Venta', tipo: 'movil' },
    { id: 8, nombreLargo: 'Reclamo', nombreCorto: 'Reclamo', tipo: 'movil' },
    { id: 9, nombreLargo: 'Postpago Migracion M4', nombreCorto: 'Mig M4', tipo: 'movil' },
    { id: 10, nombreLargo: 'Postpago Portabilidad Migraci&#243;n M4 (Or. Prepago)', nombreCorto: 'Mig M4 - Pre', tipo: 'movil' },
    { id: 11, nombreLargo: 'CAPL', nombreCorto: 'CAPL', tipo: 'movil' },
    { id: 12, nombreLargo: 'Postpago Portabilidad ( Origen Postpago )', nombreCorto: 'Porta Post', tipo: 'movil' },
    { id: 13, nombreLargo: 'Detalle de llamadas', nombreCorto: 'Detalle', tipo: 'movil' },
    { id: 14, nombreLargo: 'Postpago Portabilidad ( Origen Prepago )', nombreCorto: 'Porta Pre', tipo: 'movil' },
    { id: 15, nombreLargo: 'Prepago Migracion M7', nombreCorto: 'Prepago M7', tipo: 'movil' },
    { id: 16, nombreLargo: 'Migracion de Prepago a Postpago', nombreCorto: 'Pre a Post', tipo: 'movil' },
    { id: 17, nombreLargo: 'Cesion de Linea', nombreCorto: 'Cesion de Linea', tipo: 'movil' },
    { id: 18, nombreLargo: 'Retiro de Bandit', nombreCorto: 'Retiro de Bandit', tipo: 'movil' },
    { id: 19, nombreLargo: 'DOA', nombreCorto: 'DOA', tipo: 'movil' },
    { id: 20, nombreLargo: 'Prepago Renueva', nombreCorto: 'CAEQ Pre', tipo: 'movil' },
    { id: 21, nombreLargo: 'NAKED ', nombreCorto: 'NAKED', tipo: 'fija' },
    { id: 22, nombreLargo: 'DUO BA', nombreCorto: 'DUO BA', tipo: 'fija' },
    { id: 23, nombreLargo: 'DUO BA+TV', nombreCorto: 'DUO BA+TV', tipo: 'fija' },
    { id: 24, nombreLargo: 'TRIO', nombreCorto: 'TRIO', tipo: 'fija' },
];

let operacionesSumatorias = ['Postpago Renueva por Fidelizaci&#243;n', 'Postpago Portabilidad Migraci&#243;n M4 (Or. Postpago)', 'Postpago Migracion M4', 'Postpago Portabilidad Migraci&#243;n M4 (Or. Prepago)', 'Postpago Portabilidad ( Origen Postpago )', 'Migracion de Prepago a Postpago', 'NAKED ', 'DUO BA', 'DUO BA+TV', 'TRIO'];

let oportunidadesTotales;
let oportunidadesEfectivas;
let ventasTotales;
function upload() {
    let alohaFile = document.getElementById('aloha_file_upload').files;
    let controlNetMovilFile = document.getElementById('controlNetMovil_file_upload').files;
    let controlNetFijaFile = document.getElementById('controlNetFija_file_upload').files;
    if ((alohaFile.length == 0) || (controlNetMovilFile.length == 0) || (controlNetFijaFile.length == 0)) {
        alert("Falta Cargar algún archivo.");
        return;
    }
    let alohaFilename = alohaFile[0].name;
    let CNMovilFilename = controlNetMovilFile[0].name;
    let CNFijaFilename = controlNetFijaFile[0].name;
    let alohaExtension = alohaFilename.substring(alohaFilename.lastIndexOf(".")).toUpperCase();
    let CNMovilExtension = CNMovilFilename.substring(CNMovilFilename.lastIndexOf(".")).toUpperCase();
    let CNFijaExtension = CNFijaFilename.substring(CNFijaFilename.lastIndexOf(".")).toUpperCase();
    if ((alohaExtension == '.XLS' || alohaExtension == '.XLSX') && ((CNMovilExtension == '.XLS' || CNMovilExtension == '.XLSX')) && ((CNFijaExtension == '.XLS' || CNFijaExtension == '.XLSX'))) {
        excelAlohaFileToJSON(alohaFile[0]);
        excelControlNetMovilFileToJSON(controlNetMovilFile[0]);
        excelControlNetFijaFileToJSON(controlNetFijaFile[0]);

        setTimeout(function () {
            // Cantidad de Oportunidades por Asesor
            // Oportunidades Totales
            oportunidadesTotales = alohaArray.reduce((cnt, cur) => (cnt[cur.__EMPTY_16] = cnt[cur.__EMPTY_16] + 1 || 1, cnt), {});
            // Ventas Totales
            ventasTotales = controlNetMovilArray.reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {});

            // Tickets Aprovechados
            oportunidadesEfectivas = Array.from(new Set(controlNetMovilArray.map(a => a['DNI/RUC'])))
                .map(id => {
                    return controlNetMovilArray.find(a => a['DNI/RUC'] === id)
                })
            oportunidadesEfectivas = oportunidadesEfectivas.reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {});

            // Asesores
            alohaArray.forEach(elemento => {
                asesores.push({ 'nombre': elemento.__EMPTY_17, 'id': elemento.__EMPTY_16 });
            })
            asesores = Array.from(new Set(asesores.map(a => a.id)))
                .map(id => {
                    return asesores.find(a => a.id === id)
                })

            // Normalizar ArrayFija
            controlNetFijaArray.forEach(elemento => {
                elemento['Operaci&#243;n'] = elemento['Tipo Operacion'];
                elemento['C&#243;digo FFVV'] = elemento['CodigoFFVV'];
            })

            controlNetArray = controlNetMovilArray.concat(controlNetFijaArray);

            // ------------------------Cambiando Errores Ortográficos
            n = 0;
            let filterOpHtml = '';

            operaciones.forEach(operacion => {
                let checked = '';
                let busqueda = operacionesSumatorias.some(operacionS => operacionS == operacion.nombreLargo);
                if (busqueda) {
                    checked = `checked`;
                }
                // operationsHtml += `<button class="buttonOperation" onclick="filterOperations('${n}')">${operacionName}</button>`;
                filterOpHtml += `<label for="${operacion.nombreLargo}"><input id="${operacion.nombreLargo}" type="checkbox" value="${operacion.id}" ${checked}/><a class="aButton" href="#" onclick="filterOperations('${n}')">${operacion.nombreCorto}</a></label>`;
                n++;
            })
            document.querySelector('.options').innerHTML = filterOpHtml;

            // ------------------------------------------------------

            // Filtrando asesores y contando cantidad de operaciones;
            asesores.forEach(asesor => {
                asesor.oportunidadesTotales = oportunidadesTotales[asesor.id];
                asesor.oportunidadesEfectivas = oportunidadesEfectivas[asesor.id];
                asesor.ventasTotales = ventasTotales[asesor.id];
                asesor.operaciones = {};
                operaciones.forEach(operacion => {
                    operaciones[operacion.nombreLargo] = controlNetArray.filter(obj => obj['Operaci&#243;n'] == operacion.nombreLargo && obj['C&#243;digo FFVV'] == asesor.id);
                    asesor.operaciones[operacion.nombreLargo] = operaciones[operacion.nombreLargo].reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {})[asesor.id] || 0;
                })
                let sumatoriaMovil = 0;
                let sumatoriaFija = 0;
                operacionesSumatorias.forEach(operacionS => {
                    if (operaciones.find(operacion => operacion.nombreLargo === operacionS).tipo == 'movil') {
                        sumatoriaMovil += asesor.operaciones[operacionS] || 0;
                    } else if (operaciones.find(operacion => operacion.nombreLargo === operacionS).tipo == 'fija') {
                        sumatoriaFija += asesor.operaciones[operacionS] || 0;
                    }
                })
                asesor.movilesTotales = sumatoriaMovil;
                asesor.fijasTotales = sumatoriaFija;
            });

            // Aparecer objetos al cargar
            document.querySelector('.files').classList.add('hidden');
            document.querySelector('.generalOperations').classList.remove('hidden');
            document.querySelector('.inputBusqueda').classList.remove('hidden');
        }, 500)
    } else {
        alert("Por favor selecciona archivos Excel válidos.");
    }
}

//Method to read excel file and convert it into JSON 
function excelAlohaFileToJSON(file) {
    try {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });
            let result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            alohaArray = result['Reporte_Tickets_Individuales'];
            alohaArray.splice(0, 2);
        }
    } catch (e) {
        console.error(e);
    }
}
function excelControlNetMovilFileToJSON(file) {
    try {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });
            let result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            controlNetMovilArray = result.Sheet1;
        }
    } catch (e) {
        console.error(e);
    }
}
function excelControlNetFijaFileToJSON(file) {
    try {
        let reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (e) {

            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });
            let result = {};
            workbook.SheetNames.forEach(function (sheetName) {
                let roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                if (roa.length > 0) {
                    result[sheetName] = roa;
                }
            });
            controlNetFijaArray = result.Hoja1;
        }
    } catch (e) {
        console.error(e);
    }
}

// Funcion de busqueda
let inputBusqueda = document.getElementById('iSearch');
inputBusqueda.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        // e.preventDefault();
        let allTH = document.querySelectorAll('.row');
        findElement(allTH)
        let allH3 = document.querySelectorAll('h3');
        findElement(allH3)

        function findElement(data) {
            data.forEach(element => {
                if (element.textContent.search(inputBusqueda.value.toUpperCase()) >= 0) {
                    element.style = 'color: red';
                }
            })
        }
    }
})
// function searchText(){

// }

// Funcion de colores
function perc2color(perc) {
    var r, g, b = 0;
    if (perc < 50) {
        r = 255;
        g = Math.round(5.1 * perc);
    }
    else {
        g = 255;
        r = Math.round(510 - 5.10 * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

// Funcion de filtro
function filterOperations(filter) {
    filter = operaciones[filter].nombreLargo;
    let graphHtml = '';
    asesores.sort((a, b) => (b.operaciones[filter] > a.operaciones[filter]) ? 1 : ((a.operaciones[filter] > b.operaciones[filter]) ? -1 : 0))
    let paletaColores = asesores.map(obj => obj.operaciones[filter]);
    paletaColores = [...new Set(paletaColores)];
    let graph100percent = asesores[0].operaciones[filter];
    asesores.forEach((asesor) => {
        let efectivePercent = Math.round((asesor.operaciones[filter] * 100) / graph100percent);
        graphHtml += `<div class="item">
    <div class="bar__container">
        <h3 class="h3">${asesor.nombre}</h3>
        <h3>${asesor.operaciones[filter]}</h3>
        <div class="bar" style="width: ${efectivePercent}%; background-color: ${perc2color(efectivePercent)};">
        </div>
    </div>
</div>
`;
    });
    graphHtml += `<div class="item">
    <div class="bar__container">
        <h3 class="h3">TOTAL</h3>
        <h3>${asesores.reduce((obj1, obj2) => obj1 + obj2.operaciones[filter], 0)}</h3>
        <div class="bar" style="width: 100%; background-color: #000;">
        </div>
    </div>
</div>
`;
    document.querySelector('.graphs').innerHTML = graphHtml;
    document.querySelector('.graphs').classList.remove('hidden');
}

document.querySelector(".filterButton").addEventListener("click", function (event) {
    event.preventDefault();
    filterVentas('a', true)
});

function filterVentas(type, filtered) {
    document.querySelector('.filter').classList.add('hidden');
    let graphHtml = '';
    if (type === 'm') {
        filter = 'movilesTotales';
        document.querySelector('.graphs').classList.add('graphsMode');

        drawObjectsFromFilter('m')
    } else if (type === 'f') {
        filter = 'fijasTotales';
        document.querySelector('.graphs').classList.add('graphsMode');

        drawObjectsFromFilter('f')
    } else if (type === 'a') {
        document.querySelector('.graphs').classList.remove('graphsMode');

        document.querySelector('.filter').classList.remove('hidden');
        let operacionesFiltradas = [];
        if (filtered === true) {
            let filterOptions = document.querySelector('.options');
            let optCheckeds = filterOptions.getElementsByTagName('input');
            for (let i = 0; i < optCheckeds.length; i++) {
                if (optCheckeds[i].checked) {
                    operacionesFiltradas.push(operaciones[optCheckeds[i].value - 1]);
                }
            }
        } else {
            operacionesFiltradas = operaciones;
        }
        graphHtml += `<table style="text-align: center;">
        <thead>
        <tr>
            <th class="col" colspan=1></th>
            <th class="col" colspan=${operacionesFiltradas.length + 2}>Ventas Totales</th>
        </tr>
        <tr class="opHeader"><th class="col">Nombre</th>`
        operacionesFiltradas.forEach(operacionf => {
            graphHtml += `<th class="col">${operacionf.nombreCorto}</th>`
        })
        graphHtml += `<th class="col" style="background-color: #ccc; border-bottom: 1px solid #ccc;">Total Móviles</th>`
        graphHtml += `<th class="col" style="background-color: #ccc; border-bottom: 1px solid #ccc;">Total Fija</th>`
        graphHtml += `</tr></thead><tbody>`
        getOptionsFiltered(operacionesFiltradas)
        function getOptionsFiltered(listOperations) {
            asesores.forEach(asesor => {
                let acumuladorMovil = 0;
                let acumuladorFija = 0;
                graphHtml += `<tr><th class="row"><div class=""></div>${asesor.nombre}</th>`;
                listOperations.forEach(loperacion => {
                    graphHtml += `<td>${asesor.operaciones[loperacion.nombreLargo] || 0}</td>`
                    let operacionEncontrada = operaciones.find(operacion => operacion.nombreLargo === loperacion.nombreLargo)['tipo']
                    if (operacionEncontrada === 'movil') {
                        acumuladorMovil += asesor.operaciones[loperacion.nombreLargo] || 0;
                    } else if (operacionEncontrada === 'fija') {
                        acumuladorFija += asesor.operaciones[loperacion.nombreLargo] || 0;
                    };
                })
                graphHtml += `<td style="background-color: #ccc; border-bottom: 1px solid #ccc;">${acumuladorMovil || 0}</td>`
                asesor.movilesTotales = acumuladorMovil || 0;
                graphHtml += `<td style="background-color: #ccc; border-bottom: 1px solid #ccc;">${acumuladorFija || 0}</td>`
                asesor.fijaTotales = acumuladorFija || 0;
                return graphHtml += `<tr></tbody>`
            })
        }
    }
    function drawObjectsFromFilter(data) {
        data == 'm' ? (data = 'Ventas Móviles') : (data = 'Ventas Fijas');
        asesores.sort((a, b) => (b[filter] > a[filter]) ? 1 : ((a[filter] > b[filter]) ? -1 : 0))
        let paletaColores = asesores.map(obj => obj[filter]);
        paletaColores = [...new Set(paletaColores)];
        graphHtml += `<h2 style="text-align: center;">${data}</h2>`
        let graph100percent = asesores[0][filter];
        asesores.forEach((asesor) => {
            efectivePercent = Math.round((asesor[filter] * 100) / graph100percent);
            graphHtml += `<div class="item">
    <div class="bar__container">
        <h3 class="h3">${asesor.nombre}</h3>
        <h3>${asesor[filter]}</h3>
        <div class="bar" style="width: ${efectivePercent}%; background-color: ${perc2color(efectivePercent)};">
        </div>
    </div>
</div>
`;
        });
        graphHtml += `<div class="item">
    <div class="bar__container">
        <h3 class="h3">TOTAL</h3>
        <h3>${asesores.reduce((obj1, obj2) => obj1 + obj2[filter], 0)}</h3>
        <div class="bar" style="width: 100%; background-color: #000;">
        </div>
    </div>
</div>
`;
    }
    document.querySelector('.graphs').innerHTML = graphHtml;
    document.querySelector('.graphs').classList.remove('hidden');

}
