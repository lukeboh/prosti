// Função para modificar o tipo do campo de entrada para "password"
function alterarParaSenha() {
    // Selecionar o elemento com o ID "pwdSenha"
    var senhaInput = document.getElementById('pwdSenha');
    
    // Verificar se o elemento foi encontrado
    if (senhaInput) {
        // Alterar o tipo do elemento para "password"
        senhaInput.type = 'password';
    } 
}

// Chamar a função ao carregar a página do site www.teste.com.br
window.onload = alterarParaSenha;