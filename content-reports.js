console.log("reports...")
var style = document.createElement('style');
style.innerHTML = '.header { visibility: Hidden !important } !important';
style.innerHTML = '.toolbar { visibility: Hidden !important } !important';
document.head.appendChild(style);      


// Função para ocultar a div com a classe "header"
function ocultarHeader() {
    var headerDiv = document.querySelector('.header');
    if (headerDiv) {
        headerDiv.style.display = 'none';
    } else {
        console.error('Elemento de classe "header" não encontrado.');
    }
}

// Chamada da função ao carregar a página
window.addEventListener('load', function() {
    ocultarHeader();
});


// Função para ocultar a div com a classe "header"
function ocultarHeader() {
    var headerDiv = document.querySelector('.header');
    if (headerDiv) {
        headerDiv.style.display = 'none';
        headerDiv.style.visibility = 'Hidden';
    } else {
        console.error('Elemento de classe "header" não encontrado.');
    }
}


// Chamada da função ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    ocultarHeader();
    // Criar um elemento <style>
var style = document.createElement('style');

// Definir o conteúdo CSS para ocultar os elementos com as classes "header" e "toolbar"
style.innerHTML = '.header, .toolbar { visibility: hidden !important; }';

// Adicionar o elemento <style> ao cabeçalho do documento
document.head.appendChild(style);
});


// Função para ocultar a div com a classe "header" e atualizar a página a cada 3 minutos
function ocultarHeaderEAtualizar() {
    // Ocultar a div com a classe "header" e a div com a classe "toolbar"
    var style = document.createElement('style');
    style.innerHTML = '.header, .toolbar { visibility: hidden !important; }';
    document.head.appendChild(style);

    // Atualizar a página a cada 3 minutos
    setTimeout(function() {
        location.reload();
    }, 3 * 60 * 1000); // 3 minutos em milissegundos    
}

// Chamar a função ao carregar a página
window.onload = ocultarHeaderEAtualizar;