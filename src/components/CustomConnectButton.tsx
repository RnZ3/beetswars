import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGlobalContext } from "contexts/GlobalContext";
import { getVotingPower } from "hooks/voteSnapshot";
import { vpDisplayFormat } from "utils/vpDisplayFormat";

let votingPower: any = "";

export const CustomConnectButton = () => {
  const [displayVp, setDisplayVp] = useState("");
  const { gProposal } = useGlobalContext();
  const account = useAccount();

  async function getVp() {
    if (account.address && gProposal) {
      votingPower = await getVotingPower(gProposal, account.address);
      setDisplayVp(vpDisplayFormat(votingPower, 2));
    }
  }

  console.log("VP:", votingPower, displayVp, vpDisplayFormat(votingPower, 2));

  useEffect(() => {
    console.log("getVp");
    getVp();
  }, [account.address, gProposal]);

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
        const ready = mounted;
        const connected = ready && account && chain;

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
