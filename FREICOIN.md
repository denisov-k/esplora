# Esplora for Freicoin

This branch adds a Freicoin flavor to [Blockstream's Esplora](https://github.com/Blockstream/esplora)
block explorer, as run at https://freicoin.ru/explorer/. Its backend is the Freicoin branch of
electrs (`FREICOIN.md` there), whose REST API adds what Freicoin needs: transactions'
`lock_height`, fees and balances after demurrage, and merge-mined blocks' parents.

## The flavor

`flavors/freicoin-mainnet` is served under `/explorer/`, with the API at `/explorer/api`:

    npm install
    npm run dist -- freicoin-mainnet     # into dist/

The pages differ from Bitcoin's as follows:

- **Units.** Amounts are in FRC, fee rates in kria/vB.
- **Address pages.** The balance and spendable balance are after demurrage, from electrs'
  `present_value`, with the face-value sums marked as such.
- **Transaction pages.** They show the `lock_height`, the output values' reference height. The fees
  take demurrage into account (electrs computes them).
- **Block pages.** A merge-mined block's page shows its parent block. That is a Bitcoin block,
  linked to mempool.space, or a pool share. The page also shows the previous Bitcoin block and
  whether the auxiliary proof-of-work checks.
- **The block-final transaction.** Its output, which carries each block's witness commitment, is
  labelled as such.
- **The dashboard.** Its recommended fee falls back to the minimum relay fee: with few
  transactions, freicoind has no fee estimates. The fee market section shows only once there are
  estimates. Neither the bitcoin price nor the segwit fee savings are shown.
- **Language.** There is a complete Russian translation (`lang/ru.json`).
- **Header and footer.** They are one line each in freicoin.ru's style, with the wallet's favicon.
- **Themes.** There are a light and a dark one, in the freicoin.ru wallet's colours. They share the
  wallet's `fw_theme_mode` setting (`system`, `light` or `dark`) through `js/theme.js`, which sets
  the theme before the page is drawn.

## New build options

They leave the explorer unchanged when not set:

- `FEE_RATE_UNIT`: the fee rate unit (default `sat/vB`).
- `MIN_FEE_RATE`: the fee rate, in that unit, the recommended fee falls back to without estimates.
  It also hides the fee market section while there are none.
- `HIDE_BITCOIN_PRICE`: no bitcoin price card, price fetches or dollar amounts.
- `HIDE_SEGWIT_GAINS`: no segwit fee savings, computed for Bitcoin's address types.
- `FREICOIN`: the block interval tooltip names Freicoin's.
- `THEMES`: the header's light/dark switch (with `js/theme.js` loaded through `HEAD_HTML`).
- `FAVICON`, `FAVICON_TYPE`: the page icon (default `img/favicon.png`, `image/png`).
- `PARENT_CHAIN_EXPLORER_BLOCK`: the URL of a parent chain block, with `{hash}` replaced.

The network selector shows only with `MENU_ITEMS` or `MENU_ACTIVE`, which the flavor leaves out.

## Serving

`dist/` is static. The web server sends `/explorer/api/*` to electrs' REST API, with the prefix
stripped, and the explorer's own paths to `index.html`. With Caddy:

    handle_path /explorer/api/* {
        reverse_proxy 127.0.0.1:3000
    }
    handle_path /explorer/* {
        root * /srv/esplora/dist
        try_files {path} /index.html
        file_server
    }

## Tests

Upstream's tests (`npm test`) pass unchanged.
