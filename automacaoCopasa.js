const puppeteer = require('puppeteer');

// Função principal que aceita CPF, senha e consultas como argumentos
async function runScript(cpf, senha) {
    const consultas = ['109683251', '7897928', '119872617', '131337131', '16732553', '154908860', '111758726', '124275966', '113631430', '113568134', '12725901', '118425773', '130661775', '123918707', '8094306', '7999291', '121323170', '102353671', '122106113', '169293696', '159277566', '118040308', '102403155', '128070196', '8112525', '7945744', '13084526', '148787053', '7920652', '146386973', '149128789', '127608478', '17995973', '7922086', '7840390', '123648742', '102741344', '14144719', '114208701', '123670918', '152348981', '115417231', '165778822', '117202088', '161147607', '132698927', '149553692', '114627452', '138032629', '154210129', '23126744', '14269023', '7997736', '7921349', '22236643', '132509997', '14032635', '103838279', '138845093', '159206235', '119286351', '104895926', '18612598', '18612610', '106688375', '7943989', '120121247', '112796214', '7746938', '7920121', '8186383', '117906531', '116429259', '149160542', '19389973', '104383810', '7928084', '7856806', '126972290', '12762717', '8147728', '113944349', '119104865', '16781498', '131636651', '116709553', '115264388', '7731264', '100982646', '127039783', '7781288', '123918901', '115446508', '122190581', '140825011', '104757043', '120035961', '154664227', '137077602', '7948271', '119229731', '121559076', '153385073', '16150848', '22224068', '8002550', '7997922', '153305746', '7845588', '129477362', '121097986', '20340133', '7937385', '115763678', '116438371', '128797827', '23613611', '7932596', '103326286', '7743211', '118469983', '134931262', '118198734', '116006579', '121054799', '123407494', '120302039', '126878170', '7920679', '112044581', '124096280', '121990630', '147792037', '165848189', '104065010'];
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

        for (const consulta of consultas) {

            await page.waitForTimeout(10000);

            await page.type('input[type="search"]', consulta);

            await page.waitForTimeout(1000);

            await page.click('input[id="RadioID"]');
            await page.click('button[id="btnproceed"]');
            await page.waitForTimeout(4000);

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
if (process.argv.length < 4) {
    console.error('Por favor, forneça CPF e senha como argumentos de linha de comando.');
    process.exit(1); // Encerre o script com código de erro
}

// Pega os argumentos da linha de comando
const cpf = process.argv[2];
const senha = process.argv[3];

// Chama a função principal com os argumentos
runScript(cpf, senha);