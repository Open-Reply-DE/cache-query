import "./style.css";
import { setup as subscribersSetup } from "./subscribers";
import { setup as watchersSetup } from "./watchers";

const element1 = document.createElement("div");
element1.innerHTML = `  
    <div class="card">
      <button id="app-1-subscribers1" type="button"></button>
    </div>
`;

document.body.querySelector('#app-1')?.appendChild(element1);

subscribersSetup(element1.querySelector<HTMLButtonElement>("#app-1-subscribers1")!);

const element2 = document.createElement("div");
element2.innerHTML = `
    <div class="card">
      <button id="app-1-subscribers2" type="button"></button>
    </div>
`;

document.body.querySelector('#app-1')?.appendChild(element2);

subscribersSetup(element2.querySelector<HTMLButtonElement>("#app-1-subscribers2")!);

const element3 = document.createElement("div");
element3.innerHTML = `
    <div class="card">
      <button id="app-1-watchers1" type="button"></button>
    </div>
`;

document.body.querySelector('#app-1')?.appendChild(element3);

watchersSetup(element3.querySelector<HTMLButtonElement>("#app-1-watchers1")!);
