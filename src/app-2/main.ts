import "./style.css";
import { setup as buttonSetup } from "./button";
import { setup as displaySetup } from "./display";
import { DefaultCache } from "~/core/default-cache";

const cache = new DefaultCache('app-1');


const element1 = document.createElement("div");
element1.innerHTML = `  
    <div class="card">
      <div id="app-2-counter1"></div>
    </div>
`;

document.body.querySelector('#app-2')?.appendChild(element1);

displaySetup(element1.querySelector<HTMLButtonElement>("#app-2-counter1")!, cache);

const element2 = document.createElement("div");
element2.innerHTML = `
    <div class="card">
      <button id="app-2-counter2" type="button"></button>
    </div>
`;

document.body.querySelector('#app-2')?.appendChild(element2);

buttonSetup(element2.querySelector<HTMLButtonElement>("#app-2-counter2")!, cache);
