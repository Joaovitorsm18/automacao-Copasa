const fs = require('fs');
const ExcelJS = require('exceljs');
const path = require('path');

async function readExcel() {
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'consultas.xlsx');
    const consulta = [];

    try {
        await workbook.xlsx.readFile(filePath);
        const worksheet = workbook.getWorksheet(1);
        const columnToRead = 'A';
        const column = worksheet.getColumn(columnToRead);
        let isFirstRow = true;

        column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            if (isFirstRow) {
                isFirstRow = false;
                return;
            }

            const cellValue = cell.value;
            consulta.push(cellValue);
        });

        return consulta;
    } catch (error) {
        console.error('Ocorreu um erro ao ler o arquivo Excel:', error);
        return [];
    }
}

async function saveToTxtFile() {
    const consulta = await readExcel();
    const txtData = consulta.map(value => `'${value}'`).join(', '); // Formata os valores entre aspas simples e separados por vírgula

    fs.writeFile('consulta.txt', txtData, (err) => {
        if (err) {
            console.error('Ocorreu um erro ao salvar o arquivo de texto:', err);
        } else {
            console.log('Arquivo de texto "consulta.txt" salvo com sucesso.');
        }
    });
}

saveToTxtFile();


