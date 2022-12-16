import React, { useState } from "react";
import PageContent from "components/PageContent";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";
import NavBar from "components/NavBar";
import Heading from "components/Heading";
import Footer from "components/Footer";
import { MyGlobalContext } from "contexts/GlobalContext";
import { WagmiConfig } from "wagmi";
import { client, chains } from "utils/wagmiconf";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

function App() {
  const [requestedRound, requestRound] = useState<string>("latest");
  const [gVersion, setGVersion] = useState<string>("");
  const [gProposal, setGProposal] = useState<string>("");
  const [showChart, setShowChart] = useState<boolean>(false);

  return (
    <div>
      <MyGlobalContext.Provider
        value={{
          requestedRound,
          requestRound,
          showChart,
          setShowChart,
          gVersion,
          setGVersion,
          gProposal,
          setGProposal,
        }}
      >
        <WagmiConfig client={client}>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            theme={darkTheme()}
          >
            <ThemeProvider>
              <CssBaseline />
              <NavBar />
              <Heading />
              <PageContent />
              <Footer />
            </ThemeProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </MyGlobalContext.Provider>
    </div>
  );
}

export default App;
