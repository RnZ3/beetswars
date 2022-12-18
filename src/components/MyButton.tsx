import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useGlobalContext } from "contexts/GlobalContext";
import { getVotingPower } from "hooks/voteSnapshot";

let votingPower: any = "";

function vpDisplayFormat(num: any, digits: any) {
  var units = ["k", "M", "G", "T", "P", "E", "Z", "Y"],
    decimal;
  for (var i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);
    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }
  return num;
}

export const MyButton = () => {
  const [displayVp, setDisplayVp] = useState("");
  const { gProposal } = useGlobalContext();
  const account = useAccount();

  async function blub() {
    if (account.address && gProposal) {
      votingPower = await getVotingPower(gProposal, account.address);
      setDisplayVp(vpDisplayFormat(votingPower, 2));
    }
  }

  console.log(
    "VP:",
    votingPower,
    displayVp,
    vpDisplayFormat(votingPower, 2),
    vpDisplayFormat(5493000, 2)
  );

  useEffect(() => {
    console.log("blub");
    blub();
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
