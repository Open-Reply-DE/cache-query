import "./style.css";
import { setup as buttonSetup } from "./button";
import { setup as displaySetup } from "./display";
import { DefaultCache } from "~/core/default-cache";

const cache = new DefaultCache('app-3');


const element1 = document.createElement("div");
element1.innerHTML = `  
    <div class="card">
      <div id="app-3-subscribers1"></div>
    </div>
`;

document.body.querySelector('#app-3')?.appendChild(element1);

displaySetup(element1.querySelector<HTMLButtonElement>("#app-3-subscribers1")!, cache);

const element2 = document.createElement("div");
element2.innerHTML = `
    <div class="card">
      <button id="app-3-subscribers2" type="button"></button>
    </div>
`;

document.body.querySelector('#app-3')?.appendChild(element2);

buttonSetup(element2.querySelector<HTMLButtonElement>("#app-3-subscribers2")!, cache);
