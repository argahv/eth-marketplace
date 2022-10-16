import { useEffect } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0x9592e0542d333c1ef12ee170a0b6f0d9598e614cfe67685fb45952f9a18349f7": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      if (!account) {
        throw new Error(
          "Cannot retreive an account. Please refresh the browser."
        );
      }

      return account;
    }
  );

  useEffect(() => {
    const mutator = (accounts) => mutate(accounts[0] ?? null);
    provider?.on("accountsChanged", mutator);

    return () => {
      provider?.removeListener("accountsChanged", mutator);
    };
  }, [provider]);

  return {
    data,
    isAdmin: true,
    // isAdmin: (data && adminAddresses[web3.utils.keccak256(data)]) ?? false,

    mutate,
    ...rest,
  };
};
