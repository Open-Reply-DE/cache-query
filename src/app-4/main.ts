import "./style.css";
import { setup as subscribersSetup } from "./subscribers";
import { setup as watchersSetup } from "./watchers";

const element1 = document.createElement("div");
element1.innerHTML = `  
    <div class="card">
      <button id="app-4-subscribers1" type="button"></button>
    </div>
`;

document.body.querySelector('#app-4')?.appendChild(element1);

subscribersSetup(element1.querySelector<HTMLButtonElement>("#app-4-subscribers1")!);

const element3 = document.createElement("div");
element3.innerHTML = `
    <div class="card">
      <button id="app-4-watchers1" type="button"></button>
    </div>
`;

document.body.querySelector('#app-4')?.appendChild(element3);

watchersSetup(element3.querySelector<HTMLButtonElement>("#app-4-watchers1")!);
