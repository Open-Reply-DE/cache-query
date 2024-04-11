import useQuery from "~/core/use-query";
import { DefaultCache } from "~/core/default-cache";
import { DefaultCacheSync } from "~/core/default-cache-sync";

const cache = new DefaultCache('app-2');
const cacheSync = new DefaultCacheSync('app-2');
const query = async (): Promise<string> => {
  const result = await fetch("http://localhost:3000/subscribers");

  return await result.text();
};

const mutate = async (): Promise<string> => {
  const result = await fetch("http://localhost:3000/subscribers", { method: "POST" });

  return await result.text();
};

export function setup(element: HTMLButtonElement) {
  const { invalidate } = useQuery(["subscribers"], query, {
    onSuccess: async (result) => {
      element.innerHTML = result;
    },
    onLoading: async (loading) => {
      if (loading) element.innerHTML = "loading...";
    },
    onFetching: async (fetching) => {
      if (fetching) element.classList.add("button--loading");
      else element.classList.remove("button--loading");
    },
    onError: async (error) => {
      element.innerHTML = `${error}`;
    },
    debug: 'app-1',
    staleTime: 1000,
  }, cache, cacheSync);


  element.addEventListener("click", async () => {
    await mutate();
    // you would write this:
    // run();
    // but now you can write this:
    invalidate();
  });
}
