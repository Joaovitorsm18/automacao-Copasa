const { exec } = require('child_process');
const express = require('express');
const app = express();
const port = 3000;

// Configuração do middleware para lidar com dados do formulário
app.use(express.urlencoded({ extended: true }));

// Página de login
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h2>Login</h2>
            <form action="/process-login" method="post">
                <label for="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" required>
                <br>
                <label for="senha">Senha:</label>
                <input type="password" id="senha" name="senha" required>
                <br>
                <button type="submit">Login</button>
            </form>
        </body>
        </html>
    `);
});

// Rota para processar o formulário
app.post('/process-login', (req, res) => {
    const { cpf, senha } = req.body;

    // Use exec para chamar o script Node.js com os parâmetros
    exec(`node automacaoCopasa.js ${cpf} ${senha}`, (error, stdout, stderr) => {
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
        res.send('Login processado com sucesso!');
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
