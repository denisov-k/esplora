// Freicoin: the light and dark themes, shared with the freicoin.ru wallet through its
// fw_theme_mode setting ('system', 'light' or 'dark'). Set before the page is drawn; the
// header's .theme-toggle button switches it, reloading the page.
(function () {
  var root = document.documentElement, key = 'fw_theme_mode', mode
  var system = function () {
    return window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  }
  try { mode = localStorage.getItem(key) } catch (e) {}
  var apply = function () {
    root.setAttribute('data-theme', mode == 'light' || mode == 'dark' ? mode : system())
  }
  apply()
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', function () {
      if (mode != 'light' && mode != 'dark') location.reload()
    })
  }
  document.addEventListener('click', function (e) {
    var button = e.target.closest && e.target.closest('.theme-toggle')
    if (!button) return
    e.preventDefault()
    mode = root.getAttribute('data-theme') == 'light' ? 'dark' : 'light'
    try { localStorage.setItem(key, mode) } catch (e) {}
    apply()
    // the pending block's grid takes its colours when drawn: draw the page again
    location.reload()
  })
})()
