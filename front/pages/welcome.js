import { Router } from "@vaadin/router";
import { state } from "../state";
class Home extends HTMLElement {
    connectedCallback() {
        console.log(state.data);
        const cs = state.getState();
        if (cs.rtdbRoomId && cs.userId) {
            state.accessToRoom();
            Router.go("/chatroom");
        }
        this.render();
        const selection = this.querySelector(".selection");
        selection.addEventListener("change", (e) => {
            const roomIdEl = document.getElementById("room-id__container");
            const targetSel = e.target;
            if (targetSel.value == "new-room") {
                roomIdEl.style.display = "none";
            }
            if (targetSel.value == "existant-room") {
                roomIdEl.style.display = "block";
            }
        });
        const form = this.querySelector(".form");
        form.addEventListener("submit", (e) => {
            const data = state.getState();
            e.preventDefault();
            const target = e.target;
            state.setEmailAndFullname(target["email-input"].value, target["name-input"].value);
            state.signIn((err) => {
                if (err)
                    console.error("hubo un error en el signIn");
                console.log(target["room-id"].value);
                if (target["room-id"].value) {
                    state.setRoomId(target["room-id"].value);
                    state.accessToRoom();
                }
                else {
                    state.askNewRoom(() => {
                        state.accessToRoom();
                    });
                }
            });
            Router.go("/chatroom");
        });
    }
    render() {
        this.innerHTML = `
        <div class="home__container container">
        <form class="form" id="form">
        <h1>Bienvenidxs!</h1>
        <div>
        <label class="label-input">Tu email</label>
        <input  class="input-box" type="email" name="email-input"></input>
        </div>
        <div>
        <label class="label-input">Tu nombre</label>
        <input  class="input-box" type="text" name="name-input"></input>
        </div>
        <div>
        <label class="label-input">Room</label>
        <select id="room-selection" form="form" class="selection">
        <option value="new-room">Nuevo Room</option>
        <option value="existant-room">Room existente</option>
        </select>
        </div>
        <div id="room-id__container">
        <label class="label-input">Room Id</label>
        <input  class="input-box" type="text" name="room-id"></input>
        </div>
        <button class="submit-button">Comenzar</button> 
        </form>
        </div>
        `;
        const style = document.createElement("style");
        style.innerHTML = `
      
        .home__container{
          
          
          }
          .form{
            width:65vw;
            background-color:white;
            padding:20px;
            border-radius: 30px;
            box-sizing: border-box;
        }

        input{
          transition-delay:9999s;
          transition-property:background;
        }
        .label-input{
          display:block;
          padding: 5px 5px 5px 15px;
          transform-origin: left center;
        }

        .input-box{
          width:100%;
          padding:10px 15px;
          border-radius: 1px;
          box-sizing: border-box;
          border: 1px solid ;
        }
        .selection{
          padding:10px 15px;
          width:100px;
          border-radius: 1px;
          box-sizing: border-box;
          border: 1px solid ;
     
        }
        .submit-button{
            border-radius: 1px;
            height:30px;
            border-style:none;
            background-color:red;
            border-radius: 1px;
            box-sizing: border-box;
            color:white;
            margin-top: 15px
        }
        #room-id__container{
            display:none;
        }
        `;
        this.appendChild(style);
    }
}
customElements.define("home-page", Home);
/*
  .form{
            position:relative;
            top:50%;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            gap:15px;
            width:65vw;
            background-color:white;
            padding:20px;
            border-radius: 30px;
            box-sizing: border-box;
        }
 */
