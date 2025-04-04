// content.js
console.log('Iniciando content.js em '+window.location.href);
// content.js


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
        * /* NOVO ESTILO PARA O GRUNE */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;            
        }
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        h1, h2 {
            color: #333;
            margin-bottom: 10px;
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
            padding: 14px 16px;
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
            margin-bottom: 20px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
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
		
		/*.ok tr{
		    background-color: #e6ffdb ;
		}*/
		
		
		/* Estilo para linhas corretas */
        .ok {
            background-color: #d4edda !important;; /* Verde claro */
        }

        /* Estilo para linhas com problemas */
        .alerta {
            background-color: #f8d7da !important;; /* Vermelho claro */
            animation: piscar 1s infinite alternate; /* Animação de piscar */
        }
		
		.warning {			
			background-color: #fffad4 !important;;			
		}

        /* Animação de piscar */
        @keyframes piscar {
            from {
                background-color: #f8d7da; /* Vermelho claro */
            }
            to {
                background-color: #721c24; /* Vermelho escuro */
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


// Carrega as configurações salvas
chrome.storage.sync.get(['keywords', 'enableAlert', 'showOnlyWithProblem'], function(data) {
  const keywords = data.keywords || [];
  const enableAlert = data.enableAlert || false;
  const showOnlyWithProblem = data.showOnlyWithProblem || false;

  // Verifica se o alerta está habilitado
 /* if (enableAlert) {
    const bodyText = document.body.innerText.toLowerCase();

    // Verifica se alguma das palavras-chave está presente na página
    const foundKeyword = keywords.find(keyword => bodyText.includes(keyword));

    if (foundKeyword) {
      // Se alguma palavra-chave for encontrada, envie uma mensagem para o background.js
      chrome.runtime.sendMessage({ action: "checkForWord" });
    }
  }*/
  
  if (showOnlyWithProblem) {
    if (window.location.href.includes("dash-cadastro-eleitoral")) {	
      console.log('produção');  
      var style = document.createElement('style');
      style.innerHTML = '.ok td { display: none; }';
      document.head.appendChild(style);  
    }
  }
});



