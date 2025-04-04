console.log('Iniciando content-grune-css.js em ' + window.location.href);
let browser = chrome;
let tabId;

function getPageTitle() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ type: 'GET_TAB_INFO' }, (title) => {
            if (title && title.response) { // Verifica se title e title.response não são undefined
                resolve(title.response);
            } else {
                reject(new Error('Failed to get tab title'));
            }
        });
    });
}

// Chamada da função ao carregar a página
getPageTitle()
    .then(response => {
        tabId = response; // Define o tabId obtido na variável global

        // Carrega as configurações salvas ao abrir 
        chrome.storage.sync.get(properties.map(prop => getStorageKey(tabId, prop.name)), function (data) {
            properties.forEach(prop => {
                const inputElement = document.getElementById(prop.element);
                if (inputElement) {
                    const storageKey = getStorageKey(tabId, prop.name);
                    const newValue = data[storageKey];
                    console.log("local.get", storageKey, newValue);
                    if (prop.type === 'checkbox') {
                        if (typeof newValue !== 'undefined') { // Verifica se o valor do armazenamento não é undefined
                            inputElement.checked = newValue;
                            if (storageKey.startsWith("showOnlyWithProblemTab")){
                                applyStyle(newValue);
                            }
                        }
                    } else {
                        inputElement.value = newValue || '';
                    }
                }
            });
        });

        // Atualiza as configurações do armazenamento local quando houver alterações
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            if (namespace === 'sync') { // Corrige o namespace para 'sync'
                for (let key in changes) {
                    if (properties.some(prop => key.endsWith(prop.name))) {
                        const newValue = changes[key].newValue;
                        console.log("local ", key, newValue);

                        if (key.startsWith("showOnlyWithProblemTab")){
                            applyStyle(newValue);
                        }
                        
                        
                    }
                }
            }
        });

        console.log('TabId:', tabId);

        // Faça algo com o tabId aqui, por exemplo:
        // document.title = title;
    })
    .catch(error => {
        console.error('Error:', error);
    });
    


// Função para substituir um link CSS por um estilo embutido
function replaceCSSLink() {
    // Selecione todos os elementos 'link' na página
    const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');

    // Itere sobre cada link CSS
    cssLinks.forEach(link => {
        // Verifique se o link aponta para o 'teste.css'
        if (link.href.includes('estilo2.css')) {
            // Crie um novo estilo embutido
            const style = document.createElement('style');
            style.innerHTML = `

      /* ESTILO DO SWITCH */
      label {
        display: block;
        margin-bottom: 10px;
        color: #333;
    }
    textarea {
        width: 95%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        resize: vertical;
    }
    .switch-label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        color: #333;
    }
    .switch-label input {
        display: none;
    }
    .slider {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
        background-color: #ccc;
        border-radius: 34px;
        margin-left: 10px;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        border-radius: 50%;
        -webkit-transition: .4s;
        transition: .4s;
    }
    input:checked + .slider {
        background-color: #2196F3;
    }
    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }
    button {
        padding: 10px 20px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
    }
    button:hover {
        background-color: #0d8aed;
    }
    
      * /* NOVO ESTILO PARA O GRUNE */
      * {
          margin: 0;
          padding: 0px;
          box-sizing: border-box;            
      }
      body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          padding: 0px 10px 10px 10px;
      }
      h1 {
          color: #333;
          margin-bottom: 0px;
          font-size: medium;			
      }
      h2 {
          color: #333;
          margin: 1px;
          font-size: small;
      }
      ul {
          list-style-type: none;
          margin-bottom: 20px;
          background-color: #333;
          border-radius: 8px;
          overflow: hidden;			
      }
      li {
          float: left;
      }
      li a {
          display: block;
          color: white;
          text-align: center;
          padding: 4px 20px;
          text-decoration: none;
      }
      li a:hover {
          background-color: #555;
      }
      a {
          text-decoration: none;
          color: #333;            
      }
      table {
          font-size: small;
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 5px;
          padding: 20px;
      }
      th, td {
          padding: 5px;
          text-align: left;
          border-bottom: 1px solid #ddd;			
      }
      td {
        background-color: transparent!important;
      }
      th {
          background-color: #f2f2f2;
      }
      
      tr:hover {
          background-color: #f5f5f5;
      }
      .container {
          max-width: 1200px;
          margin: 0 auto;
      }
      
      
      /* Estilo para linhas corretas */
      .ok {
          background-color: #d4edda !important; /* Verde claro */
      }

      .ok:hover {
          background-color: #AACBBF !important; /* Verde escuro */
      }

      .warning {			
        background-color: #FFE081;
        animation: piscar-warning 1s infinite alternate !important; /* Animação de piscar */		
      }

      /* Animação de piscar */
      @keyframes piscar-warning {
          from {
              background-color: #ffedb4; /* amarelo claro */
          }
          to {
              background-color: #ffcd35; /* amarelo escuro */
          }
      }

      .critical {
        background-color: #FAB0A6; /* Vermelho claro */
        animation: piscar 1s infinite alternate !important; /* Animação de piscar */
      } 

      /* Estilo para linhas com problemas */
        .alerta {
            background-color: #FAB0A6; /* Vermelho claro */
            animation: piscar 1s infinite alternate !important; /* Animação de piscar */
        }

        /* Animação de piscar */
        @keyframes piscar {
            from {
                background-color: #fddbd6; /* Vermelho claro */
            }
            to {
                background-color: #f6705e; /* Vermelho escuro */
            }
        }
      
      
      
      /* Estilos para a div flutuante */
      .powered-by {
          position: absolute;
          top: 20px;
          right: 20px;
          background-color: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
      }
      `;



            // Substitua o link pelo novo estilo
            link.parentNode.replaceChild(style, link);
        }
    });
}

