import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGlobalContext } from "contexts/GlobalContext";
import { getVotingPower2 } from "hooks/voteSnapshot";
import { vpDisplayFormat } from "utils/vpDisplayFormat";

export const CustomConnectButton = () => {
  const { gProposal, votingPower, setVotingPower } = useGlobalContext();
  const account = useAccount();

  async function getVp() {
    if (account.address && gProposal) {
      await getVotingPower2(gProposal, account.address)
        .then((response) => {

            if (response && response.votes.length > 0 ) {
              setVotingPower(response.votes[0].vp);

            } else {
              setVotingPower(0)
           }
          console.log("VP raw",votingPower)
        })
      }
    }

  useEffect(() => {
    console.log("get Vp");
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
                    {' '}
                    {vpDisplayFormat(votingPower, 2)}
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
