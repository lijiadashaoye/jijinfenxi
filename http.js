var http = require('http'),
    fs = require('fs');
http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Max-Age', '100000');
        res.setHeader('Cache-Control', 'max-age=2000');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.setHeader('Referer-Policy', 'strict-origin-when-cross-origin');

        var k = req.url.slice(1).split('/'),
            url = '';
        // 读取excel文件
        if (k[0] === 'wenjian') {
            res.setHeader('Content-Type', 'application/octet-stream') // 二进制流数据（如常见的文件下载）
            getFile();
        }
        // 获取基金持仓数据
        if (k[0] === 'chicang') {
            url = `http://fund.10jqka.com.cn/web/fund/stockAndBond/${k[1]}`;
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }
        // 获取基金持仓比例
        if (k[0] === 'bili') {
            url = `http://fund.eastmoney.com/pingzhongdata/${k[1]}.js`;
            res.setHeader('Content-Type', 'application/javascript;charset=utf-8')
            getData();
        }
        // // 获取基金收益走势，用天天基金拉数据
        // if (k[0] === 'shouyiqushi') {
        //     url = `http://fund.eastmoney.com/data/FundPicData.aspx?bzdm=${k[1]}&n=0&dt=all&vname=ljsylSVG_PicData&r=0.7943138073284852`
        //     res.setHeader('Content-Type', 'text/html; charset=utf-8')
        //     getData();
        // }

        // 获取基金排名，用同花顺
        if (k[0] === 'shouyiqushi') {
            url = `http://fund.10jqka.com.cn/${k[1]}/json/jsonljjz.json`;
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getData();
        }
        // 获取基金详情
        if (k[0] === 'xiangqing') {
            url = `http://fund.10jqka.com.cn/data/client/myfund/${k[1]}`;
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }
        // 获取基金排名
        if (k[0] === 'paiming') {
            url = `http://fund.10jqka.com.cn/ifindRank/quarter_year_${k[1]}.json`
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getData();
        }
        // 获取同类
        if (k[0] === 'tonglei') {
            url = `http://fund.10jqka.com.cn/ifindRank/commonTypeAvgFqNet/${k[1]}.json`
            res.setHeader('Content-Type', 'application/json')
            getData();
        }
        // 获取沪深300
        if (k[0] === 'hushen') {
            url = `http://fund.10jqka.com.cn/1B0300.js`
            res.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            getData();
        }
        // 获取中证500
        if (k[0] === 'zhongzheng') {
            url = `http://fund.10jqka.com.cn/1B0905.js`
            res.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            getData();
        }
        // 获取上证
        if (k[0] === 'shangzheng') {
            url = `http://fund.10jqka.com.cn/1A0001.js`
            res.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            getData();
        }
        // 获取创业板
        if (k[0] === 'chuangyeban') {
            url = `http://fund.10jqka.com.cn/399006.js`
            res.setHeader('Content-Type', 'text/javascript;charset=utf-8')
            getData();
        }
        // 获取市场文件数据
        if (k[0] === 'shiChang') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getShiChang();
        }
        // 更新市场文件数据
        if (k[0] === 'upShiChang') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            saveShiChang()
        }
        // 删除市场数据文件
        if (k[0] === 'clearShiChang') {
            clearShiChang()
        }

        // 获取页面使用的数据到文件
        if (k[0] === 'getPageData') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            getPageData();
        }
        // 存储页面使用的数据到文件
        if (k[0] === 'savePageData') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            savePageData()
        }
        // 删除基金数据文件
        if (k[0] === 'clearJiJin') {
            clearJiJin()
        }

        let type = 'SH';
        // 获取大陆股票数据
        if (k[0] === 'hangyeDaLu') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getHangYe()
        }
        // 获取香港股票数据
        if (k[0] === 'hangyeHK') {
            res.setHeader('Content-Type', 'application/json')
            getHK()
        }
        
        // 获取股票行业数据
        function getHangYe() {
            let url = `http://f10.eastmoney.com/CompanySurvey/CompanySurveyAjax?code=${type}${k[1]}`;
            http.get(url,
                (req) => {
                    var datas = '';
                    req.on('data', (data) => {
                        datas += data;
                    });
                    req.on('end', () => {
                        let da = JSON.parse(datas);
                        if (da.status == -1) {
                            if (type == 'SH') {
                                type = 'SZ'
                            } else {
                                type = 'SH';
                            }
                            getHangYe();
                        } else {
                            res.end(datas)
                        }
                    });
                })
        }

        function getHK() {
            let url = `http://emweb.securities.eastmoney.com/PC_HKF10/CompanyProfile/PageAjax?code=${k[1]}`;
            http.get(url,
                (req) => {
                    var datas = '';
                    req.on('data', (data) => {
                        datas += data;
                    });
                    req.on('end', () => {
                        res.end(datas)
                    });
                })
        }

        // 读取基金excel文件
        function getFile() {
            fs.readFile('./JiJin.xlsx', (err, data) => {
                var k = err ? 'false' : data;
                res.end(k)
            });
        }
        // 获取数据
        function getData() {
            http.get(url,
                (req) => {
                    var datas = '';
                    req.on('data', (data) => {
                        datas += data;
                    });
                    req.on('end', () => {
                        res.end(datas)
                    });
                })
        }
        // 读取市场文件
        function getShiChang() {
            if (fs.existsSync('./shiChang.json')) {
                fs.readFile('./shiChang.json', (err, data) => {
                    var k = err ? 'false' : data;
                    res.end(k)
                });
            } else {
                res.end('false')
            }
        }
        // 存储市场数据到文件
        function saveShiChang() {
            var data = '';
            req.on('data', function (mock) {
                    data += mock
                })
                .on('end', function () {
                    fs.unlink('./shiChang.json', err => {
                        fs.writeFile('./shiChang.json', data, e => {
                            var k = e ? 'false' : 'true';
                            res.end(k)
                        })
                    });
                })
        }
        // 删除市场数据文件
        function clearShiChang() {
            fs.unlink('./shiChang.json', err => {
                var k = err ? 'false' : 'true';
                res.end(k)
            });
        }
        // 读取页面使用的数据到文件
        function getPageData() {
            if (fs.existsSync('./pageData.json')) {
                fs.readFile('./pageData.json', (err, data) => {
                    var k = err ? 'false' : data;
                    res.end(k)
                });
            } else {
                res.end('false')
            }
        }
        // 存储页面使用的数据到文件
        function savePageData() {
            var data = '';
            req.on('data', function (mock) {
                    data += mock
                })
                .on('end', function () {
                    fs.unlink('./pageData.json', err => {
                        fs.writeFile('./pageData.json', data, e => {
                            var k = e ? 'false' : 'true';
                            res.end(k)
                        })
                    });
                })
        }
        // 删除基金数据文件
        function clearJiJin() {
            fs.unlink('./pageData.json', err => {
                var k = err ? 'false' : 'true';
                res.end(k)
            });
        }
    } else {
        res.end('')
    }

}).listen(6634)