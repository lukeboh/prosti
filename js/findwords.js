//findwords.js
console.log('Iniciando findwords.js em ' + window.location.href);

// Carrega as configurações salvas
chrome.storage.sync.get(['keywords', 'enableAlert'], function (data) {
  console.log('Carregando valores...' + window.location.href);
  const keywordString = data.keywords || '';
  const keywords = keywordString.split(',').map(keyword => keyword.trim());
  const enableAlert = data.enableAlert || false;

  // Verifica se o alerta está habilitado
  if (enableAlert) {
    console.log('Alerta está habilitado. Palavras-chave:', keywords);

    const bodyText = document.body.innerText.toLowerCase();

    // Verifica se alguma das palavras-chave está presente na página
    const foundKeywords = keywords.filter(keyword => bodyText.includes(keyword.toLowerCase()));

    if (foundKeywords.length > 0) {
      console.log('Palavra(s) chave encontrada(s):', foundKeywords.join(', '));

      // Se a palavra-chave for encontrada, envie uma mensagem para o background.js
      const currentTime = Date.now();

      // Capturar a tela da aba ativa - FUNCIONAL
      /*
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tabId = tabs[0].id;        
        let captureVisibleTab = chrome.tabs.captureVisibleTab({ format: 'png' });
        captureVisibleTab.then(result => sendPhotoToTelegram(result));
      });
      */

      chrome.runtime.sendMessage('', {
        type: 'notification',
        options: {
          title: 'Instância com problema',
          message: 'A(s) palavra(s) chave(s) [' + foundKeywords.join(', ') + '] foi(foram) encontrada(s) no dashboard.',
          iconUrl: 'notification-icon.png',
          eventTime: currentTime,
          priority: 2,
          type: 'basic'
        }
      });

    } else {
      console.log('Nenhuma palavra chave encontrada.');
    }
  } else {
    console.log('Alerta está desabilitado. Nenhuma ação realizada.');
  }
});