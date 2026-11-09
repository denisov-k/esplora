import layout from "./layout";
import { txBox } from "./tx";
import { formatNumber } from "./util";
import loader from "../components/loading";
import {
  BlockIcon,
  CaretCircleLeftIcon,
  CaretCircleRightIcon,
} from "../components/icons";
import BlockDetailsCard from "../components/block-details-card";

const staticRoot = process.env.STATIC_ROOT || "";

// Freicoin: the parent chain block header a merge-mined block's auxiliary proof-of-work commits
// to. Consensus checks the work done on it, not that the parent exists, so it is shown as such,
// with no link to a parent chain explorer.
const parentDifficulty = (bits) => {
  const exponent = bits >>> 24, mantissa = bits & 0x7fffff;
  const target = mantissa * Math.pow(2, 8 * (exponent - 3));
  return target > 0 ? (0xffff * Math.pow(2, 208)) / target : NaN;
};

const mergeMining = (parent, t) => (
  <div className="detail-grid merge-mining">
    <p className="section-title">{t`Merge mining`}</p>
    <div className="detail-grid-row">
      <div className="detail-field">
        <p className="detail-field-label">{t`Parent block header`}</p>
        <div className="detail-field-content">
          <p className="mono">{parent.hash}</p>
        </div>
      </div>
    </div>
    <div className="detail-grid-row">
      <div className="detail-field">
        <p className="detail-field-label">{t`Its previous block`}</p>
        <div className="detail-field-content">
          <p className="mono">{parent.prev_blockhash}</p>
        </div>
      </div>
    </div>
    <div className="detail-grid-row">
      <div className="detail-field">
        <p className="detail-field-label">{t`Header difficulty`}</p>
        <div className="detail-field-content">
          <p>{formatNumber(Math.round(parentDifficulty(parent.bits)))}</p>
        </div>
      </div>
      <div className="detail-field">
        <p className="detail-field-label">{t`Transactions in the parent block`}</p>
        <div className="detail-field-content">
          <p>{formatNumber(parent.tx_count)}</p>
        </div>
      </div>
    </div>
    <div className="detail-grid-row">
      <div className="detail-field">
        <p className="detail-field-label">{t`Auxiliary proof-of-work`}</p>
        <div className="detail-field-content">
          <p>{parent.meets_target ? t`Valid` : t`Not verified`}</p>
        </div>
      </div>
    </div>
  </div>
);

const makeStatus = (b) =>
  b && { confirmed: true, block_height: b.height, block_hash: b.id };

export default ({
  t,
  block: b,
  blockStatus: status,
  blockTxs,
  openTx,
  spends,
  goBlock,
  tipHeight,
  loading,
  page,
  previousBlock,
  txsStatus = makeStatus(b),
  ...S
}) =>
  b &&
  layout(
    [
      <div className="block-page">
        <div className="block-box">
          <div className="table-header">
            <div className="table-header-icon-container">
              <BlockIcon />
            </div>
            <div className="block-navigation">
              {b.previousblockhash && (
                <a
                  href={`block/${b.previousblockhash}`}
                  aria-label={t`Previous block`}
                >
                  <CaretCircleLeftIcon />
                </a>
              )}
              <p className="block-navigation-block-number">{formatNumber(b.height)}</p>

              {status && status.next_best && (
                <a
                  href={`block/${status.next_best}`}
                  aria-label={t`Next block`}
                >
                  <CaretCircleRightIcon />
                </a>
              )}
            </div>
          </div>
          <BlockDetailsCard
            block={b}
            previousBlock={previousBlock}
            t={t}
            detailsOpen={S.openBlock === b.id}
            statusText={
              !status
                ? null
                : status.in_best_chain
                  ? t`Confirmed`
                  : t`Orphaned`
            }
            statusVariant={
              status && status.in_best_chain ? "success" : "warning"
            }
          />
          {b.parent_block ? mergeMining(b.parent_block, t) : ""}
        </div>

        <div className="transactions">
          {blockTxs
            ? blockTxs.map((tx, index) =>
                txBox(
                  { ...tx, status: txsStatus },
                  {
                    openTx,
                    tipHeight,
                    t,
                    spends,
                    listingIndex: +goBlock.start_index + index + 1,
                    listingTotal: b.tx_count,
                  },
                ),
              )
            : loader()}
        </div>

        <div className="load-more-container">
          <div>
            {loading ? (
              <div className="load-more load-more-loading g-btn primary-btn font-btn-2 disabled">
                <span>{t`Loading...`}</span>
                <div>{loader("small")}</div>
              </div>
            ) : (
              pagingNav(b, { ...S, t })
            )}
          </div>
        </div>
      </div>,
    ],
    { t, page, activeTab: "recentBlocks", ...S },
  );

const pagingNav = (block, { nextBlockTxs, prevBlockTxs, t }) =>
  process.browser
    ? nextBlockTxs && (
        <div
          className="load-more g-btn primary-btn font-btn-2"
          role="button"
          data-loadmoreTxsIndex={nextBlockTxs}
          data-loadmoreTxsBlock={block.id}
        >
          {t`Load more`}
        </div>
      )
    : [
        prevBlockTxs != null && (
          <a
            className="load-more"
            href={`block/${block.id}?start=${prevBlockTxs}`}
          >
            <div>
              <img alt="" src={`${staticRoot}img/icons/arrow_left_blu.png`} />
            </div>
            <span>{t`Prev`}</span>
          </a>
        ),
        nextBlockTxs != null && (
          <a
            className="load-more"
            href={`block/${block.id}?start=${nextBlockTxs}`}
          >
            <span>{t`Next`}</span>
            <div>
              <img alt="" src={`${staticRoot}img/icons/arrow_right_blu.png`} />
            </div>
          </a>
        ),
      ];
