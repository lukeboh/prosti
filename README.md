# Pro STI - Monitor de Conexão com Internet

## Descrição
O Pro STI é uma extensão para Chrome que monitora a conexão com a internet e modifica o background da página do Google. A extensão realiza verificações periódicas da conexão, mede a velocidade de download e registra os resultados em um arquivo CSV.

## Funcionalidades
- Monitoramento contínuo da conexão com a internet
- Medição da velocidade de download
- Verificação de disponibilidade de sites populares
- Registro de logs em formato CSV
- Modificação do background da página do Google
- Interface popup para visualização do status

## Tecnologias Utilizadas
- JavaScript (Chrome Extension API)
- Python (Script de monitoramento)
- HTML/CSS (Interface do popup)
- Chrome Extension Manifest V3

## Estrutura do Projeto
```
.
├── manifest.json        # Configuração da extensão
├── background.js       # Service worker para monitoramento
├── popup.html         # Interface do popup
├── popup.js          # Lógica do popup
├── content.js       # Script de conteúdo para modificar o Google
├── check_internet.py # Script Python para monitoramento detalhado
└── icons/           # Ícones da extensão
```

## Sites Monitorados
- Google
- YouTube
- Facebook
- Instagram
- Wikipedia
- TSE (Tribunal Superior Eleitoral)
- LinkedIn
- Netflix

## Instalação
1. Clone este repositório
2. Abra o Chrome e acesse `chrome://extensions/`
3. Ative o "Modo do desenvolvedor"
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

## Uso
A extensão iniciará automaticamente o monitoramento após a instalação. Os resultados são registrados no arquivo `check_internet_log.csv` com as seguintes informações:
- Timestamp
- Status da conexão
- Código HTTP
- Descrição do status
- Velocidade (KB/s)
- Tamanho do conteúdo (KB)
- URL testada

## Licença
Este projeto está licenciado sob a licença incluída no arquivo LICENSE. 
