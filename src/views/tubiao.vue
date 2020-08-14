<template>
  <div>
    <input type="file" id="file" @change="readExcel" />
    <div style="width:100%;overflow:scroll" v-if="toShow">
      <div id="main" :style="{width:`${setWidth}px`,height:`${setHeight}px`}"></div>
    </div>
    <table border="1" collpase v-if="toShow">
      <thead>
        <tr>
          <th colspan="2">没有持仓数据的</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in kong" :key="t.code">
          <td>{{t.code}}</td>
          <td>{{t.name}}</td>
        </tr>
      </tbody>
    </table>

    <table border="1" collpase v-if="toShow">
      <thead>
        <tr>
          <th colspan="4">数据统计</th>
        </tr>
        <tr>
          <th>共{{allDatas.length}}个基金</th>
          <th colspan="3">{{kong.length}}个看不到持仓</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>股票名称</th>
          <th class="sorrs" title="点击排序" @click="toSort(true)">被持仓次数</th>
          <th class="sorrs" title="点击排序" @click="toSort(false)">日涨幅 %</th>
          <th>
            持仓基金&nbsp;
            <input type="text" placeholder="输入股票名称" v-model="jijins" />
            <button @click="search">搜索基金</button>
          </th>
        </tr>

        <tr v-for="(t,ind) in jishu" :key="ind" :ref="t.code">
          <td :class="{'bk':t.num>=shaixuan}">{{t.name}}</td>
          <td>{{t.num}}</td>
          <td>{{t.zhangfu}}</td>
          <td style="font-size:12px;">{{t.jijin.join('，')}}</td>
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
      httpData: [], // 拉取得的服务器数据
      kong: [], // 保存为空的基金
      canSee: [], // 排除服务器数据中为空的基金
      jijinName: [], // 基金名称
      finallData: [],
      jishu: [], // 统计股票被持仓数量
      toShow: false,
      whos: true, // true:泽伟用，false:李朋用
      shaixuan: 5, // 用来筛选被持有量

      setWidth: 0,
      setHeight: 0,
    };
  },
  methods: {
    readExcel(ev) {
      sessionStorage.removeItem("httpData");
      var _this = this,
        files = ev.target.files[0],
        reader = new FileReader();
      reader.readAsArrayBuffer(files);

      reader.onload = function (e) {
        let fff = 1,
          workbook = XLSX.read(e.target.result, {
            type: "buffer",
          }),
          sheetNames = workbook.SheetNames; // 工作表名称集合
        if (sheetNames.length > 1) {
          let ls;
          for (let i = 0; i < sheetNames.length; i++) {
            i > 0
              ? (ls += `${i + 1} : ${sheetNames[i]}`)
              : (ls = `${i + 1} : ${sheetNames[i]}\n`);
          }
          fff = prompt(
            `文件中有${sheetNames.length}个表，请选择查看哪个，请选择编号。\n${ls}`
          );
        }
        let worksheet = workbook.Sheets[sheetNames[fff - 1]], // 这里我们只读取第一张sheet1
          csv = XLSX.utils.sheet_to_json(worksheet, { range: "A1:B200" });

        _this.allDatas = csv.map((t) => ({
          code: "" + t["代码"],
          name: "" + t["名字"],
        }));
        _this.getData();
      };
    },

    makeChart() {
      let forY = this.jishu.map((t) => t.name),
        forX = this.jijinName.map((t) => t.name);

      forX.forEach((t) => {
        if (t.length > this.setHeight) {
          this.setHeight = t.length;
        }
      });
      forY.forEach((t) => {
        if (t.length > this.setWidth) {
          this.setWidth = t.length;
        }
      });

      this.setWidth = this.setWidth + forX.length * 22;
      this.setHeight = this.setHeight + forY.length * 22;

      this.jishu.forEach((t, ind) => {
        t.jijinCode.forEach((d) => {
          let num = this.allDatas.findIndex((k) => k.code == d);
          // 点位数据，以索引标定位置 [x,y,tip]
          this.finallData.push([num, ind, t.zhangfu]);
        });
      });
      let option = {
        title: {
          text: "股票投资公司分部",
        },
        tooltip: {
          position: "top",
          formatter: function (params) {
            return ` 日涨幅 ${params.value[2]}%`;
          },
        },
        grid: {
          left: 2,
          bottom: 5,
          right: 5,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: forX,
          axisLabel: { rotate: 90 },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#d3d0d0",
              type: "dashed",
            },
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          name: "股票",
          type: "category",
          data: forY,
          axisLine: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#d3d0d0",
              type: "dashed",
            },
          },
        },
        series: [
          {
            type: "scatter",
            symbolSize: 10, //图元的大小
            data: this.finallData,
          },
        ],
      };

      this.toShow = true;
      setTimeout(() => {
        var myChart = echarts.init(document.getElementById("main"));
        myChart.setOption(option);
        myChart.on("click", (params) => {
          let ind = params.value[0];
          window.open(`http://fund.10jqka.com.cn/${this.canSee[ind].code}/`);
        });
      }, 100);
    },
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
      let k = sessionStorage.getItem("httpData");
      if (k) {
        this.httpData = JSON.parse(k);
        this.laping(this.httpData);
      } else {
        let proArr = [],
          jijin = this.allDatas.map((t) => t.code); // 提取基金号
        for (let i = 0; i < jijin.length; i++) {
          proArr.push(
            this.$axios({
              method: "get",
              url: jijin[i],
            })
          );
        }
        Promise.all(proArr).then((res) => {
          this.httpData = res;
          sessionStorage.setItem("httpData", JSON.stringify(res));
          this.laping(res);
        });
      }
    },
    // 将多维数组，拉成一维数组，并去除空数组
    laping(data) {
      // 选出空数组
      data.forEach((t, ind) => {
        if (t.length) {
          this.canSee.push(...t);
        } else {
          this.kong.push(this.allDatas[ind]);
        }
      });

      // 选出不为空的基金
      let kongArr = this.kong.map((t) => t.code);
      this.allDatas.forEach((t) => {
        if (!kongArr.includes(t.code)) {
          this.jijinName.push(t);
        }
      });
      // 统计数据
      this.canSee.forEach((t) => {
        let kk = this.jishu.map((u) => u.code);
        if (!kk.includes(t.zcCode)) {
          this.jishu.push({
            zhangfu: t.rate, // 涨幅
            code: t.zcCode, //  股票代码
            name: t.zcName,
            num: 0,
            jijin: [],
            jijinCode: [], // 基金的代码
          });
        }
      });

      this.canSee.forEach((t) => {
        let code = t.zcCode, //  股票代码
          inJishu = this.jishu.filter((h) => h.code == code)[0], // 找出股票的数据
          jijin = this.allDatas.filter((h) => h.code == t.code)[0]; // 找出基金的名字
        inJishu.jijin.push(jijin.name);
        inJishu.jijinCode.push(jijin.code);
        inJishu.num++;
      });
      this.makeChart();
    },
    search() {
      if (this.jijins != "") {
        let code = this.jishu.filter((t) => t.name == this.jijins)[0].code;
        let tar = this.$refs[code][0];
        tar.setAttribute("style", "background:red;");
        setTimeout(() => {
          this.$refs[code][0].removeAttribute("style");
        }, 5000);
      }
    },
  },
};
</script>

<style>
table {
  border: 1px solid red;
  border-collapse: collapse; /*关键代码*/
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
  background: palegoldenrod;
}
</style>