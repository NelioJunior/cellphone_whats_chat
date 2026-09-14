const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const inputInitHeight = chatInput.scrollHeight;
const entity = window.location.pathname.split('/').pop().replace("lista", "").replace(".php", "") ;
const warning = "Me desculpa,nao entendi...";
const pageTitle = document.querySelectorAll('title')[document.querySelectorAll('title').length  - 1];

let avatar = "brunetteHair";
let userPhone = "";

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);

    let chatContent = "<p></p>";
    
    if (className === "incoming" && pageTitle.innerText !== "Agendamento") {
        chatContent = `<img src="./img/${avatar}.png" class="profile-image"><p></p>`
    }  

    chatLi.innerHTML = chatContent;

    if (message === "image"){
        chatLi.querySelector("p").innerHTML = "<div class='thinking-div'><img src='./img/typing.gif' class='thinking-image'></div>";
    } else {
        chatLi.querySelector("p").textContent = message;
    }
    return chatLi;
}

function callCustomerServiceApi(chatbox) {
    const urlApi = "https://ia-apis-unique-salao-70537013131.us-east1.run.app/whatsapp";
    const outgoing_lst = chatbox.querySelectorAll(".outgoing");
    const msg = outgoing_lst[outgoing_lst.length - 1]?.innerText;

    userPhone = localStorage.getItem('userPhone');

    // Se não existe no localStorage ou está vazio
    if (!userPhone || userPhone === "") {
        userPhone = prompt("Digite seu número de telefone (ex: 11999887766):");

        // Se o usuário cancelou o prompt ou deixou vazio
        if (!userPhone || userPhone.trim() === "") {
            chatReplay("Número de telefone é obrigatório para continuar.");
            return; // Sai da função sem fazer a requisição
        }

        // Remove espaços e caracteres especiais, mantém apenas números
        userPhone = userPhone.trim().replace(/\D/g, '');

        // Se não começar com 55 (código do Brasil), adiciona automaticamente
        if (!userPhone.startsWith('55')) {
            // Validação básica do número brasileiro (10 ou 11 dígitos)
            if (userPhone.length < 10 || userPhone.length > 11) {
                chatReplay("Número de telefone inválido. Digite apenas os números (10 ou 11 dígitos).");
                return;
            }

            // Validação adicional para celular brasileiro (deve começar com 9 se for 11 dígitos)
            if (userPhone.length === 11 && userPhone[2] !== '9') {
                chatReplay("Número de celular inválido. O terceiro dígito deve ser 9.");
                return;
            }

            // Adiciona o código do país brasileiro
            userPhone = '55' + userPhone;
        } else {
            // Se já tem 55, valida se o restante está correto (12 ou 13 dígitos total)
            if (userPhone.length < 12 || userPhone.length > 13) {
                chatReplay("Número de telefone inválido com código do país.");
                return;
            }

            // Valida se após o 55, tem um número válido brasileiro
            const numeroSem55 = userPhone.substring(2);
            if (numeroSem55.length === 11 && numeroSem55[2] !== '9') {
                chatReplay("Número de celular inválido. O terceiro dígito após o DDD deve ser 9.");
                return;
            }
        }

        // Salva no localStorage para próximas vezes
        localStorage.setItem('userPhone', userPhone);
    } else {
        // Valida o número salvo também
        userPhone = userPhone.replace(/\D/g, '');

        // Se não tem código do país, adiciona
        if (!userPhone.startsWith('55')) {
            if (userPhone.length >= 10 && userPhone.length <= 11) {
                userPhone = '55' + userPhone;
                localStorage.setItem('userPhone', userPhone); // Atualiza no localStorage
            } else {
                // Se o número salvo é inválido, remove e pede novamente
                localStorage.removeItem('userPhone');
                chatReplay("Número salvo é inválido. Digite novamente.");
                return;
            }
        }
    }

    fetch(urlApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Formato esperado pelo PHP
        },
        body: new URLSearchParams({
            Body: msg,
            From: userPhone,
        }).toString()

    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.text(); 
    })
    .then(responseText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseText, "application/xml");
        const message = xmlDoc.getElementsByTagName("Message")[0]?.textContent || "Resposta não encontrada";

        chatReplay(message)
    })
    .catch(error => {
        chatReplay( "Ocorreu um erro ao processar sua mensagem.");
    });
}

function chatReplay(message) {
    const incoming_lst = chatbox.querySelectorAll(".chat.incoming");
    const last_bot_message = incoming_lst[incoming_lst.length - 1]?.querySelector('p');
    if (last_bot_message) {
        last_bot_message.innerText = message;
    }        
}

function callBiApi (chatbox) {
    const urlApi = "../model/ai4bi_redirected.php";
    const outgoing_lst = chatbox.querySelectorAll(".outgoing");
    const last_user_msg = outgoing_lst[outgoing_lst.length-1].innerText;

    fetch(urlApi, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            question: last_user_msg,
        }),
    })
    .then(response => response.json())
    .then(result => {
        incoming_lst = chatbox.querySelectorAll(".chat.incoming");
        last_bot_message = incoming_lst[incoming_lst.length-1].querySelector('p');
        last_bot_message.innerText = result['answer']
    })
    .catch(error => {
        incoming_lst = chatbox.querySelectorAll(".chat.incoming");
        last_bot_message = incoming_lst[incoming_lst.length-1].querySelector('p');
        last_bot_message.innerText = warning
    });

}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.overflowY = 'hidden';

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("image", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        if (pageTitle.innerText == "Agendamento") {
            callCustomerServiceApi(chatbox);            
        } else {
            callBiApi (chatbox)  
        }
        
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    setTimeout(() => {
         window.history.back();
    }, 2000);
});

document.addEventListener("DOMContentLoaded", function() {
    var strURL = "./jsonFiles/configuracao.json?" + (new Date()).getTime();

    fetch(strURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            var avatar = json.avatar;

            if (pageTitle.innerText == "Agendamento") {
                var imagem = document.querySelector('.chat-avatar');

                if (imagem) {
                    imagem.src = './img/' + avatar + '.png';
                }
            }
        })
        .catch(function(error) {
            console.error("Erro ao carregar configuracao.json:", error);
        });
});