import { ChevronDownIcon } from '../components/icons'

// untranslated when a page is laid out without a translator
const identity = (strs, ...vals) => String.raw({ raw: strs }, ...vals)

const languageForm = ({ t, page }) =>
  <form className="language-form" method="get">
    { !process.browser && Object.entries(page.query).map(([ k, v ]) =>
      k != 'lang' && <input type="hidden" name={k} value={v} />
    ) }
    <select className="language-selector" name="lang">
      { Object.entries(t.langs).map(([ lang_id, lang_t ]) =>
        <option value={lang_id} attrs={lang_id == t.lang_id ? { selected: true } : {}}>{lang_t`lang_name`}</option>
      ) }
    </select>
    <ChevronDownIcon className="language-selector-arrow" />
    { !process.browser && <input type="submit" className="language-submit" value={t`Go`} /> }
  </form>

// Freicoin: one line, the language on the left, the project's links in the middle and the
// software's credit on the right, in place of the upstream footer's columns
const freicoinFooter = opt => {
  const t = opt.t || identity
  return (
  <footer className="footer frc-footer">
    <div className="container frc-footer-container">
      <div className="language">
        { languageForm(opt) }
      </div>
      <nav className="frc-footer-links">
        <a href="https://freicoin.ru/">freicoin.ru</a>
        <a href="https://github.com/tradecraftio/tradecraft">{t`Freicoin source code`}</a>
        <a href="explorer-api">{t`API`}</a>
      </nav>
      <p className="frc-footer-credit">
        <a href="https://github.com/Blockstream/esplora">{t`Built on Esplora`}</a>
      </p>
    </div>
  </footer>
  )
}

export default freicoinFooter;
