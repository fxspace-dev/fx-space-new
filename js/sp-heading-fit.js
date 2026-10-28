/* スマホのタイトル・見出しの大きさ（2026-10-24）
   スマホ（幅600px以下）では、ページのタイトルを30px・セクションの見出しを21.75pxにする（CSSは各ページの <style> の「スマホのタイトル・見出し」）。
   タイトル・見出しは1行ずつ折り返さない作りなので、画面に入りきらない長さのものだけ、入る大きさまで小さくする。 */
(function () {
  var MQ = window.matchMedia('(max-width: 600px)');
  function textWidth(el) {
    var lines = el.querySelectorAll('.line-text');
    if (lines.length) {
      var w = 0;
      lines.forEach(function (l) { w = Math.max(w, l.getBoundingClientRect().width); });
      return w;
    }
    var r = document.createRange();
    r.selectNodeContents(el);
    return r.getBoundingClientRect().width;
  }
  function room(el) {
    var box = el.closest('.ytt-spec-header, .ytt-sp-hero') || el.parentElement;
    var cs = getComputedStyle(box);
    return box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  }
  function fit() {
    document.querySelectorAll('.ytt-sp-hero-title, .ytt-spec-header h2').forEach(function (el) {
      el.style.removeProperty('font-size');
      if (!MQ.matches) return;
      var w = textWidth(el), a = room(el);
      if (w > a) {
        var fs = parseFloat(getComputedStyle(el).fontSize);
        el.style.setProperty('font-size', Math.floor(fs * a / w * 0.98 * 10) / 10 + 'px', 'important');
      }
    });
  }
  var busy = false;
  function refit() {
    if (busy) return;
    fit();
    // タイトル下の波線の幅は resize で計算し直されるので、大きさを決めたあとに一度だけ知らせる
    busy = true;
    window.dispatchEvent(new Event('resize'));
    busy = false;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refit); else refit();
  window.addEventListener('load', refit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refit);
  window.addEventListener('resize', function () { if (!busy) fit(); });
})();
