document.addEventListener('DOMContentLoaded', () => {
   
    const chatOverlay = document.getElementById('chatOverlay');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const messageForm = document.getElementById('messageForm');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');


    const fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    
    let selectedFile = null;

    function addMessageToChat(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    
    const Imagebot = document.getElementById('Imagebot');
    if (Imagebot) {
        Imagebot.addEventListener('click', () => {
            chatOverlay.classList.add('visible');
            userInput.focus();
        });
    }
    
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', () => {
            chatOverlay.classList.remove('visible');
        });
    }

    if (chatOverlay) {
        chatOverlay.addEventListener('click', (e) => {
            if (e.target === chatOverlay) {
                chatOverlay.classList.remove('visible');
            }
        });
    }

    fileInput.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            fileNameDisplay.textContent = `Arquivo: ${selectedFile.name}`;
            userInput.disabled = false;
            sendMessageBtn.disabled = false;
        } else {
            fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
            userInput.disabled = true;
            sendMessageBtn.disabled = true;
        }
    });

    if (messageForm) {
        messageForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            loadingIndicator.style.display = 'block';

            if (selectedFile) {
               
                const formData = new FormData();
                formData.append('file', selectedFile);

                addMessageToChat(`Enviando o arquivo: ${selectedFile.name}...`, 'user');

                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error(`Erro no upload! Status: ${response.status}`);
                    }

                    const result = await response.json();
                    const botResponseText = result.resposta;
                    addMessageToChat(botResponseText, 'bot');

                } catch (error) {
                    console.error("Erro ao enviar o arquivo:", error);
                    addMessageToChat("Desculpe, houve um erro ao fazer o upload do arquivo.", 'bot');
                } finally {
                    loadingIndicator.style.display = 'none';
                    selectedFile = null;
                    fileNameDisplay.textContent = 'Nenhum arquivo selecionado';
                    fileInput.value = null;
                    userInput.disabled = true;
                    sendMessageBtn.disabled = true;
                }

            } else {
                
                const userQuestion = userInput.value.trim();
                if (userQuestion === '') {
                    loadingIndicator.style.display = 'none';
                    return;
                }
                
                addMessageToChat(userQuestion, 'user');
                userInput.value = '';

                try {
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pergunta: userQuestion })
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Erro HTTP! Status: ${response.status}`);
                    }
                    
                    const result = await response.json();
                    const botResponseText = result.resposta;
                    addMessageToChat(botResponseText, 'bot');

                } catch (error) {
                    console.error("Erro ao chamar o backend:", error);
                    addMessageToChat("Desculpe, houve um erro ao processar sua solicitação. Tente novamente.", 'bot');
                } finally {
                    loadingIndicator.style.display = 'none';
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }
        });
    }
});