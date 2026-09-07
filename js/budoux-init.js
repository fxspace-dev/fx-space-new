/* BudouX（日本語の文節改行）を全ページ共通で適用する。
   - js/budoux-ja.min.js（同梱。CDN だと広告ブロッカー等で読み込めず、文節改行が効かないことがあるため自前で配信）を先に読み込む
   - 日本語を含むテキストノードにだけ <wbr> を入れる（script/style/code/pre/svg 内は対象外）
   - 適用できたら <body class="budoux-ready"> を付け、CSS 側で word-break: keep-all に切り替える
     （適用できなかった場合は通常の折り返しのまま＝見切れない安全側）
   - すでに wbr が入っている要素（手動指定）はそのまま */
(function () {
    var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, OPTION: 1 };
    function applyBudouX(parser, root) {
        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (n) {
                if (!n.nodeValue || !/[぀-ヿ㐀-鿿]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
                var p = n.parentNode;
                if (!p || SKIP[p.nodeName] || (p.closest && (p.closest('svg') || p.closest('[data-no-budoux]')))) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(function (n) {
            var segs = parser.parse(n.nodeValue);
            if (segs.length < 2) return;
            var frag = document.createDocumentFragment();
            segs.forEach(function (s, i) {
                frag.appendChild(document.createTextNode(s));
                if (i < segs.length - 1) frag.appendChild(document.createElement('wbr'));
            });
            n.parentNode.replaceChild(frag, n);
        });
    }
    function run() {
        if (!window.budoux || !window.budoux.loadDefaultJapaneseParser) return;
        try {
            var parser = window.budoux.loadDefaultJapaneseParser();
            applyBudouX(parser, document.body);
            document.body.classList.add('budoux-ready');
        } catch (e) {}
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
})();
