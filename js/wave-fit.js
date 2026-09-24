/* 見出しの下の波線を、YTT特設ページのタイトルと同じ決まりにそろえる（2026-09-24 airiさん「すべての波線を同じように」）
   ・線の高さ＝その見出しの文字の大きさの1.01倍（太さが文字に比例する）
   ・元の波線を縦横比そのままで使う。見出しの幅が波線より短いときは、はみ出した右側を切る。長いときは横にだけ伸ばす（太さは変わらない）
   ・タイトル（2行の大きな見出し）の波線は、各ページの小さなプログラムが別にそろえているので、ここでは触らない
   読み込み方：<script src="js/wave-fit.js?v=…" defer></script> */
(function () {
  var SEL = 'img[src*="wave-"], img[src*="underline-wave"]';

  /* 波線がどの見出しの下にあるか：見出しの中にあればそれ、なければ近くの親の中で波線より前にある見出し */
  function headingFor(img) {
    var h = img.closest('h1,h2,h3,h4');
    if (h) return h;
    var e = img;
    for (var i = 0; i < 3 && e.parentElement; i++) {
      e = e.parentElement;
      var hs = [].filter.call(e.querySelectorAll('h1,h2,h3,h4'), function (x) {
        return x.compareDocumentPosition(img) & Node.DOCUMENT_POSITION_FOLLOWING;
      });
      if (hs.length) return hs[hs.length - 1];
    }
    return null;
  }

  function set(img, k, v) { img.style.setProperty(k, v, 'important'); }

  function fitOne(img) {
    if (img.closest('.tw-wave, span.ytt-title-wave')) return; /* タイトルの波線は別のプログラム */
    var h = headingFor(img);
    if (!h) return;
    var fs = parseFloat(getComputedStyle(h).fontSize) || 16;
    var H = fs * 1.01;
    var bw = img.getBoundingClientRect().width;
    if (!bw) return; /* 見えていない（閉じたタブの中など）ときは、見えたときにやり直す */
    var ratio = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 8.5;
    set(img, 'height', H.toFixed(2) + 'px');
    set(img, 'max-height', 'none');
    set(img, 'aspect-ratio', 'auto');
    if (bw < H * ratio - 0.5) {
      set(img, 'object-fit', 'cover');
      set(img, 'object-position', 'left center');
    } else {
      set(img, 'object-fit', 'fill');
    }
  }

  /* 2行に分けて行ごとに波線を敷く見出し（背景の波線）：高さ＝文字の1.01倍、長い方の行に合わせた大きさを短い行でも使う */
  function fitBgLines() {
    document.querySelectorAll('.h2-lines').forEach(function (h) {
      var fs = parseFloat(getComputedStyle(h).fontSize) || 16, w = fs * 1.01 * 1866 / 207;
      h.querySelectorAll('.h2-line').forEach(function (t) { w = Math.max(w, t.getBoundingClientRect().width); });
      h.style.setProperty('--wave-w', Math.ceil(w) + 'px');
    });
  }

  var queued = false;
  function fitAll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      document.querySelectorAll(SEL).forEach(fitOne);
      fitBgLines();
    });
  }

  function start() {
    fitAll();
    document.querySelectorAll(SEL).forEach(function (img) {
      if (!img.complete) img.addEventListener('load', fitAll);
    });
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(fitAll);
      document.querySelectorAll(SEL).forEach(function (img) { if (img.parentElement) ro.observe(img.parentElement); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', fitAll);
  window.addEventListener('resize', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
})();
