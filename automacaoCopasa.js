const puppeteer = require('puppeteer');

async function runScript(cpf, senha, pesquisa) {
    const pesquisasArray = pesquisa.split(/\s+/).map(value => value.trim());


    console.log('CPF:', cpf);
    console.log('Senha:', senha);
    console.log('Pesquisa:', pesquisasArray);

    const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-maximized'] });
    const page = await browser.newPage();

    const url = 'https://copasaportalprd.azurewebsites.net/Copasa.Portal/Login/Index';

    try {
        await page.goto(url);

        await page.type('input[id="cpfInput"]', cpf);
        await page.type('input[id="passwordInput"]', senha);
        await page.keyboard.press('Enter');

        await page.waitForSelector('img[alt="Copasa"]');
        await page.click('img[alt="Copasa"]');

        await page.waitForTimeout(3000);

        await page.goto('https://copasaportalprd.azurewebsites.net/Copasa.Portal/Services/MyAccount_ListIdentifiers');

        await page.waitForTimeout(3000);

        for (const consulta of pesquisasArray) {

            await page.waitForTimeout(10000);

            await page.type('input[type="search"]', consulta);

            await page.waitForTimeout(1000);

            await page.click('input[id="RadioID"]');
            await page.click('button[id="btnproceed"]');
            await page.waitForTimeout(6000);

            try {
                const elements = await page.$x('/html/body/div/main/form/div[1]/div[5]/div/div[1]/div[3]/div/table/tbody/tr/th[7]/a/span');
                if (elements.length > 0) {
                    await elements[0].click();
                }
            } catch (error) {
                console.error('Ocorreu um erro ao realizar download:', error);
            }

            await page.waitForTimeout(5000);

            await page.click('button[id="btnSelect"]');
            await page.waitForTimeout(7000);
            await page.waitForTimeout(6000);
        }
    } catch (error) {
        console.error('Ocorreu um erro:', error);
    } finally {
        await browser.close();
    }
}

// Verifica se os argumentos são fornecidos corretamente
if (process.argv.length < 5) {
    console.error('Por favor, forneça CPF, senha e pesquisa como argumentos de linha de comando.');
    process.exit(1); // Encerre o script com código de erro
}

// Pega os argumentos da linha de comando
const cpf = process.argv[2];
const senha = process.argv[3];
const pesquisa = process.argv[4];

// Chama a função principal com os argumentos
runScript(cpf, senha, pesquisa);;