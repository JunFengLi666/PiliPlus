// ==UserScript==
// @name         Bilibili Watch Later AI Summary
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Inject AI summaries into Bilibili watch later page
// @match        *://www.bilibili.com/watchlater/*
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    var md5 = (function() {
        function safeAdd(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }
        function bitRotateLeft(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
        function md5cmn(q, a, b, x, s, t) {
            return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
        }
        function md5ff(a, b, c, d, x, s, t) {
            return md5cmn((b & c) | (~b & d), a, b, x, s, t);
        }
        function md5gg(a, b, c, d, x, s, t) {
            return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
        }
        function md5hh(a, b, c, d, x, s, t) {
            return md5cmn(b ^ c ^ d, a, b, x, s, t);
        }
        function md5ii(a, b, c, d, x, s, t) {
            return md5cmn(c ^ (b | ~d), a, b, x, s, t);
        }
        function binlMD5(x, len) {
            x[len >> 5] |= 0x80 << (len % 32);
            x[((len + 64) >>> 9 << 4) + 14] = len;
            var i, olda, oldb, oldc, oldd,
                a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
            for (i = 0; i < x.length; i += 16) {
                olda = a; oldb = b; oldc = c; oldd = d;
                a = md5ff(a, b, c, d, x[i], 7, -680876936);
                d = md5ff(d, a, b, c, x[i+1], 12, -389564586);
                c = md5ff(c, d, a, b, x[i+2], 17, 606105819);
                b = md5ff(b, c, d, a, x[i+3], 22, -1044525330);
                a = md5ff(a, b, c, d, x[i+4], 7, -176418897);
                d = md5ff(d, a, b, c, x[i+5], 12, 1200080426);
                c = md5ff(c, d, a, b, x[i+6], 17, -1473231341);
                b = md5ff(b, c, d, a, x[i+7], 22, -45705983);
                a = md5ff(a, b, c, d, x[i+8], 7, 1770035416);
                d = md5ff(d, a, b, c, x[i+9], 12, -1958414417);
                c = md5ff(c, d, a, b, x[i+10], 17, -42063);
                b = md5ff(b, c, d, a, x[i+11], 22, -1990404162);
                a = md5ff(a, b, c, d, x[i+12], 7, 1804603682);
                d = md5ff(d, a, b, c, x[i+13], 12, -40341101);
                c = md5ff(c, d, a, b, x[i+14], 17, -1502002290);
                b = md5ff(b, c, d, a, x[i+15], 22, 1236535329);
                a = md5gg(a, b, c, d, x[i+1], 5, -165796510);
                d = md5gg(d, a, b, c, x[i+6], 9, -1069501632);
                c = md5gg(c, d, a, b, x[i+11], 14, 643717713);
                b = md5gg(b, c, d, a, x[i], 20, -373897302);
                a = md5gg(a, b, c, d, x[i+5], 5, -701558691);
                d = md5gg(d, a, b, c, x[i+10], 9, 38016083);
                c = md5gg(c, d, a, b, x[i+15], 14, -660478335);
                b = md5gg(b, c, d, a, x[i+4], 20, -405537848);
                a = md5gg(a, b, c, d, x[i+9], 5, 568446438);
                d = md5gg(d, a, b, c, x[i+14], 9, -1019803690);
                c = md5gg(c, d, a, b, x[i+3], 14, -187363961);
                b = md5gg(b, c, d, a, x[i+8], 20, 1163531501);
                a = md5gg(a, b, c, d, x[i+13], 5, -1444681467);
                d = md5gg(d, a, b, c, x[i+2], 9, -51403784);
                c = md5gg(c, d, a, b, x[i+7], 14, 1735328473);
                b = md5gg(b, c, d, a, x[i+12], 20, -1926607734);
                a = md5hh(a, b, c, d, x[i+5], 4, -378558);
                d = md5hh(d, a, b, c, x[i+8], 11, -2022574463);
                c = md5hh(c, d, a, b, x[i+11], 16, 1839030562);
                b = md5hh(b, c, d, a, x[i+14], 23, -35309556);
                a = md5hh(a, b, c, d, x[i+1], 4, -1530992060);
                d = md5hh(d, a, b, c, x[i+4], 11, 1272893353);
                c = md5hh(c, d, a, b, x[i+7], 16, -155497632);
                b = md5hh(b, c, d, a, x[i+10], 23, -1094730640);
                a = md5hh(a, b, c, d, x[i+13], 4, 681279174);
                d = md5hh(d, a, b, c, x[i], 11, -358537222);
                c = md5hh(c, d, a, b, x[i+3], 16, -722521979);
                b = md5hh(b, c, d, a, x[i+6], 23, 76029189);
                a = md5hh(a, b, c, d, x[i+9], 4, -640364487);
                d = md5hh(d, a, b, c, x[i+12], 11, -421815835);
                c = md5hh(c, d, a, b, x[i+15], 16, 530742520);
                b = md5hh(b, c, d, a, x[i+2], 23, -995338651);
                a = md5ii(a, b, c, d, x[i], 6, -198630844);
                d = md5ii(d, a, b, c, x[i+7], 10, 1126891415);
                c = md5ii(c, d, a, b, x[i+14], 15, -1416354905);
                b = md5ii(b, c, d, a, x[i+5], 21, -57434055);
                a = md5ii(a, b, c, d, x[i+12], 6, 1700485571);
                d = md5ii(d, a, b, c, x[i+3], 10, -1894986606);
                c = md5ii(c, d, a, b, x[i+10], 15, -1051523);
                b = md5ii(b, c, d, a, x[i+1], 21, -2054922799);
                a = md5ii(a, b, c, d, x[i+8], 6, 1873313359);
                d = md5ii(d, a, b, c, x[i+15], 10, -30611744);
                c = md5ii(c, d, a, b, x[i+6], 15, -1560198380);
                b = md5ii(b, c, d, a, x[i+13], 21, 1309151649);
                a = md5ii(a, b, c, d, x[i+4], 6, -145523070);
                d = md5ii(d, a, b, c, x[i+11], 10, -1120210379);
                c = md5ii(c, d, a, b, x[i+2], 15, 718787259);
                b = md5ii(b, c, d, a, x[i+9], 21, -343485551);
                a = safeAdd(a, olda);
                b = safeAdd(b, oldb);
                c = safeAdd(c, oldc);
                d = safeAdd(d, oldd);
            }
            return [a, b, c, d];
        }
        function binl2rstr(input) {
            var i, output = '';
            for (i = 0; i < input.length * 32; i += 8) {
                output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
            }
            return output;
        }
        function rstr2binl(input) {
            var i, output = [];
            output[(input.length >> 2) - 1] = undefined;
            for (i = 0; i < output.length; i += 1) {
                output[i] = 0;
            }
            for (i = 0; i < input.length * 8; i += 8) {
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
            }
            return output;
        }
        function rstrMD5(s) {
            return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
        }
        function rstr2hex(input) {
            var hexTab = '0123456789abcdef', output = '', x, i;
            for (i = 0; i < input.length; i += 1) {
                x = input.charCodeAt(i);
                output += hexTab.charAt((x >>> 4) & 0x0F) + hexTab.charAt(x & 0x0F);
            }
            return output;
        }
        function str2rstrUTF8(input) {
            return unescape(encodeURIComponent(input));
        }
        return function(string) {
            return rstr2hex(rstrMD5(str2rstrUTF8(string)));
        };
    })();

    var SETTINGS_KEY = 'bilibili_ai_summary_settings';
    var defaultSettings = {
        showAiSummary: true,
        showAiBeforePlay: false,
        autoLoadAll: true
    };

    function loadSettings() {
        try {
            var saved = localStorage.getItem(SETTINGS_KEY);
            if (saved) return Object.assign({}, defaultSettings, JSON.parse(saved));
        } catch (e) {}
        return Object.assign({}, defaultSettings);
    }

    function saveSettings(s) {
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
        } catch (e) {}
    }

    var settings = loadSettings();
    var cache = new Map();
    var mixinKeyCache = { key: null, expire: 0 };

    var rateLimiter = {
        queue: [],
        running: 0,
        maxConcurrent: 3,
        interval: 200,
        lastStart: 0,

        add: function(fn) {
            return new Promise(function(resolve, reject) {
                rateLimiter.queue.push({ fn: fn, resolve: resolve, reject: reject });
                rateLimiter.check();
            });
        },

        check: function() {
            var self = rateLimiter;
            if (self.queue.length === 0 || self.running >= self.maxConcurrent) return;
            var now = Date.now();
            var wait = Math.max(0, self.interval - (now - self.lastStart));
            setTimeout(function() {
                if (self.running >= self.maxConcurrent || self.queue.length === 0) return;
                self.lastStart = Date.now();
                var item = self.queue.shift();
                self.running++;
                Promise.resolve().then(function() {
                    return item.fn();
                }).then(function(result) {
                    item.resolve(result);
                }).catch(function(err) {
                    item.reject(err);
                }).then(function() {
                    self.running--;
                    self.check();
                });
            }, wait);
        }
    };

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : '';
    }

    var ENC_TAB = [46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13];

    function getMixinKey(raw) {
        return ENC_TAB.map(function(i) { return raw[i]; }).join('').slice(0, 32);
    }

    async function fetchMixinKey() {
        if (mixinKeyCache.key && Date.now() < mixinKeyCache.expire) {
            return mixinKeyCache.key;
        }
        var resp = await fetch('https://api.bilibili.com/x/web-interface/nav', {
            credentials: 'include'
        });
        var data = await resp.json();
        if (data.code !== 0) throw new Error('nav API error');
        var imgUrl = data.data.wbi_img.img_url;
        var subUrl = data.data.wbi_img.sub_url;
        var imgKey = imgUrl.split('/').pop().split('.')[0];
        var subKey = subUrl.split('/').pop().split('.')[0];
        var mixinKey = getMixinKey(imgKey + subKey);
        mixinKeyCache.key = mixinKey;
        mixinKeyCache.expire = Date.now() + 10 * 60 * 1000;
        return mixinKey;
    }

    async function encWbi(params) {
        var mixinKey = await fetchMixinKey();
        params.wts = Math.floor(Date.now() / 1000);
        var sortedKeys = Object.keys(params).sort();
        var chrFilter = /[!'()*]/g;
        var query = sortedKeys.map(function(key) {
            var value = params[key].toString().replace(chrFilter, '');
            return encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }).join('&');
        params.w_rid = md5(query + mixinKey);
        return params;
    }

    async function fetchVideoDetail(bvid) {
        var cacheKey = 'detail_' + bvid;
        if (cache.has(cacheKey)) return cache.get(cacheKey);
        return rateLimiter.add(function() {
            return fetch('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid, {
                credentials: 'include'
            })
            .then(function(resp) { return resp.json(); })
            .then(function(data) {
                if (data.code !== 0) throw new Error('video detail error');
                var result = {
                    aid: data.data.aid,
                    bvid: data.data.bvid,
                    cid: data.data.cid,
                    ownerMid: data.data.owner.mid,
                    title: data.data.title
                };
                cache.set(cacheKey, result);
                return result;
            });
        });
    }

    async function fetchAiConclusion(bvid, cid, upMid) {
        var cacheKey = 'conclusion_' + bvid;
        if (cache.has(cacheKey)) return cache.get(cacheKey);
        var params = await encWbi({
            bvid: bvid,
            cid: cid,
            up_mid: upMid
        });
        return rateLimiter.add(function() {
            var sortedKeys = Object.keys(params).sort();
            var chrFilter = /[!'()*]/g;
            var query = sortedKeys.map(function(key) {
                var value = params[key].toString().replace(chrFilter, '');
                return encodeURIComponent(key) + '=' + encodeURIComponent(value);
            }).join('&');
            return fetch('https://api.bilibili.com/x/web-interface/view/conclusion/get?' + query, {
                credentials: 'include'
            })
            .then(function(resp) { return resp.json(); })
            .then(function(data) {
                var result = null;
                if (data.code === 0 && data.data) {
                    var modelResult = data.data.model_result || data.data.result;
                    if (modelResult) {
                        if (modelResult.result_type === 2 && modelResult.summary) {
                            result = modelResult.summary;
                        } else if (modelResult.outline && modelResult.outline.length > 0) {
                            result = modelResult.outline.map(function(item) {
                                return item.title + (item.part_summary ? '：' + item.part_summary : '');
                            }).join('\n');
                        }
                    }
                }
                cache.set(cacheKey, result);
                return result;
            });
        });
    }

    async function removeFromWatchLater(aid) {
        var csrf = getCookie('bili_jct');
        var body = 'resources=' + encodeURIComponent(aid) + '&csrf=' + encodeURIComponent(csrf);
        return fetch('https://api.bilibili.com/x/v2/history/toview/v2/dels', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        })
        .then(function(resp) { return resp.json(); })
        .then(function(data) { return data.code === 0; });
    }

    function injectCSS() {
        var style = document.createElement('style');
        style.textContent = [
            '.ai-summary-inline{padding:8px 12px;margin:6px 0;background:rgba(0,161,214,0.06);border-radius:6px;border-left:3px solid #00a1d6;font-size:12px;line-height:1.6;position:relative;transition:all .2s ease}',
            '.ai-summary-inline:hover{background:rgba(0,161,214,0.12)}',
            '.ai-summary-badge{display:inline-block;background:linear-gradient(135deg,#00a1d6,#00d4aa);color:#fff;padding:1px 8px;border-radius:10px;font-size:11px;margin-bottom:4px;font-weight:500}',
            '.ai-summary-text{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;color:#505050;padding-right:60px;cursor:pointer}',
            '.ai-summary-text.expanded{-webkit-line-clamp:unset;padding-right:0}',
            '.ai-summary-remove{position:absolute;right:8px;top:8px;background:#ff6b6b;color:#fff;border:none;padding:2px 10px;border-radius:4px;cursor:pointer;font-size:11px;opacity:.8;transition:opacity .2s}',
            '.ai-summary-remove:hover{opacity:1}',
            '.ai-summary-loading{color:#999;font-size:12px;padding:4px 0}',
            '.ai-summary-none{color:#999;font-size:12px;padding:4px 0;font-style:italic}',
            '.ai-summary-modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;animation:ai-summary-fade-in .2s ease}',
            '@keyframes ai-summary-fade-in{from{opacity:0}to{opacity:1}}',
            '.ai-summary-modal{background:#fff;border-radius:12px;padding:24px;max-width:480px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.2);animation:ai-summary-slide-in .3s ease}',
            '@keyframes ai-summary-slide-in{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}',
            '.ai-summary-modal h3{margin:0 0 16px;font-size:16px;color:#333;display:flex;align-items:center;gap:8px}',
            '.ai-summary-modal .summary-content{margin:12px 0;padding:16px;background:#f4f5f7;border-radius:8px;font-size:14px;line-height:1.8;color:#333;max-height:300px;overflow-y:auto;white-space:pre-wrap}',
            '.ai-summary-modal .modal-actions{display:flex;gap:12px;justify-content:flex-end;margin-top:20px}',
            '.ai-summary-modal .btn-play{background:#00a1d6;color:#fff;border:none;padding:8px 24px;border-radius:6px;cursor:pointer;font-size:14px;transition:background .2s}',
            '.ai-summary-modal .btn-play:hover{background:#00b5e5}',
            '.ai-summary-modal .btn-remove{background:#ff6b6b;color:#fff;border:none;padding:8px 24px;border-radius:6px;cursor:pointer;font-size:14px;transition:background .2s}',
            '.ai-summary-modal .btn-remove:hover{background:#ff5252}',
            '.ai-summary-settings-btn{position:fixed;bottom:24px;right:24px;width:44px;height:44px;background:linear-gradient(135deg,#00a1d6,#00d4aa);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:9999;font-size:22px;box-shadow:0 4px 12px rgba(0,161,214,0.3);transition:transform .2s,box-shadow .2s;user-select:none}',
            '.ai-summary-settings-btn:hover{transform:scale(1.1);box-shadow:0 6px 16px rgba(0,161,214,0.4)}',
            '.ai-summary-settings-panel{position:fixed;bottom:80px;right:24px;background:#fff;border-radius:12px;padding:20px;box-shadow:0 8px 32px rgba(0,0,0,0.15);z-index:9999;width:300px;display:none;animation:ai-summary-slide-in .2s ease}',
            '.ai-summary-settings-panel.show{display:block}',
            '.ai-summary-settings-panel h4{margin:0 0 16px;font-size:15px;color:#333;font-weight:600}',
            '.ai-summary-settings-panel .setting-item{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}',
            '.ai-summary-settings-panel .setting-item:last-child{border-bottom:none}',
            '.ai-summary-settings-panel .setting-label{font-size:13px;color:#333;flex:1;margin-right:12px}',
            '.ai-summary-toggle{position:relative;width:44px;height:24px;background:#ccc;border-radius:12px;cursor:pointer;transition:background .3s;flex-shrink:0}',
            '.ai-summary-toggle.active{background:#00a1d6}',
            '.ai-summary-toggle::after{content:"";position:absolute;top:2px;left:2px;width:20px;height:20px;background:#fff;border-radius:50%;transition:transform .3s;box-shadow:0 1px 3px rgba(0,0,0,0.2)}',
            '.ai-summary-toggle.active::after{transform:translateX(20px)}',
            'html.bili-dark .ai-summary-inline,html.dark .ai-summary-inline{background:rgba(0,161,214,0.1)}',
            'html.bili-dark .ai-summary-text,html.dark .ai-summary-text{color:#aaa}',
            'html.bili-dark .ai-summary-modal,html.dark .ai-summary-modal{background:#222;color:#eee}',
            'html.bili-dark .ai-summary-modal h3,html.dark .ai-summary-modal h3{color:#eee}',
            'html.bili-dark .ai-summary-modal .summary-content,html.dark .ai-summary-modal .summary-content{background:#333;color:#ccc}',
            'html.bili-dark .ai-summary-settings-panel,html.dark .ai-summary-settings-panel{background:#222}',
            'html.bili-dark .ai-summary-settings-panel h4,html.dark .ai-summary-settings-panel h4{color:#eee}',
            'html.bili-dark .ai-summary-settings-panel .setting-label,html.dark .ai-summary-settings-panel .setting-label{color:#ccc}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function extractVideoCards() {
        var cards = [];
        var seen = new Set();
        var items = document.querySelectorAll('.list-item, .watch-later-item, .video-card, [data-bvid]');
        if (items.length > 0) {
            items.forEach(function(item) {
                if (item.hasAttribute('data-ai-summary-processed')) return;
                var bvid = item.getAttribute('data-bvid');
                var link = item.querySelector('a[href*="/video/BV"]');
                if (!bvid && link) {
                    var m = link.href.match(/\/video\/(BV[a-zA-Z0-9]+)/);
                    if (m) bvid = m[1];
                }
                if (bvid && !seen.has(bvid)) {
                    seen.add(bvid);
                    cards.push({ element: item, bvid: bvid, link: link });
                }
            });
        }
        if (cards.length === 0) {
            var links = document.querySelectorAll('a[href*="/video/BV"]');
            links.forEach(function(link) {
                var m = link.href.match(/\/video\/(BV[a-zA-Z0-9]+)/);
                if (!m) return;
                var bvid = m[1];
                if (seen.has(bvid)) return;
                var card = link.closest('.list-item, .watch-later-item, .video-card, li, [class*="item"]') || link.parentElement.parentElement;
                if (!card || card.hasAttribute('data-ai-summary-processed')) return;
                seen.add(bvid);
                cards.push({ element: card, bvid: bvid, link: link });
            });
        }
        return cards;
    }

    function injectSummary(cardEl, bvid, summary, aid) {
        var existing = cardEl.querySelector('.ai-summary-inline');
        if (existing) existing.remove();

        var div = document.createElement('div');
        div.className = 'ai-summary-inline';

        var badge = document.createElement('span');
        badge.className = 'ai-summary-badge';
        badge.textContent = '\uD83E\uDD16 AI\u603B\u7ED3';
        div.appendChild(badge);

        if (summary) {
            var textEl = document.createElement('div');
            textEl.className = 'ai-summary-text';
            textEl.textContent = summary;
            textEl.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                textEl.classList.toggle('expanded');
            });
            div.appendChild(textEl);
        } else {
            var noneEl = document.createElement('div');
            noneEl.className = 'ai-summary-none';
            noneEl.textContent = '\u6682\u65E0AI\u603B\u7ED3';
            div.appendChild(noneEl);
        }

        var removeBtn = document.createElement('button');
        removeBtn.className = 'ai-summary-remove';
        removeBtn.textContent = '\u4E0D\u770B\u4E86';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            handleRemove(aid, cardEl);
        });
        div.appendChild(removeBtn);

        var infoEl = cardEl.querySelector('.av-txt, .info, .video-info, [class*="title"], [class*="info"]');
        if (infoEl && infoEl.parentElement === cardEl) {
            cardEl.insertBefore(div, infoEl.nextSibling);
        } else if (infoEl) {
            infoEl.parentElement.insertBefore(div, infoEl.nextSibling);
        } else {
            cardEl.appendChild(div);
        }
    }

    function injectLoading(cardEl) {
        var existing = cardEl.querySelector('.ai-summary-inline');
        if (existing) return;
        var div = document.createElement('div');
        div.className = 'ai-summary-inline';
        var badge = document.createElement('span');
        badge.className = 'ai-summary-badge';
        badge.textContent = '\uD83E\uDD16 AI\u603B\u7ED3';
        div.appendChild(badge);
        var loading = document.createElement('div');
        loading.className = 'ai-summary-loading';
        loading.textContent = '\u52A0\u8F7D\u4E2D...';
        div.appendChild(loading);
        var infoEl = cardEl.querySelector('.av-txt, .info, .video-info, [class*="title"], [class*="info"]');
        if (infoEl && infoEl.parentElement === cardEl) {
            cardEl.insertBefore(div, infoEl.nextSibling);
        } else if (infoEl) {
            infoEl.parentElement.insertBefore(div, infoEl.nextSibling);
        } else {
            cardEl.appendChild(div);
        }
    }

    async function handleRemove(aid, cardEl) {
        try {
            var success = await removeFromWatchLater(aid);
            if (success) {
                cardEl.style.transition = 'opacity 0.3s, transform 0.3s';
                cardEl.style.opacity = '0';
                cardEl.style.transform = 'translateX(20px)';
                setTimeout(function() {
                    cardEl.remove();
                }, 300);
            }
        } catch (e) {}
    }

    function createModal(bvid, summary, videoUrl, aid) {
        var overlay = document.createElement('div');
        overlay.className = 'ai-summary-modal-overlay';

        var modal = document.createElement('div');
        modal.className = 'ai-summary-modal';

        var h3 = document.createElement('h3');
        h3.textContent = '\uD83E\uDD16 AI\u89C6\u9891\u603B\u7ED3';
        modal.appendChild(h3);

        var content = document.createElement('div');
        content.className = 'summary-content';
        if (summary) {
            content.textContent = summary;
        } else {
            content.textContent = '\u6682\u65E0AI\u603B\u7ED3';
        }
        modal.appendChild(content);

        var actions = document.createElement('div');
        actions.className = 'modal-actions';

        var removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.textContent = '\u4E0D\u770B\u4E86\uFF0C\u79FB\u9664';
        removeBtn.addEventListener('click', function() {
            overlay.remove();
            if (aid) {
                var cardEl = document.querySelector('[data-bvid="' + bvid + '"]') ||
                    document.querySelector('a[href*="/video/' + bvid + '"]');
                if (cardEl) {
                    var container = cardEl.closest('.list-item, .watch-later-item, .video-card, li, [class*="item"]') || cardEl.parentElement.parentElement;
                    handleRemove(aid, container);
                } else {
                    removeFromWatchLater(aid);
                }
            }
        });
        actions.appendChild(removeBtn);

        var playBtn = document.createElement('button');
        playBtn.className = 'btn-play';
        playBtn.textContent = '\u64AD\u653E\u89C6\u9891';
        playBtn.addEventListener('click', function() {
            overlay.remove();
            if (videoUrl) window.location.href = videoUrl;
        });
        actions.appendChild(playBtn);

        modal.appendChild(actions);
        overlay.appendChild(modal);

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.remove();
        });

        document.body.appendChild(overlay);
        return overlay;
    }

    function createSettingsPanel() {
        var btn = document.createElement('div');
        btn.className = 'ai-summary-settings-btn';
        btn.textContent = '\u2699';
        document.body.appendChild(btn);

        var panel = document.createElement('div');
        panel.className = 'ai-summary-settings-panel';

        var h4 = document.createElement('h4');
        h4.textContent = 'AI\u603B\u7ED3\u8BBE\u7F6E';
        panel.appendChild(h4);

        var toggles = [
            { key: 'showAiSummary', label: '\u5728\u7A0D\u540E\u89C2\u770B\u4E2D\u663E\u793AAI\u603B\u7ED3' },
            { key: 'showAiBeforePlay', label: '\u70B9\u51FB\u89C6\u9891\u524D\u5F39\u51FA\u603B\u7ED3' },
            { key: 'autoLoadAll', label: '\u81EA\u52A8\u52A0\u8F7D\u6240\u6709AI\u603B\u7ED3' }
        ];

        toggles.forEach(function(toggle) {
            var item = document.createElement('div');
            item.className = 'setting-item';

            var label = document.createElement('span');
            label.className = 'setting-label';
            label.textContent = toggle.label;
            item.appendChild(label);

            var switchEl = document.createElement('div');
            switchEl.className = 'ai-summary-toggle' + (settings[toggle.key] ? ' active' : '');
            switchEl.addEventListener('click', function() {
                settings[toggle.key] = !settings[toggle.key];
                switchEl.classList.toggle('active');
                saveSettings(settings);
            });
            item.appendChild(switchEl);
            panel.appendChild(item);
        });

        document.body.appendChild(panel);

        var isOpen = false;
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            isOpen = !isOpen;
            panel.classList.toggle('show', isOpen);
        });

        document.addEventListener('click', function(e) {
            if (isOpen && !panel.contains(e.target) && e.target !== btn) {
                isOpen = false;
                panel.classList.remove('show');
            }
        });
    }

    function setupClickInterception() {
        document.addEventListener('click', function(e) {
            if (!settings.showAiBeforePlay) return;
            var link = e.target.closest('a[href*="/video/BV"]');
            if (!link) return;
            var m = link.href.match(/\/video\/(BV[a-zA-Z0-9]+)/);
            if (!m) return;
            var bvid = m[1];
            e.preventDefault();
            e.stopPropagation();
            var videoUrl = link.href;

            var cardEl = link.closest('.list-item, .watch-later-item, .video-card, li, [class*="item"]') || link.parentElement.parentElement;

            var showSummaryModal = function(summary, aid) {
                createModal(bvid, summary, videoUrl, aid);
            };

            var cacheKey = 'conclusion_' + bvid;
            if (cache.has(cacheKey)) {
                var detailCacheKey = 'detail_' + bvid;
                var aid = null;
                if (cache.has(detailCacheKey)) {
                    aid = cache.get(detailCacheKey).aid;
                }
                showSummaryModal(cache.get(cacheKey), aid);
                return;
            }

            var overlay = createModal(bvid, null, null, null);
            var contentEl = overlay.querySelector('.summary-content');
            if (contentEl) contentEl.textContent = '\u52A0\u8F7D\u4E2D...';

            fetchVideoDetail(bvid).then(function(detail) {
                return fetchAiConclusion(bvid, detail.cid, detail.ownerMid).then(function(summary) {
                    return { summary: summary, aid: detail.aid };
                });
            }).then(function(result) {
                overlay.remove();
                showSummaryModal(result.summary, result.aid);
            }).catch(function() {
                overlay.remove();
                showSummaryModal(null, null);
            });
        }, true);
    }

    async function processCard(cardEl, bvid) {
        cardEl.setAttribute('data-ai-summary-processed', '1');
        cardEl.setAttribute('data-bvid', bvid);

        if (!settings.showAiSummary) return;
        if (!settings.autoLoadAll) return;

        injectLoading(cardEl);

        try {
            var detail = await fetchVideoDetail(bvid);
            var summary = await fetchAiConclusion(bvid, detail.cid, detail.ownerMid);
            injectSummary(cardEl, bvid, summary, detail.aid);
        } catch (e) {
            var existing = cardEl.querySelector('.ai-summary-inline');
            if (existing) existing.remove();
            var div = document.createElement('div');
            div.className = 'ai-summary-inline';
            var badge = document.createElement('span');
            badge.className = 'ai-summary-badge';
            badge.textContent = '\uD83E\uDD16 AI\u603B\u7ED3';
            div.appendChild(badge);
            var noneEl = document.createElement('div');
            noneEl.className = 'ai-summary-none';
            noneEl.textContent = '\u52A0\u8F7D\u5931\u8D25';
            div.appendChild(noneEl);
            cardEl.appendChild(div);
        }
    }

    function scanAndProcess() {
        var cards = extractVideoCards();
        cards.forEach(function(card) {
            processCard(card.element, card.bvid);
        });
    }

    var scanTimer = null;
    function debouncedScan() {
        if (scanTimer) clearTimeout(scanTimer);
        scanTimer = setTimeout(scanAndProcess, 500);
    }

    function init() {
        injectCSS();
        createSettingsPanel();
        setupClickInterception();

        scanAndProcess();

        var observer = new MutationObserver(function(mutations) {
            var shouldScan = false;
            for (var i = 0; i < mutations.length; i++) {
                if (mutations[i].addedNodes.length > 0) {
                    shouldScan = true;
                    break;
                }
            }
            if (shouldScan) debouncedScan();
        });

        var target = document.querySelector('#app') || document.body;
        observer.observe(target, { childList: true, subtree: true });

        window.addEventListener('hashchange', function() {
            setTimeout(scanAndProcess, 1000);
        });

        var urlCheckInterval = setInterval(function() {
            var cards = extractVideoCards();
            if (cards.length > 0) {
                scanAndProcess();
                clearInterval(urlCheckInterval);
            }
        }, 2000);

        setTimeout(function() {
            clearInterval(urlCheckInterval);
        }, 30000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
