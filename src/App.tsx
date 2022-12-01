import React, { useState } from "react";
import PageContent from "components/PageContent";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "theme/ThemeProvider";
import NavBar from "components/NavBar";
import Heading from "components/Heading";
import Footer from "components/Footer";
import { MyGlobalContext } from "contexts/GlobalContext";
import { WagmiConfig } from 'wagmi'
import { client } from './wagmiconf'
import { ConnectKitProvider, getDefaultClient } from "connectkit";



function App() {
  const [bribeFile, setBribeFile] = useState<string>("bribe-data-latest.json");
  const [gVersion, setGVersion] = useState<string>("");
  const [gProposal, setGProposal] = useState<string>("");
  const [showChart, setShowChart] = useState<boolean>(false);

  return (
    <div>
      <MyGlobalContext.Provider
        value={{
          bribeFile,
          setBribeFile,
          showChart,
          setShowChart,
          gVersion,
          setGVersion,
          gProposal,
          setGProposal,
        }}
      >

    <WagmiConfig client={client}>



      <ConnectKitProvider
theme="minimal" 
        options={{
          hideTooltips:true,
          hideQuestionMarkCTA:true,
          hideNoWalletCTA:true,
          disclaimer: "disclaimer here",
        }}
      >



        <ThemeProvider>
          <CssBaseline />
          <NavBar />
          <Heading />
          <PageContent />
          <Footer />
        </ThemeProvider>

      </ConnectKitProvider>

    </WagmiConfig>




      </MyGlobalContext.Provider>
    </div>
  );
}

export default App;
