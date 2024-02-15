import { atom } from "recoil";

export const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: { setSelf: Function; onSet: Function }) => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem(key);
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue: any, _: any, isReset: any) => {
        isReset
          ? localStorage.removeItem(key)
          : localStorage.setItem(key, JSON.stringify(newValue));
      });
    }
  };

export const userAtom = atom({
  key: "userState",
  default: {
    email: "",
    name: "",
    id: "",
    accessToken: "",
  },
  effects: [localStorageEffect("userDetails")],
});
