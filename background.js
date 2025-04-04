// background.js
console.log("Background.js 2 starting...");
let lastAlarmTime;
let intervalBetweenAlarms; // 5 minutos em milissegundos
let scrollToEnd;
let rotateTabs = false;
let timeRotateTabs = 5;
let controlswitchTabs;
let popAberto = false;

//Telegram options
const token = '7028038500:AAFDfWamOI4oA6NpgB--4rh97rrwSHXy3W4';
//const chatId = '-4147692731';   //PRODUÇÃO
const chatId = '-4152074842';   //DESENVOLVIMENTO
let browser = chrome;

// background-script.js
// Listener para receber mensagens do content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('Background script recebeu mensagem:', message);
  if (message.action === 'getTabId') {
    console.log('Solicitado ID da aba atual. Enviando resposta...', sender.tab.id);
    // Responde ao content script com o ID da aba atual
    return sender.tab.id;
  }
  sendResponse({ response: sender.tab.id });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script recebeu mensagem ', request);
  const { type, ...rest } = request;
  if (type === 'GET_TAB_INFO') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      sendResponse(sender.tab.id);
    });
  }

  return true;
});



function sendPhotoToTelegram(fileBase64) {

  // Construir a URL da API do Telegram para enviar foto por URL
  const apiUrl = `https://api.telegram.org/bot${token}/sendPhoto`;

  // Converter o arquivo base64 em Blob
  const binaryString = atob(fileBase64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: 'image/png' });

  // Montar o corpo da requisição
  const body = new FormData();
  body.append('chat_id', chatId);
  body.append('photo', blob);

  // Enviar a requisição ao Telegram
  fetch(apiUrl, {
    method: 'POST',
    body: body
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao enviar foto para o Telegram: ' + response.status);
      }
      console.log('Foto enviada com sucesso para o Telegram!');
    })
    .catch(error => {
      console.error('Erro ao enviar foto para o Telegram:', error);
    });
}


function sendMessageToTelegram(message) {

  fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`)
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        console.log('Mensagem enviada com sucesso:', data.result);
      } else {
        console.error('Erro ao enviar mensagem:', data.description);
      }
    })
    .catch(error => {
      console.error('Erro na requisição:', error);
    });

}

// Carrega as configurações do armazenamento local
chrome.storage.sync.get(['rotateTabs', 'timeRotateTabs', 'lastAlarmTime', 'intervalBetweenAlarms', 'scrollToEnd', 'timeScroll', 'popAberto'], function (data) {
  rotateTabs = data.rotateTabs || false;
  timeRotateTabs = (data.timeRotateTabs && data.timeRotateTabs > 5) ? data.timeRotateTabs : 5;
  lastAlarmTime = data.lastAlarmTime || 0;
  intervalBetweenAlarms = data.intervalBetweenAlarms || 5 * 60 * 1000;
  scrollToEnd = data.scrollToEnd || false;
  popAberto = data.popAberto;


  console.log("popAberto: ", popAberto);


  if (rotateTabs) {
    agendarProximaRotacao();
  } else {
    pararRotacao();
  }

});

function agendarProximaRotacao() {
  // Obtém todas as abas abertas
  chrome.tabs.query({}, function (result) {
    tabs = result;
    controlswitchTabs = setTimeout(switchTabs, timeRotateTabs * 1000);
  });
}

function pararRotacao() {
  console.log("Parando rotação de abas.")
  clearTimeout(controlswitchTabs);
}

// Atualiza as configurações do armazenamento local quando houver alterações
chrome.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync') {
    if ('rotateTabs' in changes) {
      rotateTabs = changes.rotateTabs.newValue;
      if (rotateTabs) {
        agendarProximaRotacao();
      } else {
        pararRotacao();
      }
    }
    if ('timeRotateTabs' in changes) {
      timeRotateTabs = (changes.timeRotateTabs.newValue && changes.timeRotateTabs.newValue > 5) ? changes.timeRotateTabs.newValue : 5;
    }
    if ('lastAlarmTime' in changes) {
      lastAlarmTime = changes.lastAlarmTime.newValue;
    }
    if ('intervalBetweenAlarms' in changes) {
      intervalBetweenAlarms = changes.intervalBetweenAlarms.newValue;
    }
    if ('scrollToEnd' in changes) {
      scrollToEnd = changes.scrollToEnd.newValue;
    }
    if ('popAberto' in changes) {
      popAberto = changes.popAberto.newValue;
    }
  }
});

chrome.runtime.onMessage.addListener(data => {
  if (data.type === 'notification') {
    console.log("Envio de notificação solicitado");

    // Obter a hora atual
    var now = new Date();
    var currentHour = now.getHours();
    var currentMinutes = now.getMinutes();

    // Verificar se o horário está entre 5h e 5h10
    if (currentHour === 5 && currentMinutes >= 0 && currentMinutes <= 10) {
      console.log("Restart programado da madrugada. Não será enviada notificação. ", now, data.options);
      return;
    }

    const currentTime = Date.now();
    const elapsedTimeSinceLastAlarm = currentTime - lastAlarmTime;
    if (elapsedTimeSinceLastAlarm < intervalBetweenAlarms) {
      console.log("Aguardando o intervalo de 5 minutos entre os alarmes.");
      return;
    }

    console.log("Notificação será enviada agora ", currentTime, data.options);
    let actualTabID = chrome.tabs.query({ active: true, lastFocusedWindow: true }).id;
    lastAlarmTime = currentTime;

    chrome.notifications.create('alert', data.options);

    //Enviar alerta para o telegram
    sendMessageToTelegram(data.options.message);

    // Atualiza a aba ativa para a do grune, tira print, envia para o telegram e retorna para a aba que estava aberta
    chrome.tabs.update(gruneTabId, { active: true });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let captureVisibleTab = chrome.tabs.captureVisibleTab({ format: 'png' });
      captureVisibleTab.then(result => sendPhotoToTelegram(result));
    });

    chrome.tabs.update(actualTabID, { active: true });

  }
});



let controlScroll;
let controlFindWords;
let gruneTabId;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab && tab.url) {

    if (tab.url.includes('grune')) {
      clearTimeout(controlFindWords);

      gruneTabId = tabId;

      // Aguarda 1 segundo antes de buscar palavras
      controlFindWords = setTimeout(() => {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['js/findwords.js']
        });
      }, 1000);
    }

    if (tab.url.includes('grafana')) {

      clearTimeout(controlScroll);

      // Aguarda 1 segundo1 antes de retomar o scroll automático
      controlScroll = setTimeout(() => {
        console.log('Página carregada. Aguardando elemento dinâmico...');

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['js/scrolltoend.js']
        });
      }, 2000);

    }

  }
});



//Alternar abas
let currentIndex = 0;
let tabs = [];


function switchTabs() {
  clearTimeout(controlswitchTabs);

  chrome.tabs.query({}, function (result) {
    tabs = result;
  });

  if (tabs.length === 0 || tabs.length < 2) {
    console.log('Não há abas abertas para alternar.');
    return;
  }

  if (rotateTabs && !popAberto) {
    currentIndex = (currentIndex + 1) % tabs.length;
    const tabId = tabs[currentIndex].id;

    // Atualiza a aba ativa
    chrome.tabs.update(tabId, { active: true }, () => {
      console.log(`Alternando para a aba ${currentIndex + 1}/${tabs.length} (ID: ${tabId})`);
    });

  } else {
    console.log('A rotação de abas está desativada.');
  }
  agendarProximaRotacao();
}
