var apiHost = "//api.fund.eastmoney.com",
    _loadingHtml = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";

function switchTabEvent(e, a, t, r, n, i) {
    n = "" == n || void 0 === n ? "mouseover" : "click";
    for (var s = $(e).getElementsByTagName(a), l = 0; l < s.length; l++) s[l].className = "", s[l].className = l == t ? r : "";
    if (i) {
        var c = i()._param;
        c.pindex = 1, c.type = t, i()._init(c)
    }
    $aE($(e), n, function (e) {
        for (var a = $E(e), t = 0, n = 0; n < s.length; n++) s[n].className = "", s[n] == a ? (s[n].className = r, t = n) : s[n].className = "";
        if (i) {
            var l = i()._param;
            l.pindex = 1, l.type = t, i()._init(l)
        }
    }, !1)
}

function switchLinkEvent(e, a, t, n, l) {
    for (var r = $(e).getElementsByTagName(a), i = 0; i < r.length; i++) r[i].className = "", r[i].className = i == t ? n : "";
    if (l) {
        var s = l()._param;
        s.pindex = 1, s.type = t, l()._init(s)
    }
}

function focusCalendar(e, a) {
    if ("gg" == a) switch (e) {
        case "s":
            document.getElementById("jjggSDate").focus();
            break;
        case "e":
            document.getElementById("jjggEDate").focus()
    }
    if ("jz" == a) switch (e) {
        case "s":
            document.getElementById("lsjzSDate").focus();
            break;
        case "e":
            document.getElementById("lsjzEDate").focus()
    }
}

function makePageBar(e, a, t) {
    if (0 < e) {
        if (0 < a) {
            var n = "";
            if (n = 1 == t ? '<label class="end" value="1">上一页</label>' : '<label value="' + (parseInt(t) - 1) + '">上一页</label>', 5 < a)
                if (a - t < 5)
                    for (_pi = a - 4; _pi <= a; _pi++) t == _pi ? n += '<label value="' + _pi + '" class="cur">' + _pi + "</label>" : n += '<label value="' + _pi + '">' + _pi + "</label>";
                else {
                    if (2 < t)
                        for (_pi = t - 2; _pi <= parseInt(t) + 2; _pi++) t == _pi ? n += '<label value="' + _pi + '" class="cur">' + _pi + "</label>" : n += '<label value="' + _pi + '">' + _pi + "</label>";
                    else
                        for (_pi = 1; _pi <= 5; _pi++) t == _pi ? n += '<label value="' + _pi + '" class="cur">' + _pi + "</label>" : n += '<label value="' + _pi + '">' + _pi + "</label>";
                    n += "<span>...</span>", n += '<label value="' + a + '">' + a + "</label>"
                }
            else
                for (_pi = 1; _pi <= a; _pi++) t == _pi ? n += '<label value="' + _pi + '" class="cur">' + _pi + "</label>" : n += '<label value="' + _pi + '">' + _pi + "</label>";
            return n += t == a ? '<label value="' + t + '" class="end">下一页</label>' : '<label value="' + (parseInt(t) + 1) + '">下一页</label>', n += "<span>转到</span>", n += '<input type="text" class="pnum" />', n += "<span>页</span>", '<div class="pagebtns">' + (n += '<input type="button" class="pgo" />') + '</div><div class="space0"></div>'
        }
        return '<div class="pagebtns"><span style="color:red;">符合查找条件记录为空!</span></div><div class="space0"></div>'
    }
    return '<div class="pagebtns"></div><div class="space0"></div>'
}

function makePageBarForYear(e, a) {
    if (e.constructor === Array) {
        var t = e.length;
        if (0 < t) {
            for (var n = -1, l = 0; l < t; l++)
                if (e[l] == a) {
                    n = l + 1;
                    break
                } var r = "";
            if (10 < t)
                if (t - n < 9)
                    for (r += '<label value="' + e[0] + '">' + e[0] + "年</label>", r += "<span>...</span>", _pi = t - 8; _pi <= t; _pi++) n == _pi ? r += '<label value="' + e[_pi - 1] + '" class="cur">' + e[_pi - 1] + "年</label>" : r += '<label value="' + e[_pi - 1] + '">' + e[_pi - 1] + "年</label>";
                else {
                    if (6 < n)
                        for (r += '<label value="' + e[0] + '">' + e[0] + "年</label>", r += "<span>...</span>", _pi = n - 3; _pi <= parseInt(n) + 3; _pi++) n == _pi ? r += '<label value="' + e[_pi - 1] + '" class="cur">' + e[_pi - 1] + "年</label>" : r += '<label value="' + e[_pi - 1] + '">' + e[_pi - 1] + "年</label>";
                    else
                        for (_pi = 1; _pi <= 9; _pi++) n == _pi ? r += '<label value="' + e[_pi - 1] + '" class="cur">' + e[_pi - 1] + "年</label>" : r += '<label value="' + e[_pi - 1] + '">' + e[_pi - 1] + "年</label>";
                    r += "<span>...</span>", r += '<label value="' + e[t - 1] + '">' + e[t - 1] + "年</label>"
                }
            else
                for (_pi = 1; _pi <= t; _pi++) n == _pi ? r += '<label value="' + e[_pi - 1] + '" class="cur">' + e[_pi - 1] + "年</label>" : r += '<label value="' + e[_pi - 1] + '">' + e[_pi - 1] + "年</label>";
            return '<div class="pagebtns">' + r + "</div>"
        }
        return ""
    }
    return '<div class="pagebtns">ok</div>'
}

function CalPagePosition(e) {
    if ($(e || "pagebar").firstChild) {
        var a = $(e || "pagebar").firstChild.offsetWidth;
        $(e || "pagebar").firstChild.style.left = (790 - a) / 2 + "px"
    }
}

function CalPagePositionNew(e) {
    var a = document.getElementById(e || "pagebar");
    if (a.firstChild) {
        var t = a.firstChild.offsetWidth;
        a.firstChild.style.left = (790 - t) / 2 + "px"
    }
}

function ChkSelectItem(e, a) {
    for (var t = $(e).getElementsByTagName("option"), n = 0; n < t.length; n++)
        if (t[n].getAttribute("value") == a) try {
            t[n].selected = !0
        } catch (l) {}
}

function ChkSelectLiItem(e) {
    for (var a = $("fundul").getElementsByTagName("li"), t = 0; t < a.length; t++) a[t].getAttribute("fundcode") == e && ($("fcodelb").innerHTML = a[t].innerHTML)
}

