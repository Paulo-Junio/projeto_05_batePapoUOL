let usuario;
let idInterval;
let idItervalUpload;
let numeroDeMensagens=0;
let cont=1;

function entrarNaSala () {
    console.log("entrarNaSala ()");
    usuario= prompt ("Qual o seu nome?");
    let loginUsuario = {
        name:usuario
    }
    let respostaLogin= axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ",loginUsuario)
    console.log(loginUsuario)
    respostaLogin.then(manterConexao)
    respostaLogin.catch(atualizarPagina)
    idInterval = setInterval(manterConexao, 5000)
    setInterval(carregarMensagem, 3000)
    
}

function manterConexao() {
    console.log("manterConexao()");
    let statusConexao = {
        name: usuario
    };
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", statusConexao);
    if (cont === 1) {
        carregarMensagem()
        cont++
    }
}

function atualizarPagina (respose){
    window.location.reload()
}

function carregarMensagem() {
    const buscarMensagens = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    buscarMensagens.then(imprimirMensagens)
}

function imprimirMensagens(resposta) {
    let quantidadeMensagens = resposta.data.length;
    console.log(quantidadeMensagens)
    console.log("numero")
    console.log(numeroDeMensagens)
    let mensagensRecuperadas = resposta.data;
    for (let i=(quantidadeMensagens-20); i<quantidadeMensagens; i++){
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
    const elementoQueAparece = document.querySelector(".mensagens").lastElementChild;
    elementoQueAparece.scrollIntoView()
    numeroDeMensagens = quantidadeMensagens;
}

function enviarMengagem() {
    let mensagem =document.querySelector(".enviar-mensagem input").value;
    console.log(mensagem)
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