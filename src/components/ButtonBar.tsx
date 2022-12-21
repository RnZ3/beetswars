import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";
import { CustomConnectButton } from "components/CustomConnectButton";
import { abbreviateNumber  } from "utils/vpDisplayFormat";
import { useAccount } from "wagmi";



const ButtonBar: FC = () => {
  const account = useAccount();

  const { votingPower, requestedRound, showChart, setShowChart, gProposal, gVersion } =
    useGlobalContext();
  const apilink: string =
    "https://beetswars-backend.cyclic.app/api/v1/bribedata/" + requestedRound;
  const plink: string =
    "https://snapshot.org/#/beets.eth/" +
    (showChart ? "" : "proposal/" + gProposal);

  // console.log(account,votingPower.full)

  return (
    <>
      <Box
        sx={{
          padding: "3px",
          paddingRight: "9px",
          paddingLeft: "9px",
          display: "flex",
          justifyContent: "space-between",
          background: "#000",
          color: "white",
          textDecoration: "none",
          marginBottom: "0px",
          fontSize: "1rem",
          fontFamily: "sans",
        }}
      >
        <Box>
            <Link
              href="https://beets.fi/#/"
              target="_blank"
              color="white"
              underline="hover"
            >
              beethoven-x
            </Link>{" "}
            |&nbsp;
            <Link
              href={plink}
              target="_blank"
              color="white"
              underline="hover"
            >
              snapshot
            </Link>{" "}
            |&nbsp;
            <Link
              href="https://github.com/mobiusTripper-crypto/beetswars"
              target="_blank"
              color="white"
              underline="hover"
            >
              github
            </Link>
            {!showChart && (
              <>
                {" "}
                |&nbsp;
                <Link
                  // href="https://github.com/mobiusTripper-crypto/beetswars-data"
                  href={apilink}
                  target="_blank"
                  color="white"
                  underline="hover"
                >
                  data: {gVersion}
                </Link>
              </>
            )}
        </Box>
        <Box
          sx={{
            padding: "2px",
            paddingRight: "3px",
            display: "flex",
            justifyContent: "flex-end",
            color: "white",
            textDecoration: "none",
          }}
        >
          <Box style={{ marginRight: "12px" }}>
            <button onClick={() => setShowChart(!showChart)}>
              {showChart ? "Dashboard (" + gVersion + ")" : "Stats"}
            </button>
          </Box>
          <Box style={{}}>
            <CustomConnectButton />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          padding: "1px",
          paddingRight: "9px",
          paddingLeft: "9px",
          display: "flex",
          justifyContent: "flex-end",
          color: "#eee",
          textDecoration: "none",
          marginBottom: "23px",
          fontFamily: "sans",
          fontSize: "0.9rem",
          height: "0.9rem",
        }}
      >
        <Box
          sx={{
            padding: "0px",
            paddingRight: "9px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {account.isConnected && (votingPower !== undefined)  ? (
            <Box>
              VP max: {abbreviateNumber(votingPower.full)} | 
              VP selected Round: {abbreviateNumber(votingPower.round)}
            </Box>
          ) : ("") }
        </Box>
      </Box>
    </>
  );
};
export default ButtonBar;
