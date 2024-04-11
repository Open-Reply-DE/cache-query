import { KeyHash } from "~/core/key-hash";

export class DefaultKeyHash implements KeyHash {
  hash(keys: string[]) {
    return keys.join(".");
  }
}
