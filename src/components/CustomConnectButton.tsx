import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGlobalContext } from "contexts/GlobalContext";
import { getVotingPower, getVotingPower2 } from "hooks/voteSnapshot";
import { abbreviateNumber  } from "utils/vpDisplayFormat";

export const CustomConnectButton = () => {
  const { gProposal, votingPower, setVotingPower } = useGlobalContext();
  const account = useAccount();
  let vpround = 0;
  let vpfull = 0;
  async function getVp() {
    if (account.address && gProposal) {
      await Promise.all([
        await getVotingPower(gProposal, account.address)
          .then((response) => {
//            console.log("V1:",response)
            vpfull = response;
          }
        ),
        await getVotingPower2(gProposal, account.address)
          .then((response) => {
//            console.log("V2:",response)
            if (response && response.votes.length > 0 ) {
              vpround = response.votes[0].vp;
            } else {
              vpround = 0;
            }
          }),
        await setVotingPower({full:vpfull, round: vpround})
      ])
    } else if (!account.isConnected) {
        await setVotingPower({full: 0, round: 0})
    }
  }

  console.log(votingPower?.full)
  console.log(votingPower?.round)

  useEffect(() => {
    console.log("get VP");
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


/*

                    {account.displayName}
                    {" | VP: "}
                    {' '}
                    {abbreviateNumber(votingPower?.round)}
*/