function EventForPageBtn(t, n, e) {
    t.code, t.pindex, t.pernum;
    for (var l = t.pages, a = e || "pagebar", r = $(a).getElementsByTagName("label"), i = $(a).getElementsByTagName("input"), s = null, c = 0; c < r.length; c++) r[c].onclick = function () {
        if (-1 < this.className.indexOf("end") || -1 < this.className.indexOf("cur")) return !1;
        var e = this.getAttribute("value");
        t.pindex = e, n(t)
    };
    for (c = 0; c < i.length; c++) "text" == i[c].getAttribute("type") && (s = i[c], i[c].onkeyup = function (e) {
        if (13 == (e = e || window.event).keyCode) {
            var a = s.value;
            if ("" != a) {
                if (isNaN(a)) return alert("请输入整数型页码!"), s.value = "", !1;
                if (parseInt(a) < 1 || parseInt(a) > l) return alert("请输入有效页码!"), s.value = "", !1;
                t.pindex = a, n(t)
            } else alert("请输入页码!")
        }
    }), "button" == i[c].getAttribute("type") && (i[c].onclick = function () {
        if (null == s) return !1;
        if (tonum = s.value, "" != tonum) {
            if (isNaN(tonum)) return s.value = "", !1;
            if (parseInt(tonum) < 1 || parseInt(tonum) > l) return alert("请输入有效页码!"), s.value = "", !1;
            t.pindex = tonum, n(t)
        } else alert("请输入页码!")
    })
}

function EventForYearBtn(a, t) {
    a.code, a.years;
    for (var e = $("pagebar").getElementsByTagName("label"), n = 0; n < e.length; n++) e[n].onclick = function () {
        if (-1 < this.className.indexOf("end") || -1 < this.className.indexOf("cur")) return !1;
        var e = this.getAttribute("value");
        a.year = e, a.month && (a.month = ""), t(a)
    }
}

