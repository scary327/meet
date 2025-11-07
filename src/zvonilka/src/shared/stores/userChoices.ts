import { proxy, subscribe } from "valtio";
import {
  loadUserChoices,
  saveUserChoices,
  type LocalUserChoices as LocalUserChoicesLK,
} from "@livekit/components-core";

export type LocalUserChoices = LocalUserChoicesLK;

function getUserChoicesState(): LocalUserChoices {
  return {
    ...loadUserChoices(),
    username: localStorage.getItem("username") || "",
  };
}

export const userChoicesStore = proxy<LocalUserChoices>(getUserChoicesState());

subscribe(userChoicesStore, () => {
  saveUserChoices(userChoicesStore, false);
});
