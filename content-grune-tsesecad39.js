function appendCurrentTimeToFirstH2() {
    // Obter o primeiro elemento h2 na página
    const firstH2 = document.querySelector('h2');
  
    // Verificar se encontrou algum elemento h2
    if (firstH2) {
      // Obter o horário atual
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour12: false });
  
      // Concatenar o horário atual ao texto do elemento h2
      firstH2.textContent += ' - ' + currentTime;
    } else {
      console.error('Nenhum elemento h2 encontrado na página.');
    }
  }

  function replaceH2WithH6() {
    // Obter todos os elementos h2 na página
    const h2Elements = document.querySelectorAll('h2');
  
    // Verificar se encontrou algum elemento h2
    if (h2Elements.length > 1) {
      // Iterar sobre todos os elementos h2, começando do segundo elemento
      for (let i = 1; i < h2Elements.length; i++) {
        const h2Element = h2Elements[i];
        const newH6Element = document.createElement('h6');
  
        // Copiar o conteúdo do elemento h2 para o novo elemento h6
        newH6Element.textContent = h2Element.textContent;
  
        // Substituir o elemento h2 pelo novo elemento h6
        h2Element.parentNode.replaceChild(newH6Element, h2Element);
      }
    } else {
      console.error('Menos de dois elementos h2 encontrados na página.');
    }
  }
  
  // Chamar a função ao carregar a página
  window.addEventListener('load', replaceH2WithH6);
  
  
  // Chamar a função ao carregar a página
  window.addEventListener('load', appendCurrentTimeToFirstH2);



