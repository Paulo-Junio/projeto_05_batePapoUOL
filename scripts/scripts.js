let usuario;
let idInterval;
let idItervalUpload;
let numeroDeMensagens=0;
let cont=1;

function entrarNaSala () {
    usuario= prompt ("Qual o seu nome?");
    let loginUsuario = {
        name:usuario
    }
    let respostaLogin= axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ",loginUsuario)
    respostaLogin.then(manterConexao)
    respostaLogin.catch(atualizarPagina)
    idInterval = setInterval(manterConexao, 5000)
    let idItervalUpload = setInterval(carregarMensagem, 3000)
    
}

function manterConexao() {
    let statusConexao = {
        name: usuario
    };
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", statusConexao);
    if (cont === 1) {
        carregarMensagem()
        cont++
    }
}

function atualizarPagina (){
    clearInterval(idInterval)
    clearInterval(idItervalUpload)
    window.location.reload()
}

function carregarMensagem() {
    const buscarMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    buscarMensagens.then(imprimirMensagens)
}

function imprimirMensagens(resposta) {
    let quantidadeMensagens = resposta.data.length;
    let mensagensRecuperadas = resposta.data;
    let chat= document.querySelector(".mensagens");
    chat.innerHTML = ""
    for (let i=(quantidadeMensagens-50); i<quantidadeMensagens; i++){
        const privacidadeMensagem =mensagensRecuperadas[i].type;
        if (privacidadeMensagem === "status") {
            chat.innerHTML += `<div class="box-mensagem status-chat">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
        else if (privacidadeMensagem === "message") {
            chat.innerHTML += `<div class="box-mensagem mensagem-todos">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> para <strong>${mensagensRecuperadas[i].to}</strong>: ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
        else if (privacidadeMensagem === "private_message" && ((mensagensRecuperadas[i].to)===usuario)) {
            chat.innerHTML += `<div class="box-mensagem mensagem-privada">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> reservadamente para <strong>${mensagensRecuperadas[i].to}</strong>: ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
    }
    const elementoQueAparece = document.querySelector(".mensagens").lastElementChild;
    elementoQueAparece.scrollIntoView()
    numeroDeMensagens = quantidadeMensagens;
}

function enviarMengagem() {
    let mensagem =document.querySelector(".enviar-mensagem input").value;
    let criarMensagem = {
        from: usuario,
        to: "Todos",
        text: mensagem,
        type: "message"
    }
    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", criarMensagem)
    document.querySelector(".enviar-mensagem input").value="";
}

entrarNaSala()