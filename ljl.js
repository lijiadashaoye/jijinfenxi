define("common", [], function () {
        return function () {
            return {
                getSearch: function (a, t) {
                    var e = t ? t.match(/(?:\?)[^\#]*?(?=[\?|\#])/g)[0].substr(1) : location.search.substr(1);
                    if (!e) return "";
                    var s = e.split("&"),
                        n = {};
                    return $.each(s, function (a, t) {
                        var e = t.split("=");
                        n[e[0]] = e[1]
                    }), n[a] ? n[a] : ""
                },
                setSearch: function (a, t, e) {
                    var s = e || location.href,
                        n = s.split("#")[0],
                        i = s.split("#")[1],
                        o = n.split("?")[1],
                        r = {};
                    if (o) {
                        var d = o.split("&");
                        $.each(d, function (a, t) {
                            var e = t.split("=");
                            r[e[0]] = e[1]
                        })
                    }
                    r[a] = t;
                    var l = "";
                    return $.each(r, function (a, t) {
                        l += "&" + a + "=" + t
                    }), {
                        url: n.split("?")[0] + "?" + l.substr(1) + (i ? "#" + i : ""),
                        search: l.substr(1)
                    }
                },
                alertMessage: function (a, t) {
                    var e = {
                            height: 50,
                            bothPadding: 20,
                            radius: 4,
                            opacity: .5,
                            fontSize: 16,
                            backgroundColor: "#000",
                            color: "#fff"
                        },
                        s = $.extend({}, e, t);
                    $("#_msg").remove();
                    var n = '<div class="_msg" id="_msg" style="z-index: 200;line-height: ' + s.height + "px;color: " + s.color + ";position: fixed;top: 50%;margin-top:  -30px;font-size: " + s.fontSize + 'px;width: 100%;text-align: center;"><p style="border-radius: ' + s.radius + "px;transform: scale(1.5);transition: all .3s;opacity: 0;background-color: " + s.backgroundColor + ';  overflow:hidden;zoom:1; position:;display: inline-block;*display: inline;"><span style="float:left;padding: 0 ' + s.bothPadding + 'px;">' + a + "</span></p></div>";
                    $("body").append(n),
                        function (a) {
                            var t = $(this);
                            setTimeout(function () {
                                t.css({
                                    transform: "scale(1)",
                                    opacity: s.opacity
                                })
                            }, 0), setTimeout(function () {
                                t.css({
                                    opacity: "0"
                                })
                            }, 2e3), setTimeout(function () {
                                t.parent("._msg").remove()
                            }, 2300)
                        }.call($("#_msg p"))
                },
                timeFormat: function (a, t) {
                    var e = new Date;
                    e.setTime(a);
                    var s = e.getFullYear(),
                        n = t,
                        i = {
                            M: e.getMonth() + 1,
                            d: e.getDate(),
                            H: e.getHours(),
                            m: e.getMinutes(),
                            s: e.getSeconds()
                        };
                    /(y+)/.test(n) && (n = n.replace(RegExp.$1, s));
                    for (var o in i) new RegExp("(" + o + "+)").test(n) && (n = n.replace(RegExp.$1, 1 === RegExp.$1.length ? i[o] : ("00" + i[o]).substring(("" + i[o]).length)));
                    return n
                }
            }
        }()
    }), define("fdurl", [], function () {
        return {
            sydata: "/{code}/json/wfsy.js",
            gzdata: ~location.hostname.indexOf("test") ? "//testfund.10jqka.com.cn/guzhi/?module=api&controller=index&action=chart&info={code}&start={time}" : "//gz-fund.10jqka.com.cn/?module=api&controller=index&action=chart&info={code}&start={time}",
            samefund: "/publicapi/staticsyph/{type}_{key}_desc.txt",
            diagnose: "/public/awc/{code}.json",
            unitvalue: "/{code}/json/jsondwjz.json",
            totalvalue: "/{code}/json/jsonljjz.json",
            sharesplit: "/{code}/fhcf.js",
            fundzs: "/{code}/json/jsonfqjz.json",
            fundrate: "/ifindRank/quarter_year_{code}.json",
            fundaverage: "/ifindRank/commonTypeAvgFqNet/{code}.json",
            compareline: "/{code}.js",
            rankdata: "/ifindRank/commonTypeRankInfo_{code}.json",
            ownfund: "/myfund.php?userid={userid}&do={do}&codes={codes}",
            stateJudge: "/data/client/myfund/{code}",
            sybdata: "/sybdata.txt",
            lcbdata: "/public/dqlc/data.txt",
            likedata: "/web/fund/guessYouLike/0_{userid}",
            fromsy: "/publicapi/staticsyph/guessyoulike.txt",
            importstock: "/web/fund/stockAndBond/{code}",
            noticedata: "/interface/net/pubnote2/{type}_{code}_{page}_{count}",
            newsdata: "/publicapi/zxlist.json"
        }
    }),
    function (a, t) {
        "function" == typeof define && define.amd ? define("search", t) : "object" == typeof exports ? module.exports = t() : a.searchFunc = t()
    }(this, function () {
        function a(a) {
            this.defaults = {
                searchId: "",
                type: "stock,ijjfund",
                placeholder: "请输入代码、简称或拼音",
                count: "5",
                searchBtnFont: "搜索",
                otherKey: "",
                ifCss: !1,
                successCallback: null,
                focusCallback: null,
                blurCallback: null
            }, this.domClass = {
                iptId: "sh-input",
                disId: "sh-result",
                btnId: "sh-button",
                boxId: "searchBox"
            }, this.dom = {
                iptId: "#sh-input",
                disId: "#sh-result",
                btnId: "#sh-button",
                boxId: "#searchBox"
            }, this._data = {
                url: "//news.10jqka.com.cn/public/index_keyboard_{keyword}_{type}_{count}_1_jsonp.html",
                callback: this.successCallback
            }, this.init(a)
        }
        return a.prototype = {
            init: function (a) {
                var t = this;
                this.opts = $.extend({}, this.defaults, a), this.dom = {
                    iptId: "#sh-input" + this.opts.otherKey,
                    disId: "#sh-result" + this.opts.otherKey,
                    btnId: "#sh-button" + this.opts.otherKey,
                    boxId: "#searchBox" + this.opts.otherKey
                }, this.opts.ifCss && this.addCss(), this.addInput(), this._data.type = this.opts.type.split(","), this._data.url = this._data.url.replace("{type}", this.opts.type).replace("{count}", this.opts.count), this._data.callback = "function" == typeof this.opts.successCallback ? this.opts.successCallback : this._data.callback, this._data.focusCallback = "function" == typeof this.opts.focusCallback ? this.opts.focusCallback : null, this._data.blurCallback = "function" == typeof this.opts.blurCallback ? this.opts.blurCallback : null, this._data.namelist = [], this._data.index = -1, this._data.runFunc = null, this._data.target = $(this.dom.iptId), this._data.listbox = $(this.dom.disId), this._data.button = $(this.dom.btnId), this._data.ajaxProcess = null, this._data.keyword = "", $.each(this._data.type, function (a, e) {
                    var s = t.tools.keyToName(e);
                    t._data.namelist.push(s)
                }), this._data.target.off().on({
                    "input propertychange": function () {
                        var a = this;
                        clearTimeout(t._data.runFunc), t._data.runFunc = setTimeout(function () {
                            t._data.ajaxProcess && t._data.ajaxProcess.abort(), t.getInput.call(t, a)
                        }, 300)
                    },
                    keydown: function (a) {
                        t.getKeydown.call(t, a)
                    },
                    focus: function () {
                        t.tools.focusPlaceholder.call(t, this), t._data.focusCallback && t._data.focusCallback()
                    },
                    blur: function () {
                        t.tools.blurPlaceholder.call(t, this), t._data.blurCallback && t._data.blurCallback()
                    }
                }), navigator.userAgent.toLowerCase().indexOf("msie") > -1 && "MSIE9.0" === navigator.appVersion.split(";")[1].replace(/[ ]/g, "") && this._data.target.off("input propertychange").on({
                    keyup: function (a) {
                        var e = a.which;
                        if ("13" != e && "38" != e && "40" != e) {
                            var s = this;
                            clearTimeout(t._data.runFunc), t._data.runFunc = setTimeout(function () {
                                t._data.ajaxProcess && t._data.ajaxProcess.abort(), t.getInput.call(t, s)
                            }, 300)
                        }
                    }
                }), this.idEstimate() || (this._data.button.off().on({
                    click: function () {
                        t.clickEnter()
                    }
                }), this._data.listbox.on({
                    click: function () {
                        t.forDD.skip.call(t, this)
                    },
                    mouseenter: function () {
                        t.forDD.trig.call(t, this)
                    }
                }, "dd"), $(document).click(function (a) {
                    $(t.dom.boxId).is(a.target) || 0 !== $(t.dom.boxId).has(a.target).length || $(t._data.listbox).hide()
                }))
            },
            addCss: function () {
                $(this.opts.searchId).append('<link rel="stylesheet" href="http://testfund.10jqka.com.cn/public/fronttest/search/css/search.css">')
            },
            addInput: function () {
                var a = '<div class="' + this.domClass.boxId.replace("#", "") + '" id="' + this.dom.boxId.replace("#", "") + '">';
                a += '<input value="' + this.opts.placeholder + '" type="text"  class="' + this.domClass.iptId.replace("#", "") + '" id="' + this.dom.iptId.replace("#", "") + '" style="color:#999;">', a += '<span class="' + this.domClass.btnId.replace("#", "") + '" id="' + this.dom.btnId.replace("#", "") + '">' + this.opts.searchBtnFont + "</span>", this.idEstimate() || (a += '<div class="' + this.domClass.disId.replace("#", "") + '" id="' + this.dom.disId.replace("#", "") + '" style="display: none;"></div>'), a += "</div>", $(this.opts.searchId).append(a)
            },
            getKeydown: function (a) {
                if (!this._data.listbox.is(":hidden") && !this.idEstimate()) {
                    var t, e = a.which;
                    switch (e) {
                        case 40:
                            a.preventDefault(), t = this._data.listbox.find("dd").length, this._data.index++, this._data.index > t - 1 && (this._data.index = 0), this.forDD.choice.call(this);
                            break;
                        case 38:
                            a.preventDefault(), t = this._data.listbox.find("dd").length, this._data.index--, this._data.index < -1 && (this._data.index = t - 1), -1 === this._data.index && (this._data.index = t - 1), this.forDD.choice.call(this);
                            break;
                        case 13:
                            this.clickEnter()
                    }
                }
            },
            clickEnter: function () {
                var a = this._data.index;
                if (0 === this._data.listbox.find("dd").length) {
                    var t = "//search.10jqka.com.cn/search?tid=info&qs=box_ths&w=" + this._data.keyword;
                    return void window.open(t)
                }
                this._data.listbox.find("dd").eq(-1 === a ? 0 : a).click()
            },
            getInput: function (a) {
                var t = $(a).val();
                if (this._data.index = -1, "" === t || t === this.opts.placeholder) return void $(this._data.listbox).hide();
                var e = this._data.url.replace("{keyword}", t);
                this._data.keyword = t, this.tools.useJSONP.call(this, e, this._data.callback)
            },
            successCallback: function (a) {
                var a = a,
                    t = "";
                t = this.stringGroup.call(this, a), $(this._data.listbox).show().html(t)
            },
            stringGroup: function (a) {
                var t = "",
                    e = "",
                    s = this;
                return $.each(a, function (a, n) {
                    var i = s._data.type[a];
                    if (0 === n.length) return e += '<dl class="sh-line" data-key="' + s._data.type[a] + '">', e += '<dt class="sh-title">相关 <b>' + s._data.namelist[a].name + "</b> 搜索结果为0</dt>", e += "</dl>", !0;
                    t += '<dl class="sh-line" data-key="' + s._data.type[a] + '">', t += '<dt class="sh-title">搜"' + s._data.keyword + '"相关 <b>' + s._data.namelist[a].name + "</b></dt>", $.each(n, function (a, e) {
                        var n = new RegExp(s._data.keyword, "gi"),
                            o = e.code.toString(),
                            r = e.name.toString(),
                            d = o.match(n),
                            l = r.match(n);
                        d ? o = o.replace(d[0], "<em>" + d[0] + "</em>") : l && (r = r.replace(l[0], "<em>" + l[0] + "</em>")), t += "ijjfifund" == i ? '<dd class="sh-info" data-code="' + e.code + '" data-sday="' + e.startdate.replace(/\-/g, "") + '"><span>' + o + "</span>" + r + "</dd>" : '<dd class="sh-info" data-code="' + e.code + '"><span>' + o + "</span>" + r + "</dd>"
                    }), t += "</dl>"
                }), t + e
            },
            idEstimate: function () {
                return "function" == typeof this.opts.successCallback
            },
            forDD: {
                choice: function () {
                    this._data.listbox.find("dd").removeClass("sh-on").eq(this._data.index).addClass("sh-on")
                },
                skip: function (a) {
                    var t = $(a).parent().attr("data-key"),
                        e = this.tools.keyToName(t).url,
                        s = $(a).attr("data-code"),
                        n = $(a).attr("data-sday");
                    window.open(e.replace("{code}", s).replace("{startday}", n))
                },
                trig: function (a) {
                    var t = this._data.listbox.find("dd").index($(a));
                    this._data.index = t, this.forDD.choice.call(this)
                }
            },
            tools: {
                blurPlaceholder: function (a) {
                    "" === $(a).val() && $(a).val(this.opts.placeholder).css({
                        color: "#999"
                    })
                },
                focusPlaceholder: function (a) {
                    var t = $(a).val();
                    if (t === this.opts.placeholder) return void $(a).val("").css({
                        color: "inherit"
                    });
                    "" !== t && $(this._data.listbox).show()
                },
                keyToName: function (a) {
                    var t = {};
                    switch (a) {
                        case "ijjfund":
                            t = {
                                name: "基金",
                                url: "http://fund.10jqka.com.cn/{code}/"
                            };
                            break;
                        case "ijjfifund":
                            t = {
                                name: "固收",
                                url: "http://fund.10jqka.com.cn/public/webgs/funddetail.html?fundCode={code}&openday={startday}"
                            };
                            break;
                        case "stock":
                            t = {
                                name: "股票",
                                url: "http://stockpage.10jqka.com.cn/{code}/"
                            };
                            break;
                        case "company":
                            t = {
                                name: "基金公司",
                                url: "http://fund.10jqka.com.cn/company/{code}/"
                            };
                            break;
                        case "master":
                            t = {
                                name: "名家",
                                url: "http://master.10jqka.com.cn/mj_{code}/"
                            }
                    }
                    return t
                },
                useJSONP: function (a, t) {
                    var e = this;
                    e._data.ajaxProcess = $.ajax({
                        url: a,
                        dataType: "jsonp",
                        jsonpCallback: "jsonp",
                        jsonp: !1,
                        cache: !0,
                        success: function (a) {
                            t.call(e, a)
                        },
                        error: function (t, e) {
                            console.log(a), console.log(e)
                        }
                    })
                }
            }
        }, a
    }), define("login", [], function () {
        return window.sso = new htsso, window.modifyUserInfo = function (a) {
            if (a) {
                if ($("#logined").length > 0) $("#logined .username").html(a);
                else {
                    var t = '<div class="logined" id="logined" style="display: none;"><span class="username">' + a + "</span><span class=\"quit\" onclick=\"location.href='//upass.10jqka.com.cn/logout?redir=' + encodeURIComponent('//' + 'upass.' + window.location.host.split('.').slice(1).join('.').split(':').shift() + '/logout?redir=' + encodeURIComponent(window.location.href))\">退出</span></div>";
                    $("#login").after(t)
                }
                setTimeout(function () {
                    $("#logined").show()
                }, 500), $("#login").hide()
            } else $("#login").show(), $("#logined").remove()
        }, window.onSsoLogin = function () {
            var a = sso.getCookie("escapename"),
                t = a ? unescape(a) : "";
            if (a) try {
                ThsLogin.hideLoginBox()
            } catch (a) {}
            modifyUserInfo(t)
        }, $(function () {
            sso.login(("https:" == document.location.protocol ? "https://" : "http://") + window.location.host + "/public/class/sso/reload.html"), onSsoLogin(), $("#login").on("click", function () {
                ThsLogin.showLoginBox(("https:" == document.location.protocol ? "https://" : "http://") + window.location.host + "/public/class/sso/login.html")
            })
        }), {
            sso: sso,
            modifyUserInfo: modifyUserInfo,
            onSsoLogin: onSsoLogin
        }
    }), define("nhead", ["search", "login"], function (a, t) {
        function e(a) {
            this._data = a, this.init()
        }

        function s() {
            var a = window.location,
                t = document.title,
                e = navigator.userAgent.toLowerCase();
            if (e.indexOf("360se") > -1) alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
            else if (e.indexOf("msie 8") > -1) window.external.AddToFavoritesBar(a, t);
            else if (document.all) try {
                window.external.addFavorite(a, t)
            } catch (a) {
                alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!")
            } else window.sidebar ? window.sidebar.addPanel(t, a, "") : alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!")
        }

        function n() {
            $("#searchBox").addClass("shfocus")
        }

        function i() {
            $("#searchBox").removeClass("shfocus")
        }
        document.domain = "10jqka.com.cn", window.sso = t.sso, window.modifyUserInfo = t.modifyUserInfo, window.onSsoLogin = t.onSsoLogin, e.prototype = {
            init: function () {},
            sendKeyNew: function (a) {
                var t = this;
                a.actime || (a.actime = (new Date).getTime()), TA.log({
                    actime: a.actime ? a.actime : "",
                    optime: t._data.optime,
                    acpage: ACPAGE,
                    ld: "browser",
                    id: a.id ? a.id : "",
                    backcolor: "white",
                    cururl: t._data.cururl,
                    ifjump: a.ifjump ? a.ifjump : "0",
                    nexturl: a.nexturl ? a.nexturl : "",
                    targid: a.targid ? a.targid : "",
                    stateid: a.stateid ? a.stateid : "",
                    url_ver: t._data.urlver,
                    log_ver: t._data.logver,
                    f_custid: a.custid ? a.custid : "",
                    keyword: a.keyword ? a.keyword : ""
                }), a.apg || ACPAGE++
            },
            setHang: function (a, t) {
                var e, s = a,
                    n = this,
                    i = !0;
                $(s).on({
                    mouseenter: function () {
                        i && (e = setTimeout(function () {
                            n.sendKeyNew({
                                id: t
                            }), i = !1
                        }, 1e3))
                    },
                    mouseleave: function () {
                        clearTimeout(e)
                    }
                })
            }
        };
        var o = new e(TAINFO);
        $.boxShow = function (a) {
            function t() {
                var a = i,
                    t = $(i).index();
                "" != s.key && (a = $(this).attr(s.key)), "function" == $.type(s.showbeforeCallback) && s.showbeforeCallback(t), "" != s.cls && $(i).addClass(s.cls), $(a).show(), "function" == $.type(s.showCallback) && s.showCallback(t)
            }

            function e() {
                var a = $(i),
                    t = $(i).index();
                "" != s.key && (a = $(this).attr(s.key)), "" != s.cls && $(i).removeClass(s.cls), $(a).hide(), "function" == $.type(s.hideCallback) && s.hideCallback(t)
            }
            var s, n = {
                    key: "data-lang",
                    cls: "",
                    action: "mouseenter",
                    ifout: "true",
                    showCallback: null,
                    hideCallback: null,
                    showbeforeCallback: null
                },
                i = this;
            this.init = function () {
                s = $.extend({}, n, a), $(i).off().on(s.action, t), s.ifout && $(i).on("mouseleave", e)
            }, this.init()
        }, $.fn.boxShow = function (a) {
            return this.each(function () {
                $.boxShow.call(this, a)
            })
        }, $("#newsTop .nt_left li, #newsTop .nt_right li,#nnav li").boxShow(), $("#nt_navbox, #nt_login, #nt_deal, #nt_guide").boxShow({
            key: ""
        }), $("#hdTop .h-nav ul li").boxShow(), $("#ntl_collect").on("click", function () {
            s()
        }), $.format = function (a, t) {
            return 1 == arguments.length ? function () {
                var t = $.makeArray(arguments);
                return t.unshift(a), $.format.apply(this, t)
            } : (arguments.length > 2 && t.constructor != Array && (t = $.makeArray(arguments).slice(1)), t.constructor != Array && (t = [t]), $.each(t, function (t, e) {
                a = a.replace(new RegExp("\\{" + t + "\\}", "g"), e)
            }), a)
        }, new a({
            type: "ijjfund,ijjfifund,company",
            searchId: "#topSearch",
            searchBtnFont: "",
            successCallback: "",
            focusCallback: n,
            blurCallback: i
        }), $("#newsTop .nt_left li").on({
            click: function () {
                var a = $(this).index(),
                    t = $(this).attr("data-taid"),
                    e = a + 1,
                    s = 0,
                    n = "",
                    i = PAGEID + "-webtop-r1c" + e + "-click-sta-" + t;
                1 != e && (s = 1, n = $(this).find("a").attr("href")), 3 != e && o.sendKeyNew({
                    id: i,
                    ifjump: s,
                    nexturl: n
                })
            }
        }), $("#newsTop .nt_left .ntl_login").each(function () {
            var a = $(this).index(),
                t = $(this).attr("data-taid"),
                e = a + 1,
                s = PAGEID + "-webtop-r1c" + e + "-hang-sta-" + t;
            o.setHang($(this), s)
        }), $("#nt_login .login a").click(function () {
            var a = $(this).attr("data-taid"),
                t = $(this).attr("href"),
                e = PAGEID + "-webtop-r2c3-click-sta-" + a;
            o.sendKeyNew({
                id: e,
                ifjump: 1,
                nexturl: t
            })
        }), $("#nt_login .open a").click(function () {
            var a = $(this).attr("data-taid"),
                t = $(this).attr("href"),
                e = PAGEID + "-webtop-r3c3-click-sta-" + a;
            o.sendKeyNew({
                id: e,
                ifjump: 1,
                nexturl: t
            })
        }), $("#newsTop .nt_right li").each(function () {
            var a = $(this).index(),
                t = $(this).attr("data-taid"),
                e = a + 6;
            if (11 == e) {
                var s = PAGEID + "-webtop-r1c" + e + "-hang-sta-" + t;
                o.setHang($(this), s)
            } else if ($(this).click(function () {
                    var a = PAGEID + "-webtop-r1c" + e + "-click-sta-" + t,
                        s = $(this).find("a").attr("href");
                    o.sendKeyNew({
                        id: a,
                        ifjump: "1",
                        nexturl: s
                    })
                }), 7 == e || 8 == e) {
                var s = PAGEID + "-webtop-r1c" + e + "-hang-sta-" + t;
                o.setHang($(this), s)
            }
        }), $("#nt_navbox .ntn_line").each(function () {
            var a = $(this).index(),
                t = 12 + 2 * a;
            $(this).find(".grade a:odd").click(function () {
                var a = $(this).index(),
                    e = $(this).attr("data-taid"),
                    s = 2 + (a - 1) / 2,
                    n = t + 1,
                    i = $(this).attr("href"),
                    r = PAGEID + "-webtop-r" + s + "c" + n + "-click-sta-" + e;
                o.sendKeyNew({
                    id: r,
                    ifjump: "1",
                    nexturl: i
                })
            }), $(this).find(".grade a:even").click(function () {
                var a = $(this).index(),
                    e = $(this).attr("data-taid"),
                    s = 2 + a / 2,
                    n = t,
                    i = $(this).attr("href"),
                    r = PAGEID + "-webtop-r" + s + "c" + n + "-click-sta-" + e;
                o.sendKeyNew({
                    id: r,
                    ifjump: "1",
                    nexturl: i
                })
            })
        }), $("#nt_deal a").click(function () {
            var a = $(this).index(),
                t = $(this).attr("data-taid"),
                e = a + 2,
                s = $(this).attr("href"),
                n = PAGEID + "-webtop-r" + e + "c7-click-sta-" + t;
            o.sendKeyNew({
                id: n,
                ifjump: "1",
                nexturl: s
            })
        }), $("#nt_guide a").click(function () {
            var a = $(this).index(),
                t = $(this).attr("data-taid"),
                e = a + 2,
                s = $(this).attr("href"),
                n = PAGEID + "-webtop-r" + e + "c8-click-sta-" + t;
            o.sendKeyNew({
                id: n,
                ifjump: "1",
                nexturl: s
            })
        }), $("#hdTop .h-logo").click(function () {
            var a = $(this).attr("href"),
                t = PAGEID + "-guide-r1c1-click-sta-fundindex";
            o.sendKeyNew({
                id: t,
                ifjump: "1",
                nexturl: a
            })
        }), $("#hdTop .h-nav li").each(function (a, t) {
            var e = $(this).index() + 2;
            $(this).children("a").each(function () {
                var a = $(this).attr("data-taid"),
                    t = $(this).attr("href"),
                    s = PAGEID + "-guide-r1c" + e + "-click-sta-" + a,
                    n = PAGEID + "-guide-r1c" + e + "-hang-sta-" + a;
                6 != e && o.setHang($(this), n), $(this).click(function () {
                    o.sendKeyNew({
                        id: s,
                        ifjump: "1",
                        nexturl: t
                    })
                })
            }), $(this).find(".clist span").click(function () {
                var a = $(this).attr("data-taid"),
                    t = $(this).index() + 2,
                    s = PAGEID + "-guide-r" + t + "c" + e + "-click-sta-" + a,
                    n = $(this).find("a").attr("href");
                o.sendKeyNew({
                    id: s,
                    ifjump: "1",
                    nexturl: n
                })
            })
        }), $("#sh-input").on({
            focus: function () {
                var a = $(this).val(),
                    t = PAGEID + "-search-r1c1-click-fu-srk";
                if (o.sendKeyNew({
                        id: t,
                        keyword: a
                    }), "" != a) {
                    var e = PAGEID + "-search-r1c1-click-fu-xlk";
                    setTimeout(function () {
                        o.sendKeyNew({
                            id: e,
                            keyword: a
                        })
                    }, 1e3)
                }
            }
        }), $("#sh-result").on("click", "dd", function () {
            var a, t = $("#sh-result dd").index($(this)) + 2,
                e = $(this).parent().attr("data-key"),
                s = $(this).attr("data-code"),
                n = $(this).attr("data-sday"),
                i = $("#sh-input").val(),
                r = "";
            switch (e) {
                case "ijjfund":
                    a = "fund", r = "/" + s + "/";
                    break;
                case "ijjfifund":
                    a = "gushou", r = "/public/webgs/funddetail.html?fundCode=" + s + "&openday=" + n;
                    break;
                case "company":
                    a = "company", r = "/company/" + s + "/"
            }
            var d = PAGEID + "-search-r" + t + "c1-click-" + a + "-" + s;
            o.sendKeyNew({
                id: d,
                ifjump: "1",
                nexturl: r,
                keyword: i
            })
        }), $("#login").click(function () {
            var a = PAGEID + "-guide-r1c7-click-sta-login";
            o.sendKeyNew({
                id: a
            })
        }), $("#logined .quit").click(function () {
            var a = PAGEID + "-guide-r1c7-click-sta-login";
            o.sendKeyNew({
                id: a
            })
        }), $("#hdTop .open").click(function () {
            var a = $(this).attr("href"),
                t = PAGEID + "-guide-r1c8-click-sta-kaihu";
            o.sendKeyNew({
                id: t,
                ifjump: "1",
                nexturl: a
            })
        })
    }),
    function (a, t) {
        "function" == typeof define && define.amd ? define("calculator", t) : "object" == typeof exports ? module.exports = t() : a.calcuOper = t()
    }(this, function () {
        function calcuOper(a) {
            this.defaults = {
                fundname: "",
                fundcode: "",
                fundbsy: "0.0035",
                closeCallback: ""
            }, this._data = {
                generId: "useCalculator",
                infoId: "fundInfo",
                moneyId: "fundMoney",
                resultId: "setResult",
                searchId: "seachResult",
                fundmsy: "",
                fundbsy: ""
            }, this.init(a)
        }
        return calcuOper.prototype = {
            init: function (a) {
                var t = this;
                this.opts = $.extend({}, this.defaults, a), this._data.fundname = this.opts.fundname, this._data.fundcode = this.opts.fundcode, this._data.fundbsy = this.opts.fundbsy, this._data.day = [365, 180, 90, 30], this._data.fundPlace = "请输入基金代码、简称或拼音", this._data.moneyPlace = "请输入申请金额", this._data.tsIndex = -1;
                var e = t._data;
                this.addHTML(e), $("#" + this._data.infoId + " input").on({
                    focus: function () {
                        t.tools.placeGetholderFocus.call(this, t._data.fundPlace)
                    },
                    click: function () {
                        "" !== $.trim($("#" + t._data.searchId).html()) && "" != $.trim($(this).val()) && $("#" + t._data.searchId).show()
                    },
                    blur: function () {
                        t.tools.placeGetholderBlur.call(this, t._data.fundPlace)
                    },
                    keyup: function (a) {
                        var e = a.which;
                        "38" != e && "13" != e && "40" != e && t.fundSearch.call(t, this)
                    },
                    keydown: function (a) {
                        t.setKeydown.call(t, a)
                    }
                }), $("#" + this._data.moneyId + " input").on({
                    keyup: function () {
                        var a = $(this).val();
                        $(this).val(a.replace(/[^(0-9)]/g, "")), t.setCalculate.call(t, this)
                    },
                    focus: function () {
                        t.tools.placeGetholderFocus.call(this, t._data.moneyPlace)
                    },
                    blur: function () {
                        t.tools.placeGetholderBlur.call(this, t._data.moneyPlace)
                    }
                }), $("#" + this._data.searchId).on({
                    mouseenter: function () {
                        var a = $("#" + t._data.searchId + " p").index($(this));
                        t._data.tsIndex = a, t.choiceDD.call(t, t._data.tsIndex)
                    },
                    click: function () {
                        t.clickEnter.call(t, t._data.tsIndex)
                    }
                }, "p"), $("#calClose").on({
                    click: function () {
                        $("#" + t._data.generId).hide(), $("#" + t._data.searchId).hide(), "function" == typeof t.opts.closeCallback && t.opts.closeCallback()
                    }
                }), $(document).click(function (a) {
                    $("#" + t._data.infoId + " input").is(a.target) || 0 !== $("#" + t._data.searchId).has(a.target).length || $("#" + t._data.searchId).hide()
                })
            },
            addHTML: function (a) {
                var t = this,
                    e = '<div class="usecalculator" id="' + a.generId + '" style="display: none;"><p class="u-title"><span class="name">收益计算器</span><i class="close" id="calClose"></i></p><div class="u-fundinfo"><div class="fundinput" style="z-index: 99;" id="' + a.infoId + '"><span class="title">基金名称</span><input type="text" value="' + a.fundPlace + '" style="display: none;color: #999;"><p class="fund" style="display: none;"><span>' + t.opts.fundname + "</span> (" + t.opts.fundcode + ')</p><div class="seachResult" id="' + a.searchId + '" style="display: none"></div><div class="clear"></div></div><div class="fundinput" id="' + a.moneyId + '"><span class="title">申购金额</span><input type="text" value="' + a.moneyPlace + '" style="color: #999;" maxlength="9"><span class="unit">元</span><div class="clear"></div></div><p class="tip">收益根据您的申购金额和基金过往业绩进行测算</p></div><div class="u-result" id="' + a.resultId + '"><div class="line"><div class="sy"><p class="key">近1年预计收益</p><p class="value f-up">--</p></div><div class="sy"><p class="key">银行活期</p><p class="value f-up">--</p></div></div><div class="line"><div class="sy"><p class="key">近6月预计收益</p><p class="value f-up">--</p></div><div class="sy"><p class="key">银行活期</p><p class="value f-up">--</p></div></div><div class="line"><div class="sy"><p class="key">近3月预计收益</p><p class="value f-up">--</p></div><div class="sy"><p class="key">银行活期</p><p class="value f-up">--</p></div></div><div class="line"><div class="sy"><p class="key">近1月预计收益</p><p class="value f-up">--</p></div><div class="sy"><p class="key">银行活期</p><p class="value f-up">--</p></div></div></div><p class="u-expoint">收益测算仅供参考，过往业绩不预示未来表现。</p></div><div class="shadow" id="shadow" style="display: none;"></div>';
                $("body").append(e)
            },
            dataClear: function (a) {
                var t = this;
                $("#" + t._data.infoId + " input").val(t._data.fundPlace).css({
                    color: "#999"
                }), $("#" + t._data.resultId + " .value").html("--").addClass("f-up").removeClass("f-down"), $("#" + t._data.moneyId + " input").val(t._data.moneyPlace).css({
                    color: "#999"
                }), a && (t._data.fundmsy = "")
            },
            setCalculate: function (a) {
                var t = this,
                    e = $(a).val();
                return !isNaN(e) && ($("#" + t._data.resultId + " .value").html("--").addClass("f-up").removeClass("f-down"), "" !== t._data.fundmsy && void t.goCal.call(t, e))
            },
            setKeydown: function (a) {
                var t = this;
                if (!$("#" + t._data.searchId).is(":hidden")) {
                    switch (a.which) {
                        case 40:
                            t._data.tsIndex++, t._data.tsIndex > $("#" + t._data.searchId + " p").length - 1 && (t._data.tsIndex = 0), t.choiceDD.call(t, t._data.tsIndex);
                            break;
                        case 38:
                            t._data.tsIndex--, (t._data.tsIndex < -1 || -1 === t._data.tsIndex) && (t._data.tsIndex = $("#" + t._data.searchId + " p").length - 1), t.choiceDD.call(t, t._data.tsIndex);
                            break;
                        case 13:
                            select = -1 === t._data.tsIndex ? 0 : t._data.tsIndex, t.clickEnter.call(t, select)
                    }
                }
            },
            choiceDD: function (a) {
                var t = this;
                $("#" + t._data.searchId + " p").removeClass("on").eq(a).addClass("on")
            },
            clickEnter: function (a) {
                var t = this,
                    e = $("#" + t._data.searchId + " p").eq(a).html().split(" ");
                $("#" + t._data.searchId).hide(), $("#" + t._data.infoId + " input").val(e[1] + "(" + e[0] + ")");
                var s = e[0];
                t.getSydata.call(t, s)
            },
            getSydata: function (code) {
                var self = this,
                    url = "/interface/net/index/0_" + code;
                $.get(url, function (data) {
                    var dd = eval("(" + data + ")").data,
                        ysy = dd.year / 100,
                        hsy = dd.hyear / 100,
                        tsy = dd.tmonth / 100,
                        msy = dd.month / 100,
                        fundmsy = ysy + "|" + hsy + "|" + tsy + "|" + msy;
                    self._data.fundmsy = fundmsy, self.setCalculate.call(self, $("#" + self._data.moneyId + " input"))
                })
            },
            fundSearch: function (a) {
                var t = this,
                    e = $(a).val();
                if ("" === e) return void $("#" + t._data.searchId).hide();
                var s = "http://news.10jqka.com.cn/public/index_keyboard_" + e + "_ijjfund_5_1_jsonp.html";
                $.ajax({
                    url: s,
                    dataType: "jsonp",
                    jsonpCallback: "jsonp",
                    jsonp: !1,
                    cache: !0,
                    success: function (a) {
                        if (0 == a.length) return void $("#" + t._data.searchId).hide();
                        $("#" + t._data.searchId).show(), t.addShresult.call(t, a)
                    }
                })
            },
            addShresult: function (a) {
                var t = this,
                    e = a,
                    s = "";
                $.each(e, function (a, t) {
                    s += '<p class="s-info">' + t.code + " " + t.name + "</p>"
                }), $("#" + t._data.searchId).html(s)
            },
            goCal: function (a, t, e) {
                var s = this;
                s._data.fundmsy = t || s._data.fundmsy, s._data.fundbsy = e || s._data.fundbsy;
                var n = s._data.fundmsy.split("|"),
                    i = s._data.fundbsy,
                    o = s._data.day;
                $("#" + s._data.moneyId + " input").val(a).css({
                    color: "#333"
                }), $("#" + s._data.resultId + " .line").each(function (t, e) {
                    var s = n[t] * a,
                        r = i * a * o[t] / 365;
                    $(this).find(".value").eq(0).addClass(s < 0 ? "f-down" : "f-up").html("￥" + s.toFixed(2)), $(this).find(".value").eq(1).addClass(r < 0 ? "f-down" : "f-up").html("￥" + r.toFixed(2))
                })
            },
            tools: {
                placeGetholderFocus: function (a) {
                    var t = a;
                    $(this).val() === t && $(this).val("").css({
                        color: "#333"
                    })
                },
                placeGetholderBlur: function (a) {
                    "" === $(this).val() && $(this).val(a).css({
                        color: "#999"
                    })
                },
                priceChange: function (a) {
                    var t = a;
                    return -1 !== t.indexOf(".") && (t = t.split("."), t = t[0] + "." + t[1]), t = isNaN(t) ? 0 : parseFloat(t).toFixed(2)
                }
            }
        }, calcuOper
    }), define("getsydata", [], function () {
        return systart = 0, jzstart = 0, {
            syFiltrate: function (a, t, e) {
                var s = function () {
                    return a.slice(0)
                }();
                s.reverse();
                var n = s[0][0],
                    i = n.substring(0, 4) + "/" + n.substring(4, 6) + "/" + n.substring(6, 8),
                    o = new Date(i),
                    r = [],
                    d = o.getMonth() + 1,
                    l = o.getFullYear(),
                    c = o.getDate();
                if (-1 != t.toString().indexOf("/")) o = new Date(t).getTime();
                else {
                    for (; parseInt(d) <= parseInt(t);) d = parseInt(d) + 12, l -= 1;
                    d -= t, o = new Date(l + "/" + d + "/" + c).getTime()
                }
                e && ("hs" != e && "tl" != e || (o = systart), "fhcf" == e && (o = jzstart));
                try {
                    $.each(s, function (a, t) {
                        var s = t[0].substring(0, 4) + "/" + t[0].substring(4, 6) + "/" + t[0].substring(6, 8);
                        return s = new Date(s).getTime(), "sy" == e && (systart = s), "jz" == e && (jzstart = s), "fhcf" == e ? !(o > s) && (r.push(t), !0) : o > s ? (r.push(t), !1) : o == s ? (r.push(t), !1) : void r.push(t)
                    })
                } catch (a) {}
                return r = r.reverse()
            },
            tools: {
                dateSelect: function (a, t) {
                    for (var e = this, s = e.timeFormat(new Date, "yyyy-MM-dd"), n = s.split("-"), i = n[1], o = n[0], r = n[2]; parseFloat(i) <= parseFloat(a);) i = parseFloat(i) + 12, o -= 1;
                    return i -= a, i = 1 === i.toString().length ? "0" + i : i, o + "/" + i + "/" + r
                },
                timeFormat: function (a, t) {
                    var e = new Date;
                    e.setTime(a);
                    var s = e.getFullYear(),
                        n = t,
                        i = {
                            M: e.getMonth() + 1,
                            d: e.getDate(),
                            H: e.getHours(),
                            m: e.getMinutes(),
                            s: e.getSeconds()
                        };
                    /(y+)/.test(n) && (n = n.replace(RegExp.$1, s));
                    for (var o in i) new RegExp("(" + o + "+)").test(n) && (n = n.replace(RegExp.$1, 1 === RegExp.$1.length ? i[o] : ("00" + i[o]).substring(("" + i[o]).length)));
                    return n
                }
            }
        }
    }), define("ownfund", ["fdurl", "common"], function (a, t) {
        function e() {
            this._data = {
                url: a.ownfund
            }, this.init()
        }

        function s(a, t, e, s, n) {
            var i = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: i,
                fid: ""
            })
        }
        $("#ownFund").find(".o-title span").click(function () {
            $("#ownFund").find(".o-title span").removeClass("on"), $(this).addClass("on");
            var a = $(this).attr("data-key");
            $(".o-box").hide(), $("#" + a).show();
            var t = $(this).index();
            1 == t ? $(this).nextAll(".more").hide() : $(this).nextAll(".more").show(), s("click", "login", 0, t + 1, $(this).attr("data-taid"))
        });
        var n = {
            setPrint: function () {
                var a = "",
                    t = [],
                    e = localStorage.getItem("footprint"),
                    s = !0;
                e && (a = e, t = a.split("|"));
                var n = fundName + "_" + fundCode + "_" + fundType;
                $.each(t, function (a, t) {
                    if (t.split("_")[1] == fundCode) return s = !1, !1
                }), s && (t.unshift(n), t = t.slice(0, 10), a = t.join("|"), localStorage.setItem("footprint", a))
            },
            getPrint: function () {
                var a = "",
                    t = [],
                    e = localStorage.getItem("footprint");
                return e && (a = e, t = a.split("|")), t
            }
        };
        return e.prototype = {
            init: function () {
                var a = $.cookie("userid");
                a && (this._data.url = this._data.url.replace("{userid}", a))
            },
            getFund: function () {
                var a = this,
                    t = a._data.url.replace("{do}", "get").replace("{codes}", "");
                $.ajax({
                    url: t,
                    type: "GET",
                    dataType: "json",
                    cache: !0,
                    success: function (t) {
                        if ("999" != t.data) {
                            var e = "";
                            e = a.packStr.call(a, t), "" == e && (e += '<div class="z-default" style="">无自选基金</div>'), $("#zxFund").find(".o-data").html(e)
                        }
                    }
                })
            },
            packStr: function (a) {
                var t = a.data,
                    e = "",
                    s = 0;
                return $.each(t, function (a, t) {
                    if ("hbx" == a) return !0;
                    $.each(t, function (a, t) {
                        if (null == t) return !0;
                        var n = "f-red",
                            i = t.rate ? t.rate + "%" : "--";
                        parseFloat(t.rate) < 0 && (n = "f-down"), "" != t.rate && t.rate || (n = ""), t.code == fundCode && $(".topinfo").find(".ofund").addClass("on"), ++s < 11 && (e += '<ul><li class="name"><a href="//fund.10jqka.com.cn/' + t.code + '/" target="_blank" data-code="' + t.code + '">' + t.name + '</a></li><li class="value f-red">' + (t.net ? t.net : "--") + '</li><li class="rise ' + n + '">' + i + "</li></ul>")
                    })
                }), t.hbx && $.each(t.hbx, function (a, t) {
                    if (null == t) return !0;
                    var n = "f-red",
                        i = "" == t.rate ? "--" : t.rate + "%";
                    parseFloat(t.rate) < 0 && (n = "f-down"), "" == t.rate && (n = ""), t.code == fundCode && $(".topinfo").find(".ofund").addClass("on"), ++s < 11 && (e += '<ul><li class="name"><a href="//fund.10jqka.com.cn/' + t.code + '/" target="_blank" data-code="' + t.code + '">' + t.name + '</a></li><li class="value f-red">' + t.net + '</li><li class="rise ' + n + '">' + i + "</li></ul>")
                }), e
            },
            addFund: function (a, e) {
                var s = this,
                    n = s._data.url.replace("{do}", "add").replace("{codes}", a);
                $.ajax({
                    url: n,
                    type: "GET",
                    dataType: "json",
                    cache: !1,
                    success: function (a) {
                        "1" == a.data ? (t.alertMessage("添加成功"), s.getFund.call(s), e()) : t.alertMessage("添加失败")
                    }
                })
            },
            delFund: function (a, e) {
                var s = this,
                    n = s._data.url.replace("{do}", "del").replace("{codes}", a);
                $.ajax({
                    url: n,
                    type: "GET",
                    dataType: "json",
                    cache: !1,
                    success: function (a) {
                        "1" == a.data ? (t.alertMessage("删除成功"), s.getFund.call(s), e()) : t.alertMessage("删除失败")
                    }
                })
            }
        }, {
            ownFund: e,
            footPrint: n
        }
    }), define("topInfo", ["fdurl", "calculator", "getsydata", "ownfund"], function (FDURL, cal, gsdata, ofd) {
        function arClone(a) {
            return a.slice(0)
        }

        function setImportStock() {
            var a = FDURL.importstock.replace("{code}", fundCode);
            $.ajax({
                url: a,
                dataType: "json",
                type: "GET",
                success: function (a) {
                    if ("0" != a.error.id || 0 == a.data.stock.length && 0 == a.data.bond.length && 0 == a.data.fund.length) return $("#zcDefault").show(), $("#zcBox .cz-title").remove(), $("#czContent").remove(), void clearInterval(zcginterval);
                    $("#zcDefault").remove(), $("#zcBox .cz-title").show(), $("#czContent").show();
                    var t, e = a.data;
                    t = e.fund.length > 0 ? e.fund : e.stock.length > 0 ? e.stock : e.bond;
                    var s = "";
                    $.each(t, function (a, t) {
                        "" == t.rate && (t.rate = 0);
                        var e = "";
                        parseFloat(t.rate) > 0 ? e = "f-up" : parseFloat(t.rate) < 0 && (e = "f-down"), s += '<ul><li class="width50">' + (a + 1) + "</li>", TYPE && "QDII" != TYPE ? "fund" == t.zcType ? s += '<li class="width100" title="' + t.zcName + '"><a href="/' + t.zcCode + '/" target="_blank">' + t.zcName + "</a></li>" : s += '<li class="width100" title="' + t.zcName + '">' + ("bond" == t.zcType ? t.zcName : '<a href="//stockpage.10jqka.com.cn/' + t.zcCode + '/" target="_blank">' + t.zcName + "</a>") + "</li>" : s += '<li class="width100" title="' + t.zcName + '">' + t.zcName + "</li>", s += '<li class="width90 ' + e + '">' + (t.rate && "" != t.rate ? parseFloat(t.rate).toFixed(2) + "%" : "--") + '</li><li class="width96">' + t.ccRate + '%</li><li class="width108">' + t.totalPrice + "</li></ul>"
                    }), $("#czContent").html(s);
                    try {
                        ifscroll && (scrollBar.setScrollbar("#czContent"), ifscroll = !1)
                    } catch (a) {}
                }
            })
        }

        function fundDiagnose() {
            this._data = {
                zdurl: FDURL.diagnose,
                tmonthdata: "",
                monthdata: "",
                hyeardata: ""
            }, this.chart = null, this.init()
        }

        function cantSelect() {
            $("#ctrlTime li").each(function () {
                var a = $(this).attr("data-key");
                if ("" == a) return !0;
                keyToDate(a) && $(this).addClass("off")
            })
        }

        function keyToDate(a) {
            var t, e = sd.tools.dateSelect(a);
            return 0 == tab && (t = qX), 1 == tab && (t = wX), e = new Date(e).getTime(), parseFloat(e) < parseFloat(t[0])
        }

        function topTimesGz(a) {
            this._data = {}, this._data.hqcode = "vm_fd_" + a, this._data.startTime = "09:30", this._data.endTime = "15:00", this._data.gzurl = FDURL.gzdata.replace("{code}", this._data.hqcode), this._data.cvsRun = null, this._data.chart = null, this.init()
        }

        function topCharts() {
            var a = FDURL.sydata.replace("{code}", fundCode);
            $.ajax({
                url: a,
                dataType: "script",
                cache: !0,
                success: function (a) {
                    if (!a) return $("#wfsyCanvas").html('<div class="gz-default" id="gzDefault" style="background-color: #fafafa;color: #666;text-align: center;line-height: 311px;height: 311px;width: 480px;">暂无数据</div>'), void $("#syTab li").eq(1).remove();
                    var a = wfsyJsonData;
                    if (!a) return $("#wfsyCanvas").html('<div class="gz-default" id="gzDefault" style="background-color: #fafafa;color: #666;text-align: center;line-height: 311px;height: 311px;width: 480px;">暂无数据</div>'), void $("#syTab li").eq(1).remove();
                    var t = a.wfsy.data,
                        e = a.qrnhsy.data;
                    wfsy = [], qrnhsy = [], $.each(e, function (a, t) {
                            var e = Date.UTC(t[0].substring(0, 4), parseFloat(t[0].substring(4, 6)) - 1, t[0].substring(6, 8));
                            t[0] = e, t[1] = parseFloat(t[1]), isNaN(t[1]) || (qX.push(t[0]), qrnhsy.push(t))
                        }),
                        chartmin = qmin, chartmax = qmax, $.each(t, function (a, t) {
                            var e = Date.UTC(t[0].substring(0, 4), parseFloat(t[0].substring(4, 6)) - 1, t[0].substring(6, 8));
                            t[0] = e, t[1] = parseFloat(t[1]), isNaN(t[1]) || (wX.push(t[0]), wfsy.push(t))
                        });
                    var s;
                    0 == qrnhsy.length ? (s = wfsy.slice(0), tab = 1, $("#syTab li").eq(0).remove(), $("#syTab li").addClass("on"), ky = "万份收益") : s = qrnhsy.slice(0), option = drawCharts(s), $("#wfsyCanvas").highcharts("StockChart", option), symychart = $("#wfsyCanvas").highcharts()
                }
            })
        }

        function drawCharts(a) {
            return {
                chart: {
                    marginLeft: 65,
                    marginTop: 10,
                    marginBottom: 20,
                    marginRight: 21,
                    style: {
                        fontFamily: "arial"
                    },
                    plotBorderColor: "#ddd",
                    plotBorderWidth: 1,
                    animation: {
                        duration: 300
                    }
                },
                plotOptions: {
                    area: {
                        fillColor: "rgba(68, 137, 202, .1)",
                        lineWidth: 1,
                        lineColor: "rgb(68, 137, 202)",
                        threshold: null,
                        dataGrouping: {
                            dateTimeLabelFormats: {
                                millisecond: ["%Y-%m-%d", "%Y-%m-%d"],
                                second: ["%Y-%m-%d", "%Y-%m-%d"],
                                minute: ["%Y-%m-%d", "%Y-%m-%d"],
                                hour: ["%Y-%m-%d", "%Y-%m-%d"],
                                day: ["%Y-%m-%d", "%Y-%m-%d"],
                                week: ["%Y-%m-%d", "%Y-%m-%d"],
                                month: ["%Y-%m-%d", "%Y-%m-%d"],
                                year: ["%Y-%m-%d", "%Y-%m-%d"]
                            }
                        }
                    }
                },
                rangeSelector: {
                    selected: 1,
                    buttonTheme: {
                        fill: "none",
                        width: 42,
                        r: 3,
                        style: {
                            fontSize: "12px",
                            color: "#666",
                            fontFamily: "Microsoft Yahei"
                        },
                        states: {
                            hover: {
                                fill: "#5072b8",
                                style: {
                                    color: "#fff"
                                }
                            },
                            select: {
                                fill: "#5072b8",
                                style: {
                                    color: "#fff"
                                }
                            }
                        }
                    },
                    buttons: [{
                        type: "month",
                        count: 1,
                        text: "近1月"
                    }, {
                        type: "month",
                        count: 3,
                        text: "近3月"
                    }, {
                        type: "month",
                        count: 6,
                        text: "近6月"
                    }, {
                        type: "year",
                        count: 1,
                        text: "近1年"
                    }, {
                        type: "year",
                        count: 3,
                        text: "近3年"
                    }, {
                        type: "ytd",
                        text: "今年来"
                    }, {
                        type: "all",
                        text: "成立来"
                    }],
                    labelStyle: {
                        fontFamily: "Microsoft Yahei"
                    },
                    inputEnabled: !1
                },
                title: {
                    text: ""
                },
                credits: {
                    enabled: !1
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderRadius: 9,
                    borderWidth: 0,
                    shadow: !1,
                    headerFormat: '<span style="color: #fff;font-size: 14px;">{point.key}</span><br/>',
                    xDateFormat: "%Y-%m-%d",
                    pointFormatter: function () {
                        var a = "";
                        return "万份收益" == ky ? a = parseFloat(this.y).toFixed(4) : "七日年化收益" == ky && (a = parseFloat(this.y).toFixed(4) + "%"), "<span style=\"color:#fff;font-family: 'Microsoft YaHei';\">" + ky + '：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;">' + a + "</span>"
                    },
                    pointFormat: "",
                    dateTimeLabelFormats: {
                        millisecond: "%Y-%m-%d",
                        second: "%Y-%m-%d",
                        minute: "%Y-%m-%d",
                        hour: "%Y-%m-%d",
                        day: ["%Y-%m-%d", "%Y-%m-%d"],
                        week: "%Y-%m-%d",
                        month: "%Y-%m-%d",
                        year: "%Y"
                    }
                },
                scrollbar: {
                    enabled: !1
                },
                navigator: {
                    outlineColor: "#fff",
                    outlineWidth: 0,
                    height: 30,
                    handles: {
                        backgroundColor: "#4489ca",
                        borderColor: "#fff"
                    },
                    xAxis: {
                        dateTimeLabelFormats: {
                            day: "%Y-%m-%d",
                            week: "%Y",
                            month: "%Y-%m",
                            year: "%Y-%m"
                        }
                    }
                },
                xAxis: {
                    lineColor: "#ddd",
                    tickLength: 5,
                    crosshair: {
                        color: "#ffcbcc"
                    },
                    labels: {
                        style: {
                            color: "#666",
                            fontSize: "12px"
                        }
                    },
                    type: "datetime",
                    dateTimeLabelFormats: {
                        day: "%m-%d",
                        week: "%m-%d",
                        month: "%Y-%m",
                        year: "%Y"
                    }
                },
                yAxis: {
                    lineColor: "#ddd",
                    lineWidth: 1,
                    gridLineColor: "#f6f6f6",
                    opposite: !1,
                    labels: {
                        style: {
                            color: "#f44446",
                            fontSize: "12px"
                        },
                        formatter: function () {
                            var a = parseFloat(this.value);
                            return "万份收益" == ky ? a < 0 ? '<span style="color: #57ab76;">' + a.toFixed(4) + "</span>" : a.toFixed(4) : "七日年化收益" == ky ? a < 0 ? '<span style="color: #57ab76;">' + a.toFixed(4) + "%</span>" : this.value.toFixed(2) + "%" : void 0
                        }
                    },
                    crosshair: {
                        color: "#ffcbcc"
                    }
                },
                legend: {
                    enabled: !1
                },
                series: [{
                    name: "",
                    type: "area",
                    data: a,
                    turboThreshold: Number.MAX_VALUE
                }]
            }
        }

        function closeCallback() {
            $("#shadow").hide()
        }

        function stateJudge() {
            this._data = {
                url: FDURL.stateJudge.replace("{code}", fundCode),
                data: {
                    code: "",
                    sgStart: "",
                    rgStart: "",
                    rgStartReal: "",
                    rgEnd: "",
                    sgStat: "",
                    money: "",
                    shStat: "",
                    clrq: "",
                    ifcl: "",
                    sgfl: "",
                    zdsg: "",
                    buy: "",
                    ifFast: "",
                    ifDt: "",
                    sgoldfl: "",
                    type: "",
                    egtype: "",
                    fundtype: "",
                    lcqx: "",
                    hqcode: "",
                    themeList: "",
                    ifnew: "",
                    ifzj: "",
                    ifgz: "",
                    iszcz: "",
                    iszcg: "",
                    isfof: "",
                    sertime: "",
                    frm: "",
                    thsqbfl: ""
                }
            }, this.init()
        }

        function _sendKey(a, t, e, s, n) {
            var i = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: i,
                fid: ""
            })
        }

        function _sendKeyButton(a, t, e, s, n, i) {
            var o = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: o,
                fid: i || ""
            })
        }
        var sd = gsdata,
            ky = "七日年化收益",
            chartstep = .2,
            wX = [],
            wY = [],
            qX = [],
            qY = [],
            tab = 0,
            symychart, option = {},
            startdate, qrnhsy = [],
            wfsy = [],
            qmin = 100,
            qmax = 0,
            wmin = 100,
            wmax = 0,
            chartmin = qmin,
            chartmax = qmax,
            ifgz = !1,
            ifzj = !1,
            TYPE = _TYPE || "";
        Highcharts.setOptions({
            lang: {
                rangeSelectorZoom: "选择区间"
            }
        });
        var firstzcg = !0,
            firstzd = !0,
            zcginterval = null;
        $("#tLeft").on("click", "#gzTab li", function () {
            var a = $(this).attr("data-key");
            if (a != tab) {
                tab = a;
                var t = $(this).attr("data-lang");
                $("#gzTab li").removeClass("on"), $(this).addClass("on"), $("#gzCartogram>div").hide(), $(t).show(), firstzcg && 1 == tab && (firstzcg = !1, setImportStock(), zcginterval = setInterval(function () {
                    setImportStock()
                }, 3e5)), firstzd && 2 == tab && (firstzd = !1, new fundDiagnose);
                var e = $(this).index() + 1,
                    s = $(this).attr("data-taid"),
                    n = "fund_mf_" + fundCode + "-graph-r0c" + e + "-click-sta-" + s;
                TA.log({
                    id: n,
                    fid: ""
                })
            }
        });
        var ifscroll = !0;
        fundDiagnose.prototype = {
            init: function () {
                if (!ifzj) return $("#zdDefault").show(), $("#cjChart").remove(), $("#cjNav").remove(), $("#jjCanvas .cj-total").remove(), void $("#jjCanvas .cj-more").remove();
                this.getData(this.dealData), this.tabChange()
            },
            dealData: function (a) {
                var t = this;
                t._data.tmonthdata = a.data[1], t._data.monthdata = a.data[0], t._data.hyeardata = a.data[2];
                var e = [],
                    s = [];
                $.each(t._data.tmonthdata.list, function (a, t) {
                    e.push(t.key), s.push(parseFloat(t.data))
                }), e.reverse(), s.reverse();
                var n = t.drawChart(e, s);
                $("#cjChart").highcharts(n), t.chart = $("#cjChart").highcharts(), t.chart.setTitle({
                    text: t._data.tmonthdata.totalScore.toString()
                });
                var i = t._data.tmonthdata.rank.split("/");
                $("#jjCanvas .cj-total .pm").html("<span>" + i[0] + "</span>/" + i[1])
            },
            tabChange: function () {
                var a = this;
                $("#cjNav li").click(function () {
                    if (!$(this).hasClass("on")) {
                        $("#cjNav li").removeClass("on"), $(this).addClass("on");
                        var t = $(this).index();
                        0 == t && a.reDraw(a._data.monthdata), 1 == t && a.reDraw(a._data.tmonthdata), 2 == t && a.reDraw(a._data.hyeardata)
                    }
                })
            },
            reDraw: function (a) {
                var t = this,
                    e = [],
                    s = [];
                $.each(a.list, function (a, t) {
                    e.push(t.key), s.push(parseFloat(t.data))
                }), e.reverse(), s.reverse(), t.chart.xAxis[0].setCategories(e), t.chart.series[0].setData(s), t.chart.setTitle({
                    text: a.totalScore.toString()
                });
                var n = a.rank.split("/");
                $("#jjCanvas .cj-total .pm").html("<span>" + n[0] + "</span>/" + n[1])
            },
            drawChart: function (a, t) {
                return {
                    chart: {
                        polar: !0,
                        type: "area"
                    },
                    credits: {
                        enabled: !1
                    },
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, .5)",
                        borderRadius: 9,
                        borderWidth: 0,
                        shadow: !1,
                        shared: !0,
                        crosshairs: !0,
                        headerFormat: '<span style="color: #fff;font-size: 14px;font-family: \'Microsoft YaHei\';">{point.key}：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;font-family: arial;">{point.y}</span>',
                        pointFormat: "",
                        useHTML: !0
                    },
                    plotOptions: {
                        area: {
                            fillColor: "rgba(253, 93, 91, .3)",
                            lineWidth: 1,
                            marker: {
                                enabled: !1,
                                radius: 2,
                                fillColor: "rgb(253, 93, 91)",
                                lineColor: "rgb(255, 255, 255)",
                                states: {
                                    hover: {}
                                }
                            },
                            pointStart: 0,
                            animation: !1
                        }
                    },
                    title: {
                        text: "--",
                        verticalAlign: "middle",
                        y: 10,
                        style: {
                            color: "#fd5d5b",
                            fontSize: "30px",
                            fontFamily: "Microsoft YaHei"
                        }
                    },
                    pane: {
                        size: "80%",
                        startAngle: 60
                    },
                    xAxis: {
                        categories: a,
                        tickmarkPlacement: "on",
                        lineWidth: 0,
                        labels: {
                            format: "<span style=\"border: 1px solid #ddd;border-radius: 9px;line-height: 16px;padding: 0 8px;color: #888;font-family: 'Microsoft YaHei';\">{value}</span>",
                            useHTML: !0
                        }
                    },
                    yAxis: {
                        gridLineInterpolation: "polygon",
                        lineWidth: 0,
                        min: 0,
                        max: 10,
                        tickAmount: 6,
                        alternateGridColor: "#fafafa",
                        labels: {
                            enabled: !1
                        }
                    },
                    legend: {
                        enabled: !1
                    },
                    series: [{
                        name: "",
                        data: t,
                        color: "rgba(253, 93, 91, 0)",
                        pointPlacement: "on"
                    }]
                }
            },
            getData: function (a) {
                var t = this,
                    e = t._data.zdurl.replace("{code}", fundCode);
                $.ajax({
                    url: e,
                    dataType: "json",
                    type: "GET",
                    success: function (e) {
                        $("#zdDefault").remove(), $("#cjChart").show(), $("#cjNav").show(), $("#jjCanvas .cj-total").show(), a.call(t, e)
                    },
                    error: function (a, t) {}
                })
            }
        };
        var scrollBar = {
            setScrollbar: function (a) {
                $(a).slimScroll({
                    height: "246px",
                    railVisible: !0,
                    alwaysVisible: !0,
                    railOpacity: .1,
                    size: "4px"
                })
            }
        };
        $("#tLeft").on("click", "#syTab li", function () {
            var a = $(this).attr("data-key");
            if (a != tab) {
                tab = a, $("#syTab li").removeClass("on"), $(this).addClass("on"), ky = $(this).text();
                var t = [],
                    e = $(this).attr("data-taid");
                0 == tab && (t = qrnhsy.slice(0), r = 0, c = 1, mthkey = "graphqrnh", chartstep = .2), 1 == tab && (t = wfsy.slice(0), r = 0, c = 2, mthkey = "graphwf", chartstep = .5);
                var s = "fund_mf_" + fundCode + "-graph-r" + r + "c" + c + "-click-sta-" + e;
                TA.log({
                    id: s,
                    fid: ""
                }), symychart.series[0].setData(t.slice(0)), symychart.series[0].redraw()
            }
        });
        var mthkey = "graphqrnh";
        $("#tLeft").on("click", "#ctrlTime li", function () {
            var a = $(this).index(),
                t = $(this).hasClass("off"),
                e = 0,
                s = $(this).width();
            if (!t) {
                for (var n = 0; n < a; n++) e += $("#ctrlTime li").eq(n).width() + 18;
                $("#ctrlLine").css({
                    left: e,
                    width: s
                });
                var i = $(this).attr("data-taid");
                _sendKey("click", mthkey, 1, a + 1, i)
            }
        }), Highcharts.setOptions({
            global: {
                useUTC: !1
            }
        }), topTimesGz.prototype = {
            init: function () {
                var a = this;
                if (!ifgz) return $("#gzDefault").show(), $("#gzBox .gzData").remove(), void $("#gzCanvas").remove();
                this.getData(this.dataDeal), a._data.cvsRun = setInterval(function () {
                    a.getData(a.dataDeal)
                }, 6e4)
            },
            dataDeal: function (a) {
                var t = this,
                    e = a.indexOf("|"),
                    s = a.substring(e + 1),
                    n = s.split("~");
                if (!(s = n[2]) || "" == s) return $("#gzDefault").show(), $("#gzBox .gzData").remove(), void $("#gzCanvas").remove();
                $("#gzDefault").remove(), $("#gzBox .gzData").show(), $("#gzCanvas").show(), this._data.step = parseFloat(n[1]), this._data.date = n[0].replace(/\-/g, "/");
                var i = s.split(";"),
                    o = [];
                $.each(i, function (a, t) {
                    o[a] = [], o[a] = t.split(",")
                });
                var r = [],
                    d = [],
                    l = 0,
                    c = 0,
                    u = 0,
                    f = 0;
                $.each(o, function (a, e) {
                    var s = e[0].substring(0, 2) + ":" + e[0].substring(2);
                    new Date(t._data.date + " " + s).getTime();
                    c = e[0].substring(0, 2), u = e[0].substring(2), f = e[1];
                    var n = [];
                    n.push(s), n.push(parseFloat(e[1])), l = Math.abs(parseFloat(e[1]) - t._data.step) > l ? Math.abs(parseFloat(e[1]) - t._data.step) : l, r.push(n)
                });
                var p = (f - this._data.step) / this._data.step * 100;
                if ($("#gzBox .gzData .gz b").text(parseFloat(f).toFixed(4)).addClass(p < 0 ? "f-down" : "f-up"), $("#gzBox .gzData .zf").text((p < 0 ? "" : "+") + p.toFixed(2) + "%").addClass(p < 0 ? "f-down" : "f-up"), $("#gzBox .gzData .time").text("[" + this._data.date.substring(5).replace(/\//g, "-") + " " + c + ":" + u + "]"), u++, "15" == c && "1" == u ? clearInterval(t._data.cvsRun) : r = t.cltData(c, u, r, "data"), null == t._data.chart) {
                    d = t.cltData("9", "30", d, "time");
                    var h = t.getChartsOptions(r, this._data.step, d);
                    $("#gzCanvas").highcharts(h), t._data.chart = $("#gzCanvas").highcharts()
                } else t._data.chart.series[0].setData(r);
                var m = this._data.step + l,
                    y = this._data.step - l;
                t._data.chart.yAxis[0].setExtremes(y, m)
            },
            cltData: function (a, t, e, s) {
                for (var n = parseFloat(a), i = parseFloat(t); n < 16;) {
                    "11" == n ? "31" == i && (i = 0, n = 13) : "15" == n ? n++ : "60" == i && (i = 0, n++);
                    var o = 1 == n.toString().length ? "0" + n : n,
                        r = 1 == i.toString().length ? "0" + i : i,
                        d = o + ":" + r;
                    if ("time" == s && e.push(d), "data" == s) {
                        var l = [];
                        l.push(d), l.push(null), e.push(l)
                    }
                    i++
                }
                return e
            },
            getChartsOptions: function (a, t, e) {
                return {
                    title: {
                        text: ""
                    },
                    credits: {
                        enabled: !1
                    },
                    chart: {
                        plotBorderColor: "#ddd",
                        plotBorderWidth: 1,
                        animation: !1,
                        style: {
                            fontFamily: "arial"
                        }
                    },
                    plotOptions: {
                        line: {
                            lineWidth: 1,
                            connectNulls: !1,
                            marker: {
                                enabled: !1,
                                radius: 2,
                                states: {
                                    hover: {}
                                }
                            },
                            pointStart: 0,
                            animation: !1
                        }
                    },
                    xAxis: {
                        categories: e,
                        lineColor: "#ddd",
                        crosshair: {
                            color: "#ffcbcc",
                            width: 1
                        },
                        labels: {
                            formatter: function () {
                                var a = this.value,
                                    t = "";
                                switch (a) {
                                    case "09:30":
                                    case "10:30":
                                    case "14:00":
                                    case "15:00":
                                        t = a;
                                        break;
                                    case "13:00":
                                        t = "11:30/13:00";
                                        break;
                                    default:
                                        t = void 0
                                }
                                return t
                            },
                            rotation: 0,
                            useHTML: !0,
                            style: {
                                fontSize: "12px",
                                color: "#666",
                                fontFamily: "arial, microsoft yahei"
                            }
                        },
                        showLastLabel: !0,
                        showFirstLabel: !0,
                        tickWidth: 0,
                        tickPixelInterval: 50
                    },
                    yAxis: [{
                        title: {
                            text: null
                        },
                        crosshair: {
                            color: "#ffcbcc",
                            width: 1
                        },
                        plotLines: [{
                            label: {
                                text: parseFloat(t).toFixed(4),
                                style: {
                                    fontFamily: "arial, microsoft yahei"
                                },
                                align: "left",
                                x: 5
                            },
                            dashStyle: "shortdash",
                            value: parseFloat(t),
                            width: 1,
                            color: "#5e5e5e",
                            zIndex: 1
                        }],
                        lineColor: "#ddd",
                        labels: {
                            formatter: function () {
                                var a = parseFloat(this.value).toFixed(4),
                                    e = parseFloat(t);
                                return parseFloat(a) > e ? '<span style="font-family: arial;color:#f44446">' + a + "</span>" : parseFloat(a) < e ? '<span style="font-family: arial;color:#57ab76">' + a + "</span>" : '<span style="font-family: arial;">' + a + "</span>"
                            },
                            style: {
                                fontSize: "12px",
                                color: "#666",
                                fontFamily: "arial, microsoft yahei"
                            }
                        }
                    }, {
                        title: {
                            text: null
                        },
                        lineColor: "#ddd",
                        linkedTo: 0,
                        opposite: !0,
                        plotLines: [{
                            label: {
                                text: "0.00%",
                                style: {
                                    fontFamily: "arial, microsoft yahei"
                                },
                                align: "right",
                                x: -5
                            },
                            dashStyle: "shortdash",
                            value: parseFloat(t),
                            width: 1,
                            color: "#5e5e5e",
                            zIndex: 1
                        }],
                        labels: {
                            formatter: function () {
                                var a = ((this.value - t) / t * 100).toFixed(2);
                                return parseFloat(a) > 0 ? '<span style="font-family: arial;color:#f44446">' + a + "%</span>" : parseFloat(a) < 0 ? '<span style="font-family: arial;color:#57ab76">' + a + "%</span>" : '<span style="font-family: arial;">' + a + "%</span>"
                            },
                            style: {
                                fontSize: "12px",
                                color: "#666",
                                fontFamily: "microsoft yahei"
                            }
                        },
                        gridLineColor: "#f6f6f6",
                        showLastLabel: !0
                    }],
                    tooltip: {
                        backgroundColor: "rgba(0, 0, 0, .5)",
                        borderRadius: 9,
                        borderWidth: 0,
                        shadow: !1,
                        shared: !0,
                        crosshairs: !0,
                        headerFormat: '<span style="color: #fff;font-family: \'Microsoft YaHei\';">时间：</span><span style="color: #fff;font-size: 14px;">{point.key}</span><br/>',
                        dateTimeLabelFormats: {
                            millisecond: "%H:%M",
                            second: "%H:%M",
                            minute: "%H:%M",
                            hour: "%H:%M",
                            day: "%H:%M",
                            week: "%Y-%m-%d",
                            month: "%Y-%m-%d",
                            year: "%Y"
                        },
                        pointFormatter: function () {
                            var a = (this.y - t) / t * 100;
                            return a = a.toFixed(2), '<span style="color:#fff;font-family: \'Microsoft YaHei\';">估值：</span><span style="color:#fff;font-size:14px;">' + parseFloat(this.y).toFixed(4) + '元</span><br /><span style="color:#fff;font-family: \'Microsoft YaHei\';">涨幅：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;">' + a + "%</span>"
                        },
                        pointFormat: ""
                    },
                    legend: {
                        enabled: !1
                    },
                    series: [{
                        name: "",
                        data: a,
                        color: "rgba(68, 137, 202, 1)"
                    }]
                }
            },
            getData: function (callback, time) {
                var self = this,
                    url = self._data.gzurl.replace("{time}", time || self._data.startTime.replace(":", ""));
                $.ajax({
                    url: url,
                    dataType: "script",
                    success: function (data) {
                        var data = eval("(" + self._data.hqcode + ")");
                        callback.call(self, data)
                    },
                    error: function (a, t) {}
                })
            }
        };
        var od = new ofd.ownFund;
        $(".topinfo .ofund").on("click", function () {
            if (!$.cookie("escapename")) return void(location.href = "http://upass.10jqka.com.cn/login?redir=HTTP_REFERER");
            $(this);
            $(this).hasClass("on") ? od.delFund(fundCode, function () {
                $(".topinfo .ofund").removeClass("on")
            }) : od.addFund(fundCode, function () {
                $(".topinfo .ofund").addClass("on"), $("#menu").append('<b class="ofundnum">+1</b>'), setTimeout(function () {
                    $("#menu .ofundnum").remove()
                }, 300)
            })
        }), $("#bCtrl .planpay").attr("href", "https://trade.5ifund.com/pc/plan/new.html?frm=hd_d3&fundCode=" + fundCode);
        var calcu = new cal({
            fundname: fundName,
            fundcode: fundCode,
            closeCallback: closeCallback
        });
        $("#tRight").on("click", "#calculator", function () {
            $("#useCalculator").show(), $("#shadow").show();
            var a = $("#fundInfo .fund").text();
            $("#fundInfo input").show().val(a).css("color", "#333");
            var t = $(this).attr("data-taid");
            calcu.getSydata.call(calcu, fundCode), calcu.goCal.call(calcu, 1e4), _sendKey("click", "abstract", 1, 1, t)
        }), stateJudge.prototype = {
            init: function () {
                this.getData()
            },
            getData: function () {
                var a = this;
                $.ajax({
                    url: a._data.url,
                    dataType: "json",
                    type: "GET",
                    success: function (t) {
                        var e = t.data[0],
                            s = e.rcsgStart ? new Date(e.rcsgStart.replace(/\-/g, "/") + " 15:00:00").getTime() : "",
                            n = e.rcshStart ? new Date(e.rcshStart.replace(/\-/g, "/")).getTime() : "";
                        a._data.data = {
                            code: e.code,
                            sgStart: "",
                            rgStart: e.rgStart,
                            rgStartReal: e.rgStartReal ? e.rgStartReal : e.rgStart,
                            rgEnd: sd && sd.tools && sd.tools.timeFormat(new Date(e.rgEnd && e.rgEnd.replace(/\-/g, "/")).getTime(), "yyyy-MM-dd"),
                            rgEndShow: e.rgEnd,
                            sgStat: e.sgstat,
                            money: parseFloat(e.money).toFixed(2),
                            shStat: e.shstat,
                            clrq: e.clrq,
                            ifcl: e.clrq && "" != e.clrq ? e.clrq : e.rgEnd,
                            buy: e.buy,
                            zdsg: e.zdsg,
                            sgfl: "",
                            ifFast: e.fastcash,
                            ifDt: e.dt,
                            sgoldfl: "",
                            type: e.type,
                            fundtype: e.fundtype,
                            hqcode: e.hqcode,
                            themeList: e.themeList,
                            lcqx: e.lcqx,
                            ifnew: "0" != e.ifnew,
                            ifzj: "0" != e.ifzj,
                            ifgz: "0" != e.ifgz,
                            iszcz: e.iszcz,
                            iszcg: e.iszcg,
                            isfof: e.isfof,
                            sertime: parseInt(e.nowtime),
                            frm: a.getSearch("frm") ? a.getSearch("frm") : "hd_d3",
                            thsqbfl: parseFloat(e.thsqbfl)
                        }, a._data.data.sgStart = "" == s ? n : "" == n ? s : s > n ? n : s, a._data.data.egtype = a.tools.fontToKey(a._data.data.fundtype), a._data.data.ifnew ? (a._data.data.sgfl = parseFloat(e.rgfl).toFixed(2), a._data.data.sgoldfl = parseFloat(e.rgflold).toFixed(2)) : (a._data.data.sgfl = parseFloat(e.sgfl).toFixed(2), a._data.data.sgoldfl = parseFloat(e.sgoldfl).toFixed(2)), a.fundInfo.call(a, t), a._data.rightstr = "", "0" != e.buy && e.buy ? a._data.rightstr = a.retStr.sell.call(a) : a._data.rightstr = a.retStr.cantSell.call(a), $("#tRight").append(a._data.rightstr);
                        var i = $("#buyInput").val();
                        $("#bCtrl").on({
                            focus: function () {
                                $(this).val() == i && $(this).val("").css({
                                    color: "#333"
                                })
                            },
                            blur: function () {
                                "" == $(this).val() && $(this).val(i).css({
                                    color: "#aaa"
                                })
                            },
                            keyup: function (t) {
                                var e = t.which;
                                if (37 != e && 39 != e) {
                                    var s = $(this).val(),
                                        n = a.tools.numMatch(s);
                                    $(this).val(n)
                                }
                            }
                        }, "#buyInput");
                        var o = $("#buyInput").attr("data-step");
                        $("#bCtrl").on("click", "#up", function () {
                            var a = $("#buyInput").val() == i ? 0 : parseFloat($("#buyInput").val());
                            a += parseFloat(o), $("#buyInput").val(0 == a ? a : a.toFixed(2)).css({
                                color: "#333"
                            }), _sendKey("click", "abstract", 1, 2, $(this).attr("data-taid"))
                        }), $("#bCtrl").on("click", "#down", function () {
                            var a = $("#buyInput").val() == i ? 0 : parseFloat($("#buyInput").val());
                            a -= parseFloat(o), a = a < 0 ? 0 : a, $("#buyInput").val(0 == a ? a : a.toFixed(2)).css({
                                color: "#333"
                            }), _sendKey("click", "abstract", 1, 2, $(this).attr("data-taid"))
                        }), $(".t-imfloattitle .obutton").on("click", function () {
                            var t = $("#buyInput").val(),
                                e = $("#buyInput").data("step"),
                                s = parseFloat(t).toFixed(2);
                            isNaN(s) && (s = e);
                            var n = "https://trade.5ifund.com/trade/trade_otherTradeInit.action?fundCode=" + fundCode + "&tradeType=buy01&amount=" + s + "&frm=" + a._data.data.frm;
                            window.open(n)
                        }), $("#bCtrl").on("click", "#iBuy", function () {
                            var t = $("#buyInput").val(),
                                e = $("#buyInput").data("step"),
                                s = parseFloat(t).toFixed(2);
                            isNaN(s) && (s = e);
                            var n = "https://trade.5ifund.com/trade/trade_otherTradeInit.action?fundCode=" + fundCode + "&tradeType=buy01&amount=" + s + "&frm=" + a._data.data.frm;
                            window.open(n), _sendKeyButton("click", "abstract", 1, 3, $(this).attr("data-taid"), "fund_files_buy")
                        }), "0" != e.buy && e.buy || a.giveSybfund.call(a), a._data.leftstr = "";
                        var r = a._data.data.sertime,
                            d = "" == a._data.data.clrq ? "" : new Date(a._data.data.clrq.replace(/\-/g, "/")).getTime();
                        a._data.leftstr = "" == d || r < d ? a.leftStr.beforeSell.call(a) : a.leftStr.afterSell.call(a), $("#tLeft").append(a._data.leftstr), $("#wfsyCanvas").length > 0 && topCharts(), ifgz = a._data.data.ifgz, ifzj = a._data.data.ifzj, $("#gzCartogram").length > 0 && new topTimesGz(a._data.data.hqcode)
                    }
                }), $(".t-imfloattitle").show(), $(window).on("scroll", function () {
                    $(document).scrollTop() > 540 ? $(".t-imfloattitle").addClass("on") : $(".t-imfloattitle").removeClass("on")
                })
            },
            getSearch: function (a) {
                var t = location.search.substr(1),
                    e = t.split("&"),
                    s = {};
                return $.each(e, function (a, t) {
                    var e = t.split("=");
                    s[e[0]] = e[1]
                }), s[a]
            },
            fundInfo: function (a) {
                var t = a.data[0];
                if ($(".t-imtitle .ti-left .name,.t-imfloattitle .ti-left .name").html(t.name), $(".t-imtitle .ti-left .code,.t-imfloattitle .ti-left .code").html(t.code), $(".t-imtitle .ti-left,.t-imfloattitle .ti-left").append('<span class="tips">' + t.fundtype + '</span><span class="tips risk">' + t.levelOfRisk + "</span>"), "0" != t.ifnew && $(".t-imtitle .ti-left,.t-imfloattitle .ti-left").append('<span class="tips theme">新发基金</span>'), "0" == t.fastcash && "hbx" == t.type && $(".t-imtitle .ti-left,.t-imfloattitle .ti-left").append('<span class="tips theme">实时取现</span>'), t.themeList && "" != t.themeList) {
                    var e = "";
                    $.each(t.themeList, function (a, t) {
                        if (e += '<span class="tips theme"><a href="http://fund.10jqka.com.cn/fundtheme/index.html#key/' + t.id + "/" + encodeURIComponent(t.field_name) + '" target="_blank">' + t.field_name + "</a></span>", "1" == a) return !1
                    }), $(".t-imtitle .ti-left,.t-imfloattitle .ti-left").append(e)
                }
                var s = "";
                "hbx" == t.type ? (s += '<div class="data"><p class="percent f-up">' + (t.totalnet ? (t.totalnet > 10 ? parseFloat(t.totalnet).toFixed(2) : t.totalnet) + "%" : "--") + '</p><p class="unit">七日年化 [' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p></div>", s += '<div class="data"><p class="percent f-up">' + (t.net ? t.net : "--") + '</p><p class="unit">万份收益 [' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p></div>") : (s += '<div class="data"><p class="percent ' + (parseFloat(t.rate) < 0 ? "f-down" : "f-up") + '">' + (t.net ? t.net : "--") + '</p><p class="unit">单位净值 [' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p></div>", s += '<div class="data"><p class="percent ' + (parseFloat(t.rate) < 0 ? "f-down" : "f-up") + '">' + (isNaN(parseFloat(t.rate)) || parseFloat(t.rate) < 0 ? "" : "+") + (t.rate ? t.rate + "%" : "--") + '</p><p class="unit">日增长率 [' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p></div>"), $(".t-imfloattitle .ti-middle").html(s);
                var n = '<div class="d-wfsy">';
                "hbx" == t.type ? n += '<p class="value f-red"><b class="percent">' + (t.totalnet ? (t.totalnet > 10 ? parseFloat(t.totalnet).toFixed(2) : t.totalnet) + "<span>%</span>" : "--") + '</b></p><p class="key">七日年化[' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p>" : n += '<p class="value ' + (parseFloat(t.rate) < 0 ? "f-down" : "f-up") + '"><b class="percent">' + (t.net ? t.net : "--") + '</b><b class="spcent"><span class="top">' + (isNaN(parseFloat(t.rate)) || parseFloat(t.rate) < 0 ? "" : "+") + (t.rate ? t.rate + "%" : "--") + '</span><span class="bottom">' + (isNaN(parseFloat(t.rate)) || parseFloat(t.rate) < 0 ? "" : "+") + (t.ranges ? t.ranges : "--") + '</span></b></p><p class="key">单位净值[' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p>", n += '</div><div class="d-wfsy">', "hbx" == t.type ? n += '<p class="value f-red"><b class="percent">' + (t.net ? t.net : "--") + '</b></p><p class="key">万份收益[' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p>" : n += '<p class="value ' + (parseFloat(t.rate) < 0 ? "f-down" : "f-up") + '"><b class="percent">' + (t.totalnet ? t.totalnet : "--") + '</b></p><p class="key">累计净值[' + (t.enddate ? t.enddate.substring(5) : "--") + "]</p>", n += '</div><ul class="d-other"><li>近1月：<span class="' + (parseFloat(t.month) < 0 ? "f-down" : "f-up") + '">' + (t.month ? t.month + "%" : "--") + '</span></li><li>近3月：<span class="' + (parseFloat(t.tmonth) < 0 ? "f-down" : "f-up") + '">' + (t.tmonth ? t.tmonth + "%" : "--") + '</span></li><li>近6月：<span class="' + (parseFloat(t.hyear) < 0 ? "f-down" : "f-up") + '">' + (t.hyear ? t.hyear + "%" : "--") + '</span></li><li>近1年：<span class="' + (parseFloat(t.year) < 0 ? "f-down" : "f-up") + '">' + (t.year ? t.year + "%" : "--") + "</span></li></ul>", $("#tRight .data").html(n);
                var i = this._data.data.sertime,
                    o = "" == this._data.data.clrq ? "" : new Date(this._data.data.clrq.replace(/\-/g, "/")).getTime();
                ("" == o || i < o) && $("#tRight .data").addClass("nfund");
                var r = "<li>基金规模：" + (t.asset ? t.asset + "亿元" : "--") + '</li><li class="c-widthauto">成立时间：' + (t.clrq ? t.clrq : "--") + "</li>";
                "0" != t.ifnew ? r += "<li>基金经理：" + (t.manager ? '<a href="/' + t.code + '/#manager" target="_blank">' + t.manager + "</a>" : "--") + "</li>" : r += "<li>基金经理：" + (t.manager ? '<a href="/' + t.code + '/interduce.html#manager" target="_blank">' + t.manager + "</a>" : "--") + "</li>";
                for (var d = "", l = 0; l < t.maxStar;) d += '<i class="star"></i>', l++;
                r += '<li><span class="c-name">基金评级：</span>' + (d || "暂无评级") + "</li>", r += '<li class="c-widthauto">管理人：' + (t.orgname ? t.orgname : "--") + "</li>", $("#tRight .company").html(r)
            },
            giveSybfund: function () {
                var a = this,
                    t = a.tools.fontToKey(a._data.data.fundtype),
                    e = "hbx" == t ? "七日年化" : "近3月收益",
                    s = "hbx" == t ? "totalnet" : "tmonth",
                    n = FDURL.samefund.replace("{type}", t).replace("{key}", s);
                $.ajax({
                    url: n,
                    dataType: "json",
                    type: "GET",
                    success: function (a) {
                        var t = a;
                        $("#gFund .first .top .t-name").html(t[0].name).attr("href", "//fund.10jqka.com.cn/" + t[0].code + "/").attr("data-code", t[0].code), $("#gFund .first .top .t-code").html("(" + t[0].code + ")"), $("#gFund .first .bottom .b-percent").html(t[0][s] + "%"), $("#gFund .first .bottom .b-key").text(e), $("#gFund .first .bottom .b-btn").attr("href", "https://trade.5ifund.com/trade/trade_otherTradeInit.action?tradeType=buy&fundCode=" + t[0].code), $("#gFund .second .top .t-name").html(t[1].name).attr("href", "//fund.10jqka.com.cn/" + t[1].code + "/").attr("data-code", t[0].code), $("#gFund .second .top .t-code").html("(" + t[1].code + ")"), $("#gFund .second .bottom .b-percent").html(t[1][s] + "%"), $("#gFund .second .bottom .b-key").text(e), $("#gFund .second .bottom .b-btn").attr("href", "https://trade.5ifund.com/trade/trade_otherTradeInit.action?tradeType=buy&fundCode=" + t[1].code)
                    }
                })
            },
            sortyear: function (a, t) {
                return t.yield - a.yield
            },
            retStr: {
                sell: function (a) {
                    var t = this,
                        e = ["{{#list}}", '<div class="buy">', '<div class="b-state">', "{{#stateformat}}{{sgStart}}|{{clrq}}|{{sgStat}}|{{shStat}}|{{rgEnd}}|{{rgStartReal}}|{{money}}{{/stateformat}}", "</div>", '<div class="b-ctrl" id="bCtrl">', '<span class="calculator" id="calculator" data-taid="jsq">', "<i></i>", "</span>", "{{#buyformat}}{{buy}}|{{zdsg}}|{{sgStart}}|{{rgStartReal}}|{{rgEnd}}{{/buyformat}}", "{{#dtformat}}{{ifDt}}|{{code}}|{{frm}}{{/dtformat}}", '<a href="https://trade.5ifund.com/pc_regnew/regNewInit.action?frm={{frm}}" target="_blank" class="open" id="open" data-taid="kaihu">8秒开户</a>', "</div>", '<div class="b-tip">', '<p class="fl">费率：{{#flformat}}{{type}}|{{sgoldfl}}|{{ifnew}}{{/flformat}}<span class="f-red">{{sgfl}}%</span></p>', "{{#tipformat}}{{sgStart}}|{{ifFast}}|{{type}}|{{lcqx}}|{{thsqbfl}}{{/tipformat}}", "</div>", "</div>", "{{/list}}"].join(""),
                        s = {
                            list: t._data.data,
                            stateformat: function () {
                                return function (a, e) {
                                    var s = e(a).split("|"),
                                        n = "",
                                        i = t._data.data.sertime,
                                        o = new Date(s[1].replace(/\-/g, "/")).getTime(),
                                        r = new Date(s[4].replace(/\-/g, "/") + " 15:00:00").getTime(),
                                        d = new Date(s[5].replace(/\-/g, "/") + " 15:00:00").getTime();
                                    return isNaN(parseFloat(s[0])) || i < parseFloat(s[0]) ? isNaN(o) ? n += i > r ? '<p>交易状态：<span class="f-red">验资期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : i < d ? "<p>交易状态：<span>--</span></p><p>开放日：<span>" + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : '<p>交易状态：<span class="f-red">认购期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : n += '<p>交易状态：<span class="f-red">封闭期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : ("限制大额" == s[2] ? n += '<p style="width:296px;">申购状态：<span class="f-red">' + s[2] + "（单日购买上限" + (s[6] >= 1e4 ? (s[6] / 1e4).toFixed(1) + "亿" : s[6] < 1 ? (1e4 * s[6]).toFixed(0) + "元" : s[6] + "万") + "）</span></p>" : n += '<p>申购状态：<span class="f-red">' + s[2] + "</span></p>", n += '<p>赎回状态：<span class="f-red">' + s[3] + "</span></p>"), n
                                }
                            },
                            dtformat: function () {
                                return function (a, t) {
                                    var e = t(a).split("|");
                                    return "1" == e[0] ? '<a href="https://trade.5ifund.com/trade/trade_otherTradeInit.action?fundCode=' + e[1] + "&tradeType=plan01&frm=" + e[2] + '" target="_blank" class="planpay" id="planpay" data-taid="dingtou">定投</a>' : '<a class="planpay off">定投</a>'
                                }
                            },
                            flformat: function () {
                                return function (a, t) {
                                    var e = t(a).split("|"),
                                        s = '<span class="oldfl">' + e[1] + "%</span>";
                                    return "hbx" == e[0] && (s = ""), s
                                }
                            },
                            tipformat: function () {
                                return function (a, e) {
                                    var s = e(a).split("|"),
                                        n = "",
                                        i = t._data.data.sertime;
                                    return "0" == s[4] && (n += '<span class="wallet">钱包购买更优惠</span>'), i >= parseInt(s[0]) && ("hbx" == s[2] ? (n += '<span class="tip">按日计息</span>', "0" == s[1] && (n += '<span class="tip">2小时内到账</span>')) : (n += '<span class="tip">基金转换</span>', "0" == s[1] && (n += '<span class="tip">快速赎回</span>'))), "--" != s[3] && (n += '<span class="tip">' + s[3] + "理财期限</span>"), n
                                }
                            },
                            buyformat: function () {
                                return function (a, e) {
                                    var s = e(a).split("|"),
                                        n = "",
                                        i = t._data.data.sertime;
                                    return "2" != s[0] && s[0] ? i < parseFloat(s[2]) ? i >= t.tools.dateToTime(s[3] + " 15:00:00") && i < t.tools.dateToTime(s[4] + " 15:00:00") ? n += '<div class="input"><input type="text" value="' + s[1] + '元起购" id="buyInput" data-step="' + s[1] + '"><a class="i-button" id="iBuy" data-taid="buy">立即购买</a><p class="i-arrow"><span class="up" id="up" data-taid="arrow"><i></i></span><span class="down id="down" data-taid="arrow"><i></i></span></p></div>' : n += '<div class="input off"><input type="text" value="' + s[1] + '元起购" id="buyInput" data-step="' + s[1] + '"><a class="i-button">立即购买</a><p class="i-arrow"><span class="up" data-taid="arrow"><i></i></span><span class="down" data-taid="arrow"><i></i></span></p></div>' : n += '<div class="input"><input type="text" value="' + s[1] + '元起购" id="buyInput" data-step="' + s[1] + '"><a class="i-button" id="iBuy" data-taid="buy">立即购买</a><p class="i-arrow"><span class="up" id="up" data-taid="arrow"><i></i></span><span class="down" id="down" data-taid="arrow"><i></i></span></p></div>' : n += '<div class="input off"><input type="text" value="' + s[1] + '元起购" id="buyInput" data-step="' + s[1] + '"><a class="i-button">立即购买</a><p class="i-arrow"><span class="up" data-taid="arrow"><i></i></span><span class="down" data-taid="arrow"><i></i></span></p></div>', n
                                }
                            }
                        };
                    return Mustache.render(e, s)
                },
                cantSell: function () {
                    var a = this,
                        t = ["{{#list}}", '<div class="cantbuy">', '<div class="b-state">', "{{#stateformat}}{{sgStart}}|{{clrq}}|{{sgStat}}|{{shStat}}|{{rgEnd}}|{{rgStartReal}}|{{money}}{{/stateformat}}", "</div>", '<div class="b-other">', "<p>该基金暂不可购买，您可查看同类热门基金</p>", '<a href="//fund.10jqka.com.cn/datacenter/sy/{{#moreformat}}{{egtype}}{{/moreformat}}/" target="_blank" id="cantMore">查看更多></a>', "</div>", '<div class="b-fund" id="gFund">', '<div class="one first">', '<p class="top"><a href="#" target="_blank" class="t-name" data-code="">--</a><span class="t-code">（--）</span></p>', '<p class="bottom"><b class="b-percent">--</b><span class="b-key">--</span><a href="###" target="_blank" class="b-btn" data-taid="buy">购买</a></p>', "</div>", '<div class="one two second">', '<p class="top"><a href="#" target="_blank" class="t-name" data-code="">--</a><span class="t-code">（--）</span></p>', '<p class="bottom"><b class="b-percent">--</b><span class="b-key">--</span><a href="###" target="_blank" class="b-btn" data-taid="buy">购买</a></p>', "</div>", '<a href="https://trade.5ifund.com/pc_regnew/regNewInit.action?frm={{frm}}" target="_blank" class="open" id="open" data-taid="kaihu">8秒开户</a>', "</div>", "</div>", "{{/list}}"].join(""),
                        e = {
                            list: a._data.data,
                            moreformat: function () {
                                return function (a, t) {
                                    var e = t(a);
                                    return "hbx" != t(a) && (e = "kfs/" + t(a)), e
                                }
                            },
                            stateformat: function () {
                                return function (t, e) {
                                    var s = e(t).split("|"),
                                        n = "",
                                        i = a._data.data.sertime,
                                        o = new Date(s[1].replace(/\-/g, "/")).getTime(),
                                        r = new Date(s[4].replace(/\-/g, "/") + " 15:00:00").getTime(),
                                        d = new Date(s[5].replace(/\-/g, "/") + " 15:00:00").getTime();
                                    return isNaN(parseFloat(s[0])) || i < parseFloat(s[0]) ? isNaN(o) ? n += i > r ? '<p>交易状态：<span class="f-red">验资期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : i < d ? "<p>交易状态：<span>--</span></p><p>开放日：<span>" + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : '<p>交易状态：<span class="f-red">认购期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : n += '<p>交易状态：<span class="f-red">封闭期</span></p><p>开放日：<span>' + (isNaN(parseFloat(s[0])) ? "--" : sd.tools.timeFormat(parseFloat(s[0]), "yyyy-MM-dd")) + "</span></p>" : ("限制大额" == s[2] ? n += '<p style="width:296px;">申购状态：<span class="f-red">' + s[2] + "（单日购买上限" + (s[6] >= 1e4 ? (s[6] / 1e4).toFixed(1) + "亿" : s[6] + "万") + "）</span></p>" : n += '<p>申购状态：<span class="f-red">' + s[2] + "</span></p>", n += '<p>赎回状态：<span class="f-red">' + s[3] + "</span></p>"), n
                                }
                            }
                        };
                    return Mustache.render(t, e)
                }
            },
            leftStr: {
                beforeSell: function (a) {
                    var t = this,
                        e = ["{{#list}}", '<div class="default">', '<div class="topline">认购期：{{rgStartReal}} 15:00~{{rgEndShow}} 15:00 <i class="question" data-taid="rgq"></i>', '<div class="quesbox" style="display: none;">', "<p>到期日后，开放申购和赎回时间以基金公司公告为准，数据仅供参考。</p>", "<span></span>", "</div></div>", "{{#rgformat}}{{rgStartReal}}|{{rgEnd}}{{/rgformat}}", "</div>", "{{/list}}"].join(""),
                        s = {
                            list: t._data.data,
                            rgformat: function () {
                                return function (a, e) {
                                    var s = e(a).split("|"),
                                        n = new Date(s[0].replace(/\-/g, "/") + " 15:00:00").getTime(),
                                        i = new Date(s[1].replace(/\-/g, "/") + " 15:00:00").getTime(),
                                        o = "",
                                        r = t._data.data.sertime;
                                    if (r < n) {
                                        var d = (n - r) / 864e5,
                                            l = parseInt(d),
                                            c = parseInt(24 * (d - l)),
                                            u = parseInt(60 * (24 * (d - l) - c));
                                        o += '<div class="bottomline">距离认购开始还有：<span class="f-red">' + parseInt(d) + '</span>天<span class="f-red">' + c + '</span>小时<span class="f-red">' + u + '</span>分</div><a href="//fund.10jqka.com.cn/datacenter/xfjj/" target="_blank" class="xfjj" data-taid="xfjj">查看更多新发基金></a>'
                                    } else if (r >= i) o += '<div class="bottomline">认购已结束，即将开放，敬请期待</div>';
                                    else {
                                        var d = (i - r) / 864e5,
                                            l = parseInt(d),
                                            c = parseInt(24 * (d - l)),
                                            u = parseInt(60 * (24 * (d - l) - c));
                                        o += '<div class="bottomline">距离认购结束还有：<span class="f-red">' + (isNaN(parseInt(d)) ? "--" : parseInt(d)) + '</span>天<span class="f-red">' + (isNaN(c) ? "--" : c) + '</span>小时<span class="f-red">' + (isNaN(u) ? "--" : u) + '</span>分</div><a href="//fund.10jqka.com.cn/datacenter/xfjj/" target="_blank" class="xfjj" data-taid="xfjj">查看更多新发基金></a>'
                                    }
                                    return o
                                }
                            }
                        };
                    return Mustache.render(e, s)
                },
                afterSell: function () {
                    var a = this,
                        t = a._data.data.iszcg,
                        e = a._data.data.iszcz,
                        s = a._data.data.isfof,
                        n = "",
                        i = "",
                        o = "";
                    return "1" == t ? (n = "重仓持股", i = "股票名称", o = "市值/万元") : "1" == s ? (n = "重仓基金", i = "基金名称", o = "公允价值/万元") : "1" == e ? (n = "重仓持债", i = "债券名称", o = "市值/万元") : (n = "重仓持股", i = "股票名称", o = "市值/万元"), "hbx" == a._data.data.type ? ['<div class="top">', '<ul class="tab" id="syTab">', '<li data-key="0" class="on" data-taid="qrnh">七日年化收益</li>', '<li data-key="1" data-taid="wf">万份收益</li>', "</ul>", "</div>", '<div class="cartogram">', '<div class="c-contrl">', "选择区间", '<div class="clear"></div>', "</div>", '<div class="c-canvas" id="wfsyCanvas"></div>', "</div>"].join("") : ['<div class="top">', '<ul class="tab" id="gzTab">', '<li data-key="0" data-lang="#gzBox" class="tpart on" data-taid="ssgz">实时估值</li>', '<li data-key="1" data-lang="#zcBox" class="tpart" data-taid="zccg">' + n + "</li>", '<li data-key="2" data-lang="#jjCanvas" class="tpart" data-taid="jjzd">基金诊断</li>', "</ul>", "</div>", '<div class="cartogram" id="gzCartogram">', '<div class="c-sbox" id="gzBox">', '<div class="gz-default" id="gzDefault" style="display: none;">暂无估值</div>', '<p class="gzData" style="display: none;">实时估值：<span class="gz"><b>--</b>元</span>估值涨幅：<span class="zf">--</span><span class="time">[--]</span></p>', '<div class="c-scanvas" id="gzCanvas" style="display: none;"></div>', "</div>", '<div class="c-zstroe" id="zcBox" style="display: none;">', '<div class="gz-default" id="zcDefault" style="display: none;">暂无数据</div>', '<ul class="cz-title" style="display: none;">', '<li class="width50">序号</li>', '<li class="width100">' + i + "</li>", '<li class="width90">日涨幅</li>', '<li class="width96">占净资产比</li>', '<li class="width108">' + o + "</li>", "</ul>", '<div class="cz-content" id="czContent" style="display: none;">', "</div>", "</div>", '<div class="c-jcanvas" id="jjCanvas" style="display: none;">', '<div class="gz-default" id="zdDefault" style="display: none;">暂无数据</div>', '<div class="cj-chart" id="cjChart" style="display: none;"></div>', '<ul class="cj-nav" id="cjNav" style="display: none;"><li>近1月 <i></i></li><li class="on">近3月 <i></i></li><li>近6月 <i></i></li></ul>', '<div class="cj-total" style="display: none;">', '<p class="pm"><span>--</span>/--</p>', '<p class="vl">综合诊断排名</p>', "</div>", '<a href="http://www.iwencai.com/stockpick/search?typed=1&preParams=&ts=1&f=1&qs=result_rewrite&selfsectsn=&querytype=fund&searchfilter=&tid=stockpick&w=' + a._data.data.code + '" target="_blank" class="cj-more">查看更多诊基信息></a>', "</div>", "</div>"].join("")
                }
            },
            tools: {
                numMatch: function (a) {
                    var t = a,
                        e = t.indexOf(".") + 1,
                        s = t.substring(0, e),
                        n = t.substring(e);
                    return s = s.replace(/[^\d\.]/g, ""), n = n.replace(/[^\d]/g, ""), 1 == e ? n : s + n
                },
                dateToTime: function (a) {
                    var t = a;
                    return new Date(t.replace(/\-/g, "/")).getTime()
                },
                fontToKey: function (a) {
                    var t = "";
                    switch (a) {
                        case "股票型":
                            t = "gpx";
                            break;
                        case "混合型":
                            t = "hhx";
                            break;
                        case "指数型":
                            t = "zsx";
                            break;
                        case "债券型":
                            t = "zqx";
                            break;
                        case "QDII":
                            t = "QDII";
                            break;
                        default:
                            t = "hbx"
                    }
                    return t
                },
                getServertime: function () {
                    var a = null;
                    a = window.XMLHttpRequest ? new window.XMLHttpRequest : new ActiveObject("Microsoft"), a.open("GET", "/", !1), a.send(null);
                    var t = a.getResponseHeader("Date");
                    return new Date(t).getTime()
                }
            }
        }, new stateJudge, $("#tLeft").on({
            mouseenter: function () {
                $(this).next(".quesbox").show()
            },
            mouseleave: function (a) {
                var t = $(this).next(".quesbox");
                t.is(a.target) || t.hide()
            }
        }, ".question"), $("#tLeft").on({
            mouseenter: function () {
                $(this).show()
            },
            mouseleave: function () {
                $(this).hide()
            }
        }, ".quesbox"), $("#tRight").on("click", "#planpay", function () {
            _sendKeyButton("click", "abstract", 1, 4, $(this).attr("data-taid"), "fund_files_dingtou")
        }), $("#tRight").on("click", "#open", function () {
            _sendKeyButton("click", "abstract", 1, 5, $(this).attr("data-taid"), "fund_files_kaihu")
        }), $("#tRight").on("click", "#cantMore", function () {
            _sendKey("click", "abstract", 1, 6, $(this).attr("data-taid"))
        }), $("#tRight").on("click", "#gFund .t-name", function () {
            var a = $(this).attr("data-code"),
                t = $("#gFund .one").index($(this).parents(".one")),
                e = t + 1,
                s = "fund_mf_" + fundCode + "-abstract-r2c" + e + "-click-fund-" + a;
            TA.log({
                id: s,
                fid: ""
            })
        }), $("#tRight").on("click", "#gFund .b-btn", function () {
            var a = $(this).attr("data-taid");
            _sendKey("click", "abstract", 3, $("#gFund .one").index($(this).parents(".one")) + 1, a)
        }), $("#tRight").on("click", "#gFund .b-btn", function () {
            var a = $(this).attr("data-taid");
            _sendKey("click", "abstract", 3, $("#gFund .one").index($(this).parents(".one")) + 1, a)
        }), $("#tLeft").on("click", ".xfjj", function () {
            _sendKey("click", "graph", 5, 1, $(this).attr("data-taid"))
        }), $("#tLeft").one({
            mouseenter: function () {
                _sendKey("hang", "graph", 4, 1, $(this).attr("data-taid"))
            }
        }, ".question"), $("#tLeft").one({
            mouseenter: function () {
                var a = "";
                a = 0 == tab ? "qrnh" : "wfsy", _sendKey("hang", mthkey, 2, 1, a)
            },
            click: function () {
                var a = "";
                a = 0 == tab ? "qrnh" : "wfsy", _sendKey("click", mthkey, 3, 1, a)
            }
        }, "#wfsyCanvas");
        var gzta1, if1 = !0;
        $("#tLeft").on({
            mouseenter: function () {
                if1 && (gzta1 = setTimeout(function () {
                    if1 = !1, _sendKey("hang", "graphssgz", 1, 1, "ssgz")
                }, 2e3))
            },
            mouseleave: function () {
                clearTimeout(gzta1)
            }
        }, "#gzCanvas");
        var gzta2, if2 = !0;
        $("#tLeft").on({
            mouseenter: function () {
                if2 && (gzta2 = setTimeout(function () {
                    if2 = !1, _sendKey("hang", "graphzccg", 1, 1, "zccg")
                }, 2e3))
            },
            mouseleave: function () {
                clearTimeout(gzta2)
            }
        }, "#zcBox");
        var gzta3, if3 = !0;
        return $("#tLeft").on({
            mouseenter: function () {
                if3 && (gzta3 = setTimeout(function () {
                    if3 = !1, _sendKey("hang", "graphjjzd", 1, 1, "jjzd")
                }, 2e3))
            },
            mouseleave: function () {
                clearTimeout(gzta3)
            }
        }, "#jjCanvas"), TA.log({
            id: "fund_mf_" + fundCode + "-show",
            fid: "info_gather,ch_fund,fund_files"
        }), {
            calcu: calcu
        }
    }), define("menu", ["topInfo"], function (a) {
        function t(a, t, e) {
            var s = $(document).scrollTop(),
                n = t,
                i = s + document.documentElement.clientHeight + n - document.documentElement.scrollHeight;
            i > e ? $(a).css({
                bottom: i
            }) : $(a).css({
                bottom: e
            })
        }

        function e(a, t, e, s, n) {
            var i = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: i,
                fid: ""
            })
        }
        $("#menu a").on({
            mouseenter: function () {
                $(this).find(".icon").stop(!0, !1).animate({
                    top: "-40px"
                }, 200), $(this).find(".font").stop(!0, !1).animate({
                    top: "0px"
                }, 200)
            },
            mouseleave: function () {
                $(this).find(".icon").stop(!0, !1).animate({
                    top: "0px"
                }, 200), $(this).find(".font").stop(!0, !1).animate({
                    top: "40px"
                }, 200)
            }
        }), $(window).on("scroll", function () {
            t("#menu", 328, 50)
        }), $("#menu .menu1").click(function () {
            $("#useCalculator").show(), $("#shadow").show(), $("#fundInfo .fund").hide(), $("#fundInfo input").show(), a.calcu.dataClear(!0), $("#fundMoney input").val(1e4).css({
                color: "#333"
            })
        }), $("#menu .gototop").click(function (a) {
            clearInterval(s);
            var t = $("body").scrollTop(),
                e = t / 20,
                s = setInterval(function () {
                    0 == t && clearInterval(s), t -= e, t < 0 && (t = 0), window.scrollTo(0, t)
                }, 15)
        }), $("#menu a").click(function () {
            e("click", "sidebar", $(this).index() + 1, 1, $(this).attr("data-taid"))
        })
    }), define("like", ["fdurl"], function (a) {
        function t() {
            this._data = {
                u_userid: a.likedata,
                u_sy: a.fromsy,
                url: "",
                likeArr: "",
                syArr: ""
            }, this.init()
        }
        return t.prototype = {
            init: function () {
                var a = this,
                    t = $.cookie("userid");
                this._data.userid = t, t ? this.getLikedata.call(this) : this.getSydata.call(a);
                var e;
                $("#fundLike").find(".h-title .update").click(function () {
                    var s = $(this);
                    t ? a.getLikedata(!0) : a.getSydata(!0), clearTimeout(e), s.addClass("on"), e = setTimeout(function () {
                        s.removeClass("on")
                    }, 300)
                })
            },
            getLikedata: function (a) {
                var t = this,
                    e = "",
                    s = this._data.u_userid.replace("{userid}", this._data.userid);
                this.fromAjax(s, function (s) {
                    var n = s.data;
                    n = n.sort(t.tools.likeSort);
                    var i = [];
                    $.each(n, function (a, t) {
                        var e = t.name + "_" + t.code + "_";
                        "hbx" == t.type ? e += t.nhsy + "_" : e += t.year + "_", e += t.type, i.push(e)
                    }), t._data.likeArr = i, e = i.join("|"), a ? t.randomData.call(t, e, 20) : t.topSydata.call(t, e)
                })
            },
            getSydata: function (a) {
                var t = this,
                    e = "",
                    s = this._data.u_sy;
                a ? t.randomData.call(t, t._data.syArr.join("|"), 60) : this.fromAjax(s, function (a) {
                    var s = a,
                        n = [],
                        i = [];
                    $.each(s, function (a, s) {
                        var o = s.name + "_" + s.code + "_";
                        "hbx" == s.type ? o += s.totalnet + "_" : o += s.year + "_", o += s.type, n.push(o), i.length < 5 && (i.push(o), e += t.tools.lineStr(o.split("_")))
                    }), t._data.syArr = n, $("#fundLike .h-list").html(e)
                })
            },
            randomData: function (a, t) {
                for (var e = this, s = a.split("|"), n = "", i = []; i.length < 5;) {
                    var o = Math.random(),
                        r = parseInt(o * t);
                    e.tools.arrIndexOf(i, r) || i.push(r)
                }
                $.each(i, function (a, t) {
                    if (!s[t]) return 0;
                    var i = s[t].split("_");
                    n += e.tools.lineStr(i)
                }), $("#fundLike").find(".h-list").html(n)
            },
            topSydata: function (a) {
                var t = this,
                    e = a.split("|"),
                    s = "",
                    n = 0;
                $.each(e, function (a, e) {
                    var i = e.split("_");
                    if (s += t.tools.lineStr(i), 5 == ++n) return !1
                }), $("#fundLike").find(".h-list").html(s)
            },
            fromAjax: function (a, t) {
                $.ajax({
                    url: a,
                    dataType: "json",
                    type: "GET",
                    success: function (a) {
                        t(a)
                    }
                })
            },
            tools: {
                arrIndexOf: function (a, t) {
                    var e = !1;
                    return $.each(a, function (a, s) {
                        if (s == t) return e = !0, !1
                    }), e
                },
                likeSort: function (a, t) {
                    return t.year - a.year
                },
                lineStr: function (a) {
                    var t = a,
                        e = "近一年收益率",
                        s = parseFloat(t[2]).toFixed(2);
                    "hbx" == t[3] && (e = "七日年化收益", s = parseFloat(t[2]).toFixed(4));
                    var n = "";
                    return n += '<li><div class="fund"><a href="/' + t[1] + '/" target="_blank" class="f-name" data-code="' + t[1] + '">' + t[0] + '</a><p class="f-code">' + t[1] + '</p></div><div class="sy"><b class="s-percent f-red">' + s + '%</b><p class="s-key">' + e + "</p></div></li>"
                }
            }
        }, t
    }), define("rightlogin", ["fdurl"], function (a) {
        return {
            init: function () {
                this.syb(), this.lcb()
            },
            syb: function () {
                $.ajax({
                    url: a.sybdata,
                    type: "GET",
                    dataType: "json",
                    success: function (a) {
                        var t = parseFloat(a.info.maxsy).toFixed(2);
                        $("#Login").find(".l-syb .data").html('<span class="d-first">' + t.toString().split(".")[0] + "</span>." + t.toString().split(".")[1] + '%<span class="d-key">7日年化 1元起</span>')
                    }
                })
            },
            lcb: function () {
                var t = this;
                $.ajax({
                    url: a.lcbdata,
                    type: "GET",
                    dataType: "json",
                    success: function (a) {
                        var a = a;
                        a = a.sort(t.sortyear);
                        var e = parseFloat(a[0].qrnhsy).toFixed(2);
                        try {
                            $(".c-right").find("#Login .l-lcb .data").html('<span class="d-first">' + e.toString().split(".")[0] + "</span>." + e.toString().split(".")[1] + '%<span class="d-key">7日年化 1元起</span>')
                        } catch (a) {}
                    }
                })
            },
            sortyear: function (a, t) {
                return t.qrnhsy - a.qrnhsy
            }
        }
    }), define("right", ["ownfund", "like", "rightlogin"], function (a, t, e) {
        function s(a, t, e, s, n) {
            var i = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: i,
                fid: ""
            })
        }
        $.cookie("escapename") ? ($("#Login").remove(), $("#ownFund").show()) : ($("#Login").show(), $("#ownFund").remove()), e.init(), $(".c-right").find("#Login .l-button a").on("click", function () {
            s("click", "login", 1, $(this).index() + 1, $(this).attr("data-taid"))
        }), $(".c-right").find("#Login .l-syb").on("click", function () {
            var a = "fund_mf_" + fundCode + "-login-r2c1-click-zy-syb";
            TA.log({
                id: a,
                fid: ""
            })
        }), $(".c-right").find("#Login .l-lcb").on("click", function () {
            var a = "fund_mf_" + fundCode + "-login-r3c1-click-zy-lcb";
            TA.log({
                id: a,
                fid: ""
            })
        }), (new a.ownFund).getFund(), $("#ownFund").find(".o-title .more").click(function () {
            s("click", "login", 0, 3, "more")
        }), $("#zxFund").on("click", ".o-data a", function () {
            var a = $(this).parents("ul").index(),
                t = $(this).attr("data-code"),
                e = a + 1,
                s = "fund_mf_" + fundCode + "-loginzx-r" + e + "c1-click-fund-" + t;
            TA.log({
                id: s,
                fid: ""
            })
        }), a.footPrint.setPrint();
        var n = a.footPrint.getPrint(),
            i = "";
        "" != n && $.each(n, function (a, t) {
            var e = t.split("_");
            i += '<ul><li class="name"><a href="//fund.10jqka.com.cn/' + e[1] + '/" target="_blank" data-code="' + e[1] + '">' + e[0] + '</a></li><li class="value">' + e[1] + '</li><li class="rise">' + e[2] + "</li></ul>"
        }), $("#footPrint").find(".o-data").append(i), $("#footPrint").find(".o-data a").click(function () {
            var a = $(this).parents("ul").index(),
                t = $(this).attr("data-code"),
                e = a + 1,
                s = "fund_mf_" + fundCode + "-loginll-r" + e + "c1-click-fund-" + t;
            TA.log({
                id: s,
                fid: ""
            })
        });
        new t;
        $("#fundLike").find(".h-title .update").click(function () {
            s("click", "cnxh", 0, 1, "sx")
        }), $("#fundLike").find(".h-list").on("click", "a", function () {
            var a = $(this).parents("li").index(),
                t = a + 1,
                e = $(this).attr("data-code"),
                s = "fund_mf_" + fundCode + "-cnxh-r" + t + "c1-click-fund-" + e;
            TA.log({
                id: s,
                fid: ""
            })
        }), $("#tools").find(".t-line").each(function () {
            var a = $(this).index(),
                t = a + 1;
            $(this).find(".list a").click(function () {
                var a = $(this).index(),
                    e = a + 1,
                    n = $(this).attr("data-taid");
                s("click", "sideguide", t, e, n)
            })
        }), $("#hotFund").find(".h-list a").click(function () {
            var a = $(this).parents("li").index(),
                t = a + 1,
                e = $(this).attr("data-code"),
                s = "fund_mf_" + fundCode + "-rexiaojijin-r" + t + "c1-click-fund-" + e;
            TA.log({
                id: s,
                fid: ""
            })
        }), $("#sameFund").find(".h-list a").click(function () {
            var a = $(this).parents("li").index(),
                t = a + 1,
                e = $(this).attr("data-code"),
                s = "fund_mf_" + fundCode + "-similarph-r" + t + "c1-click-fund-" + e;
            TA.log({
                id: s,
                fid: ""
            })
        })
    }), PAGEID = "fund_mf_" + fundCode, ACPAGE = 1, TAINFO = {
        optime: (new Date).getTime(),
        cururl: document.referrer,
        urlver: "JJXZ-767",
        logver: "2.1"
    }, require(["common", "fdurl", "nhead", "menu", "topInfo", "getsydata", "right"], function (cm, FDURL, nheadm, mn, tif, gsdata, rt) {
        function ownerChart() {
            if (0 == ownerconstr.length) return $("#ownerCanvas").before('<div class="m-default"">暂无数据</div>'), void $("#ownerCanvas").hide();
            $.each(ownerconstr, function (a, t) {
                oX.push(a), jD.push(t[0] ? parseFloat(t[0]) : 0), gD.push(t[1] ? parseFloat(t[1]) : 0)
            });
            var a, t = oX.length;
            switch (t) {
                case 4:
                    a = .13;
                    break;
                case 3:
                    a = .23;
                    break;
                case 2:
                    a = .33;
                    break;
                case 1:
                    a = .43
            }
            var e = drawOwner(a);
            $("#ownerCanvas").highcharts(e)
        }

        function drawOwner(a) {
            return {
                chart: {
                    type: "column",
                    marginRight: 0,
                    style: {
                        fontFamily: "arial"
                    }
                },
                title: {
                    text: ""
                },
                credits: {
                    enabled: !1
                },
                xAxis: {
                    categories: oX,
                    tickLength: 0,
                    labels: {
                        autoRotation: !1,
                        style: {
                            color: "#666",
                            fontSize: "12px"
                        }
                    }
                },
                plotOptions: {
                    column: {
                        pointWidth: 20,
                        groupPadding: a
                    }
                },
                legend: {
                    enabled: !0,
                    align: "center",
                    itemMarginLeft: 30,
                    itemStyle: {
                        fontWeight: "normal",
                        fontFamily: "Microsoft yahei"
                    },
                    symbolHeight: 10,
                    symbolWidth: 10,
                    symbolRadius: 0
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderRadius: 9,
                    borderWidth: 0,
                    shadow: !1,
                    headerFormat: '<span style="color: #fff;font-size: 14px;">{point.key}</span><br/>',
                    dataTimeLabelFormats: {
                        millisecond: "%A, %b, %e, %H:%M:%S.%L",
                        second: "%A, %b, %e, %H:%M:%S",
                        minute: "%A, %b, %e, %H:%M",
                        hour: "%A, %b, %e, %H:%M",
                        day: "%Y-%m-%d",
                        week: "%Y-%m-%d",
                        month: "%Y-%m",
                        year: "%Y-%m-%d"
                    },
                    xDateFormat: "%Y-%m-%d",
                    pointFormatter: function () {
                        Highcharts.dateFormat("%Y-%m-%d", this.value);
                        return "<span style=\"color:#fff;font-family: arial, 'Microsoft YaHei';\">" + this.series.name + '：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;">' + this.y.toFixed(2) + "%</span><br />"
                    },
                    pointFormat: ""
                },
                yAxis: {
                    labels: {
                        formatter: function () {
                            return '<span style="font-size: 12px;">' + this.value.toFixed(2) + "%</span>"
                        }
                    },
                    lineWidth: 0,
                    max: 100,
                    title: {
                        enabled: !1
                    }
                },
                series: [{
                    name: "机构",
                    data: jD,
                    color: "#e96563"
                }, {
                    name: "个人",
                    data: gD,
                    color: "#4e8fcd"
                }]
            }
        }

        function configCharts() {
            if (0 == fundconfig.length) return $("#configDefault").show(), void $("#configCanvas").hide();
            $("#configMoney").show(), $("#configTotal").show(), $.each(fundconfig, function (a, t) {
                t[1] = parseFloat(t[1].toFixed(2)), 0 != parseFloat(t[1]) && fcAr.push(t)
            }), fcAr = fcAr.sort(sortyear);
            var a = drawConfig();
            $("#configCanvas").highcharts(a, function (a) {
                var t = a.series[0].center[1],
                    e = parseInt(a.title.styles.fontSize);
                a.setTitle({
                    y: t + e / 2 - 30
                }), configcharts = a
            })
        }

        function sortyear(a, t) {
            return t[1] - a[1]
        }

        function drawConfig() {
            return {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: !1,
                    spacingTop: 0,
                    style: {
                        fontFamily: "arial"
                    },
                    marginTop: -20,
                    marginLeft: 0
                },
                title: {
                    floating: !0,
                    text: " ",
                    x: -93,
                    useHTML: !1
                },
                credits: {
                    enabled: !1
                },
                tooltip: {
                    enabled: !1
                },
                legend: {
                    align: "right",
                    layout: "vertical",
                    verticalAlign: "top",
                    itemMarginBottom: 5,
                    itemMarginTop: 5,
                    itemStyle: {
                        fontWeight: "normal"
                    },
                    labelFormatter: function () {
                        return "<span style=\"color:#333;font-family: 'Microsoft YaHei';margin-right: 6px;\">" + this.name + '：</span> <span style="color:#888;">' + this.y.toFixed(2) + "%</span>"
                    },
                    useHTML: !0,
                    squareSymbol: !0,
                    symbolHeight: 10,
                    symbolWidth: 10,
                    symbolRadius: 5,
                    symbolPadding: 10,
                    x: -20,
                    y: 17
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: !1,
                        cursor: "pointer",
                        dataLabels: {
                            enabled: !1,
                            format: ""
                        },
                        colors: ["#f36c60", "#fc9677", "#f4c350", "#ffd600"],
                        size: 193,
                        showInLegend: !0,
                        point: {
                            events: {
                                mouseOver: function (a) {
                                    configcharts.setTitle({
                                        text: '<span style="color: #f36c60;font-size: 28px;margin-bottom: 20px;">' + a.target.y.toFixed(2).split(".")[0] + '.</span><span style="color: #f36c60;font-size: 22px;">' + a.target.y.toFixed(2).split(".")[1] + '%</span><br/><span style="font-family: Microsoft yahei;color: #666;font-size:19px;">' + a.target.name + "</span>"
                                    })
                                },
                                mouseOut: function (a) {
                                    configcharts.setTitle({
                                        text: " "
                                    })
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: "pie",
                    name: "",
                    innerSize: "66%",
                    borderWidth: 2,
                    data: fcAr
                }]
            }
        }

        function showSydata() {
            tab1 = {
                data1: dataDeal(tab1all.data1, _dkey, null, "sy"),
                data2: dataDeal(tab1all.data2, _dkey, null, "tl"),
                data3: dataDeal(tab1all.data3, _dkey, null, "hs")
            }, dataTab(fundName, "同类平均", disname, tab1)
        }

        function showRankdata() {
            var a = FDURL.rankdata.replace("{code}", fundCode);
            if (ifrank) return void $("#rkDefault").show();
            0 == tab2all.data1.length ? $.ajax({
                url: a,
                dataType: "json",
                type: "GET",
                success: function (a) {
                    var t = a;
                    if (!t) return $("#ownSelect .o-cartogram").append('<div class="oc-default" id="rkDefault">暂无数据</div>'), void(ifrank = !0);
                    var e = 0,
                        s = 0,
                        n = 0;
                    if ($.each(t, function (a, t) {
                            var i = a.split("-");
                            i[1] = 1 == i[1].toString().length ? "0" + i[1] : i[1], i = i.join(""), m3 && t[3][2] && "" != t[3][2] && (tab2all.data1[e] = [], tab2all.data1[e][0] = i, tab2all.data1[e][1] = parseFloat(t[3][2]), e++), m6 && t[4][2] && "" != t[4][2] && (tab2all.data2[s] = [], tab2all.data2[s][0] = i, tab2all.data2[s][1] = parseFloat(t[4][2]), s++), m12 && t[5][2] && "" != t[5][2] && (tab2all.data3[n] = [], tab2all.data3[n][0] = i, tab2all.data3[n][1] = parseFloat(t[5][2]), n++)
                        }), 0 == tab2all.data1.length && (ifrank = !0), ifrank) return void $("#ownSelect .o-cartogram").append('<div class="oc-default" id="rkDefault">暂无数据</div>');
                    tab2all.data1.reverse(), tab2all.data2.reverse(), tab2all.data3.reverse(), tabRank()
                }
            }) : tabRank()
        }

        function tabRank() {
            var a = arClone(tab2all.data1),
                t = arClone(tab2all.data2),
                e = arClone(tab2all.data3);
            tab2.data1 = 0 != a.length ? dataDeal(a, _dkey, !0) : [], tab2.data2 = 0 != t.length ? dataDeal(t, _dkey, !0) : [], tab2.data3 = 0 != e.length ? dataDeal(e, _dkey, !0) : [], dataTab("每日近3月收益排名", "每日近6月收益排名", "每日近1年收益排名", tab2)
        }

        function dataTab(a, t, e, s) {
            if (mychart.series[3] && mychart.series[3].remove(), mychart.series[2] && mychart.series[2].remove(), mychart.series[1] && mychart.series[1].remove(), mychart.series[0] && mychart.series[0].remove(), s.data1 && "" != s.data1 && mychart.addSeries({
                    name: a,
                    type: "line",
                    data: s.data1,
                    color: "rgba(68, 137, 202, 1)"
                }), s.data2 && "" != s.data2 && mychart.addSeries({
                    name: t,
                    type: "line",
                    data: s.data2,
                    color: "rgba(207, 14, 15, 1)"
                }), "单位净值" == a) return s.data3 && 0 != s.data3.length && addShare(s.data3), s.data4 && 0 != s.data4.length && addShare(s.data4, "C", "拆分比例", "#5072b8"), void mychart.redraw();
            s.data3 && "" != s.data3 && mychart.addSeries({
                name: e,
                type: "line",
                data: s.data3,
                color: "rgba(121, 121, 121, 1)"
            }), mychart.redraw()
        }

        function keyToDate(a) {
            var t, e = -1 != a.indexOf("/") ? a : sd.tools.dateSelect(a);
            0 == tab && (t = qStart), 1 == tab && (t = aStart), 2 == tab && (t = jStart), e = new Date(e).getTime();
            var s = new Date(t.substring(0, 4) + "/" + t.substring(4, 6) + "/" + t.substring(6, 8)).getTime();
            return parseFloat(e) < s
        }

        function cantSelect() {
            $("#zsTime li").each(function () {
                var a = $(this).attr("data-key");
                if ("" == a) return !0;
                var t = keyToDate(a);
                3 == a && t && (m3 = !1), 6 == a && t && (m6 = !1), 12 == a && t && (m12 = !1), t && $(this).addClass("off")
            })
        }

        function getJZ(callback) {
            var unitjzUrl = FDURL.unitvalue.replace("{code}", fundCode);
            $.ajax({
                url: unitjzUrl,
                dataType: "script",
                cache: !0,
                success: function (data) {
                    if (!data) return $("#ownSelect .o-cartogram").html('<div class="oc-default">暂无数据</div>'), void $("#ownSelect .o-title .stab").remove();
                    var dt = eval("dwjz_" + fundCode);
                    if ("" == dt || !dt) return $("#ownSelect .o-cartogram").html('<div class="oc-default">暂无数据</div>'), void $("#ownSelect .o-title .stab").remove();
                    tab3all.data1 = arClone(dt), jStart = tab3all.data1[0][0];
                    var sy = dataDeal(dt, _dkey, !0, "jz");
                    tab3.data1 = arClone(sy), callback && callback(tab3all.data1, tab3.data1)
                }
            })
        }

        function jzdataShow() {
            var a = arClone(tab3all.data1),
                t = arClone(tab3all.data2),
                e = tab3all.data3 ? arClone(tab3all.data3) : "",
                s = tab3all.data4 ? arClone(tab3all.data4) : "";
            tab3.data1 = dataDeal(a, _dkey, !0, "jz"), tab3.data2 = dataDeal(t, _dkey, !0), tab3.data3 = e ? dataDeal(e, _dkey, !0, "fhcf") : "", tab3.data4 = s ? dataDeal(s, _dkey, !0, "fhcf") : "", dataTab("单位净值", "累计净值", "", tab3)
        }

        function totalValue() {
            var totaljzUrl = FDURL.totalvalue.replace("{code}", fundCode);
            $.ajax({
                url: totaljzUrl,
                dataType: "script",
                cache: !0,
                success: function (data) {
                    if (data) {
                        var dt = eval("ljjz_" + fundCode);
                        tab3all.data2 = arClone(dt);
                        var sy = dataDeal(dt, _dkey, !0);
                        tab3.data2 = arClone(sy), mychart.series[1].setData(sy)
                    }
                }
            })
        }

        function addShare(a, t, e, s) {
            var n = [];
            $.each(a, function (a, e) {
                var s = {};
                s.x = e[0], s.y = e[1], s.title = t || "Q", s.text = "qqqq", n.push(s)
            }), n && 0 != n.length && mychart.addSeries({
                type: "flags",
                name: e || "每份派现/元",
                data: n,
                color: s || "#f44446",
                fillColor: s || "#f44446",
                style: {
                    color: "white"
                },
                shape: "circlepin",
                width: 12
            })
        }

        function shareSplit() {
            var url = FDURL.sharesplit.replace("{code}", fundCode);
            $.ajax({
                url: url,
                dataType: "script",
                cache: !1,
                success: function (data) {
                    if (data) {
                        var fhdt = eval("fhdata"),
                            sy, cfdt = eval("cfdata"),
                            sy2;
                        fhdt && 0 != fhdt.length && (sy = dataDeal(fhdt.reverse(), _dkey, !0, "fhcf"), addShare(sy), tab3all.data3 = fhdt.slice(0), tab3.data3 = sy.slice(0)), cfdt && 0 != cfdt.length && (sy2 = dataDeal(cfdt, _dkey, !0, "fhcf"), addShare(sy2, "C", "拆分比例", "#5072b8"), tab3all.data4 = cfdt.slice(0), tab3.data4 = sy2.slice(0))
                    }
                }
            })
        }

        function syTrend(callback, key) {
            $.ajax({
                url: url1,
                dataType: "script",
                cache: !0,
                success: function (data) {
                    if (!data) return void(key && "hbx" == key && ($("#ownSelect .o-cartogram").html('<div class="oc-default">暂无数据</div>'), $("#ownSelect .o-title .stab").remove()));
                    var dt = eval("fqjz_" + fundCode);
                    if (!dt) return void(key && "hbx" == key && ($("#ownSelect .o-cartogram").html('<div class="oc-default">暂无数据</div>'), $("#ownSelect .o-title .stab").remove()));
                    tab1all.data1 = arClone(dt), qStart = tab1all.data1[0][0];
                    var sy = dataDeal(dt, _dkey, null, "sy");
                    tab1.data1 = arClone(sy), callback && callback(tab1all.data1, tab1.data1)
                }
            })
        }

        function setTime(a) {
            var t = (new Date).getFullYear() + "/1/1",
                e = a[0][0].substring(0, 4) + "/" + a[0][0].substring(4, 6) + "/" + a[0][0].substring(6, 8),
                s = fundClrq.replace(/\-/g, "/"),
                n = s && "" != s ? s : e;
            $("#zsTime li").eq(5).attr("data-key", t), $("#zsTime li").eq(6).attr("data-key", e);
            var i = (new Date).getMonth(),
                o = i - 3;
            i = (new Date).setMonth(o), $("#zsLine").show(), i < new Date(n).getTime() && (_dkey = n, $("#zsLine").css({
                left: "330px",
                width: "42px"
            }));
            var r = a[a.length - 1][0],
                d = r.substring(0, 4) + "-" + r.substring(4, 6) + "-" + r.substring(6, 8);
            $("#ownSelect .o-title .date").html("数据更新至 " + d), cantSelect()
        }

        function dataDeal(a, t, e, s) {
            var n = arClone(a),
                i = sd.syFiltrate(n, t, s);
            if ("" == i) return [];
            var o = [],
                r = parseFloat(i[0][1]);
            return $.each(i, function (a, t) {
                var s = [],
                    n = Date.UTC(t[0].substring(0, 4), t[0].substring(4, 6) - 1, t[0].substring(6, 8));
                s[0] = n, e ? s[1] = parseFloat(t[1]) : (s[1] = (parseFloat(t[1]) - r) / r * 100, s[1] = parseFloat(s[1].toFixed(2))), o.push(s)
            }), o
        }

        function compareExponent(code, callback) {
            var url = FDURL.compareline.replace("{code}", code);
            $.ajax({
                url: url,
                dataType: "script",
                cache: !0,
                success: function (data) {
                    var dt = eval("js" + code),
                        dtar = [];
                    $.each(dt, function (a, t) {
                        var e = [];
                        e[0] = a.replace(/\-/g, ""), e[1] = parseFloat(t), dtar.push(e)
                    }), tab1all.data3 = arClone(dtar), dtar = dataDeal(dtar, _dkey, null, "hs"), tab1.data3 = dtar, callback && callback(dtar)
                }
            })
        }

        function getAverage(a) {
            $.ajax({
                url: url2,
                type: "GET",
                dataType: "json",
                cache: !0,
                success: function (t) {
                    var e = t,
                        s = [];
                    $.each(e, function (a, t) {
                        var e = [];
                        e[0] = a.replace(/\-/g, ""), e[1] = parseFloat(t), s.push(e)
                    }), s = s.reverse(), tab1all.data2 = arClone(s), s = dataDeal(s, _dkey, null, "tl"), tab1.data2 = s, a && a(s)
                }
            })
        }

        function drawCharts(a, t, e) {
            return {
                title: {
                    text: ""
                },
                credits: {
                    enabled: !1
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderRadius: 9,
                    borderWidth: 0,
                    shadow: !1,
                    shared: !0,
                    crosshairs: !0,
                    split: !0,
                    headerFormat: '<span style="color: #fff;font-size: 14px;">{point.key}</span><br/>',
                    dateTimeLabelFormats: {
                        millisecond: "%Y-%m-%d",
                        second: "%Y-%m-%d",
                        minute: "%Y-%m-%d",
                        hour: "%Y-%m-%d",
                        day: "%Y-%m-%d",
                        week: "%Y-%m-%d",
                        month: "%Y-%m-%d",
                        year: "%Y"
                    },
                    pointFormatter: function () {
                        return "<span style=\"color:#fff;font-family: 'Microsoft YaHei';\">" + this.series.name + '：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;">' + (2 == tab ? parseFloat(this.y).toFixed(4) : parseFloat(this.y).toFixed(2) + "%") + "</span><br />"
                    },
                    pointFormat: ""
                },
                chart: {
                    marginLeft: 70,
                    marginTop: 20,
                    marginBottom: 78,
                    width: 820,
                    style: {
                        fontFamily: "arial"
                    },
                    marginRight: 21,
                    plotBorderColor: "#ddd",
                    plotBorderWidth: 1,
                    animation: {
                        duration: 300
                    },
                    panning: !1
                },
                plotOptions: {
                    line: {
                        lineWidth: 1,
                        marker: {
                            enabled: !1,
                            radius: 2,
                            states: {
                                hover: {}
                            }
                        }
                    }
                },
                navigator: {
                    enabled: !1
                },
                xAxis: {
                    type: "datetime",
                    dateTimeLabelFormats: {
                        millisecond: "%Y-%m-%d",
                        second: "%Y-%m-%d",
                        minute: "%Y-%m-%d",
                        hour: "%Y-%m-%d",
                        day: "%m-%d",
                        week: "%m-%d",
                        month: "%Y-%m",
                        year: "%Y"
                    },
                    lineColor: "#ddd",
                    tickLength: 0,
                    tickAmount: 6,
                    crosshair: {
                        color: "#ffcbcc",
                        width: 1
                    },
                    labels: {
                        style: {
                            color: "#666",
                            fontSize: "12px"
                        }
                    }
                },
                yAxis: {
                    lineColor: "#ddd",
                    lineWidth: 1,
                    gridLineColor: "#f6f6f6",
                    opposite: !1,
                    labels: {
                        formatter: function () {
                            return this.value < 0 ? '<span style="font-size: 12px;color: #57ab76;">' + (2 == tab ? parseFloat(this.value).toFixed(4) : parseFloat(this.value).toFixed(2) + "%") + "</span>" : '<span style="font-size: 12px;color: #f44446;">' + (2 == tab ? parseFloat(this.value).toFixed(4) : parseFloat(this.value).toFixed(2) + "%") + "</span>"
                        }
                    },
                    crosshair: {
                        color: "#ffcbcc"
                    },
                    title: ""
                },
                legend: {
                    enabled: !0,
                    align: "left",
                    squareSymbol: !0,
                    symbolRadius: 6,
                    symbolHeight: 12,
                    symbolWidth: 12,
                    itemMarginTop: 10,
                    itemStyle: {
                        fontWeight: "normal",
                        fontFamily: "Microsoft yahei"
                    }
                },
                series: [{
                    name: t,
                    type: "line",
                    data: a,
                    id: "data1",
                    color: "rgba(68, 137, 202, 1)",
                    pointStart: Date.UTC(2010, 0, 1),
                    pointInterval: 864e5
                }, {
                    name: e,
                    type: "line",
                    data: "",
                    color: "rgba(207, 14, 15, 1)"
                }]
            }
        }

        function managerCanvas() {
            try {
                rqD = [], tlD = [], hsD = [];
                var a = $.trim($("#manTab .on").html());
                rqD.push(parseFloat(managers[a][0])), tlD.push(parseFloat(managers[a][1])), hsD.push(parseFloat(managers[a][2])), mCanvas.series[0].setData(rqD), mCanvas.series[1].setData(tlD), mCanvas.series[2].setData(hsD)
            } catch (a) {
                console.log(a)
            }
        }

        function drawManager() {
            return {
                chart: {
                    type: "column",
                    style: {
                        fontFamily: "arial"
                    },
                    marginRight: 0
                },
                title: {
                    text: ""
                },
                credits: {
                    enabled: !1
                },
                xAxis: {
                    tickLength: 0,
                    labels: {
                        autoRotation: !1,
                        enabled: !1,
                        style: {
                            color: "#666",
                            fontSize: "12px"
                        }
                    }
                },
                plotOptions: {
                    column: {
                        pointWidth: 20
                    }
                },
                legend: {
                    enabled: !0,
                    align: "center",
                    itemMarginLeft: 30,
                    itemMarginTop: 10,
                    itemStyle: {
                        fontWeight: "normal",
                        fontFamily: "Microsoft yahei"
                    },
                    symbolHeight: 10,
                    symbolWidth: 10,
                    symbolRadius: 0
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderRadius: 9,
                    borderWidth: 0,
                    shadow: !1,
                    headerFormat: "",
                    dataTimeLabelFormats: {
                        millisecond: "%A, %b, %e, %H:%M:%S.%L",
                        second: "%A, %b, %e, %H:%M:%S",
                        minute: "%A, %b, %e, %H:%M",
                        hour: "%A, %b, %e, %H:%M",
                        day: "%Y-%m-%d",
                        week: "%Y-%m-%d",
                        month: "%Y-%m",
                        year: "%Y-%m-%d"
                    },
                    xDateFormat: "%Y-%m-%d",
                    pointFormatter: function () {
                        Highcharts.dateFormat("%Y-%m-%d", this.value);
                        return "<span style=\"color:#fff;font-family: 'Microsoft YaHei';\">" + this.series.name + '：</span><span style="color:#fba81a;font-size:14px;font-weight: bold;">' + this.y.toFixed(2) + "%</span><br />"
                    },
                    pointFormat: ""
                },
                yAxis: {
                    labels: {
                        formatter: function () {
                            return '<span style="font-size: 12px;">' + this.value.toFixed(2) + "%</span>"
                        }
                    },
                    lineWidth: 0,
                    title: {
                        enabled: !1
                    }
                },
                series: [{
                    name: "任期收益",
                    data: "",
                    color: "#4e8fcd"
                }, {
                    name: "同类回报",
                    data: "",
                    color: "#e96563"
                }, {
                    name: "沪深300",
                    data: "",
                    color: "#919191"
                }]
            }
        }

        function arClone(a) {
            return a.slice(0)
        }

        function _sendKey(a, t, e, s, n) {
            var i = "fund_mf_" + fundCode + "-" + t + "-r" + e + "c" + s + "-" + a + "-sta-" + n;
            TA.log({
                id: i,
                fid: ""
            })
        }
        var url1 = FDURL.fundzs.replace("{code}", fundCode),
            url2 = FDURL.fundaverage.replace("{code}", fundCode),
            sd = gsdata,
            qStart, aStart, jStart, option = {},
            mychart, tab = $("#ownSelect .stab .on").attr("data-key"),
            _dkey = 3,
            disname = "沪深300",
            discode = "1B0300",
            tab1 = {
                data1: [],
                data2: [],
                data3: [],
                date: "",
                d2show: !0
            },
            tab1all = {
                data1: [],
                data2: [],
                data3: []
            },
            tab2 = {
                data1: [],
                data2: [],
                data3: [],
                date: "",
                d2show: !0
            },
            tab2all = {
                data1: [],
                data2: [],
                data3: []
            },
            tab3 = {
                data1: [],
                data2: [],
                date: "",
                d2show: !1
            },
            tab3all = {
                data1: [],
                data2: []
            },
            oX = [],
            jD = [],
            gD = [];
        $(".compose .module").eq(1).find(".more").click(function () {
            _sendKey("click", "jjdacyr", 1, 1, "more")
        }), $("#ownerCanvas").one("mouseenter", function () {
            _sendKey("hang", "jjdacyr", 2, 1, "cyrjg")
        });
        try {
            ownerChart()
        } catch (a) {}
        var rateurl = FDURL.fundrate.replace("{code}", fundCode),
            fundRate = {
                init: function () {
                    var a = this;
                    this._data = {
                        nowKey: ["week", "month", "tmonth", "hyear", "nowyear", "year", "twoyear", "tyear"],
                        quarterKey: [],
                        yearKey: []
                    }, this.getData(function () {
                        a.stageRate.call(a), a.quarterRate.call(a), a.yearRate.call(a)
                    })
                },
                getData: function (a) {
                    var t = this;
                    $.ajax({
                        url: rateurl,
                        type: "GET",
                        dataType: "json",
                        success: function (e) {
                            t._data.alldata = e, a()
                        }
                    })
                },
                stageRate: function () {
                    var a = this;
                    if ($("#icPart1 .d-percent").each(function () {
                            var t = $(this).attr("data-key");
                            if (t) {
                                var e = $(this).find("li").length,
                                    s = "now" + t;
                                if (!a._data.alldata[s]) return !0;
                                for (var n = 1; n < e; n++) {
                                    var i = a._data.nowKey[n - 1],
                                        o = a._data.alldata[s][i] && "" != a._data.alldata[s][i] ? a._data.alldata[s][i] + "%" : "--",
                                        r = "";
                                    parseFloat(o) < 0 ? r = "down" : parseFloat(o) >= 0 && (r = "up"), $(this).find("li").eq(n).html(o).addClass(r)
                                }
                            }
                        }), a._data.alldata.nowCommonTypeRank) {
                        var t = a._data.alldata.nowCommonTypeRank;
                        a.setRank.call(a, $("#icPart1"), t, "now")
                    }
                },
                quarterRate: function () {
                    var a = this;
                    if ($("#icPart2 .d-percent").each(function () {
                            var t = $(this).attr("data-key");
                            if (t) {
                                var e = $(this).find("li").length,
                                    s = "quarter" + t;
                                if (!a._data.alldata[s]) return !0;
                                for (var n = 1; n < e; n++) {
                                    if ("" == a._data.quarterKey) {
                                        var i = 0;
                                        $.each(a._data.alldata[s], function (t, e) {
                                            a._data.quarterKey.push(t), $("#icPart2 .dialogtitle li").eq(i).html(t.substring(2, 4) + "年" + t.substring(5, 7) / 3 + "季度"), i++
                                        })
                                    }
                                    var o = a._data.quarterKey[n - 1],
                                        r = a._data.alldata[s][o] && "" != a._data.alldata[s][o] ? a._data.alldata[s][o] + "%" : "--",
                                        d = "";
                                    parseFloat(r) < 0 ? d = "down" : parseFloat(r) >= 0 && (d = "up"), $(this).find("li").eq(n).html(r).addClass(d)
                                }
                            }
                        }), a._data.alldata.quarterCommonTypeRankInfo) {
                        var t = a._data.alldata.quarterCommonTypeRankInfo;
                        a.setRank.call(a, $("#icPart2"), t, "quarter")
                    }
                },
                yearRate: function () {
                    var a = this;
                    if ($("#icPart3 .d-percent").each(function () {
                            var t = $(this).attr("data-key");
                            if (t) {
                                var e = $(this).find("li").length,
                                    s = "year" + t;
                                if (!a._data.alldata[s]) return !0;
                                for (var n = 1; n < e; n++) {
                                    if ("" == a._data.yearKey) {
                                        var i = 0;
                                        $.each(a._data.alldata[s], function (t, e) {
                                            a._data.yearKey.push(t), $("#icPart3 .dialogtitle li").eq(i).html(t.substring(0, 4) + "年度"), i++
                                        })
                                    }
                                    var o = a._data.yearKey[n - 1],
                                        r = a._data.alldata[s][o] && "" != a._data.alldata[s][o] ? a._data.alldata[s][o] + "%" : "--",
                                        d = "";
                                    parseFloat(r) < 0 ? d = "down" : parseFloat(r) >= 0 && (d = "up"), $(this).find("li").eq(n).html(r).addClass(d)
                                }
                            }
                        }), a._data.alldata.yearCommonTypeRank) {
                        var t = a._data.alldata.yearCommonTypeRank;
                        a.setRank.call(a, $("#icPart3"), t, "year")
                    }
                },
                setRank: function (a, t, e) {
                    for (var s = this, n = this._data[e + "Key"], i = a.find(".rank li").length, o = 1; o < i; o++)
                        if (t[n[o - 1]]) {
                            var r = parseInt(100 * (t[n[o - 1]][1] - t[n[o - 1]][0]) / t[n[o - 1]][1]),
                                d = s.getStep(r);
                            a.find(".rank li").eq(o).html(t[n[o - 1]][0] + "/" + t[n[o - 1]][1]);
                            for (var l = a.find(".ratio li").eq(o), c = l.find("span").length, u = 1; u < d.step + 1; u++) l.find("span").eq(c - u).addClass("step" + u);
                            a.find(".grade li").eq(o).html(d.grade)
                        }
                },
                getStep: function (a) {
                    return a >= 75 ? {
                        step: 4,
                        grade: "优秀"
                    } : a >= 50 ? {
                        step: 3,
                        grade: "良好"
                    } : a >= 25 ? {
                        step: 2,
                        grade: "一般"
                    } : {
                        step: 1,
                        grade: "不佳"
                    }
                }
            };
        fundRate.init();
        var configcharts, chart = null,
            fcAr = [];
        try {
            $("#configTotal span").html(configTotal), configCharts()
        } catch (a) {}
        $(".compose .module").eq(0).find(".more").click(function () {
            _sendKey("click", "jjdazcpz", 1, 1, "more")
        }), $("#configCanvas").one("mouseenter", function () {
            _sendKey("hang", "jjdazcpz", 2, 1, "zcpz")
        });
        var sykey = 0 == tab ? "jjdazssy" : "jjdazsjz";
        0 == tab && $("#compareList").show(), $("#ownSelect .stab li").click(function () {
            var a = $(this).attr("data-key");
            if (a != tab) {
                tab = a, $("#ownSelect .stab li").removeClass("on"), $(this).addClass("on");
                var t = parseFloat(tab) + 1,
                    e = $(this).attr("data-taid");
                0 == tab && ($("#compareList").show(), showSydata(), sykey = "jjdazssy", $("#rkDefault").hide()), 1 == tab && ($("#compareList").hide(), showRankdata(), sykey = "jjdazstl"), 2 == tab && ($("#compareList").hide(), jzdataShow(), sykey = "jjdazsjz", $("#rkDefault").hide()), _sendKey("click", "jjdazs", 1, t, e)
            }
        });
        var ifrank = !1;
        $("#zsTime li").click(function () {
            var a = $(this).index(),
                t = $(this).attr("data-key"),
                e = $(this).hasClass("off"),
                s = 0;
            if (!e) {
                for (var n = 0; n < a; n++) s += $("#zsTime li").eq(n).width() + 18;
                var i = $(this).width();
                if ($("#zsLine").css({
                        left: s,
                        width: i
                    }), _dkey != t) {
                    _dkey = t, 0 == tab ? showSydata() : 1 == tab ? tabRank() : jzdataShow();
                    var o = a + 1,
                        r = $(this).attr("data-taid");
                    _sendKey("click", sykey, 2, o, r)
                }
            }
        });
        var m3 = !0,
            m6 = !0,
            m12 = !0;
        try {
            "hbx" == _TYPE ? syTrend(function (a, t) {
                setTime(a), option = drawCharts(t, fundName, "同类平均"), $("#compareCanvas").highcharts(option), mychart = $("#compareCanvas").highcharts(), getAverage(function (a) {
                    mychart.series[1].setData(a)
                }), compareExponent(discode, function (a) {
                    mychart.addSeries({
                        name: disname,
                        type: "line",
                        data: a,
                        color: "rgba(121, 121, 121, 1)"
                    })
                })
            }, "hbx") : getJZ(function (a, t) {
                setTime(a), option = drawCharts(t, "单位净值", "累计净值"), $("#compareCanvas").highcharts(option), mychart = $("#compareCanvas").highcharts(), totalValue(), shareSplit(), syTrend(function () {
                    getAverage(), compareExponent(discode)
                })
            })
        } catch (a) {}
        $("#compareCanvas").one("mouseenter", function () {
            var a = "";
            "jjdazssy" == sykey ? a = "sy" : "jjdazstl" == sykey ? a = "tl" : "jjdazsjz" == sykey && (a = "jz"), _sendKey("hang", sykey, 3, 1, a)
        }), $("#compareList .list").click(function () {
            $("#listDown").toggle()
        }), $(document).click(function (a) {
            $("#compareList .list").is(a.target) || 0 != $("#compareList .list").has(a.target).length || $("#listDown").hide()
        }), $("#listDown span").click(function () {
            var a = $(this).attr("data-key"),
                t = $(this).text();
            if ($("#listDown").hide(), $("#compareList .list span").html(t), discode != a) {
                discode = a, disname = t;
                _sendKey("click", "jjdazssy", $(this).index() + 6, 4, $(this).attr("data-taid")), compareExponent(a, function (a) {
                    mychart.series[2].remove(), mychart.addSeries({
                        name: disname,
                        type: "line",
                        data: a,
                        color: "rgba(121, 121, 121, 1)"
                    }), mychart.redraw()
                })
            }
        }), $("#increase .o-title .stab li").click(function () {
            var a = $(this).attr("data-key");
            $(this).parent().find("li").removeClass("on"), $(this).addClass("on"), $("#increase .data").hide(), $("#" + a).show(), _sendKey("click", "jjdazf", 1, $(this).index() + 1, $(this).attr("data-taid"))
        }), $(".question").on({
            mouseenter: function () {
                $(this).next(".quesbox").show()
            },
            mouseleave: function (a) {
                var t = $(this).next(".quesbox");
                t.is(a.target) || t.hide()
            }
        }), $(".quesbox").on({
            mouseenter: function () {
                $(this).show()
            },
            mouseleave: function () {
                $(this).hide()
            }
        }), $("#increase .data .question").one({
            mouseenter: function () {
                _sendKey("hang", "jjdazf", 2, 1, $(this).attr("data-taid"))
            }
        }), $("#manTab li").click(function () {
            var a = $(this).index();
            $("#manTab li").removeClass("on"), $(this).addClass("on"), $("#manager .mi-means").hide().eq(a).show(), managerCanvas()
        }), $("#manager .question").one("mouseenter", function () {
            var a = $(this).attr("data-taid");
            _sendKey("hang", "jjdajl", 2, $(this).parents(".list").index(), a)
        }), $("#managerCanvas").one("mouseenter", function () {
            _sendKey("hang", "jjdajl", 2, 3, "sydb")
        }), $(".fundcompany .more").click(function () {
            _sendKey("hang", "jjdags", 1, 1, "more")
        }), $(".news .module").eq(0).find(".more").click(function () {
            _sendKey("click", "jjdayw", 1, 1, "more")
        }), $(".news .module").eq(0).find(".list a").click(function () {
            var a = $(this).parent(".line").index(),
                t = a + 2,
                e = $(this).attr("data-seq"),
                s = "fund_mf_" + fundCode + "-jjdayw-r" + t + "c1-click-atseq-" + e;
            TA.log({
                id: s,
                fid: ""
            })
        }), $(".news .module").eq(1).find(".more").click(function () {
            _sendKey("click", "jjdagg", 1, 1, "more")
        }), $(".news .module").eq(1).find(".list a").click(function () {
            var a = $(this).parent(".line").index(),
                t = a + 2,
                e = $(this).attr("data-seq"),
                s = "fund_mf_" + fundCode + "-jjdagg-r" + t + "c1-click-atgg-" + e;
            TA.log({
                id: s,
                fid: ""
            })
        });
        var rqD, tlD, hsD, option = drawManager();
        $("#managerCanvas").highcharts(option);
        var mCanvas = $("#managerCanvas").highcharts();
        managerCanvas();
        var ndt = !0;
        $(window).scroll(function () {
            $(document).scrollTop() > 600 && ndt && (ndt = !1, $.getJSON(FDURL.newsdata, function (a) {
                var t = a.slice(0, 8),
                    e = "";
                $.each(t, function (a, t) {
                    var s = "";
                    switch (t.nature) {
                        case "1":
                            s = '<span class="good"></span>';
                            break;
                        case "2":
                            s = '<span class="bad"></span>';
                            break;
                        case "3":
                            s = '<span class="soso"></span>'
                    }
                    e += '<p class="line"><a href="' + t.url + '" target="_blank">' + t.title + s + '</a><span class="date">' + cm.timeFormat(1e3 * t.ctime, "yyyy-MM-dd") + "</span></p>"
                }), $(".news .module").eq(0).find(".list").html(e)
            }))
        }), $(".tab a").click(function () {
            var a = $(this).attr("data-taid");
            _sendKey("click", "jjfile", 0, $(this).index() + 1, a)
        })
    }), define("funddetail", function () {});