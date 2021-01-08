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
        // 读取excel文件
        if (k[0] === 'wenjian') {
            res.setHeader('Content-Type', 'application/octet-stream') // 二进制流数据（如常见的文件下载）
            getFile();
        }
        // 获取持仓数据
        if (k[0] === 'chicang') {
            url = `http://fund.10jqka.com.cn/web/fund/stockAndBond/${k[1]}`;
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }
        // 获取基金详细数据
        if (k[0] === 'xiangqing') {
            url = `http://fund.10jqka.com.cn/data/client/myfund/${k[1]}`
            res.setHeader('Content-Type', 'text/html;charset=gbk')
            getData();
        }
        // 获取持仓比例数据
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
                (re) => {
                    var datas = '';
                    re.on('data', (data) => {
                        datas += data;
                    });
                    re.on('end', () => {
                        res.end(datas)
                    });
                })
        }
    } else {
        res.end('')
    }

}).listen(6634)