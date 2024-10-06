const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Importando o módulo path
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

// Middleware para parsear o JSON
app.use(bodyParser.json());

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname)));
// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Servir o arquivo index.html
});

// Função para abrir a nova aba com o link específico e acionar a janela de impressão
async function abrirNovaAba(browser, indice, numeroContrato) {
    const novaPagina = await browser.newPage();

    // Acessa o link fornecido na nova aba
    await novaPagina.goto('https://registra-ai-boy.onrender.com/registrados', { waitUntil: 'networkidle0' });

    // Imprime o número do contrato
    console.log(`Número do contrato ${numeroContrato} na nova aba ${indice}:`, await novaPagina.title());

    // Aciona a janela de impressão utilizando window.print()
    await novaPagina.evaluate(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                window.print();
                resolve();
            }, 100); // Aguarda 100ms antes de chamar window.print()
        });
    });

    console.log(`Janela de impressão ${indice} aberta.`);

    // Aguarda um tempo para simular que a impressão foi tratada (ajuste conforme necessário)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
}

// Função para abrir a nova aba com o link específico e acionar a janela de impressão
async function abrirNovaAba(browser, indice, contrato) {
    const novaPagina = await browser.newPage();


    // Acessa o link fornecido na nova aba
    await novaPagina.goto('https://registra-ai-boy.onrender.com/registrados', { waitUntil: 'networkidle0' });

    // Imprime o número do contrato
    console.log(`Número do contrato na aba ${indice}:`, contrato);

    // Aciona a janela de impressão utilizando window.print()
    await novaPagina.evaluate(() => {
        return new Promise((resolve) => {
            setTimeout(() => {
                window.print();
                resolve();
            }, 100); // Aguarda 100ms antes de chamar window.print()
        });
    });

    console.log(`Janela de impressão ${indice} aberta.`);

    // Aguarda um tempo para simular que a impressão foi tratada (ajuste conforme necessário)
    await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
}

// Função principal para iniciar o robô e abrir várias abas após a impressão
async function robo(contratos) {
    const browser = await puppeteer.launch({
        headless: false, // Deixa o navegador visível
    });

    // Abre a página principal e realiza login
    const page = await browser.newPage();

    await page.goto('https://registra-ai-boy.onrender.com/', { waitUntil: 'networkidle0' });

    // Insere as credenciais de login
    await page.type('[name="login"]', 'adriano');
    await page.type('[name="password"]', '762018');

    // Clique no botão de login
    await page.click('[type="submit"]');

    // Aguarda a navegação após o login
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    console.log('Login realizado.');


    // Array para armazenar as promessas de abrir novas abas
    const promessas = [];

    // Loop para abrir novas abas sem esperar a conclusão da anterior
    for (let i = 0; i < contratos.length; i++) {
        console.log(`Abrindo aba ${i + 1}...`);
        const promessa = abrirNovaAba(browser, i + 1, contratos[i]); // Chama a função para abrir nova aba e imprimir
        promessas.push(promessa); // Armazena a promessa
    }

    // Aguarda a conclusão de todas as promessas
    await Promise.all(promessas);

    console.log('Todas as abas foram abertas e o processo de impressão foi iniciado.');
    // Pausar por 10 segundos (10000 milissegundos)
    setTimeout(() => {
        console.log('Continuando após 10 segundos...');
        // Insira aqui o código que deve ser executado após a pausa
    }, 60000);
}

// Rota para lidar com a impressão
app.post('/imprimir', async (req, res) => {
    const contratos = req.body.contratos; // Obtém os contratos enviados na requisição
    if (!Array.isArray(contratos) || contratos.length === 0) {
        return res.status(400).send({ message: 'É necessário fornecer uma lista de contratos.' });
    }

    try {
        console.log(`Iniciando impressão para os contratos: ${contratos}`);
        await robo(contratos); // Chama a função robo com a lista de contratos
        res.status(200).send({ message: 'Impressão iniciada.' });
    } catch (error) {
        console.error('Erro ao iniciar a impressão:', error);
        res.status(500).send({ message: 'Erro ao iniciar o processo de impressão.' });
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