// Execute a função quando a página for totalmente carregada
window.addEventListener('load', replaceCSSLink);
//window.addEventListener('load', getTabId);

// Carrega as configurações salvas e busca por palavras de alerta
chrome.storage.sync.get(['keywords', 'enableAlert'], function (data) {
    const keywords = data.keywords || [];
    const enableAlert = data.enableAlert || false;

    // Verifica se o alerta está habilitado
    if (enableAlert) {
        const bodyText = document.body.innerText.toLowerCase();
        const foundKeyword = keywords.find(keyword => bodyText.includes(keyword));

        if (foundKeyword) {
            // Se alguma palavra-chave for encontrada, envie uma mensagem para o background.js
            chrome.runtime.sendMessage({ action: "checkForWord" });
        }
    }
});

// Função para aplicar o estilo com base no estado do switch
function applyStyle(showOnlyWithProblem) {
    console.log("applyStyle ", showOnlyWithProblem);
    // Remove qualquer estilo anteriormente adicionado
    document.querySelectorAll('style[data-extension-style]').forEach(style => {
        style.remove();
    });

    // Cria um elemento de estilo
    var style = document.createElement('style');
    style.setAttribute('data-extension-style', 'true');

    // Adiciona as regras de estilo com base no estado atual
    if (showOnlyWithProblem) {
        style.textContent = '.ok td { display: none !important; }';
    } else {
        style.textContent = '.ok { background-color: #d4edda !important; }';
    }

    // Adiciona o estilo ao cabeçalho do documento
    document.head.appendChild(style);
}


let parentElement = document.querySelector('div[style="text-align: center; margin-bottom: 20px;"]');
let floatingDivShowOnlyErros = document.createElement('div');

// Adiciona o switch 
floatingDivShowOnlyErros.innerHTML = `
    <label class="switch-label" for="showOnlyWithProblemTab">Exibir apenas instâncias com alerta
        <input type="checkbox" id="showOnlyWithProblemTab">
        <span class="slider"></span>
    </label>
`;

// Insere a div flutuante no DOM logo abaixo do elemento pai
parentElement.insertAdjacentElement('afterend', floatingDivShowOnlyErros);

// Define as propriedades e elementos de entrada
const properties = [
    { name: 'enableAlertTab', element: 'enableAlertTab', type: 'checkbox' },
    { name: 'showOnlyWithProblemTab', element: 'showOnlyWithProblemTab', type: 'checkbox' }
    // Adicione novas propriedades aqui conforme necessário
];

// Função para obter a chave única para o armazenamento local com base no ID da aba e no nome da propriedade
function getStorageKey(tabId, propertyName) {
    return `${propertyName}_${tabId}`;
}






// Salva as configurações quando o switch é alterado
properties.forEach(prop => {
    const inputElement = document.getElementById(prop.element);

    if (inputElement && prop.type === 'checkbox') {
        inputElement.addEventListener('change', function () {
          const newData = {};
          const storageKey = getStorageKey(tabId, prop.name);
          newData[storageKey] = inputElement.checked;
          // Recarrega a página atual
          chrome.storage.sync.set(newData, function () {
            console.log('Configurações salvas::::', newData);
          });

          if (storageKey.startsWith("showOnlyWithProblemTab")){
            applyStyle(inputElement.checked);
        }

        });
      }

});

document.querySelectorAll('.switch-input').forEach(function (input) {
    input.addEventListener('change', function () {

    });
});














