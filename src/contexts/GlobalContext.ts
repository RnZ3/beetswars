import { createContext, useContext } from "react";
import { ChartData } from "types/ChartData";

type GlobalContext = {
  requestedRound: string;
  requestRound: (c: string) => void;
  votingPower: number;
  setVotingPower: (c: number) => void;
  gProposal: string;
  setGProposal: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
  showChart: boolean;
  setShowChart: (c: boolean) => void;
  gChartData: ChartData | undefined;
  setGChartData: (c: ChartData | undefined) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
  votingPower: 0,
  setVotingPower: () => {},
  requestedRound: "",
  requestRound: () => {},
  gProposal: "",
  setGProposal: () => {},
  gVersion: "",
  setGVersion: () => {},
  showChart: false,
  setShowChart: () => {},
  gChartData: undefined,
  setGChartData: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
