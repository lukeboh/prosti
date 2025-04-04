// Use a API chrome.runtime.getManifest() para acessar as informações do manifest.json
const manifest = chrome.runtime.getManifest();
const version = manifest.version;

// Atualize o conteúdo da tag h1 com a versão da extensão
const versionElement = document.getElementById('extensionVersion');
versionElement.textContent = `Grune Pro ${version}`;



// popup.js
document.addEventListener('DOMContentLoaded', function () {
  // Define popAberto como verdadeiro quando o popup é aberto
  console.log("setando popAberto ", true);
  chrome.storage.sync.set({ 'popAberto': true });

  //Ao abrir
  const newData = {};
  newData['popAberto'] = true;  
  chrome.storage.sync.set(newData);

  //Ao fechar
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') {
      const newData = {};
      newData['popAberto'] = false;      
      chrome.storage.sync.set(newData);
    }
  });


  // Define as propriedades e elementos de entrada
  const properties = [
    { name: 'keywords', element: 'keywords', type: 'text' },
    { name: 'enableAlert', element: 'enableAlert', type: 'checkbox' },    
    { name: 'rotateTabs', element: 'rotateTabs', type: 'checkbox' },
    { name: 'timeRotateTabs', element: 'timeRotateTabs', type: 'text' },
    { name: 'timeScroll', element: 'timeScroll', type: 'text' },
    { name: 'scrollToEnd', element: 'scrollToEnd', type: 'checkbox' }
    // Adicione novas propriedades aqui conforme necessário
  ];

  // Carrega as configurações salvas ao abrir o popup
  chrome.storage.sync.get(properties.map(prop => prop.name), function (data) {
    properties.forEach(prop => {
      const inputElement = document.getElementById(prop.element);
      if (inputElement) {
        if (prop.type === 'checkbox') {
          inputElement.checked = data[prop.name] || false;
        } else {
          inputElement.value = data[prop.name] || '';
        }
      }
    });
  });


  document.querySelectorAll('.switch-input').forEach(function (input) {
    input.addEventListener('change', function () {

    });
  });

  // Salva as configurações quando o campo de entrada é alterado
  properties.forEach(prop => {
    const inputElement = document.getElementById(prop.element);
    if (inputElement && prop.type !== 'checkbox') {
      inputElement.addEventListener('input', function () {
        const newData = {};
        newData[prop.name] = inputElement.value;
        chrome.storage.sync.set(newData, function () {
          console.log('Configurações salvas:', newData);
        });
      });
    }
  });

  // Salva as configurações quando o switch é alterado
  properties.forEach(prop => {
    const inputElement = document.getElementById(prop.element);
    if (inputElement && prop.type === 'checkbox') {
      inputElement.addEventListener('change', function () {
        const newData = {};
        newData[prop.name] = inputElement.checked;
        // Recarrega a página atual
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
        chrome.storage.sync.set(newData, function () {
          console.log('Configurações salvas:', newData);
        });
      });
    }
  });
});
