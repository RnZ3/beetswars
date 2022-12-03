import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGlobalContext } from "contexts/GlobalContext";
import { getVotingPower } from "hooks/voteSnapshot";

let votingPower: any = "Z";

export const MyButton = () => {
  const [displayVp, setDisplayVp] = useState("");
  const { gProposal } = useGlobalContext();
  const account = useAccount();

  async function blub() {
    if (account.address && gProposal) {
      console.log(account.address, gProposal);
      votingPower = "X";
      votingPower = await getVotingPower(gProposal, account.address);
      setDisplayVp(
        (votingPower / 1000).toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1,
        }) + " k"
      );
    }
    console.log("VP:", votingPower, displayVp);
  }

  useEffect(() => {
    console.log("blub");
    blub();
  }, [account.address, gProposal, votingPower]);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {" | VP: "}
                    {displayVp}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
