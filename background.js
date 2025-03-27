const urls = [
  'http://www.google.com',
  'http://www.youtube.com',
  'http://www.facebook.com',
  'http://www.instagram.com',
  'http://www.wikipedia.org',
  'https://resultados.tse.jus.br/oficial/app/index.html',
  'https://www.tse.jus.br',
  'http://www.linkedin.com',
  'http://www.netflix.com',
  'https://tn3.tse.jus.br'
];

function checkInternet(url) {
  return fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(response => response.ok)
    .catch(() => false);
}

function measureSpeed(url) {
  const startTime = performance.now();
  return fetch(url, { method: 'GET', mode: 'no-cors' })
    .then(response => {
      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const contentLength = response.headers.get('content-length') / 1024; // KB
      const speed = contentLength / duration; // KB/s
      return { speed, contentLength, url, status: response.status };
    })
    .catch(() => null);
}

chrome.alarms.create('checkInternet', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'checkInternet') {
    const url = urls[Math.floor(Math.random() * urls.length)];
    checkInternet(url).then(isConnected => {
      if (isConnected) {
        measureSpeed(url).then(result => {
          if (result) {
            console.log(`Internet OK, Speed: ${result.speed.toFixed(2)} KB/s, URL: ${result.url}`);
          } else {
            console.log('Internet OK, but speed not measured');
          }
        });
      } else {
        console.log('Internet NOT OK');
      }
    });
  }
});