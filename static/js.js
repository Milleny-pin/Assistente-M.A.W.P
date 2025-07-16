document.addEventListener('DOMContentLoaded', () => {
    const Imagebot = document.getElementById('Imagebot');
    const chatOverlay = document.getElementById('chatOverlay');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const messageForm = document.getElementById('messageForm');
    const userinput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const messageContainer = document.getElementById('messageContainer');

})
document.addEventListener('DOMContentLoaded', () => {
            
            const messageForm = document.getElementById('messageForm');
            const userInput = document.getElementById('userInput');
            const chatMessages = document.getElementById('chatMessages');
            const loadingIndicator = document.getElementById('loadingIndicator');

           
            if (messageForm) {
                messageForm.addEventListener('submit', async (event) => {
                    event.preventDefault(); 

                    const userQuestion = userInput.value.trim();
                    if (userQuestion === '') {
                        
                        return;
                    }

                    
                    addMessageToChat(userQuestion, 'user');
                    userInput.value = ''; 
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    loadingIndicator.style.display = 'block'; 

                    try {
                        
                        const response = await fetch('/chat', { 
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json' 
                            },
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
                });
            }

            
            function addMessageToChat(text, sender) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message', sender); 
                messageElement.textContent = text;
                chatMessages.appendChild(messageElement);
            }
        });