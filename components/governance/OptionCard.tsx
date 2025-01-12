import styles from "../../styles/optionCard.module.scss";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import cardano from "../../public/images/crypto/Cardano.svg";
import cardanoBlack from "../../public/images/crypto/CardanoBlack.svg";
import { AppContext } from "../../pages/_app";

interface OptionCardProps {
  title: string;
  description: string;
  walletName: string;
  walletAddress: string;
  votes: string;
  loading: boolean;
}

const OptionCard = (props: OptionCardProps) => {
  const appContext = useContext(AppContext);
  const { state } = appContext ?? { state: null };
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    setCopied(true);
  };

  useEffect(() => {
    const copyToClipboard = (str: string) => {
      navigator.clipboard.writeText(str);
    };

    if (copied) {
      copyToClipboard(props.walletAddress);
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [copied, props.walletAddress]);

  return (
    <div className={styles.card}>
      <h2>{props.title}</h2>
      <p className={styles.description}>{props.description}</p>
      <Image
        src={state?.darkMode ? cardano : cardanoBlack}
        className={styles.walletLogo}
        alt={`${props.walletName} logo`}
        width={120}
        height={30}
      />
      <p className={styles.walletName}>{props.walletName}</p>
      <div className={styles.address} onClick={handleCopyClick}>
        <p className={styles.addressText}>{props.walletAddress}</p>
        {
          copied &&  <p className={styles.addressCopyText}>Copied!</p>
        }
        <button
          className={styles.addressCopyBtn}
          disabled={copied}
        >
          { state?.darkMode ? (
            <Image
              src="/images/icons/copy-dark.png"
              width={14}
              height={14}
              alt="copy"
              className={styles.icon}
            />
          ) : (
            <Image
              src="/images/icons/copy-light.png"
              width={14}
              height={14}
              alt="copy"
              className={styles.icon}
            />
          )}
        </button>
      </div>
      <div className={styles.votes}>
        <p>Current Votes:</p>
        {props.loading ? <span className={styles.loader}></span> : <p>{props.votes}</p>}
      </div>
    </div>
  );
};

export default OptionCard;