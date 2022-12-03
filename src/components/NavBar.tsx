import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { useGlobalContext } from "contexts/GlobalContext";
import { MyButton } from "components/MyButton";

const NavBar: FC = () => {
  const { requestedRound, showChart, setShowChart, gProposal, gVersion } = useGlobalContext();
  const apilink: string = "https://beetswars-backend.cyclic.app/api/v1/bribedata/" + requestedRound
  const plink: string =
    "https://snapshot.org/#/beets.eth/" +
    (showChart ? "" : "proposal/" + gProposal);

  //  console.log(showChart, gProposal, gVersion);

  return (
    <>
      <Box
        sx={{
          padding: "2px",
          paddingRight: "13px",
          display: "flex",
          justifyContent: "flex-end",
          background: "black",
          color: "white",
          textDecoration: "none",
          paddingRight: "10px"
        }}
      >
        <div style={{ marginRight: "9px", marginLeft: "9px" }}>
          <button onClick={() => setShowChart(!showChart)}>
            {showChart ? "Dashboard (" + gVersion + ")" : "Stats"}
          </button>
        </div>
        <div style={{ marginRight: "9px", flexGrow: "1" }}>
          <MyButton />
        </div>

        <Typography variant="caption" align="right">
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
    </>
  );
};
export default NavBar;