function LoadLsjz(n) {
    $("jztable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var e = n.code,
        a = n.pindex,
        t = n.pernum,
        l = n.startDate,
        r = n.endDate,
        i = apiHost + "/f10/lsjz?callback=?&fundCode=" + e + "&pageIndex=" + a + "&pageSize=" + t + "&startDate=" + l + "&endDate=" + r;
    jQuery.getJSON(i, function (e) {
        if (e && 0 == e.ErrCode && e.Data && e.Data.LSJZList && 0 < e.Data.LSJZList.length) {
            var a = template("lsjzTable", e);
            if (a) {
                jQuery("#jztable").html(a);
                var t = makePageBar(e.TotalCount, Math.ceil(e.TotalCount / e.PageSize), e.PageIndex);
                jQuery("#pagebar").html(t), CalPagePosition(), n.pages = Math.ceil(e.TotalCount / e.PageSize), e.Data.isNewType && e.PageIndex == n.pages ? jQuery("#historyText").css("display", "block") : jQuery("#historyText").css("display", "none"), EventForPageBtn(n, LoadLsjz), jQuery("#jjjzTip").ttjjTooltip()
            }
        } else jQuery("#jztable").html("<label class='tbnull'>暂无数据!</label>"), jQuery("#pagebar").html("")
    })
}

function LoadLssy(n) {
    $("jztable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var e = n.code,
        a = n.pindex,
        t = n.pernum,
        l = n.startDate,
        r = n.endDate,
        i = apiHost + "/f10/lssy?callback=?&fundCode=" + e + "&pageIndex=" + a + "&pageSize=" + t + "&startDate=" + l + "&endDate=" + r;
    jQuery.getJSON(i, function (e) {
        if (e && 0 == e.ErrCode && e.Data && e.Data.LSJZList && 0 < e.Data.LSJZList.length) {
            var a = template("lsyzTable", e);
            if (a) {
                jQuery("#jztable").html(a);
                var t = makePageBar(e.TotalCount, Math.ceil(e.TotalCount / e.PageSize), e.PageIndex);
                jQuery("#pagebar").html(t), CalPagePosition(), n.pages = Math.ceil(e.TotalCount / e.PageSize), EventForPageBtn(n, LoadLssy), jQuery("#jjjzTip").ttjjTooltip()
            }
        } else jQuery("#jztable").html("<label class='tbnull'>暂无数据!</label>")
    })
}

function SearchField() {
    var e = $("lsjzSDate").value,
        a = $("lsjzEDate").value;
    params.pindex = 1, params.startDate = e, params.endDate = a, LoadLsjz(params)
}

function SearchSYField() {
    var e = $("lsjzSDate").value,
        a = $("lsjzEDate").value;
    params.pindex = 1, params.startDate = e, params.endDate = a, LoadLssy(params)
}

function LoadJJGG(t) {
    jQuery("#ggtable").html("<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>");
    var e = t.code,
        a = t.pindex,
        n = t.pernum,
        l = t.type,
        r = apiHost + "/f10/JJGG?callback=?&fundcode=" + e + "&pageIndex=" + a + "&pageSize=" + n + "&type=" + l;
    jQuery.getJSON(r, function (e) {
        if (e && 0 == e.ErrCode) {
            var a = template("jjggtmp", e);
            jQuery("#ggtable").html(a), jQuery("#pagebar").html(makePageBar(e.TotalCount, Math.ceil(e.TotalCount / e.PageSize), e.PageIndex)), CalPagePosition(), t.pages = Math.ceil(e.TotalCount / e.PageSize), EventForPageBtn(t, LoadJJGG)
        } else jQuery("#ggtable").html("<label class='tbnull'>暂无数据</label>")
    })
}

function LoadFHGG(e) {
    jQuery("#fhggtable").html("<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>");
    var a = e.code,
        t = e.topnum,
        n = apiHost + "/f10/FHGG?callback=?&fundcode=" + a + "&pageSize=" + t + "&pageIndex=1";
    jQuery.getJSON(n, function (e) {
        if (e && 0 == e.ErrCode) {
            var a = template("jjfhgg", e);
            jQuery("#fhggtable").html(a)
        } else jQuery("#fhggtable").html("<label class='tbnull'>暂无基金分红公告!</label>")
    })
}

function LoadMore(e, a, t) {
    params && (params.month ? -1 == params.month.toString().indexOf(a) ? params.month += "," + a : 0 == params.month.toString().indexOf(a) ? (params.month = params.month.toString().replace(a + ",", ""), params.month = params.month.toString().replace(a, "")) : params.month = params.month.toString().replace("," + a, "") : params.month = a, t && t(params))
}

function LoadIndustryConfig(t) {
    var n = t.code,
        l = t.year;
    jQuery("#hypztable").html("<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>");
    var e = apiHost + "/f10/HYPZ/?fundCode=" + n + "&year=" + l + "&callback=?";
    jQuery.getJSON(e, function (e) {
        if (e && 0 == e.ErrCode) {
            var a = template("temphypz", e);
            e.Data && e.Data.QuarterInfos && 0 < e.Data.QuarterInfos.length ? jQuery("#hypng").attr("src", "//j6.dfcfw.com/charts/HypzArchivesNew/" + n + ".png") : jQuery("#hypng").hide(), jQuery("#hypztable").html(a), jQuery("#pagebar").html(makePageBarForYear(e.Data.ListYears, e.Data.Curyear)), CalPagePositionNew(), t.years = e.Data.ListYears
        } else jQuery("#hypng").attr("src", "//j6.dfcfw.com/charts/999999_Archives.png"), jQuery("#hypztable").html(""), jQuery("#pagebar").html("");
        LoadTimeSelect("hypz", t, LoadIndustryConfig), ChkSelectItem("hypz", l), EventForYearBtn(t, LoadIndustryConfig)
    })
}

function LoadFundSelect(e, n, a) {
    var t = $(e);
    if (r && 0 < r.length) {
        var l = $C("option");
        l.value = "000001", l.innerHTML = "选择基金", t.appendChild(l);
        for (var i = 0; i < r.length; i++) {
            l = $C("option");
            var s = r[i].toString().split(",");
            l.value = s[0], l.innerHTML = s[0] + " - " + s[2], a && s[0] == a && (l.selected = !0), t.appendChild(l)
        }
        $aE(t, "change", function (e) {
            var a = $E(e).value,
                t = "";
            switch (n) {
                case "jjpj":
                    t = "jjpj_" + a + ".html";
                    break;
                case "jbgk":
                    t = "jbgk_" + a + ".html";
                    break;
                case "jndzf":
                    t = "jndzf_" + a + ".html";
                    break;
                case "zcpz":
                    t = "zcpz_" + a + ".html";
                    break;
                case "zcfzb":
                    t = "zcfzb_" + a + ".html";
                    break;
                case "jbgk":
                    t = "jbgk_" + a + ".html";
                    break;
                case "ccmx1":
                    t = "ccmx1_" + a + ".html";
                    break;
                case "fyfx":
                    t = "fyfx_" + a + ".html";
                    break;
                case "fhsp":
                    t = "fhsp_" + a + ".html";
                    break;
                case "cwzb":
                    t = "cwzb_" + a + ".html";
                    break;
                case "jjjl":
                    t = "jjjl_" + a + ".html";
                    break;
                case "jjgg":
                    t = "jjgg_" + a + ".html";
                    break;
                case "jjfl":
                    t = "jjfl_" + a + ".html";
                    break;
                case "dxjg":
                    t = "dxjg_" + a + ".html";
                    break;
                case "cyrjg":
                    t = "cyrjg_" + a + ".html";
                    break;
                case "srfx":
                    t = "srfx_" + a + ".html";
                    break;
                case "hytz":
                    t = "hytz_" + a + ".html";
                    break;
                case "hybd":
                    t = "hybd_" + a + ".html";
                    break;
                case "ccbd":
                    t = "ccbd_" + a + ".html";
                    break;
                case "jzbd":
                    t = "jzbd_" + a + ".html";
                    break;
                case "jjjz":
                    t = "jjjz_" + a + ".html";
                    break;
                case "jdzf":
                    t = "jdzf_" + a + ".html";
                    break;
                case "lrfpb":
                    t = "lrfpb_" + a + ".html";
                    break;
                case "gmbd":
                    t = "gmbd_" + a + ".html";
                    break;
                case "ccmx":
                    t = "ccmx_" + a + ".html";
                    break;
                case "ccbdxq":
                    t = "ccbdxq_" + a + ".html";
                    break;
                case "sdcyr":
                    t = "sdcyr_" + a + ".html";
                    break;
                case "jjzh":
                    t = "jjzh_" + a + ".html";
                    break;
                case "hypzsy":
                    t = "hypzsy_" + a + ".html";
                    break;
                case "tssj":
                    t = "tsdata_" + a + ".html";
                    break;
                case "ccbdzs":
                    t = "ccbdzs_" + a + ".html";
                    break;
                default:
                    t = "jbgk_" + a + ".html"
            }
            location.href = t
        }, !0)
    }
}
var fundcodelist = {
    sel: "fcodelb",
    opt: "fundul",
    tagname: "li",
    txtObj: null,
    selObj: null,
    optObj: null,
    opts: null,
    load: function () {
        this.txtObj = $(this.sel), this.selObj = this.txtObj, this.optObj = $(this.opt);
        var a = this;
        if (null == this.opts && r && 0 < r.length)
            for (var e = 0; e < r.length; e++) {
                var t = $C("li"),
                    n = r[e].toString().split(",");
                t.setAttribute("fundcode", n[0]), t.innerHTML = n[0] + " - " + n[2], t.onmouseover = function () {
                    this.className = "over"
                }, t.onmouseout = function () {
                    this.className = ""
                }, t.onclick = function () {
                    a.txtObj.innerHTML = this.innerHTML, a.txtObj.fundcode = this.getAttribute("fundcode");
                    var e = a.txtObj.fundcode;
                    switch (module) {
                        case "jjpj":
                            strUrl = "jjpj_" + e + ".html";
                            break;
                        case "jbgk":
                            strUrl = "jbgk_" + e + ".html";
                            break;
                        case "jndzf":
                            strUrl = "jndzf_" + e + ".html";
                            break;
                        case "zcpz":
                            strUrl = "zcpz_" + e + ".html";
                            break;
                        case "zcfzb":
                            strUrl = "zcfzb_" + e + ".html";
                            break;
                        case "jbgk":
                            strUrl = "jbgk_" + e + ".html";
                            break;
                        case "ccmx1":
                            strUrl = "ccmx1_" + e + ".html";
                            break;
                        case "fyfx":
                            strUrl = "fyfx_" + e + ".html";
                            break;
                        case "fhsp":
                            strUrl = "fhsp_" + e + ".html";
                            break;
                        case "cwzb":
                            strUrl = "cwzb_" + e + ".html";
                            break;
                        case "jjjl":
                            strUrl = "jjjl_" + e + ".html";
                            break;
                        case "jjgg":
                            strUrl = "jjgg_" + e + ".html";
                            break;
                        case "jjfl":
                            strUrl = "jjfl_" + e + ".html";
                            break;
                        case "dxjg":
                            strUrl = "dxjg_" + e + ".html";
                            break;
                        case "cyrjg":
                            strUrl = "cyrjg_" + e + ".html";
                            break;
                        case "srfx":
                            strUrl = "srfx_" + e + ".html";
                            break;
                        case "hytz":
                            strUrl = "hytz_" + e + ".html";
                            break;
                        case "hybd":
                            strUrl = "hybd_" + e + ".html";
                            break;
                        case "ccbd":
                            strUrl = "ccbd_" + e + ".html";
                            break;
                        case "jzbd":
                            strUrl = "jzbd_" + e + ".html";
                            break;
                        case "jjjz":
                            strUrl = "jjjz_" + e + ".html";
                            break;
                        case "jdzf":
                            strUrl = "jdzf_" + e + ".html";
                            break;
                        case "lrfpb":
                            strUrl = "lrfpb_" + e + ".html";
                            break;
                        case "gmbd":
                            strUrl = "gmbd_" + e + ".html";
                            break;
                        case "ccmx":
                            strUrl = "ccmx_" + e + ".html";
                            break;
                        case "ccbdxq":
                            strUrl = "ccbdxq_" + e + ".html";
                            break;
                        case "sdcyr":
                            strUrl = "sdcyr_" + e + ".html";
                            break;
                        case "jjzh":
                            strUrl = "jjzh_" + e + ".html";
                            break;
                        case "hypzsy":
                            strUrl = "hypzsy_" + e + ".html";
                            break;
                        default:
                            strUrl = "jbgk_" + e + ".html"
                    }
                    location.href = strUrl
                }, a.optObj.appendChild(t)
            }
        this.selObj.onclick = function (e) {
            stopBubble(e), "" == a.optObj.style.display ? (a.optObj.style.display = "none", $dE(document, "click", null, !1)) : (a.optObj.style.display = "", $aE(document, "click", function () {
                a.optObj.style.display = "none"
            }, !1))
        }
    }
};

function stopBubble(e) {
    e && e.stopPropagation ? e.stopPropagation() : window.event.cancelBubble = !0
}

function LoadTimeSelect(e, t, n) {
    var a = $(e);
    if (0 != a.childNodes.length) return !1;
    (new Date).getFullYear();
    if (t.years && 0 < t.years.length) {
        for (var l = 0; l < t.years.length; l++) {
            (r = $C("option")).value = t.years[l], r.innerHTML = t.years[l] + "年", a.appendChild(r)
        }
        $aE(a, "change", function (e) {
            var a = $E(e).value;
            t.year = a, n && n(t)
        }, !0)
    } else {
        var r;
        (r = $C("option")).value = "0", r.innerHTML = "请选择年度", a.appendChild(r)
    }
}

function LoadHyinfo(e, a) {
    $("hyxxtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var t = e.code,
        n = e.hydm,
        l = "F10DataApi.aspx?pt=" + a + "&type=hyxq&code=" + t + "&hydm=" + n + "&rt=" + Math.random();
    JsLoader(l, "utf-8", function () {
        apixqdata && ("" != apixqdata.content ? ($("hyxxtable").innerHTML = apixqdata.content, $("jd").innerHTML = apixqdata.quarter, $("hypng").src = "//j6.dfcfw.com/charts/HyChangeArchives" + a + "/" + t + "_" + n + "_" + a + ".png", $("infourl").href = "hybd_" + t + "_" + n + "_" + a + ".html") : ($("hyxxtable").innerHTML = "", $("jd").innerHTML = "", $("hypng").src = "//j6.dfcfw.com/charts/999999_Archives.png"), ChkSelectItem("hy", n))
    })
}

function LoadHySelect(e, t, n, l) {
    var a = "F10DataApi.aspx?pt=" + l + "&type=hylx&code=" + e + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        if (apilxdata && apilxdata.hylx) {
            "" == t.hydm && (t.hydm = apilxdata.hylx[0][0], document.getElementById("hy").src = "//j6.dfcfw.com/charts/HyChangeArchives" + l + "/" + t.code + "_" + t.hydm + "_" + l + ".png");
            for (var e = 0; e < apilxdata.hylx.length; e++) {
                var a = $C("option");
                a.value = apilxdata.hylx[e][0], a.innerHTML = apilxdata.hylx[e][1], $("hy").appendChild(a)
            }
            $aE($("hy"), "change", function (e) {
                var a = $E(e).value;
                t.hydm = a, n && n(t, l)
            }, !0)
        }
    })
}

function LoadStockPos(e) {
    $("cctable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.year,
        n = e.topnum,
        l = e.month,
        r = "FundArchivesDatas.aspx?type=jjcc&code=" + a + "&topline=" + n + "&year=" + t + "&month=" + l + "&rt=" + Math.random();
    JsLoader(r, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("ccpng").src = "//j6.dfcfw.com/charts/StockPos/" + a + ".png?rt=" + Math.round(), $("cctable").innerHTML = apidata.content, $("pagebar").innerHTML = makePageBarForYear(apidata.arryear, apidata.curyear)) : ($("jjcc_tab").style.display = "", $dC($("boxh4"), "nb"), $("ccpng").src = "//j6.dfcfw.com/charts/999999_Archives.png", $("cctable").innerHTML = "", $("pagebar").innerHTML = ""), CalPagePosition(), e.years = apidata.arryear, EventForYearBtn(e, LoadStockPos), LoadTimeSelect("jjcc", e, LoadStockPos), setTimeout(function () {
            ChkSelectItem("jjcc", t)
        }, 200), null != document.getElementById("gpdmList") && LoadGpzd(document.getElementById("gpdmList").innerHTML)
    })
}

