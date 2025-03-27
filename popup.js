document.getElementById('checkButton').addEventListener('click', () => {
  const url = urls[Math.floor(Math.random() * urls.length)];
  checkInternet(url).then(isConnected => {
    const resultDiv = document.getElementById('result');
    if (isConnected) {
      measureSpeed(url).then(result => {
        if (result) {
          resultDiv.textContent = `Internet OK, Speed: ${result.speed.toFixed(2)} KB/s, URL: ${result.url}`;
        } else {
          resultDiv.textContent = 'Internet OK, but speed not measured';
        }
      });
    } else {
      resultDiv.textContent = 'Internet NOT OK';
    }
  });
});