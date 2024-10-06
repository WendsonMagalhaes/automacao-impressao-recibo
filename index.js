const puppeteer = require('puppeteer');

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
async function robo() {
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

    // Defina um array com os números de contrato que você deseja imprimir
    const contratos = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
    ]; // Adicione quantos contratos forem necessários

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
}

robo();
