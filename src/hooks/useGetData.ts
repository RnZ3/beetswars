import { useEffect, useState } from "react";
import {
  Bribes,
  TokenPrice,
  TokenPriceData,
  GenericReward,
} from "types/BribeData";
import { ServiceType } from "types/Service";
import { VoteDataType } from "types/VoteData";
import { RoundList, DashboardType, DashboardReturn } from "types/Dashboard";
import { getResults } from "hooks/voteSnapshot";
import { request } from "graphql-request";
import { BPT_ACT_QUERY } from "hooks/queries";
import { contract_abi, contract_address } from "contracts/priceoracleconfig";
import { ethers } from "ethers";
import useTimer from "hooks/useTimer";
import { useAccount } from "wagmi";

const useGetData = (requestedRound: string) => {
  const baseUrl = "https://beetswars-backend.cyclic.app/api/v1/bribedata/";
  const dataUrl = baseUrl + requestedRound;
  const { address, isConnecting, isDisconnected } = useAccount();
  //  console.log(address, isConnecting, isDisconnected);
  const [voteActive, setActive] = useState(false);
  const [roundListCache, setRoundListCache] = useState<RoundList[]>([]);
  const refreshInterval: number | null = voteActive ? 60000 : null; // ms or null
  const refresh = useTimer(refreshInterval);
  const [dashboardResult, setDashboardResult] = useState<
    ServiceType<DashboardReturn>
  >({ status: "loading" });

  var tokenPriceData: TokenPriceData[] = [];
  var tokenPrices: TokenPrice[] = [];

  useEffect(() => {
    const fetchDashboardData = async () => {


      if (roundListCache.length === 0) {
        console.log("round list:", roundListCache.length);

      const allRoundsIndex = await fetch(baseUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          var liste = response.map((item: any, i: any) => {
            return item.key;
          });
          const list = liste.sort().reverse();
          return list;
        });

      setRoundListCache(allRoundsIndex);
      }


      const bribeData = await fetch(dataUrl || "")
        .then((response) => {
          return response.json();
        })
        .then((response: Bribes) => {
          //console.log("return bribes");
          return response;
        });

      const voteData = await getResults(bribeData.snapshot).then(
        (response: VoteDataType) => {
          //console.log("return vote");
          return response;
        }
      );

      setActive(
        voteData.proposal.state === "active" ||
          voteData.proposal.state === "pending"
          ? true
          : false
      );

      const endTime2 = voteData.proposal.end;
      const endTime = new Date(voteData.proposal.end * 1000)
        .toLocaleDateString("de-DE")
        .replace(/\./g, "-");

      if (bribeData.tokendata) {
        bribeData.tokendata.forEach((td) => {
          const data: TokenPriceData = {
            token: td.token,
            tokenaddress: td.tokenaddress,
            coingeckoid: td.coingeckoid,
            bptpoolid: td.bptpoolid,
            isbpt: td.isbpt,
            lastprice: td.lastprice,
          };
          tokenPriceData.push(data);
        });
      }

      console.log(
        "latest:",
        roundListCache[0],
        "state:",
        voteActive,
        voteData.proposal.state,
        voteData.proposal.votes,
        refreshInterval,
        endTime,
        tokenPriceData
      );

      if (tokenPriceData.length !== 0) {
        if (voteActive) {
          // realtime prices

          await Promise.all(
            tokenPriceData.map(async (tkn) => {
              if (tkn.isbpt && tkn.bptpoolid) {
                const endpoint =
                  "https://backend-v2.beets-ftm-node.com/graphql";
                const id = tkn.bptpoolid;
                const poolData = await request(endpoint, BPT_ACT_QUERY, {
                  id,
                }).then((response) => {
                  if (response.status >= 400 && response.status < 600) {
                    throw new Error("Bad response from server");
                  }
                  return response;
                });
                const sharePrice =
                  parseFloat(poolData.poolGetPool.dynamicData.totalLiquidity) /
                  parseFloat(poolData.poolGetPool.dynamicData.totalShares);

                const data: TokenPrice = {
                  token: tkn.token,
                  price: sharePrice,
                };
                tokenPrices.push(data);
                //console.log("return bpt tkn:", tkn.token, sharePrice);
              } else {
                const provider = new ethers.providers.JsonRpcProvider(
                  "https://rpc.ftm.tools"
                );

                const contract = new ethers.Contract(
                  contract_address,
                  contract_abi,
                  provider
                );
                const priceobj = await contract.calculateAssetPrice(
                  tkn.tokenaddress
                );
                //const price = parseFloat(ethers.utils.formatEther(priceobj));
                const data: TokenPrice = {
                  token: tkn.token,
                  price: parseFloat(ethers.utils.formatEther(priceobj)),
                };
                tokenPrices.push(data);
                //console.log("return rpc tkn:", tkn.token, price);
              }
            })
          );
        } else {
          // historical prices
          await Promise.all(
            tokenPriceData.map(async (tkn) => {
              if (tkn.isbpt && tkn.lastprice) {
                //TODO get historical BPT price from backend
                //console.log("h bpt:", tkn.token, tkn.lastprice);
                const data: TokenPrice = {
                  token: tkn.token,
                  price: tkn.lastprice,
                };
                tokenPrices.push(data);
                //console.log("return h bpt:", tkn.token);
              } else {
                //console.log("h tkn:", tkn.token, tkn.coingeckoid);
                if (tkn.coingeckoid && voteData.proposal.state !== "active") {
                  const tknUrl =
                    "https://api.coingecko.com/api/v3/coins/" +
                    tkn.coingeckoid +
                    "/history?date=" +
                    endTime +
                    "&localization=false";
                  const tknUrl2 =
                    "https://api.coingecko.com/api/v3/coins/beethoven-x/market_chart/range?vs_currency=usd&from=" +
                    endTime2 +
                    "&to=" +
                    (endTime2 + 86400);
                  await fetch(tknUrl2 || "")
                    .then((response) => {
                      return response.json();
                    })
                    .then((response) => {
                      //console.log(response.prices[0][1])
                      const data: TokenPrice = {
                        token: tkn.token,
                        price: response.prices[0][1],
                      };
                      tokenPrices.push(data);
                    });
                  //console.log("return h tkn:", tkn.token);
                }
              }
            })
          );
        }
      }
      console.log(tokenPrices);

      const dashboardData = normalizeDashboardData(
        bribeData,
        voteData,
        tokenPrices
      );

      setDashboardResult({
        status: "loaded",
        payload: {
          results: dashboardData,
          totalVoter: voteData.proposal.votes,
          totalVotes: voteData.votingResults.sumOfResultsBalance,
          totalBribedVotes: dashboardData
            .map((item) => item.voteTotal)
            .reduce((prev, curr) => prev + curr, 0),
          totalBribeAmount: dashboardData
            .map((item) => item.LabelValue.value)
            .reduce((prev, curr) => prev + curr, 0),
          version: bribeData.version,
          proposalStart: voteData.proposal.start,
          proposalEnd: voteData.proposal.end,
          proposalTitle: voteData.proposal.title,
          proposalId: bribeData.snapshot,
          proposalState: voteData.proposal.state,
          roundList: roundListCache,
        },
      });
    };

    const normalizeDashboardData = (
      bribes: Bribes,
      voteData: VoteDataType,
      tokenprice: TokenPrice[]
    ) => {
      const list: DashboardType[] = [];

      function calculate(reward: GenericReward) {
        let amount = 0;
        if (reward.isfixed) {
          amount += reward.amount;
        } else {
          const token = tokenprice.find((t) => t.token === reward.token);
          amount += reward.amount * (token ? token.price : 0);
        }
        return amount;
      }

      bribes.bribedata.forEach((bribe) => {
        const votePercentage =
          (voteData.votingResults.resultsByVoteBalance[bribe.voteindex] /
            voteData.votingResults.sumOfResultsBalance) *
          100;

        const percentAboveThreshold = Math.max(
          0,
          votePercentage - bribe.percentagethreshold
        );

        const isUndervote = votePercentage < 0.15 && !bribe.payoutthreshold;
        const isUnderthreshold =
          bribe.payoutthreshold && votePercentage < bribe.payoutthreshold;

        const isQualified = !isUndervote && !isUnderthreshold;

        let label = "";
        let valuePerVote = 0;
        let pervoteAmount = 0;
        let percentAmount = 0;
        let fixedValue = 0;
        let isPervoteReward = false;
        let isFixedReward = false;
        let isPercentReward = false;

        bribe.reward.forEach((reward, index) => {
          if (reward.type === "pervote") {
            label = "Per Vote Amount";
            pervoteAmount += calculate(reward);
            isPervoteReward = true;
          } else if (reward.type === "percent") {
            label = "Percent Amount";
            percentAmount += calculate(reward);
            isPercentReward = true;
          } else if (reward.type === "fixed") {
            label = "Fixed Reward Amount";
            fixedValue += calculate(reward);
            isFixedReward = true;
          } else {
            console.warn("no reward type");
          }
        });

        if (
          [isPervoteReward, isFixedReward, isPercentReward].filter(Boolean)
            .length > 1
        ) {
          label = "Overall Amount";
        }

        const percentValue = Math.min(
          percentAmount * percentAboveThreshold,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const pervoteValue = Math.min(
          pervoteAmount *
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        const overallValue = Math.min(
          fixedValue + percentValue + pervoteValue,
          isNaN(bribe.rewardcap) ? Infinity : bribe.rewardcap
        );

        if (isPervoteReward) {
          valuePerVote = pervoteAmount;
        } else {
          valuePerVote =
            overallValue /
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex];
        }

        const finalValue = Math.max(
          0,
          percentValue,
          pervoteValue,
          fixedValue,
          overallValue
        );

        const data: DashboardType = {
          poolName: voteData.proposal.choices[bribe.voteindex],
          poolUrl: bribe.poolurl,
          isQualified: isQualified,
          rewardDescription: bribe.rewarddescription,
          assumption: bribe.assumption,
          additionalrewards: bribe.additionalrewards,
          percentAboveThreshold: percentAboveThreshold,
          voteTotal:
            voteData.votingResults.resultsByVoteBalance[bribe.voteindex],
          votePercentage: votePercentage,
          valuePerVote: valuePerVote,
          id: bribe.voteindex,
          LabelValue: { label: label, value: finalValue },
        };

        list.push(data);
      });
      //console.log("return list");
      return list;
    };
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUrl, refresh, setDashboardResult, refreshInterval, voteActive]);

  return dashboardResult;
};

export default useGetData;
