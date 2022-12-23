import { request } from "graphql-request";
import { VP_QUERY, PROPOSAL_QUERY, VOTES_QUERY } from "hooks/queries";
import lodash from "lodash";
//import configData from "config.json";

import snapshot from "@snapshot-labs/snapshot.js";

const endpoint = "https://hub.snapshot.org/graphql";
const network = "250";
const space = "beets.eth";
const delegation = false;
const testaddress = "0xc677e71b02adc94534de993a907352f748d21143";

async function getProposal(id) {
  try {
    const response = await request(endpoint, PROPOSAL_QUERY, {
      id,
    });
    const proposalResClone = await lodash.cloneDeep(response);
    return proposalResClone.proposal;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getProposalVotes(
  maxFirst,
  proposalId,
  { first, voter, skip } = { first: maxFirst, voter: "", skip: 0 }
) {
  try {
    const response = await request(endpoint, VOTES_QUERY, {
      id: proposalId,
      orderBy: "vp",
      orderDirection: "desc",
      first,
      voter,
      skip,
    });
    const votesResClone = lodash.cloneDeep(response);
    return votesResClone.votes;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getAllProposalVotes(proposalId: string) {
  let votes: Vote[] = [];
  let page = 0;
  const pageSize = 1000;
  while (votes.length === pageSize * page) {
    const newVotes = await getProposalVotes(pageSize, proposalId, {
      first: pageSize,
      skip: page * pageSize,
    });
    votes = [...votes, ...newVotes];
    page++;
  }
  return votes;
}

export async function getResults(snapshotId) {
  const proposal = await getProposal(snapshotId);
  const votes = await getAllProposalVotes(proposal.id);
  const voters = votes.map((vote) => vote.voter);

  const scores = await snapshot.utils.getScores(
    "beets.eth",
    proposal.strategies,
    proposal.network,
    voters,
    parseInt(proposal.snapshot, 10),
    "https://score.snapshot.org/api/scores"
  );

  const votes1 = votes
    .map((vote) => {
      vote.scores = proposal.strategies.map(
        (strategy, i) => scores[i][vote.voter] || 0
      );
      vote.balance = vote.scores.reduce((a, b) => a + b, 0);
      return vote;
    })
    .sort((a, b) => b.balance - a.balance)
    .filter((vote) => vote.balance > 0);

  const votingClass = new snapshot.utils.voting[proposal.type](
    proposal,
    votes1,
    proposal.strategies
  );
  const votingResults = {
    resultsByVoteBalance: votingClass.getScores(),
    sumOfResultsBalance: votingClass.getScoresTotal(),
  };

  //console.log(proposal)

  return { proposal, votingResults };
}

export async function getVotingPower(proposal, address) {
  console.log(proposal, address);
  if (address && proposal !== "pending") {
    const propsl: any = await getProposal(proposal);
    console.log(propsl);
    const votingPower = await getVpLocal(
      //const votingPower = await snapshot.utils.getVp(
      address,
      network,
      propsl.strategies,
      propsl.snapshot,
      space,
      delegation
    );
    console.log(votingPower);
    return votingPower.vp;
  }
}

export async function getVotingPower2(proposal, address) {
  if (address && proposal !== "pending") {
    try {
      const response = await request(endpoint, VP_QUERY, {
        id: proposal,
        voter: address,
        first: 1,
      });
      return response;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

async function getVpLocal(
  address: string,
  network: string,
  strategies: Strategy[],
  snapshot: number | "latest",
  space: string,
  delegation: boolean,
  options?: Options
) {
  if (!options) options = {};
  if (!options.url) options.url = "https://score.snapshot.org";
  const init = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "get_vp",
      params: {
        address,
        network,
        strategies,
        snapshot,
        space,
        delegation,
      },
      id: null,
    }),
  };
  const res = await fetch(options.url, init);
  const json = await res.json();
  if (json.error) return Promise.reject(json.error);
  if (json.result) return json.result;
}

export default getProposal;
