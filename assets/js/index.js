let alohaArray;
let controlNetMovilArray;
let controlNetFijaArray;
let controlNetArray;
let movilesContables;

let asesores = [];
let operaciones = [];

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
        document.querySelector('.files').classList.add('hidden');
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

            // Operaciones
            controlNetMovilArray.forEach(elemento => {
                operaciones.push(elemento['Operaci&#243;n']);
            })
            controlNetFijaArray.forEach(elemento => {
                operaciones.push(elemento['Tipo Operacion']);
            })
            operaciones = [...new Set(operaciones)];
            operaciones.sort()


            // Normalizar ArrayFija
            controlNetFijaArray.forEach(elemento =>{
                elemento['Operaci&#243;n'] = elemento['Tipo Operacion'];
                elemento['C&#243;digo FFVV'] = elemento['CodigoFFVV'];
            })

            controlNetArray = controlNetMovilArray.concat(controlNetFijaArray);

            // ------------------------Cambiando Errores Ortográficos
            n = 0;
            operationsHtml = '';
            operaciones.forEach(operacion => {
                let operacionName = operacion.replace('&#243;', 'ó')
                operacionName = operacionName.replace('&#237;', 'í')
                operationsHtml += `<button class="buttonOperation" onclick="filterOperations('${n}')">${operacionName}</button>`;
                n++;
            })
            // console.log(operaciones);
            document.querySelector('.operations').innerHTML = operationsHtml;
            // ------------------------------------------------------

            // Filtrando asesores y contando cantidad de operaciones;
            asesores.forEach(asesor => {
                asesor.oportunidadesTotales = oportunidadesTotales[asesor.id];
                asesor.oportunidadesEfectivas = oportunidadesEfectivas[asesor.id];
                asesor.ventasTotales = ventasTotales[asesor.id];
                asesor.operaciones = {};
                operaciones.forEach(operacion => {
                    operaciones[operacion] = controlNetArray.filter(obj => obj['Operaci&#243;n'] == operacion && obj['C&#243;digo FFVV'] == asesor.id);
                    asesor.operaciones[operacion] = operaciones[operacion].reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {})[asesor.id] || 0;
                })
                let operacionesSumatorias = ['Postpago Renueva por Fidelizaci&#243;n', 'Postpago Portabilidad Migraci&#243;n M4 (Or. Postpago)', 'Telefon&#237;a Fija', 'Post-Venta', 'Postpago Migracion M4', 'Postpago Portabilidad Migraci&#243;n M4 (Or. Prepago)', 'Postpago Portabilidad ( Origen Postpago )', 'Postpago Portabilidad ( Origen Prepago )', 'Migracion de Prepago a Postpago'];
                let sumatoria = 0;
                operacionesSumatorias.forEach( operacion =>{
                    sumatoria += asesor.operaciones[operacion] || 0;
                })
                asesor.movilesTotales = sumatoria;
                operacionesSumatorias = ['NAKED ', 'DUO BA', 'DUO BA+TV', 'TRIO'];
                sumatoria = 0;
                operacionesSumatorias.forEach( operacion =>{
                    sumatoria += asesor.operaciones[operacion] || 0;
                })
                asesor.fijasTotales = sumatoria;
            });
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
    filter = operaciones[filter];
    let graphHtml = '';
    asesores.sort((a, b) => (b.operaciones[filter] > a.operaciones[filter]) ? 1 : ((a.operaciones[filter] > b.operaciones[filter]) ? -1 : 0))
    let paletaColores = asesores.map(obj => obj.operaciones[filter]);
    paletaColores = [...new Set(paletaColores)];
    let graph100percent = asesores[0].operaciones[filter];
    asesores.forEach((asesor) => {
        let efectivePercent = Math.round((asesor.operaciones[filter] * 100) / graph100percent);
        // console.log(efectivePercent);
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
        <h3>${asesores.reduce((obj1,obj2)=>obj1 + obj2.operaciones[filter], 0)}</h3>
        <div class="bar" style="width: 100%; background-color: #000;">
        </div>
    </div>
</div>
`;
    document.querySelector('.graphs').innerHTML = graphHtml;
    document.querySelector('.graphs').classList.remove('hidden');
}

function filterVentas(type) {
    if (type === 'm'){
        filter = 'movilesTotales';
    } else if (type === 'f'){
        filter = 'fijasTotales';
    }

    let graphHtml = '';
    asesores.sort((a, b) => (b[filter] > a[filter]) ? 1 : ((a[filter] > b[filter]) ? -1 : 0))
    let paletaColores = asesores.map(obj => obj[filter]);
    paletaColores = [...new Set(paletaColores)];
    let graph100percent = asesores[0][filter];
    console.log(asesores, graph100percent);
    asesores.forEach((asesor) => {
        efectivePercent = Math.round((asesor[filter] * 100) / graph100percent);
        console.log(efectivePercent);
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
        <h3>${asesores.reduce((obj1,obj2)=>obj1 + obj2[filter], 0)}</h3>
        <div class="bar" style="width: 100%; background-color: #000;">
        </div>
    </div>
</div>
`;
    document.querySelector('.graphs').innerHTML = graphHtml;
    document.querySelector('.graphs').classList.remove('hidden');
}