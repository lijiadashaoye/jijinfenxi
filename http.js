let http = require('http');

http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        let url = `http://fund.10jqka.com.cn/web/fund/stockAndBond${req.url}`;
        http.get(url,
            (req, r) => {
                var datas = '';
                req.on('data', function (data) {
                    datas += data;
                });
                req.on('end', function () {
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                    res.setHeader('Access-Control-Allow-Origin', '*')
                    res.end(datas)
                });
            })
    } else {
        res.end('')
    }

}).listen(6654)