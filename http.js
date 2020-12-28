let http = require('http');
http.createServer((req, res) => {
    if (req.url != '/favicon.ico') {
        res.setHeader('Access-Control-Allow-Origin', '*');

        let k = req.url.slice(1).split('/'),
            url = '';
        if (k[0] === 'jijin') {
            url = `http://fund.10jqka.com.cn/web/fund/stockAndBond/${k[1]}`;
            getData();
        }
        if (k[0] === 'gongsi') {
            url = `http://liuup.com/apis/fund/findFundInfoById?id=${k[1]}`
            // url = `http://stockpage.10jqka.com.cn/${k[1]}/company.html`;
            getData();
        }

        if (k[0] === 'wenjian') {
            url = `http://liuup.com/apis/fund/findFundInfoById?id=${k[1]}`
            // url = `http://stockpage.10jqka.com.cn/${k[1]}/company.html`;
            getFile();
        }
        // 读取文件
        function getFile() {
            var fs = require('fs');
            fs.readFile('./定投.xlsx', function (err, data) {
                if (err) throw err;
                res.setHeader('Content-Type', '*')
                res.end(data)
            });
        }
        
        // 获取数据
        function getData() {
            http.get(url,
                (req) => {
                    var datas = '';
                    req.on('data', function (data) {
                        datas += data;
                    });
                    req.on('end', function () {
                        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
                        res.end(datas)
                    });
                })
        }
    } else {
        res.end('')
    }

}).listen(6634)