function LoadGpzd(e) {
    if ("" != e) {
        for (var a = e.split(","), t = Math.ceil(a.length / 120), n = [], l = 0, r = "", i = 0; i < t; i++) l = 120 * i, endIndex = l + 120, r = a.slice(l, endIndex).join(","), n.push(r);
        0 < n.length && GpzdData(n, 0)
    }
}

function GpzdData(e, a) {
    var t = "https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&invt=2&fields=f2,f3,f12,f14,f9&cb=?&ut=267f9ad526dbe6b0262ab19316f5a25b&secids=" + e[a];
    jQuery.getJSON(t, function (e) {
        var a, t = new Array,
            n = new Array,
            l = new Array,
            r = new Array;
        if (null != e && null != e.data && null != e.data.diff) {
            a = e.data.diff;
            for (var i = 0; i < a.length; i++) {
                if (null != a[i]) {
                    var s = a[i],
                        c = $("dq" + s.f12),
                        d = $("zd" + s.f12);
                    c.innerHTML = "-" == s.f2 ? "-" : s.f2.toFixed(2), d.innerHTML = "-" == s.f3 ? "-" : s.f3.toFixed(2) + "%", n.push(d), l.push(c);
                    var o = d.innerHTML.replace("%", "");
                    if (0 != o.indexOf("-")) try {
                        0 == (o = parseFloat(o)) || 0 == o || isNaN(o) ? (t.push("ping"), c.className = "ping") : (t.push("zhang"), c.className = "zhang")
                    } catch (p) {
                        t.push("ping"), c.className = "zhang"
                    } else t.push("die"), c.className = "die"
                }
                r.push(c.className)
            }
            setFlash2(n, "", t), setFlash2(l, "ping", r)
        }
    }), a++, e.length > a && setTimeout(function () {
        GpzdData(e, a)
    }, 240)
}

