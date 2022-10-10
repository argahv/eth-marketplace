import { useEffect, useState } from "react";
import useSWR from "swr";

const adminAddresses = {
  "0xa922630B8DBdA6668bFF62bD0868c2187EFBfE37": true,
};

export const handler = (web3, provider) => () => {
  const { data, mutate, ...rest } = useSWR(
    () => (web3 ? "web3/accounts" : null),
    async () => {
      const accounts = await web3.eth.getAccounts();
      return accounts[0];
    }
  );

  useEffect(() => {
    provider &&
      provider.on("accountsChanged", (accounts) => mutate(accounts[0] ?? null));
  }, [provider]);

  return {
    account: {
      isAdmin: (data && adminAddresses[data]) ?? false,
      mutate,
      data,
      ...rest,
    },
  };
};
