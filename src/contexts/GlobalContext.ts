import { createContext, useContext } from "react";
import { ChartData } from "types/ChartData";
import { VotingPower } from "types/VotingPower";


type GlobalContext = {
  requestedRound: string;
  requestRound: (c: string) => void;
  gProposal: string;
  setGProposal: (c: string) => void;
  gVersion: string;
  setGVersion: (c: string) => void;
  showChart: boolean;
  setShowChart: (c: boolean) => void;
  gChartData: ChartData | undefined;
  setGChartData: (c: ChartData | undefined) => void;
  votingPower: VotingPower ;
  setVotingPower: (c: VotingPower ) => void;
};

export const MyGlobalContext = createContext<GlobalContext>({
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
  votingPower: {full:0,round:0},
  setVotingPower: () => {},
});

export const useGlobalContext = () => useContext(MyGlobalContext);
