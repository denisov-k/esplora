const hasCam = process.browser && navigator.mediaDevices && navigator.mediaDevices.getUserMedia

export default () =>

<div className="toggle-container">
    <div className="burger-icon">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div className="toggle-menu">
      <div className="section2">
        <div className="link-list">
          <h4 className="menu-title font-h5">Freicoin</h4>
          <ul className="font-p3">
            <li><a href="https://freicoin.ru/" target="_blank">freicoin.ru</a></li>
            <li><a href="https://github.com/tradecraftio/tradecraft" target="_blank">Freicoin source code</a></li>
          </ul>
        </div>
        <div className="link-list">
          <h4 className="menu-title font-h5">Developer Tools</h4>
          <ul className="font-p3">
            <li><a href="explorer-api">API</a></li>
            <li><a href="tx/push">Broadcast Transactions</a></li>
            <li> { hasCam ? <a href="scan-qr">Scan QR</a> : ""}</li>
          </ul>
        </div>
      </div>
    </div>
</div>