function setClass2(e, a) {
    if ("object" == typeof e)
        for (var t = 0; t < e.length; t++) "" != a && 0 < a.length ? e[t].className = "zf " + a[t] : e[t].className = "zf ping"
}

function setFlash2(e, a, t) {
    setTimeout(function () {
        setClass2(e, a)
    }, 600), setTimeout(function () {
        setClass2(e, t)
    }, 900)
}

function LoadStockHis(e) {
    $("cctable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.gpdm;
    "" != t && (document.getElementById("ggpic").src = "//j6.dfcfw.com/charts/StockOneArchives/" + e.code + "_" + e.gpdm + ".png");
    var n = "F10DataApi.aspx?type=ggxq&code=" + a + "&gpdm=" + t + "&rt=" + Math.random();
    JsLoader(n, "utf-8", function () {
        apidata.content && ($("cctable").innerHTML = apidata.content, $("jd").innerHTML = "（" + apidata.quarter + "）")
    })
}

function LoadStockList(e, t, a) {
    var n = "F10DataApi.aspx?type=gglx&code=" + e + "&rt=" + Math.random();
    JsLoader(n, "utf-8", function () {
        if (apidata && apidata.gplx) {
            "" == t.gpdm && (t.gpdm = apidata.gplx[0][0], $("ggpic").src = "//j6.dfcfw.com/charts/StockOneArchives/" + t.code + "_" + t.gpdm + ".png");
            for (var e = 0; e < apidata.gplx.length; e++) {
                (a = $C("option")).value = apidata.gplx[e][0], a.innerHTML = apidata.gplx[e][1], $("gg").appendChild(a)
            }
            $aE($("gg"), "change", function (e) {
                var a = $E(e).value;
                t.gpdm = a, location.href = "ccbdxq_" + t.code + "_" + t.gpdm + ".html"
            }, !0), ChkSelectItem("gg", t.gpdm)
        } else {
            var a;
            (a = $C("option")).value = "0", a.innerHTML = "请选择", $("gg").appendChild(a)
        }
    })
}

function LoadBond(e) {
    $("cctable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.year,
        n = "FundArchivesDatas.aspx?type=zqcc&code=" + a + "&year=" + t + "&rt=" + Math.random();
    JsLoader(n, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("cctable").innerHTML = apidata.content, $("pagebar").innerHTML = makePageBarForYear(apidata.arryear, apidata.curyear)) : ($("zqpng").src = "//j6.dfcfw.com/charts/999999_Archives.png?rt=" + Math.round(), $("cctable").innerHTML = "", $("pagebar").innerHTML = ""), CalPagePosition(), e.years = apidata.arryear, LoadTimeSelect("zqcc", e, LoadBond), ChkSelectItem("zqcc", t), EventForYearBtn(e, LoadBond)
    })
}

function LoadMajor(e) {
    $("bdtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.type,
        n = e.year,
        l = "FundArchivesDatas.aspx?type=zdbd&code=" + a + "&zdbd=" + (parseInt(t) + 1).toString() + "&year=" + n + "&rt=" + Math.random();
    JsLoader(l, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("bdtable").innerHTML = apidata.content, $("pagebar").innerHTML = makePageBarForYear(apidata.arryear, apidata.curyear)) : ($("bdtable").innerHTML = "<label class='tbnull'>暂无数据!</label>", $("pagebar").innerHTML = ""), CalPagePosition(), e.years = apidata.arryear, LoadTimeSelect("zdbdSel", e, LoadMajor), ChkSelectItem("zdbdSel", n), EventForYearBtn(e, LoadMajor)
    })
}

function LoadBalance(e) {
    $("cwtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.type,
        n = e.year,
        l = "FundArchivesDatas.aspx?type=zcfzb&code=" + a + "&showtype=" + (parseInt(t) + 1).toString() + "&year=" + n + "&rt=" + Math.random();
    JsLoader(l, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("cwtable").innerHTML = apidata.content, $("pagebar").innerHTML = makePageBarForYear(apidata.arryear, apidata.curyear)) : ($("cwtable").innerHTML = "<label class='tbnull'>暂无数据!</label>", $("pagebar").innerHTML = ""), CalPagePosition(), e.years = apidata.arryear, EventForYearBtn(e, LoadBalance)
    })
}

