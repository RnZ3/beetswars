import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";
import { MyButton } from "components/MyButton";

const ButtonBar: FC = () => {
  const { requestedRound, showChart, setShowChart, gProposal, gVersion } =
    useGlobalContext();
  const apilink: string =
    "https://beetswars-backend.cyclic.app/api/v1/bribedata/" + requestedRound;
  const plink: string =
    "https://snapshot.org/#/beets.eth/" +
    (showChart ? "" : "proposal/" + gProposal);

  //  console.log(showChart, gProposal, gVersion);

  return (
    <>
      <Box
        sx={{
          padding: "3px",
          paddingRight: "9px",
          paddingLeft: "9px",
          display: "flex",
          justifyContent: "space-between",
          background: "#010101",
          color: "white",
          textDecoration: "none",
          marginBottom: "20px",
        }}
      >
        <Box>
          <Typography variant="caption">
            <Link
              style={{ fontSize: "1rem" }}
              href="https://beets.fi/#/"
              target="_blank"
              color="white"
              underline="hover"
            >
              beethoven-x
            </Link>{" "}
            |&nbsp;
            <Link
              style={{ fontSize: "1rem" }}
              href={plink}
              target="_blank"
              color="white"
              underline="hover"
            >
              snapshot
            </Link>{" "}
            |&nbsp;
            <Link
              style={{ fontSize: "1rem" }}
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
                  style={{ fontSize: "1rem" }}
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
          </Typography>
        </Box>
        <Box
          sx={{
            padding: "2px",
            paddingRight: "3px",
            display: "flex",
            justifyContent: "flex-end",
            background: "black",
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
            <MyButton />
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default ButtonBar;
