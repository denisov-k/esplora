import { InfoCard } from "../components/info-card";
import { feeEstimateTargets } from "../const";
import { estimateTypicalTransactionFeeUsd } from "../lib/fees";
import { getLatestBitcoinPrice } from "../lib/market";
import { formatFeeRate, formatUsd } from "./util";

const getFeeMarketLevels = (t) => [
  {
    key: "low",
    title: t`Low`,
    tooltip: t`A lower-priority fee rate estimated to confirm within ${feeEstimateTargets.low} blocks.`,
  },
  {
    key: "average",
    title: t`Average`,
    tooltip: t`A balanced fee rate estimated to confirm within ${feeEstimateTargets.average} blocks.`,
  },
  {
    key: "high",
    title: t`High`,
    tooltip: t`A higher-priority fee rate estimated to confirm in the next block.`,
  },
];

export const feeMarket = ({ feeEst, bitcoinMarketChart, t } = {}) => {
  const bitcoinPrice = getLatestBitcoinPrice(bitcoinMarketChart);
  const unavailable = t`N/A`;
  const levels = getFeeMarketLevels(t);

  // Freicoin (MIN_FEE_RATE, the overview showing the minimum fee): no section of three
  // unavailable estimates while the node has none, for too few transactions
  if (
    process.env.MIN_FEE_RATE &&
    !levels.some(({ key }) => Number.isFinite(feeEst && feeEst[feeEstimateTargets[key]]))
  ) {
    return "";
  }

  return (
    <div className="fee-market">
      <p className="section-title">{t`Fee Market`}</p>
      <div className="fee-market-body">
        {levels.map(({ key, title, tooltip }) => {
          const feerate = feeEst && feeEst[feeEstimateTargets[key]];
          const feeUsd = estimateTypicalTransactionFeeUsd(
            bitcoinPrice,
            feerate,
          );

          return (
            <InfoCard
              className={`fee-market-${key}`}
              title={title}
              tooltip={tooltip}
              value={formatFeeRate(feerate, unavailable)}
              footer={process.env.HIDE_BITCOIN_PRICE ? "" : formatUsd(feeUsd, unavailable)}
            />
          );
        })}
      </div>
    </div>
  );
};
