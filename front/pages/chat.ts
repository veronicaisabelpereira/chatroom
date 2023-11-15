import { state } from "../state";
type Message = {
  fullName: String;
  message: String;
};
class Chat extends HTMLElement {
  fullName: String;
  message: String;
  room: String;
  connectedCallback() {
    //se subscribe al estado
    state.subscribe(() => {
      const cs = state.getState();
      //toma del cs los msjs y el roomId
      this.messages = cs.messages;
      this.room = cs.roomId;
      console.log(this.messages);
      console.log("room id:", cs.roomId);
      //renderiza componente ya con estos datos
      this.render();
    });
    this.render();
  }
  //Escucha el submit
  addListeners() {
    const form = this.querySelector(".submit-message");
    form!.addEventListener("submit", (e) => {
      e.preventDefault();
      //toma la info ingresada en el campo para escribir
      //La carga al state mediante los metodos setMessage y pushMessage
      const target = e.target as any;
      const message = target["new-message"].value;
      state.setMessage(message);
      state.pushMessage(message);
    });
    //Funcion para scrolear
    const messagesContainer = this.querySelector(".messages__container");
    function scrollToBottom() {
      messagesContainer!.scrollTop = messagesContainer!.scrollHeight;
    }
    scrollToBottom();
  }
  //
  //Inicializa messages un objeto del tipo Message vacio
  messages: Message[] = [];
  //Funcion que dibuja el componenente
  render() {
    const cs = state.getState();
    this.innerHTML = `
    <div class="chat-container">
    <div class="chat-card">
    <h1>Chat</h1>
    <h2>Room: ${this.room}</h2>
    <div class="messages__container">
    ${this.messages
      .map((m) => {
        return `
        <label class="message-label">${
          m.fullName == cs.fullName ? "" : m.fullName
        }</label>
        <div class= "${
          m.fullName == cs.fullName ? "box sent" : "box received"
        }">${m.message}</div>`;
      })
      .join("")}
      </div>
      <form class="submit-message">
      <input class="chat-input"type="text" name="new-message"></input>
      <button class="send-button">Enviar</button> 
      </form>
      </div>
    </div>
         `;
    const style = document.createElement("style");
    style.innerHTML = `
        .chat-container{
          font-family:'Roboto';
          display:grid;
          justify-content:center;
          height:100vh;
          align-content:center;
        }
        .chat-card{
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            gap:15px;
            width:85vw;
            background-color:white;
            padding:20px;
            border-radius: 30px;
            box-sizing: border-box;
          }
          
          @media(min-width:960px){
            .chat-card{
            width:65vw;
          }
        }
        .messages__container{
            padding:10px;
            background-color: #938274;
            min-width:100%;
            height:50vh;
            overflow-x:hidden;
            overflow-y:auto;
            display:flex;
            flex-direction:column;
            gap:3px;
        }
        .message-label{
            color:white;
        }
        .box{ 
            max-width:160px;
            border-radius:6px;
            padding:15px;
            word-wrap: break-word;
             max-width: 30vw;
        }
        .box.received{
            background-color: red;
            color:white;
          }
          .box.sent{
            margin-left: auto;
            background-color: green;
            color:white;
        }
        .submit-message{
            display:flex;
            flex-direction:column;
        }
        .chat-input{
          border-radius:1px;
          padding:10px;
        }
        .send-button{
            font-weight:500;
            font-family:'Roboto';
            appearance: button;
            border-radius: 1px;
            border-width: 0;
            padding: 0 25px;
            font-size: 100%;
            background-color:red;
            color:white;
            box-sizing: border-box;
            margin: 12px 0 0;
            padding:10px;
            text-align: center;
            transition: all .2s,box-shadow .08s ease-in;
        }
        `;
    this.appendChild(style);
    this.addListeners();
  }
}
customElements.define("chat-page", Chat);
