import { Cache } from "~/core/cache";

export function setup(element: HTMLButtonElement, cache: Cache) {
  element.innerHTML = 'Click me!';
  element.addEventListener("click", async () => {
    await fetch("http://localhost:3000/watchers", { method: "POST" });
    cache.invalidate(['watchers']);
  });
}
