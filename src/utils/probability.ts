import { SimulatedTokenCandidate } from '../types';

export interface CalculatedTokenProb {
  token: string;
  meaning: string;
  baseLogit: number;
  rawSoftmax: number;
  isIncludedInTopP: boolean;
  finalProb: number;
}

export function computeTokenProbabilities(
  candidates: SimulatedTokenCandidate[],
  temperature: number,
  topP: number
): {
  tokens: CalculatedTokenProb[];
  entropy: number;
  effectiveTokenCount: number;
} {
  // Clamp temperature between 0.05 and 2.5 to avoid div by 0
  const safeTemp = Math.max(0.05, Math.min(2.5, temperature));
  const safeTopP = Math.max(0.01, Math.min(1.0, topP));

  // Compute exp(logit / temp) with numerical stability (subtract max)
  const maxLogit = Math.max(...candidates.map((c) => c.baseLogit));
  const exps = candidates.map((c) => Math.exp((c.baseLogit - maxLogit) / safeTemp));
  const sumExps = exps.reduce((acc, v) => acc + v, 0);

  const rawProbs = exps.map((val) => val / sumExps);

  // Sort candidates by raw probability descending to apply top-p
  const sorted = candidates
    .map((c, idx) => ({
      candidate: c,
      rawProb: rawProbs[idx],
    }))
    .sort((a, b) => b.rawProb - a.rawProb);

  let cumSum = 0;
  const sampledList = sorted.map((item) => {
    cumSum += item.rawProb;
    // Keep token if cumSum before this item was < topP, or always keep at least the 1st
    const keep = cumSum - item.rawProb < safeTopP;
    return {
      token: item.candidate.token,
      meaning: item.candidate.meaning,
      baseLogit: item.candidate.baseLogit,
      rawSoftmax: item.rawProb,
      isIncludedInTopP: keep,
      finalProb: 0,
    };
  });

  // Re-normalize only kept tokens
  const keptSum = sampledList
    .filter((s) => s.isIncludedInTopP)
    .reduce((acc, s) => acc + s.rawSoftmax, 0);

  sampledList.forEach((s) => {
    if (s.isIncludedInTopP && keptSum > 0) {
      s.finalProb = s.rawSoftmax / keptSum;
    } else {
      s.finalProb = 0;
    }
  });

  // Compute Shannon entropy in bits: -sum(p * log2(p))
  let entropy = 0;
  sampledList.forEach((s) => {
    if (s.finalProb > 0.0001) {
      entropy -= s.finalProb * Math.log2(s.finalProb);
    }
  });

  const effectiveTokenCount = sampledList.filter((s) => s.isIncludedInTopP).length;

  return {
    tokens: sampledList,
    entropy,
    effectiveTokenCount,
  };
}
