let alohaArray;
let controlNetArray;

let asesores = [];
let operaciones = [];

let oportunidadesTotales;
let oportunidadesEfectivas;
let ventasTotales;
function upload() {
    let alohaFile = document.getElementById('aloha_file_upload').files;
    let controlNetFile = document.getElementById('controlNet_file_upload').files;
    if ((alohaFile.length == 0) || (controlNetFile.length == 0)) {
        alert("Falta Cargar algún archivo.");
        return;
    }
    let alohaFilename = alohaFile[0].name;
    let extension = alohaFilename.substring(alohaFilename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX') {
        excelAlohaFileToJSON(alohaFile[0]);
        excelControlNetFileToJSON(controlNetFile[0]);
        setTimeout(function () {
            // console.table(alohaArray);
            // Cantidad de Oportunidades por Asesor
            // Oportunidades Totales
            oportunidadesTotales = alohaArray.reduce((cnt, cur) => (cnt[cur.__EMPTY_16] = cnt[cur.__EMPTY_16] + 1 || 1, cnt), {});
            // Ventas Totales
            ventasTotales = controlNetArray.reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {});


            // Tickets Aprovechados
            oportunidadesEfectivas = Array.from(new Set(controlNetArray.map(a => a['DNI/RUC'])))
                .map(id => {
                    return controlNetArray.find(a => a['DNI/RUC'] === id)
                })
            oportunidadesEfectivas = oportunidadesEfectivas.reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {});

            // console.table(oportunidadesEfectivas); 

            // Asesores
            alohaArray.forEach(elemento => {
                asesores.push({ 'nombre': elemento.__EMPTY_17, 'id': elemento.__EMPTY_16 });
            })
            asesores = Array.from(new Set(asesores.map(a => a.id)))
                .map(id => {
                    return asesores.find(a => a.id === id)
                })

            // Operaciones
            controlNetArray.forEach(elemento => {
                operaciones.push(elemento['Operaci&#243;n']);
            })
            operaciones = [...new Set(operaciones)];

            // ------------------------Cambiando Errores Ortográficos
            // n = 0;
            // console.log(operaciones);
            // operaciones.forEach(operacion => {
            //     operacion = operacion.replace('&#243;', 'o')
            //     operacion = operacion.replace('&#237;', 'i')
            //     operaciones[n]=operacion;
            //     n++;
            // })
            // ------------------------------------------------------

            // Filtrando asesores y contando cantidad de operaciones;
            asesores.forEach(asesor => {
                asesor.oportunidadesTotales = oportunidadesTotales[asesor.id];
                asesor.oportunidadesEfectivas = oportunidadesEfectivas[asesor.id];
                asesor.ventasTotales = ventasTotales[asesor.id];
                asesor.operaciones = {};
                operaciones.forEach(operacion => {
                    operaciones[operacion] = controlNetArray.filter(obj => obj['Operaci&#243;n'] == operacion && obj['C&#243;digo FFVV'] == asesor.id);
                    asesor.operaciones[operacion] = operaciones[operacion].reduce((cnt, cur) => (cnt[cur['C&#243;digo FFVV']] = cnt[cur['C&#243;digo FFVV']] + 1 || 1, cnt), {})[asesor.id];
                })
            })
        }, 2000)
    } else {
        alert("Please select a valid excel file.");
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
function excelControlNetFileToJSON(file) {
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
            controlNetArray = result.Sheet1;
        }
    } catch (e) {
        console.error(e);
    }
}

