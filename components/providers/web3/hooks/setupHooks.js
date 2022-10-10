import { handler as createUseAccount } from "./useAccount";

export const setupHooks = (...args) => {
  return {
    useAccount: createUseAccount(...args),
  };
};
