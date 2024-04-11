import useQuery from "~/core/use-query";
import { DefaultCacheSync } from "~/core/default-cache-sync";
import { Cache } from "~/core/cache";

const cacheSync = new DefaultCacheSync('app-3');

const query = async (): Promise<string> => {
  const result = await fetch("http://localhost:3000/watchers");

  return await result.text();
};

export function setup(element: HTMLButtonElement, cache: Cache) {
  useQuery(["watchers"], query, {
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
    debug: 'app-3',
    scope: "global",
    refetchOnWindowFocus: true,
  }, cache, cacheSync);
}
