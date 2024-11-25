const API_KEY = '092eef9f51a73b1d3180718f0eafda49';
let btnBuscar = document.getElementById('btnBuscar');
const loadingElement = document.getElementById('loading');
const erroDiv = document.getElementById('erro');

// CARREGA A PAGINA COM A CIDADE PADRAO
window.addEventListener('load', () => {
    const cidadePadrao = "Brasilia"; // CIDADE PADRAO
    FuncCidade(cidadePadrao);
});

btnBuscar.addEventListener('click', async () => {
    let inputCity = document.getElementById('cidade').value;

    if (!inputCity) {
        showError('Por favor, digite o nome de uma cidade');
        return;
    }

    await FuncCidade(inputCity);
});

async function FuncCidade(inputCity) {
    try {
        // Mostra loading e esconde erro anterior
        showLoading();

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${API_KEY}&lang=pt_br&units=metric`
        );

        if (!response.ok) {
            throw new Error('Cidade não encontrada');
        }

        const DadosW = await response.json();
        Showdata(DadosW);

        // Esconde loading após sucesso
        hideLoading();
        // Esconde mensagem de erro se existir
        hideError();

    } catch (error) {
        // Esconde loading e mostra erro
        hideLoading();
        showError(error.message);

        // Limpa os dados anteriores
        clearData();
    }
}

function Showdata(DadosW) {
    document.getElementById('cidade-nome').innerHTML = DadosW.name;
    document.getElementById('clima').innerHTML = `${Math.floor(DadosW.main.temp)}°C`;
    document.getElementById('icon').src = `https://openweathermap.org/img/w/${DadosW.weather[0].icon}.png`;
    document.getElementById('status').innerHTML = capitalizeFirstLetter(DadosW.weather[0].description);
    document.getElementById('umidade').innerHTML = `Umidade: ${DadosW.main.humidity}%`;
}

function clearData() {
    document.getElementById('cidade-nome').innerHTML = '';
    document.getElementById('clima').innerHTML = '';
    document.getElementById('icon').src = '';
    document.getElementById('status').innerHTML = '';
    document.getElementById('umidade').innerHTML = '';
}

function showLoading() {
    loadingElement.classList.remove('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
}

function showError(message) {
    erroDiv.textContent = message;
    erroDiv.classList.remove('hidden');
}

function hideError() {
    erroDiv.classList.add('hidden');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Permitir busca ao pressionar Enter
document.getElementById('cidade').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        btnBuscar.click();
    }
});