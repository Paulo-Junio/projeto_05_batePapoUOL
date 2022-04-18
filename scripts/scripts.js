let usuario;
let idInterval;
let numeroDeMensagens=0;

function entrarNaSala () {
    console.log("entrarNaSala ()");
    usuario= prompt ("Qual o seu nome?");
    let loginUsuario = {
        name:usuario
    }
    let respostaLogin= axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ",loginUsuario)
    console.log(loginUsuario)
    respostaLogin.then(manterConexao)
    respostaLogin.catch(entrarNaSala)
    
}

function manterConexao() {
    console.log("manterConexao()");
    let statusConexao = {
        name: usuario
    };
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", statusConexao);
    carregarMensagem()

}

function carregarMensagem() {
    const buscarMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    buscarMensagens.then(renderizarMensagens)
}

function atualizarmensagens(resposta) {
    let response = resposta;
    imprimirMensagens(response)
}

function renderizarMensagens(resposta) {
    let response = resposta;
    imprimirMensagens(response)
    setInterval(uploadNovasMensagens,3000)
}

function uploadNovasMensagens() {
    const buscarMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    buscarMensagens.then(atualizarmensagens);
}

function imprimirMensagens(resposta) {
    let quantidadeMensagens = resposta.data.length;
    console.log(quantidadeMensagens)
    let mensagensRecuperadas = resposta.data;
    for (let i=numeroDeMensagens; i<quantidadeMensagens; i++){
        console.log("renderizarMensagens(for)");
        const privacidadeMensagem =mensagensRecuperadas[i].type;
        let chat= document.querySelector(".mensagens");
        chat.scrollIntoView();
        if (privacidadeMensagem === "status") {
            console.log("renderizarMensagens(if)");
            chat.innerHTML += `<div class="box-mensagem status-chat">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
        else if (privacidadeMensagem === "message") {
            console.log("renderizarMensagens(else if 1)");
            chat.innerHTML += `<div class="box-mensagem mensagem-todos">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> para <strong>${mensagensRecuperadas[i].to}</strong>: ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
        else if (privacidadeMensagem === "private_message" && ((mensagensRecuperadas[i].to)===usuario)) {
            console.log("renderizarMensagens(else if 2)");
            chat.innerHTML += `<div class="box-mensagem mensagem-privada">
            <span>(${mensagensRecuperadas[i].time})</span>
            <span><strong>${mensagensRecuperadas[i].from}</strong> reservadamente para <strong>${mensagensRecuperadas[i].to}</strong>: ${mensagensRecuperadas[i].text}</span>
            </div>`
        }
    }
    numeroDeMensagens = quantidadeMensagens;
}

function enviarMengagem() {
    let mensagem =document.querySelector(".enviar-mensagem input").innerHTML;
    console.log(mensagem)
    let criarMensagem = {
        from: usuario,
        to: "Todos",
        text: mensagem,
        type: "message"
    }

    axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", criarMensagem)
}

entrarNaSala()