function LoadFinancial(t) {
    $("cwtable").innerHTML = _loadingHtml;
    var e = t.code,
        a = t.type,
        n = t.year,
        l = apiHost + "/f10/GetArrayCwzb?fundcode=" + e + "&showtype=" + a + "&year=" + n + "&callback=?";
    jQuery.getJSON(l, function (e) {
        if (0 == e.ErrCode) {
            var a = template("cwtableTmpl", e.Data.data);
            document.getElementById("cwtable").innerHTML = a, $("pagebar").innerHTML = makePageBarForYear(e.Data.years, e.Data.year), CalPagePosition(), t.years = e.Data.years, EventForYearBtn(t, LoadFinancial)
        } else document.getElementById("cwtable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadProfit(e) {
    $("cwtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = e.type,
        n = e.year,
        l = "FundArchivesDatas.aspx?type=lrfpb&code=" + a + "&showtype=" + (parseInt(t) + 1).toString() + "&year=" + n + "&rt=" + Math.random();
    JsLoader(l, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("cwtable").innerHTML = apidata.content, $("pagebar").innerHTML = makePageBarForYear(apidata.arryear, apidata.curyear)) : ($("cwtable").innerHTML = "<label class='tbnull'>暂无数据</label>", $("pagebar").innerHTML = ""), CalPagePosition(), e.years = apidata.arryear, EventForYearBtn(e, LoadProfit)
    })
}

function LoadCyrjg(e) {
    $("cyrjgtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = "FundArchivesDatas.aspx?type=cyrjg&code=" + a + "&rt=" + Math.random();
    JsLoader(t, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("cyrjgpng").src = "//j6.dfcfw.com/charts/Cyrjg/" + a + ".png", $("cyrjgtable").innerHTML = apidata.content, $("summary").innerHTML = apidata.summary) : ($("cyrjgtable").innerHTML = "<label class='tbnull'>暂无数据!</label>", $("cyrjgpng").src = "//j6.dfcfw.com/charts/999999_Archives.png")
    })
}

function loadLSYZSY(e) {
    $("lsyzqsy").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = "FundArchivesDatas.aspx?type=yzlssy&code=" + e + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        yzlssydata.content && "" != yzlssydata.content ? $("lsyzqsy").innerHTML = yzlssydata.content : $("lsyzqsy").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadHypzsy(e) {
    $("hypzsytable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = "FundArchivesDatas.aspx?type=hypzsy&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("hypzsytable").innerHTML = apidata.content, $("summary").innerHTML = apidata.summary) : $("hypzsytable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadJdndzf(e) {
    $("jdndzftable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = "FundArchivesDatas.aspx?type=jdndzf&code=" + a + "&rt=" + Math.random();
    JsLoader(t, "utf-8", function () {
        apidata.content && "" != apidata.content ? ($("jdndzfpng").src = "//j6.dfcfw.com/charts/QuarterGain/" + a + ".png", $("jdndzftable").innerHTML = apidata.content, $("summary").innerHTML = apidata.summary) : ($("jdndzftable").innerHTML = "<label class='tbnull'>暂无数据!</label>", $("jdndzfpng").src = "//j6.dfcfw.com/charts/999999_Archives.png")
    })
}

function LoadYearZF(e) {
    $("yearzftable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = "FundArchivesDatas.aspx?type=yearzf&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        yapidata.content && "" != yapidata.content ? $("yearzftable").innerHTML = yapidata.content : $("yearzftable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadQuarterZF(e) {
    $("quarterzftable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = "FundArchivesDatas.aspx?type=quarterzf&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        qapidata.content && "" != qapidata.content ? $("quarterzftable").innerHTML = qapidata.content : $("quarterzftable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadJdzf(e) {
    $("jdzftable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = "FundArchivesDatas.aspx?type=jdzf&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        apidata.content && "" != apidata.content ? $("jdzftable").innerHTML = apidata.content : $("jdzftable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function LoadGmbd(e) {
    $("gmbdtable").innerHTML = "<div style='text-align:center; font-size:14px;'><img src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' style='margin:50px 10px; vertical-align:middle;' />数据加载中...</div>";
    var a = e.code,
        t = "FundArchivesDatas.aspx?type=gmbd&mode=" + e.type + "&code=" + a + "&rt=" + Math.random();
    JsLoader(t, "utf-8", function () {
        gmbd_apidata.content && "" != gmbd_apidata.content ? ($("summary").innerHTML = gmbd_apidata.summary, $("gmbdtable").innerHTML = gmbd_apidata.content) : $("gmbdtable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function loadJzcgmChart(e) {
    var a = "FundArchivesDatas.aspx?type=jzcgm&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        fejzcChart("#fejzcChart", jzcgm_apidata)
    })
}

function _fejzcValueFormat(e) {
    var a = 0;
    return isNaN(e) || (a = parseFloat(e) / 1e8, a = Math.round(100 * a) / 100), a
}

function GmbdBind(e, a) {
    for (i = 0; i < e.length; i++) $(e[i]).onclick = function () {
        if (this.className.indexOf("at") < 0) {
            var e = this.id.split("_")[1];
            ScaleTypeSelect(a.type = e), LoadGmbd(a)
        }
    }
}

function ScaleTypeSelect(e) {
    "0" == e ? ($aC($("scalepicleft_0"), "at"), $dC($("scalepicright_1"), "at"), $aC($("scaleconleft_0"), "at"), $dC($("scaleconright_1"), "at")) : ($dC($("scalepicleft_0"), "at"), $aC($("scalepicright_1"), "at"), $dC($("scaleconleft_0"), "at"), $aC($("scaleconright_1"), "at"))
}

function CalOffsetHeight(e) {
    var a, t;
    a = t = $(e).getElementsByTagName("dt")[0].offsetHeight - 1;
    for (var n = $(e).getElementsByTagName("dd"), l = 0; l < n.length; l++) - 1 < n[l].className.indexOf("at") ? a += 30 : -1 < n[l].className.indexOf("nb") ? a += 25 : a += 28;
    return {
        min: t,
        max: a + 2
    }
}

function ClickPuckerEvent(e) {
    var a, t = $(e).parentNode,
        n = CalOffsetHeight(t).min,
        l = CalOffsetHeight(t).max,
        r = $(t).offsetHeight,
        i = 0,
        s = function () {
            i += 2, r = $(t).offsetHeight, n < r ? (t.style.height = r - 10 * i < n ? n + "px" : r - 10 * i + "px", null != a && (clearInterval(a), i = 0), a = setInterval(s, 20)) : (clearInterval(a), i = 0)
        },
        c = function () {
            i += 2, (r = $(t).offsetHeight) < l ? (t.style.height = l < r + 10 * i ? l + "px" : r + 10 * i + "px", null != a && (clearInterval(a), i = 0), a = setInterval(c, 20)) : (clearInterval(a), i = 0)
        };
    n < r ? (s(), $(e).getElementsByTagName("b")[0].className = "ico pucker") : (c(), $(e).getElementsByTagName("b")[0].className = "ico pinch")
}

function setClass(e, a) {
    if ("object" == typeof e)
        for (var t = 0; t < e.length; t++) 0 == e[t].className.indexOf("red") && (e[t].className = e[t].className.toString().replace("red", a)), 0 == e[t].className.indexOf("grn") && (e[t].className = e[t].className.toString().replace("grn", a)), 0 == e[t].className.indexOf("bck") && (e[t].className = e[t].className.toString().replace("bck", a))
}

function setFlash(e, a, t) {
    setTimeout(function () {
        setClass(e, a)
    }, 600), setTimeout(function () {
        setClass(e, t)
    }, 900), setTimeout(function () {
        setClass(e, a)
    }, 1200), setTimeout(function () {
        setClass(e, t)
    }, 1500)
}

function reGetGZ(e) {
    try {
        var a = apiHost + "/fund/fundgz?callback=?&fundcode=" + e,
            l = document.getElementById("fund_gsz"),
            r = document.getElementById("fund_gszf"),
            i = document.getElementById("fundgz_icon");
        l && r && i && jQuery.getJSON(a, function (e) {
            try {
                var a = new Array;
                l.innerHTML;
                if (e && e.Data && 0 == e.ErrCode && 0 < e.Data.length && "" != e.Data[0].dwjz) {
                    var t = e.Data[0];
                    l.innerHTML = parseFloat(t.gsz).toFixed(4), r.innerHTML = parseFloat(t.gszzl).toFixed(2) + "%", l.className = 0 < t.gszzl ? "red lar bold guzhi" : t.gszzl < 0 ? "grn lar bold guzhi" : "blk lar bold guzhi", r.className = 0 < t.gszzl ? "red lar bold" : t.gszzl < 0 ? "grn lar bold " : "blk lar bold ", i.className = 0 < t.gszzl ? "icon  icon-up" : t.gszzl < 0 ? "icon  icon-down" : "icon", a.push(l), a.push(r), setFlash(a, "bck", 0 < t.gszzl ? "red" : t.gszzl < 0 ? "grn" : "bck")
                } else l.innerHTML = "---", r.innerHTML = "---", l.className = "", r.className = "", a.push(l), a.push(r), setFlash(a, "bck", "bck")
            } catch (n) {}
        })
    } catch (t) {}
}

function dtClickEvent() {
    for (var e = $("dlcontent").getElementsByTagName("dt"), a = function (e) {
            var a = $E(e);
            if ("DT" != a.tagName && "DT" != a.parentNode.tagName) return !1;
            "DT" != a.tagName && (a = a.parentNode), ClickPuckerEvent(a)
        }, t = 0; t < e.length; t++) $aE(e[t], "click", a, !0)
}

function loadFundGrade(c) {
    var e = apiHost + "/F10/JJPJ/?callback=?&fundcode=" + c.code + "&pageIndex=" + c.pindex + "&pageSize=" + c.pernum;
    try {
        jQuery && jQuery.getJSON(e, function (e) {
            if (e && 0 == e.ErrCode && e.Data && 0 < e.Data.length) {
                for (var a in fundGradeList = new Array, e.Data) {
                    var t = e.Data[a];
                    fundGradeList.push(new Grade(t.RDATE, t.HTPJ, t.ZSPJ, t.SZPJ3, t.ZSPJ5, t.JAPJ))
                }
                showFundGrdeToPage(fundGradeList);
                var n = Math.ceil(e.TotalCount / e.PageSize);
                $("pagebar").innerHTML = makePageBar(e.TotalCount, n, e.PageIndex), c.pages = n, EventForPageBtn(c, loadFundGrade)
            } else {
                var l = $("fundgradetable");
                l.tBodies[0] && l.removeChild(l.tBodies[0]);
                var r = document.createElement("tBody"),
                    i = document.createElement("tr"),
                    s = document.createElement("td");
                s.colSpan = 8, s.innerHTML = "<label class='tbnull'>暂无基金评级</label>", i.appendChild(s), r.appendChild(i), l.appendChild(r)
            }
        })
    } catch (r) {
        var a = $("fundgradetable");
        a.tBodies[0] && a.removeChild(a.tBodies[0]);
        var t = document.createElement("tBody"),
            n = document.createElement("tr"),
            l = document.createElement("td");
        l.colSpan = 8, l.innerHTML = "<label class='tbnull'>暂无基金评级！</label>", n.appendChild(l), t.appendChild(n), a.appendChild(t)
    }
}

function FormatNumberToStar(e) {
    var a = "",
        t = parseInt(e, 10);
    if (isNaN(t)) a = "--";
    else
        for (var n = 0; n < t; n++) a += "★";
    return a
}

function toThousands(e) {
    return e && (e = e.toFixed(2)), (e + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
}

function sortGradeTable() {
    fundGradeList.reverse(), showFundGrdeToPage()
}

function showFundGrdeToPage(e) {
    var a = document.createDocumentFragment();
    for (var t in e) {
        var n = document.createElement("tr"),
            l = document.createElement("td");
        l.innerHTML = e[t].date, n.appendChild(l), (l = document.createElement("td")).innerHTML = FormatNumberToStar(e[t].zs), n.appendChild(l), (l = document.createElement("td")).innerHTML = FormatNumberToStar(e[t].shThree), n.appendChild(l), (l = document.createElement("td")).innerHTML = FormatNumberToStar(e[t].shFive), n.appendChild(l), (l = document.createElement("td")).innerHTML = FormatNumberToStar(e[t].jaj), n.appendChild(l), a.appendChild(n)
    }
    var r = $("fundgradetable");
    r.tBodies[0] && r.removeChild(r.tBodies[0]);
    var i = document.createElement("tBody");
    i.appendChild(a), r.appendChild(i)
}

function Grade(e, a, t, n, l, r) {
    this.date = e, this.ht = a, this.zs = t, this.shThree = n, this.shFive = l, this.jaj = r
}

function loadFundHoldChange(i) {
    var e = apiHost + "/f10/FundGPTop10/?callback=?&fundcode=" + i.code + "&pageindex=" + i.pindex + "&pagesize=" + i.pernum;
    jQuery.getJSON(e, function (e) {
        if (e && 0 == e.ErrCode && e.Data) {
            var a = e.Data,
                t = {
                    x: [],
                    y: []
                };
            if (null != a && 0 < a.length) {
                var n = [];
                n.push('<div class="space8"></div><table class="w782 comm cgbd">'), n.push("<thead><tr><th>报告期</th><th>持仓集中度（占净值比）</th></tr></thead><tbody>");
                for (var l = 0, r = a.length; l < r; l++) l < 5 && (t.x.push(a[l].REPORTDATE), t.y.push(a[l].FSTOCKCENTER)), n.push("<tr><td >", a[l].REPORTDATE, "</td><td class='tor'>", isNaN(a[l].FSTOCKCENTER) ? "--" : a[l].FSTOCKCENTER.toFixed(2) + "%", "</td></tr>");
                n.push("</tbody></table>"), jQuery("#qscctable").html(n.join("")), jQuery("#pagebar").html(makePageBar(e.TotalCount, Math.ceil(e.TotalCount / e.PageSize), e.PageIndex)), CalPagePosition(), i.pages = Math.ceil(e.TotalCount / e.PageSize), EventForPageBtn(i, loadFundHoldChange), holdChangeChart.isRender || (t.x.reverse(), t.y.reverse(), holdChangeChart("#container", t), holdChangeChart.isRender = !0)
            } else jQuery("#qscctable").html("<label class='tbnull'>暂无数据!</label>"), holdChangeChart("#container", t)
        } else jQuery("#qscctable").html("<label class='tbnull'>暂无数据!</label>")
    })
}

function loadFundTurnover(i) {
    var e = apiHost + "/f10/JJHSL/?callback=?&fundcode=" + i.code + "&pageindex=" + i.pindex + "&pagesize=" + i.pernum;
    jQuery.getJSON(e, function (e) {
        if (e && 0 == e.ErrCode && e.Data) {
            var a = e.Data,
                t = {
                    x: [],
                    y: []
                };
            if (null != a && 0 < a.length) {
                var n = [];
                n.push('<div class="space8"></div><table class="w782 comm  cgbd">'), n.push("<thead><tr><th>报告期</th><th>基金换手率</th></tr></thead><tbody>");
                for (var l = 0, r = a.length; l < r; l++) l < 5 && (t.x.push(a[l].REPORTDATE), t.y.push(a[l].STOCKTURNOVER)), n.push("<tr><td>", a[l].REPORTDATE, "</td><td class='tor'>", isNaN(a[l].STOCKTURNOVER) ? "--" : a[l].STOCKTURNOVER.toFixed(2) + "%", "</td></tr>");
                n.push("</tbody></table>"), jQuery("#hsltable").html(n.join("")), jQuery("#hslpager").html(makePageBar(e.TotalCount, Math.ceil(e.TotalCount / e.PageSize), e.PageIndex)), CalPagePosition("hslpager"), i.pages = Math.ceil(e.TotalCount / e.PageSize), EventForPageBtn(i, loadFundTurnover, "hslpager"), turnoverChart.isRender || (t.x.reverse(), t.y.reverse(), turnoverChart("#chartTurnover", t), turnoverChart.isRender = !0)
            } else jQuery("#hsltable").html("<label class='tbnull'>暂无数据!</label>"), turnoverChart("#chartTurnover", t)
        } else jQuery("#hsltable").html("<label class='tbnull'>暂无数据!</label>")
    })
}

function loadHysyl(e) {
    $("sylChart").innerHTML = "<div class='loading' ><img class='img' src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中'  />数据加载中...</div>";
    var a = "F10DataApi.aspx?type=hysyl&indcode=" + e.indcode + "&Y=" + e.Y + "&Q=" + e.Q + "&lastestYear=1&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        apidata.title = e.title, hysylChart("#sylChart", apidata)
    })
}

function LoadFqzj(i) {
    if (null != $("fqzjtable")) {
        i.code;
        var e = "F10DataApi.aspx?type=nbzjcy&date=&code=" + i.code + "&rt=" + Math.random();
        JsLoader(e, "utf-8", function () {
            var e = apidata_fqzj.Data;
            if (0 < e.length) {
                var a = [];
                a.push('<table class="w782 comm cyrjg"><thead><tr><th>时间</th><th>持有份额总数(份)</th><th class="fqzjtr">持有份额占基金总份额比例(%)</th><th>发起份额总数(份)</th><th class="fqzjtr">发起份额占基金总份额比例(%)</th><th>持有份额详情</th></tr></thead><tbody>');
                for (var t = 0, n = e.length; t < n; t++) {
                    a.push("<tr>"), a.push("<td >", e[t].REPORTDATE, t == n - 1 ? "(初始)" : "", "</td>"), a.push('<td  class="tor" >', setEmptyDefault(toThousands(e[t].TOTALHOLD)), '</td><td class="tor">', "--" == setEmptyDefault(e[t].HOLDRATIO) ? "--" : e[t].HOLDRATIO.toFixed(2) + "%", '</td><td class="tor">', setEmptyDefault(toThousands(e[t].TOTALSHARE)), '</td> <td class="tor">', "--" == setEmptyDefault(e[t].SHARERATIO) ? "--" : e[t].SHARERATIO.toFixed(2) + "%", "</td>");
                    var l = NewDate(e[t].REPORTDATE),
                        r = l.getFullYear() + "-" + (l.getMonth() + 1);
                    a.push('<td><a href="nbzjcyxq_', i.code, "_", r, '.html">查看详情</a></td></tr>')
                }
                a.push("</tbody></table>"), $("fqzjtable").innerHTML = a.join("")
            } else $("fqzjtable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
        })
    }
}

function NewDate(e) {
    e = e.split("-");
    var a = new Date;
    return a.setUTCFullYear(e[0], e[1] - 1, e[2]), a.setUTCHours(0, 0, 0, 0), a
}

function LoadNbzjcy(e) {
    $("nbzjtable").innerHTML = "<div class='loading'><img class='img' src='//j5.dfcfw.com/j1/images/loading2.gif' title='数据加载中' />数据加载中...</div>";
    e.code;
    var a = "F10DataApi.aspx?type=nbzjcy&date=" + e.date.replace("年", "-").replace("月", "") + "&code=" + e.code + "&rt=" + Math.random();
    JsLoader(a, "utf-8", function () {
        var e = apidata_fqzj.Data,
            a = apidata_fqzj.MaxDate;
        if ($("limitDate").innerHTML = setEmptyDefault(a), 0 < e.length) {
            var t = [];
            t.push('<table class="w782 comm  cyrjg "><thead><tr><th>项目</th><th >持有份额总数(份)</th><th >持有份额占基金总份额比例(%)</th><th>发起份额总数(份)</th><th >发起份额占基金总份额比例(%)</th><th >发起份额承诺持有期限</th></tr></thead><tbody>');
            for (var n = 0, l = e.length; n < l; n++) t.push("<tr>"), t.push('<td class="tol">', _cyrType(e[n].ITEM), '</td><td class="tor">', setEmptyDefault(toThousands(e[n].TOTALHOLD)), '</td><td class="tor">', "--" == setEmptyDefault(e[n].HOLDRATIO) ? "--" : e[n].HOLDRATIO.toFixed(2) + "%", "</td> "), t.push('<td class="tor">', setEmptyDefault(toThousands(e[n].TOTALSHARE)), '</td> <td class="tor">', "--" == setEmptyDefault(e[n].SHARERATIO) ? "--" : e[n].SHARERATIO.toFixed(2) + "%", "<td>", e[n].PROMISEHOLD, "</td></tr>");
            t.push("</tbody></table>"), $("nbzjtable").innerHTML = t.join("")
        } else $("nbzjtable").innerHTML = "<label class='tbnull'>暂无数据!</label>"
    })
}

function setEmptyDefault(e) {
    return null == e || "" == e ? "--" : e
}

function _getNbzjcyDateColspan(e, a) {
    for (var t = 0, n = 0, l = e.length; n < l; n++)
        if (a == e[n].REPORTDATE) t++;
        else if (0 < t) break;
    return t
}

function _cyrType(e) {
    var a = "";
    switch (e) {
        case "01":
            a = "基金管理公司固有资金";
            break;
        case "02":
            a = "基金管理公司高级管理人员";
            break;
        case "03":
            a = "基金经理等人员";
            break;
        case "04":
            a = "基金管理公司股东";
            break;
        case "05":
            a = "其他";
            break;
        case "06":
            a = "合计"
    }
    return a
}