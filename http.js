let http = require('http');
http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Max-Age', '100000');
        res.setHeader('Cache-Control', 'max-age=200');
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        res.setHeader('Referer-Policy', 'strict-origin-when-cross-origin');

        let k = req.url.slice(1).split('/'),
            url = '';
        if (k[0] === 'jijin') {
            url = `http://fund.10jqka.com.cn/web/fund/stockAndBond/${k[1]}`;
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }

        if (k[0] === 'xiangqing') {
            url = `http://fund.10jqka.com.cn/data/client/myfund/${k[1]}`
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }

        if (k[0] === 'gongsi') {
            url = `http://liuup.com/apis/fund/findFundInfoById?id=${k[1]}`
            // url = `http://stockpage.10jqka.com.cn/${k[1]}/company.html`;
            res.setHeader('Content-Type', 'text/plain; charset=utf-8')
            getData();
        }

        if (k[0] === 'wenjian') {
            res.setHeader('Content-Type', '*')
            getFile();
        }
        
        if (k[0] === 'bili') {
            url = `http://fund.eastmoney.com/pingzhongdata/${k[1]}.js?v=20160518155842`
            res.setHeader('Content-Type', 'application/javascript;charset=utf-8')
            getData();
        }

        // 读取文件
        function getFile() {
            var fs = require('fs');
            fs.readFile('./定投.xlsx', (err, data) => {
                if (err) throw err;
                res.end(data)
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
                    req.on('error', (e) => {
                        console.log(e)
                    });
                })
        }
    } else {
        res.end('')
    }

}).listen(6634)