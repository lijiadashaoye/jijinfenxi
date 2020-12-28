<template>
  <div>
    <!-- 手动选择文件 -->
    <!-- <input
      type="file"
      style="margin-bottom:10px;"
      @change="readExcel"
    /> -->
    <!-- echarts 显示 -->
    <div
      v-if="chartShow"
      id="main"
      :style="{width:`${setWidth}px`,height:`${setHeight}px`}"
    ></div>

    <div class="kong">
      <!-- 重合分析 -->
      <table
        border="1"
        collpase
        v-if="toShow&&chonghe.length"
      >
        <thead>
          <tr>
            <th colspan="3">重合分析</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(t,ind) in chonghe"
            :key="ind"
          >
            <td style="width:180px">
              <p style="margin:1px;color:rgb(216, 90, 201);">{{t.one.name}}</p>
              <p style="margin:1px;">{{t.two.name}}</p>
            </td>
            <td>{{t.num}}</td>
            <td>{{(t.chong.map(d=>d.zcName)).sort().join('  ')}}</td>
          </tr>
        </tbody>
      </table>

      <div style="width:60%;flex-shrink:0">
        <!-- 基金类型统计 -->
        <table
          style="margin-bottom:10px"
          border="1"
          collpase
          v-if="toShow"
        >
          <thead>
            <tr>
              <th colspan="2">基金类型统计</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in Object.keys(jijinType)"
              :key="t"
            >
              <td style="width:55px;text-align:center;">{{t}}</td>
              <td>{{jijinType[t].join('  ')}}</td>
            </tr>
          </tbody>
        </table>

        <table
          style="margin-bottom:10px"
          border="1"
          collpase
          v-if="httpData.kong.length"
        >
          <thead>
            <tr>
              <th colspan="2">没有持仓数据的，{{`${httpData.kong.length}个`}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in httpData.kong"
              :key="t.code"
            >
              <td>{{t.code}}</td>
              <td>{{t.name}}</td>
            </tr>
          </tbody>
        </table>

        <table
          border="1"
          collpase
          v-if="chongfu.length"
        >
          <thead>
            <tr>
              <th colspan="2">excel 里重复的{{`${chongfu.length}个`}}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in chongfu"
              :key="t.code"
            >
              <td>{{t.code}}</td>
              <td>{{t.name}}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
    <!-- 数据统计 -->
    <table
      class="see"
      border="1"
      collpase
      v-if="toShow"
    >
      <thead>
        <tr>
          <th colspan="4">数据统计</th>
        </tr>
        <tr>
          <th colspan="4">共{{allDatas.length}}个基金，
            {{httpData.kong.length}}个看不到持仓</th>
        </tr>
      </thead>
      <tbody>

        <tr>
          <td
            colspan="4"
            class="sticky"
          >
            <div>
              <div>
                <input
                  style="padding:5px 2px;"
                  type="text"
                  placeholder="输入股票名称"
                  v-model="jijins"
                  @keyup.enter="search"
                />
                <button @click="search">搜索基金</button>
              </div>
            </div>

          </td>

        </tr>

        <tr>
          <th>股票名称</th>
          <th
            class="sorrs"
            title="点击排序"
            @click="toSort(true)"
          >被持仓次数</th>
          <th
            class="sorrs"
            title="点击排序"
            @click="toSort(false)"
          >日涨幅 %</th>
          <th style="font-size:16px;">
            持仓基金&nbsp;&nbsp;
            <span>{{jishu.length}}个股票，{{single}} 个股票被持有一次</span>
          </th>
        </tr>

        <tr
          v-for="(t,ind) in jishu"
          :key="ind"
          :ref="t.code"
        >
          <td
            :id="t.id"
            :class="{'bk':t.num>=shaixuan}"
            style=" min-width: 125px;text-align: center;font-size:14px;"
          >{{t.name}}
            <p style="margin:2px 0; min-width: 125px;text-align: center;">{{t.hangye}}</p>
          </td>
          <td style="text-align: center;font-size:14px;">{{t.num}}</td>
          <td style="text-align: center;font-size:14px;">{{t.zhangfu}}</td>
          <td>{{t.jijin.join(' , ')}}</td>
        </tr>
      </tbody>
    </table>

    <!-- 根据股票被持有次数的多上进行分组 -->
    <table
      style="margin-top:10px;"
      border="1"
      collpase
      v-if="toShowFew"
    >
      <thead>
        <tr>
          <th colspan="2">持有数量较少的</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="t in numQuFen"
          :key="t.name"
          style="margin:2px;"
        >
          <td>{{t.name}}</td>
          <td style="font-size:12px;">
            <ul
              v-for="(d,i) in t.jijin"
              :key="d+i"
            >
              <li>{{d.code}}&nbsp;&nbsp;&nbsp;{{d.name}}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import * as echarts from "echarts";
// https://www.jianshu.com/p/31534691ed53
import XLSX from "xlsx";

export default {
  data() {
    return {
      jijins: "", // 搜索基金用
      // 目前持有的基金
      allDatas: [],
      httpData: {
        kong: [],
        see: [],
      }, // 拉取得的服务器数据
      jijinName: [], // 基金名称
      finallData: [],
      jishu: [], // 统计股票被持仓数量
      toShow: false,
      shaixuan: 5, // 用来筛选被持有量
      chonghe: [], // 用来求重合
      chongheNum: 4, // 用来定义重合数量

      setWidth: 1300,
      setHeight: 800,
      single: 0, // 记录只被持有一次的个数
      range: "",
      jijinType: [],
      chartShow: false,
      toShowFew: false,
      numQuFen: [], // 用来将被持有数量太少的股票的基金进行分组
      chongfu: [],
    };
  },
  created() {
    this.range = "A1:B200";
    // this.range = "C1:D200";
    // this.range = "E1:F200";
    this.autoRead(); // 自动读取本地excel文件
  },
  methods: {
    autoRead() {
      this.$axios({
        method: "get",
        url: `wenjian`,
        responseType: "arraybuffer",
      }).then((res) => {
        let workbook = XLSX.read(res, {
            type: "buffer",
          }),
          sheetNames = workbook.SheetNames; // 工作表名称集合
        let worksheet = workbook.Sheets[sheetNames[0]], // 这里我们只读取第一张sheet1
          csv = XLSX.utils.sheet_to_json(worksheet, { range: this.range });
        this.allDatas = csv.map((t) => ({
          code: "" + t["代码"],
          name: "" + t["名字"],
        }));
        this.getData();
      });
    },
    readExcel(ev) {
      var files = ev.target.files[0],
        reader = new FileReader();

      // 以二进制字符串流的方式读取文件
      // reader.readAsBinaryString(files);

      // 以二进制数组的方式读取文件
      reader.readAsArrayBuffer(files);
      reader.onload = (e) => {
        let workbook = XLSX.read(e.target.result, {
            //  type: "binary",
            type: "buffer",
          }),
          sheetNames = workbook.SheetNames; // 工作表名称集合
        let worksheet = workbook.Sheets[sheetNames[0]], // 这里我们只读取第一张sheet1
          csv = XLSX.utils.sheet_to_json(worksheet, { range: this.range });
        this.allDatas = csv.map((t) => ({
          code: "" + t["代码"],
          name: "" + t["名字"],
        }));
        this.getData();
      };
    },
    // 根据持有量或当日收益排序
    toSort(type) {
      if (type) {
        //  按被持仓次数排序
        this.jishu = this.jishu.sort((a, b) => {
          return b.num - a.num;
        });
      } else {
        //  按被日涨幅排序
        this.jishu = this.jishu.sort((a, b) => {
          // return a.zhangfu > b.zhangfu ? -1 : 1;
          return b.zhangfu - a.zhangfu;
        });
      }
    },
    // 获取所有基金的持股
    getData() {
      let proArr = [],
        excelCode = [];
      for (let i = this.allDatas.length; i--; ) {
        if (!excelCode.includes(this.allDatas[i].code)) {
          excelCode.push(this.allDatas[i].code);
        } else {
          this.chongfu.push(this.allDatas.splice(i, 1)[0]);
        }
      }
      // 获取自己的基金数据
      if (sessionStorage.getItem("httpData")) {
        // 读取缓存的数据
        let kk = JSON.parse(sessionStorage.getItem("httpData")),
          // 存储目前session的基金
          sessionCode = [
            ...Array.from(new Set(kk.see.map((t) => t.code))),
            ...kk.kong.map((t) => t.code),
          ],
          // 选出文件里有但缓存里没有的基金,需要去http获取数据
          needHttp = excelCode.filter((t) => !sessionCode.includes(t));
        this.httpData = {
          kong: kk.kong.filter((t) => excelCode.includes(t.code)),
          see: kk.see.filter((t) => excelCode.includes(t.code)),
        };

        // 获取新增的基金数据
        if (needHttp.length) {
          for (let i = 0; i < needHttp.length; i++) {
            proArr.push(
              this.$axios({
                method: "get",
                url: `jijin/${needHttp[i]}`,
              })
            );
          }
          // 获取多余的基金的数据
          Promise.all(proArr)
            .then((res) => {
              // 需要再次查看http获取的数据中的基金是否为空
              let dd = res.map((t) => t.data.stock);
              for (let i = 0; i < dd.length; i++) {
                if (dd[i].length) {
                  this.httpData.see.push(...dd[i]);
                } else {
                  this.httpData.kong.push({
                    code: needHttp[i],
                    name: this.allDatas.find((t) => t.code == needHttp[i]).name,
                  });
                }
              }
            })
            .then(() => {
              sessionStorage.setItem("httpData", JSON.stringify(this.httpData));
              this.laping();
            });
        } else {
          this.laping();
        }
      } else {
        for (let i = 0; i < excelCode.length; i++) {
          proArr.push(
            this.$axios({
              method: "get",
              url: `jijin/${excelCode[i]}`,
            })
          );
        }
        Promise.all(proArr)
          .then((res) => {
            let zz = res.map((t) => t.data.stock);
            for (let i = 0; i < zz.length; i++) {
              if (zz[i].length) {
                this.httpData.see.push(...zz[i]);
              } else {
                this.httpData.kong.push(
                  this.allDatas.find((k) => k.code == excelCode[i])
                );
              }
            }
            sessionStorage.setItem("httpData", JSON.stringify(this.httpData));
          })
          .then(this.laping);
      }
    },
    // 将多维数组，拉成一维数组，并去除空数组
    laping() {
      // 统计数据
      let id = 0;
      this.httpData.see.forEach((t) => {
        let kk = this.jishu.map((u) => u.code),
          zz = this.jishu.map((u) => u.name);

        if (!kk.includes(t.zcCode)) {
          // 有的股票名字相同，但所在股市不同，需要加以区分
          if (!zz.includes(t.zcName)) {
            this.jishu.push({
              id: ++id,
              zhangfu: t.rate, // 涨幅
              code: t.zcCode, //  股票代码
              name: t.zcName,
              num: 0,
              jijin: [],
              jijinCode: [], // 基金的代码
            });
          } else {
            this.jishu.push({
              id: ++id,
              zhangfu: t.rate, // 涨幅
              code: t.zcCode, //  股票代码
              name: t.zcName + " " + id,
              num: 0,
              jijin: [],
              jijinCode: [], // 基金的代码
            });
          }
        }
      });
      this.httpData.see.forEach((t) => {
        let code = t.zcCode, //  股票代码
          inJishu = this.jishu.filter((h) => h.code == code)[0], // 找出股票的数据
          jijin = this.allDatas.filter((h) => h.code == t.code)[0]; // 找出基金的名字
        inJishu.jijin.push(jijin.name);
        inJishu.jijinCode.push({
          name: jijin.name,
          code: jijin.code,
        });
        inJishu.num++;
      });
      // 全部数据
      this.jishu = this.jishu.sort((a, b) => {
        return b.num - a.num;
      });

      // 统计有几个股票被持有1次
      this.jishu.forEach((t) => {
        if (t.num == 1) {
          this.single += +t.num;
        }
      });
      // 持有量小于一定数目个的数据
      // this.jishu = this.jishu.filter(t=>t.num<3);

      this.chongFeFenXi();
      this.leiXing();
      // this.makeChart();
      // this.getCompany();
      // this.makeNumQuFen();
    },
    leiXing() {
      // 基金类型数据
      let kk = require("./data.json").map((t) => ({
          code: t[0],
          name: t[2],
          type: t[3],
        })),
        zz = Array.from(new Set(this.httpData.see.map((t) => t.code)));

      this.jijinType = kk
        .filter((t) => zz.includes(t.code))
        .reduce((all, now) => {
          if (!all[now["type"]]) {
            all[now["type"]] = [];
          }
          all[now["type"]].push(now.name);
          return all;
        }, {});
    },
    // 重合分析
    chongFeFenXi() {
      for (let i = this.allDatas.length; i--; ) {
        this.allDatas[i]["gupiao"] = this.httpData.see.filter(
          (t) => t.code == this.allDatas[i].code
        );
      }
      let arrs = [];
      this.allDatas.forEach((t) => {
        if (t.gupiao) {
          let gupiao = t.gupiao.map((k) => k.zcCode); // 选出基金所持股票的代码
          for (let i = this.allDatas.length; i--; ) {
            if (this.allDatas[i].code != t.code && this.allDatas[i].gupiao) {
              let d = this.allDatas[i].gupiao.map((k) => k.zcCode),
                num = 0;
              gupiao.forEach((j) => {
                if (d.includes(j)) {
                  num++;
                }
              });
              if (num > this.chongheNum) {
                let a = new Set(t.gupiao.map((d) => d.zcCode)),
                  b = new Set(this.allDatas[i].gupiao.map((d) => d.zcCode)),
                  kk = [...new Set([...a].filter((x) => b.has(x)))],
                  obj = {
                    one: t,
                    two: this.allDatas[i],
                    num: num,
                    chong: t.gupiao.filter((t) => kk.includes(t.zcCode)),
                  };
                arrs.push(obj);
              }
            }
          }
        }
      });
      setTimeout(() => {
        for (let j = arrs.length; j--; ) {
          let one = arrs[j].one.code,
            two = arrs[j].two.code,
            sortArr = [one, two].sort();
          if (!this.chonghe.length) {
            this.chonghe.push(arrs[j]);
          } else {
            let isIn = false;
            for (let i = this.chonghe.length; i--; ) {
              let one = this.chonghe[i].one.code,
                two = this.chonghe[i].two.code,
                sortArr1 = [one, two].sort();
              if (sortArr[0] == sortArr1[0] && sortArr[1] == sortArr1[1]) {
                isIn = true;
              }
            }
            if (!isIn) {
              this.chonghe.push(arrs[j]);
            }
          }
        }
        this.toShow = true;
      });
    },
    // async getCompany() {
    //   for (let i = this.jishu.length; i--; ) {
    //     let reg = /^\d./gi;
    //     if (reg.test(this.jishu[i].code)) {
    //       await this.$axios({
    //         method: "get",
    //         url: `gongsi/${this.jishu[i].code}`,
    //       }).then((res) => {
    //         if (res.resultCode == 0 && Object.keys(res.data).length) {
    //           this.jishu[i].hangye = `(${res.data.businessType.replace(
    //             " — ",
    //             "-"
    //           )})`;
    //         }
    //       });
    //     }
    //   }
    // },
    // getCompany() {
    //   this.jishu.forEach((d) => {
    //     let reg = /^\d./gi;
    //     if (reg.test(d.code)) {
    //       this.$axios({
    //         method: "get",
    //         url: `gongsi/${d.code}`,
    //       }).then((res) => {
    //         if (res.resultCode == 0 && Object.keys(res.data).length) {
    //           d.hangye = `(${res.data["businessType"].replace(" — ", "-")})`;
    //           console.log(d);
    //         }
    //       });
    //     }
    //   });
    // },
    // 绘制echarts
    makeChart() {
      let obj = {};
      Object.keys(this.jijinType).forEach((t) => {
        let arr = [];
        for (let i = 0; i < this.jijinType[t].length; i += 3) {
          arr.push(this.jijinType[t].slice(i, i + 3));
        }
        obj[t] = arr;
      });
      let option = {
        title: {
          text: "基金类型分析",
          left: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: (k) => {
            return `${k.name}，${k.value * 3}个，${k.percent}%`;
          },
        },
        legend: {
          top: 30,
          left: "center",
          data: Object.keys(obj),
        },
        series: [
          {
            labelLine: {
              length: 10,
              length2: 30,
            },
            type: "pie",
            radius: "25%",
            center: ["50%", "80%"],
            data: Object.keys(obj).map((t) => ({
              value: obj[t].length,
              name: t,
              label: {
                formatter: [
                  `{title|{b}，${this.jijinType[t].length}个}{abg|}`,
                  ...obj[t].map((e) => `{weatherHead|${e.join("   ")}}`),
                ].join("\n"),
                // backgroundColor: this.makeColor(),
                backgroundColor: "#eee",
                borderColor: "#777",
                borderWidth: 1,
                borderRadius: 4,
                rich: {
                  title: {
                    fontSize: 16,
                    color: "#eee",
                    align: "center",
                    padding: [0, 10, 0, 10],
                  },
                  abg: {
                    backgroundColor: "#333",
                    width: "100%",
                    align: "right",
                    height: 22,
                    borderRadius: [4, 4, 0, 0],
                  },
                  weatherHead: {
                    color: "black",
                    align: "left",
                    height: 16,
                    padding: [0, 5, 0, 5],
                  },
                  value: {
                    width: 20,
                    padding: [0, 20, 0, 30],
                    align: "left",
                  },
                },
              },
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.chartShow = true;
      setTimeout(() => {
        var myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(option);
      }, 100);
    },
    makeColor() {
      let a = Math.floor(Math.random() * 255),
        b = Math.floor(Math.random() * 255),
        c = Math.floor(Math.random() * 255);
      return `rgba(${a}, ${b},${c})`;
    },
    search() {
      if (this.jijins != "") {
        let code = this.jishu.filter((t) => t.name == this.jijins)[0].code;
        let tar = this.$refs[code][0];
        tar.setAttribute("style", "background:red;");
        tar.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
        setTimeout(() => {
          this.$refs[code][0].removeAttribute("style");
        }, 5000);
      }
    },
    // 整理被持有数量小于3个的股票
    makeNumQuFen() {
      this.jishu.forEach((t) => {
        if (t.num < 3) {
          this.numQuFen.push({
            name: t.name,
            jijin: t.jijinCode,
          });
        }
      });
      this.toShowFew = true;
    },
  },
};
</script>

<style>
ul {
  list-style-type: none;
  padding: 0;
  margin: 2px;
}
table {
  border: 1px solid rgb(228, 178, 195);
  border-collapse: collapse; /*关键代码*/
}
th {
  min-width: 50px;
  text-align: center;
  padding: 0 5px;
}
td {
  padding: 2px 3px;
}
button {
  margin: 5px;
}
.sorrs {
  cursor: pointer;
}
.bk {
  background: rgb(237, 231, 194);
}
.kong {
  font-size: 12px;
  display: flex;
}
.kong thead,
.see thead {
  font-size: 16px;
}
.kong table {
  margin-right: 20px;
}
.see {
  font-size: 12px;
}
.sticky {
  width: 100%;
  position: sticky;
  top: 50px;
  text-align: right;
}
.sticky > div {
  width: 100%;
  text-align: right;
  display: flex;
  justify-content: flex-end;
}
.sticky > div > div {
  width: 250px;
  background: royalblue;
}
</style>