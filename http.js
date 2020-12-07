let http = require('http');

http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        let k = req.url.slice(1).split('/'),
            url = '';
        if (k[0] === 'jijin') {
            url = `http://fund.10jqka.com.cn/web/fund/stockAndBond/${k[1]}`;
        } else {
            url = `http://liuup.com/apis/fund/findFundInfoById?id=${k[1]}`
            // url = `http://stockpage.10jqka.com.cn/${k[1]}/company.html`;
        }

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

}).listen(6634)