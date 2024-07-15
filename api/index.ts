const { exec } = require('child_process');
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

const scriptPath = path.join(__dirname, '..', 'automacaoCopasa.js');

app.post('/process-login', (req, res) => {
    const { cpf, senha, pesquisa } = req.body;

    console.log('Dados recebidos no lado do servidor:', cpf, senha, pesquisa);

    exec(`node "${scriptPath}" "${cpf}" "${senha}" "${pesquisa}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro na execução do script: ${error.message}`);
            res.status(500).send('Erro na execução do script');
            return;
        }
        if (stderr) {
            console.error(`Erro no script: ${stderr}`);
            res.status(500).send('Erro no script');
            return;
        }
        console.log(`Resultado do script: ${stdout}`);
        res.send('Faturas baixadas com sucesso!');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
