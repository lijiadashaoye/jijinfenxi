let http = require('http'),
    fs = require('fs'),
    qs = require('qs');
http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Max-Age', '100000');
        res.setHeader('Cache-Control', 'max-age=2000');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.setHeader('Referer-Policy', 'strict-origin-when-cross-origin');

        let k = req.url.slice(1).split('/'),
            url = '';


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
            url = `http://fund.eastmoney.com/pingzhongdata/${k[1]}.js?v=2000011113260`
            res.setHeader('Content-Type', 'application/javascript;charset=utf-8')
            getData();
        }
        // 获取基金收益走势
        if (k[0] === 'shouyiqushi') {
            url = `http://fund.eastmoney.com/data/FundPicData.aspx?bzdm=${k[1]}&n=0&dt=all&vname=ljsylSVG_PicData&r=0.0.7943138073284852`
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            getData();
        }
        // 获取基金详情
        if (k[0] === 'xiangqing') {
            url = `http://fund.10jqka.com.cn/data/client/myfund/${k[1]}`
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
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getData();
        }
        // 获取沪深300
        if (k[0] === 'hushen') {
            url = `http://fund.10jqka.com.cn/1B0300.js`
            res.setHeader('Content-Type', 'text/javascript')
            getData();
        }
        // 获取中证500
        if (k[0] === 'zhongzheng') {
            url = `http://fund.10jqka.com.cn/1B0905.js`
            res.setHeader('Content-Type', 'text/javascript')
            getData();
        }
        // 获取上证
        if (k[0] === 'shangzheng') {
            url = `http://fund.10jqka.com.cn/1A0001.js`
            res.setHeader('Content-Type', 'text/javascript')
            getData();
        }
        // 获取创业板
        if (k[0] === 'chuangyeban') {
            url = `http://fund.10jqka.com.cn/399006.js`
            res.setHeader('Content-Type', 'text/javascript')
            getData();
        }
        // 获取市场文件数据
        if (k[0] === 'shichang') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            getJson();
        }
        // 更新市场文件数据
        if (k[0] === 'upShiChang') {
            res.setHeader('Content-Type', 'application/json;charset=utf-8')
            saveJson(req, res)
        }

        // 读取基金excel文件
        function getFile() {
            fs.readFile('./定投.xlsx', (err, data) => {
                if (err) throw err;
                res.end(data)
            });
        }

        // 读取市场文件
        function getJson() {
            fs.readFile('./shichang.json', (err, data) => {
                if (err) throw err;
                res.end(data)
            });
        }
        // 存储市场数据到文件
        function saveJson(req, res) {
            let data = '';
            req.on('data', function (mock) {
                    data += mock
                })
                .on('end', function () {
                    fs.unlink('./shichang.json', err => {
                        fs.writeFile('./shichang.json', data, e => {
                            res.end('true')
                        })
                    });
                })
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
    } else {
        res.end('')
    }

}).listen(6634)