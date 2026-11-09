import menu from './navbar-menu'

// untranslated when a page is laid out without a translator
const identity = (strs, ...vals) => String.raw({ raw: strs }, ...vals)

// Freicoin: one line, freicoin.ru's coin and name with the explorer's on the left, the
// navigation on the right
export default S => {
  const t = S.t || identity
  return (
  <nav className="container nav-container">
      <a className="navbar-brand" href=".">
        <span className="navbar-brand-name">Freicoin</span>
        <span className="navbar-brand-sep">·</span>
        <span className="navbar-brand-sub">{t`Explorer`}</span>
      </a>
        <div className="sub-nav font-h5">
            <a href="." class={{ active: S.activeTab == 'dashBoard' }}>{t`Dashboard`}</a>
            <a href="blocks/recent" class={{ active: S.activeTab == 'recentBlocks' }}>{t`Blocks`}</a>
            <a href="tx/recent" class={{ active: S.activeTab == 'recentTxs' }}>{t`Transactions`}</a>
            { process.env.IS_ELEMENTS ? <a href="assets" class={{ active: S.activeTab == 'assets' }}>{t`Assets`}<sup className="highlight"></sup></a> : "" }
            <a href="explorer-api" class={{ active: S.activeTab == 'apiLanding' }}>{t`API`}</a>
            { process.env.THEMES ? <button className="theme-toggle" type="button" title={t`Light or dark theme`} aria-label={t`Light or dark theme`}></button> : "" }
        </div>
      { process.env.NAVBAR_HTML ? menu(S) : "" }
  </nav>
  )
}
