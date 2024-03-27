import { Cip30Wallet } from "@cardano-sdk/dapp-connector";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { GlobalContext } from "../components/GlobalContext";
import { doesAddressMatchNetwork, shortenAddress } from "../utils/address";
import { CONSTANTS } from "../utils/constants";
import { useTryCatch } from "./useTryCatch";

export default function useCardanoWallet() {
  const globalContext = useContext(GlobalContext);
  const { tryWithErrorHandler } = useTryCatch();
  const hasFetchedAddress = useRef(false);

  const updateWalletAddress = useCallback(async () => {
    const { walletApi, lucid, config } = globalContext;
    if (walletApi && lucid && !hasFetchedAddress.current) {
      try {
        lucid.selectWallet(walletApi as any);
        const address = await lucid.wallet.address();
        globalContext.setAddress(address);
        globalContext.setWalletAddress(
          doesAddressMatchNetwork(address, config.network)
            ? shortenAddress(address)
            : CONSTANTS.STRINGS.wrong_network
        );
        hasFetchedAddress.current = true;
      } catch (err) {
        console.error("Error fetching wallet address:", err);
      }
      
    }
  }, [globalContext]);

  useEffect(() => {
    updateWalletAddress();
  }, [updateWalletAddress]);

  async function connectWallet(cardanoWalletName: string) {
    await tryWithErrorHandler(async () => {
      if (!window.cardano) {
        throw new Error(CONSTANTS.STRINGS.no_cardano_wallet);
      }

      const cardanoWallet = window.cardano[
        cardanoWalletName.toLowerCase()
      ] as unknown as Cip30Wallet;
      const walletApi = await cardanoWallet.enable();
      globalContext.setWalletMeta(cardanoWallet);
      globalContext.setWalletApi(walletApi);
      localStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.WALLET,
        cardanoWalletName
      );
    });
  }

  async function disconnectWallet() {
    globalContext.setWalletMeta(null);
    globalContext.setWalletApi(null);
    globalContext.setAddress("");
    globalContext.setWalletAddress(CONSTANTS.STRINGS.wallet_connecting);
    localStorage.removeItem(CONSTANTS.LOCAL_STORAGE_KEYS.WALLET);
  }

  return {
    connectWallet,
    disconnectWallet,
    walletApi: globalContext.walletApi,
    walletMeta: globalContext.walletMeta,
    walletAddress: globalContext.walletAddress,
    address: globalContext.address,
  };
}
