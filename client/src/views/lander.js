import layout from './layout'

// Freicoin: the API page, in place of the upstream's hosted-API marketing, in English and Russian.
const apiDocs = 'https://github.com/Blockstream/esplora/blob/master/API.md'

const english = api => [
    <h1 className="font-h2">Explorer API</h1>,
    <p className="font-p2">
        This explorer serves the Esplora HTTP REST API at <code>{api}</code>, documented
        in <a href={apiDocs} target="_blank">API.md</a>. Freicoin changes and adds a few fields:
    </p>,
    <ul className="font-p2">
        <li><code>GET /tx/:txid</code>: <code>lock_height</code>, the reference height the
            transaction's output values are denominated at; <code>fee</code> takes the inputs'
            demurrage into account.</li>
        <li><code>GET /address/:address</code>: <code>present_value</code> with
            the <code>height</code> it is at (the next block's), the <code>confirmed</code> outputs'
            and the <code>spendable</code> ones' (counting the mempool) values after demurrage.
            The <code>chain_stats</code> and <code>mempool_stats</code> sums are face values.</li>
        <li><code>GET /address/:address/utxo</code>: each output's <code>refheight</code> and
            its <code>present_value</code>.</li>
        <li>Outputs of block-final transactions, which carry the block's witness commitment,
            have the type <code>witness_commitment</code>.</li>
        <li>Electrum: <code>blockchain.scripthash.get_balance</code> returns present
            values; <code>listunspent</code> adds <code>refheight</code>.</li>
    </ul>,
    <p className="font-p2">
        An output's value decays by a factor of (1 - 2<sup>-20</sup>) per block after its
        reference height: at the 15-minute block target since merge mining, about 3.3% a year.
    </p>,
]

const russian = api => [
    <h1 className="font-h2">API обозревателя</h1>,
    <p className="font-p2">
        Обозреватель отдаёт HTTP REST API Esplora по адресу <code>{api}</code>, его описание —
        в <a href={apiDocs} target="_blank">API.md</a> (на английском). Во Freicoin несколько
        полей изменены и добавлены:
    </p>,
    <ul className="font-p2">
        <li><code>GET /tx/:txid</code>: <code>lock_height</code> — опорная высота, на которую
            номинированы суммы выходов транзакции; <code>fee</code> учитывает демерредж входов.</li>
        <li><code>GET /address/:address</code>: <code>present_value</code> — стоимость
            непотраченных выходов с учётом демерреджа на высоте <code>height</code> (следующего
            блока): <code>confirmed</code> для подтверждённых и <code>spendable</code> с учётом
            мемпула. Суммы в <code>chain_stats</code> и <code>mempool_stats</code> — номинальные.</li>
        <li><code>GET /address/:address/utxo</code>: у каждого выхода <code>refheight</code> и{' '}
            <code>present_value</code>.</li>
        <li>Выходы block-final транзакций, которые несут witness-коммитмент блока, имеют тип{' '}
            <code>witness_commitment</code>.</li>
        <li>Electrum: <code>blockchain.scripthash.get_balance</code> возвращает стоимость с учётом
            демерреджа; <code>listunspent</code> добавляет <code>refheight</code>.</li>
    </ul>,
    <p className="font-p2">
        Стоимость выхода умножается на (1 - 2<sup>-20</sup>) за каждый блок после его
        опорной высоты: при целевом интервале блоков 15 минут (с перехода на merge mining) это
        примерно 3,3% в год.
    </p>,
]

const LandingPage = ({ t, ...S }) => {
    const api = process.env.API_URL || '/api'
    return layout(
    <div className="container">
        {/* Read at render time: the prerender server sets it from the manifest at startup. */}
        <script src={`${process.env.STATIC_ROOT || ""}${process.env.INFINITE_SCROLL_ASSET || "js/infinite-scroll.js"}`} async></script>
        <div className="block-box">
            { t && t.lang_id == 'ru' ? russian(api) : english(api) }
        </div>
    </div>
    , { t, activeTab: 'apiLanding', ...S })
}

export default LandingPage
