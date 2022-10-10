import { createContext, useContext, useEffect, useMemo, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { setupHooks } from "./hooks/setupHooks";

const Web3Context = createContext(null);

export default function Web3Provider({ children }) {
  const [web3Api, setWeb3Api] = useState({
    web3: null,
    provider: null,
    contract: null,
    isLoading: true,
  });

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        const web3 = new Web3(provider);

        setWeb3Api({
          web3,
          provider,
          isLoading: false,
          contract: null,
        });
      } else {
        setWeb3Api((prev) => ({
          ...prev,
          isLoading: false,
        }));

        console.log("Please install MetaMask!");
      }
    };
    loadProvider();
  }, []);

  const _web3Api = useMemo(() => {
    const { web3, provider } = web3Api;
    return {
      ...web3Api,
      isWeb3Loaded: web3 !== null,
      getHooks: () => setupHooks(web3, provider),
      connect: provider
        ? async () => {
            try {
              await provider.request({ method: "eth_requestAccounts" });
            } catch (error) {
              console.error(error);
              location.reload();
            }
          }
        : () =>
            console.log("Cannot connect to MetaMask, please install it first."),
    };
  }, [web3Api]);

  return (
    <Web3Context.Provider value={_web3Api}>{children}</Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

export function useHooks(callback) {
  const { getHooks } = useWeb3();

  return callback(getHooks());
}
