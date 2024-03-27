import styles from "../../styles/governance.module.scss";
import Image from "next/image";
import Head from "next/head";
import tosidropLogo from "../../public/images/crypto/tosidrop-logo.png";
import Link from "next/link";
import OptionCard from "../../components/governance/OptionCard";
import { useEffect, useState } from "react";

export default function Governance() {

  const walletVote1 = "addr1qx5c5ydtw2xrmwj6tqj3s4yd9sck5rgcr5d22haa9jq6j2crcz99ppc0fld4m03rhm3s23v3f0nhayjpd5yu6qfu0zvsp64vph";

  const walletVote2 = "addr1qysdt8l9unds43hcuvx8e73t05lvs27djktjed8lcj9d4fqx78z7ek4j8v2v9sczcjvw80mh3wmk82ygnlp9xww2gscq38s4jp";



  const policyIdAssetCVote ="be1384bed273634e3861b715ec7004ce2fd8f0a2a2b1cc6a68d76f1663564f544536";

  interface TokenAssets {
    unit: string,
    quantity: string
  }

  const [wallet1Data, setWallet1Data] = useState<TokenAssets>();
  const [wallet2Data, setWallet2Data] = useState<TokenAssets>();
  const [loadingWallet1, setLoadingWallet1] = useState<boolean>(true);
  const [loadingWallet2, setLoadingWallet2] = useState<boolean>(true);

  useEffect(() => {

    const fetchWalletData = async () => {
      try {
        const res1 = await fetch(`/api/governance/${walletVote1}`);
        const data1 = await res1.json();
        const tokens1 = data1.received_sum;
        const amount1 = tokens1.find((token: TokenAssets) => token.unit === policyIdAssetCVote);
        console.log(amount1)
        setWallet1Data(amount1);
        setLoadingWallet1(false);

        const res2 = await fetch(`/api/governance/${walletVote2}`);
        const data2 = await res2.json();
        const tokens2 = data2.received_sum;
        const amount2 = tokens2.find((token: TokenAssets) => token.unit === policyIdAssetCVote);
        setWallet2Data(amount2);
        setLoadingWallet2(false);
      }catch (error) {
        console.error("An error occurred while fetching wallet data:", error);
        setLoadingWallet1(true);
        setLoadingWallet2(true);
      }
    }

    fetchWalletData();

  }, []);

  return (
    <>
      <Head>
        <title>Governance | anetaBTC</title>
      </Head>
      <main className={styles.governance}>
        <p className={styles.text}>
          Send your cVOTE6 tokens to the wallet you would like to vote for. At
          the end of the 48-hour voting period, the option with the most votes
          will be the outcome of the governance event.
        </p>
        <OptionCard
          title="Option 1"
          description="Allocate 0.5 BTC for development."
          walletName="Option 1 Cardano Wallet"
          walletAddress= { walletVote1 }
          votes={wallet1Data?.quantity === undefined ? "0" : Intl.NumberFormat("en").format(Number(wallet1Data?.quantity))}
          loading= { loadingWallet1 }
        />
        <OptionCard
          title="Option 2"
          description="Do not allocate 0.5 BTC for development."
          walletName="Option 2 Cardano Wallet"
          walletAddress= { walletVote2 }
          votes={wallet2Data?.quantity === undefined ? "0" : Intl.NumberFormat("en").format(Number(wallet2Data?.quantity))}
          loading= { loadingWallet2 }
        />
        <Link
          href="https://app.tosidrop.io/cardano/claim"
          target="_blank"
          className={styles.button}
        >
          Claim cVOTE6 tokens on{" "}
          <Image
            src={tosidropLogo}
            alt="tosidrop logo"
            width={120}
            height={36}
            className={styles.tosidropLogo}
          />{" "}
          <svg width="25" height="25" id="">
            <use href={"/images/icons/right-arrow.svg#icon"}></use>
          </svg>
        </Link>
      </main>
    </>
  );
}