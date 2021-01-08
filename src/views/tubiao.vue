<template>
  <div>
    <jiazai v-if="!showAll" />
    <button
      class="toChong"
      @click="tochong"
      v-show="showAll"
    >
      <!--js 特殊字符表 http://www.360doc.com/content/19/0316/09/281812_821845466.shtml -->
      &#8607;
    </button>
    <button
      class="clear"
      @click="clearCache"
    >
      清除缓存，重新拉取数据
    </button>
    <div
      class="wap"
      v-show="showAll"
    >
      <div class="gainians">
        <!-- 根据概念区分 -->
        <table
          class="gainian"
          collpase
        >
          <thead>
            <tr>
              <th colspan="2">概念类型统计</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(t,ind) in Object.keys(gaiNian)"
              :key="ind"
            >
              <td>{{t}}</td>
              <td>{{gaiNian[t].join('  ')}}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <!-- 基金类型统计 -->
          <table
            class="typeJiJin"
            collpase
          >
            <thead>
              <tr>
                <th colspan="2">基金类型统计</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(t,ind) in Object.keys(jijinType)"
                :key="ind"
              >
                <td>{{t}}</td>
                <td>{{jijinType[t].join('  ')}}</td>
              </tr>
            </tbody>
          </table>

          <!-- 没有持仓数据的 -->
          <table
            class="noChiCang"
            collpase
          >
            <thead>
              <tr>
                <th colspan="4">没有持仓数据的，{{`${zhengli.kong.length}个`}}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(t,ind) in zhengli.kong"
                :key="ind"
              >
                <td>{{t.code}}</td>
                <td>{{t.name}}</td>
              </tr>
            </tbody>
          </table>
          <!-- excel 里重复的 -->
          <table
            class="excelChongFu"
            collpase
          >
            <thead>
              <tr>
                <th colspan="4">excel 里重复的{{`${zhengli.chongfu.length}个`}}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(t,ind) in zhengli.chongfu"
                :key="ind"
              >
                <td>{{t.code}}</td>
                <td>{{t.name}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 基金经理汇总 -->
      <table
        class="typeTongJi"
        collpase
      >
        <thead>
          <tr>
            <th colspan="6">基金经理汇总</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(t,ind) in Object.keys(jingliList)"
            :key="ind"
          >
            <td
              title="点击查看基金"
              class="showManager"
              @click="showJiJin2(t)"
            >{{t}}</td>
            <td>{{jingliList[t].join('  ')}}</td>
          </tr>
        </tbody>
      </table>

      <!-- 重合分析 -->
      <table
        ref="chong"
        class="chonghe"
        collpase
      >
        <thead>
          <tr>
            <th colspan="4">重合分析</th>
          </tr>
        </thead>
        <tbody>
          <tr class="chongheTitle">
            <td>基金</td>
            <td>重合数量</td>
            <td>重合的股票</td>
            <td>不重合的股票</td>
          </tr>
          <tr
            v-for="(t,ind) in chonghe"
            :key="ind"
          >
            <td>
              <p>{{t.one.name}}</p>
              <p>{{t.two.name}}</p>
            </td>
            <td style="font-size:14px;">{{t.num}}</td>
            <td>{{t.chong.join(' ')}}</td>

            <td>
              <p>{{t.oneOther.join(' ')}}</p>
              <p>{{t.twoOther.join(' ')}}</p>
            </td>

          </tr>
        </tbody>
      </table>

      <!-- 数据统计 -->
      <table
        class="shuju"
        collpase
      >
        <thead>
          <tr>
            <th colspan="4">数据统计</th>
          </tr>
          <tr>
            <th colspan="4">共{{zhengli.canUse.length}}个基金，
              {{zhengli.kong.length}}个看不到持仓</th>
          </tr>
          <div class="stickyd">
            <input
              type="text"
              placeholder="输入股票名称"
              v-model="jijins"
              @keyup.enter="search"
            />
            <button @click="search">搜索股票</button>
          </div>
        </thead>
        <tbody>
          <tr>
            <th>股票名称</th>
            <th
              title="点击排序"
              @click="toSort(true)"
            >被持仓次数</th>
            <th
              title="点击排序"
              @click="toSort(false)"
            >日涨幅 %</th>
            <th>
              持仓该股票的基金，&nbsp;&nbsp;
              <span>{{single}} 个股票被持有一次</span>
            </th>
          </tr>

          <tr
            v-for="(t,ind) in gupiao"
            :key="ind"
            :ref="t.code"
          >
            <td
              :id="t.id"
              :class="{'bg':t.jijin.length>=shaixuan,seegupiao:true}"
              @click="seeGuPiao(t.code)"
            >
              <span title="点击查看股票">{{t.name}}</span>
            </td>
            <td>{{t.jijin.length}}</td>
            <td>{{t.zhangfu}}</td>
            <td>{{t.jijin.join(' , ')}}</td>
          </tr>
        </tbody>
      </table>
      <!-- 每个基金的分析 -->
      <table
        class="fenxi"
        collpase
      >
        <thead>
          <tr>
            <th colspan="3">
              基金详情，{{`共 ${zhengli.fenxi.length} 个`}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(d,ind) in chartList "
            :key="ind"
          >
            <td
              v-for="(t,ind) in d "
              :key="ind"
            >
              <div class="bili">
                <div :id="t.code"></div>
                <ul>
                  <li>
                    <span class="leixingName">
                      {{`${t.leixing}：`}}</span>
                    <span>{{t.fengxian}}</span>
                  </li>
                  <li
                    v-for="(d,ind) of t.peizhi"
                    :key="ind"
                  >
                    <span class="leixingName">{{`${d.name}：`}}</span>
                    <span v-if="d.name!='规模'">{{d.num?d.num+' %':'--'}}</span>
                    <span v-else>{{d.num?d.num+' 亿':'--'}}</span>
                    <span v-if="d.name=='规模'&&t.chengli">{{' ('+t.chengli.slice(5)+')'}} </span>
                  </li>
                </ul>
              </div>
              <div class="xiangqing">
                <div class="names">
                  <p
                    title="点击查看基金"
                    class="showManager"
                    @click="showJiJin(t.code)"
                  >
                    <span>基金号：</span>
                    <span>{{t.code}}</span>
                  </p>
                  <p>{{t.name}}</p>
                </div>

                <div>
                  <p
                    title="点击查看基金经理管理的基金"
                    class="showManager"
                    @click="showManager(t.code)"
                  >
                    <span>基金经理：</span>
                    <span>{{t.jingli}}</span>
                  <p>{{t.chengli+' 成立'}}</p>
                </div>

                <div class="gai">
                  <span>概念：</span>
                  <span
                    v-for="(d,ind) of t.theme"
                    :key="ind"
                    :style="{color:colorObj[d],fontWeight:'bold'}"
                  >
                    {{d}}
                  </span>
                </div>

                <div class="zhang">
                  <p>
                    <span>净值：</span>
                    <span>{{t.jingzhi}}</span>
                  </p>
                  <p>
                    <span>统计日期：</span>
                    <span>{{`${t.jingTime}`}}</span>
                  </p>
                </div>

                <div class="zhang">
                  <p>
                    <span>日涨幅：</span>&nbsp;
                    <span>{{`${t.zhangfu}%`}}</span>
                  </p>
                  <p>
                    <span>购买费率：</span>&nbsp;
                    <span>{{t.feilv?t.feilv+'%':''}}</span>
                  </p>
                </div>

                <div class="zhang">
                  <p> <span>近1月：</span>&nbsp;
                    <span>{{t.yue_1+' %'}}</span>
                  </p>
                  <p> <span>近3月：</span>&nbsp;
                    <span>{{t.yue_3+' %'}}</span>
                  </p>
                </div>

                <div class="zhang">
                  <p>
                    <span>近6月：</span>&nbsp;
                    <span>{{t.yue_6+' %'}}</span>
                  </p>
                  <p>
                    <span>近1年：</span>&nbsp;
                    <span>{{t.nian+' %'}}</span>
                  </p>
                </div>
                <div class="zhang">
                  <p>
                    <span>今年：</span>&nbsp;
                    <span>{{t.nowyear+' %'}}</span>
                  </p>
                  <p style="color:red;">
                    <span>成立以来：</span>&nbsp;
                    <span>{{t.tyear+' %'}}</span>
                  </p>
                </div>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import jiazai from "./jiazai";
// https://www.jianshu.com/p/31534691ed53
import XLSX from "xlsx";
export default {
  data() {
    return {
      jijins: "", // 搜索基金用
      shaixuan: 5, // 用来筛选被持有量
      chongheNum: 4, // 用来定义重合数量
      setWidth: 1300,
      setHeight: 800,
      // 将读取的excel文件进行数据整理
      zhengli: {
        chongfu: [], // excel里重复添加的基金
        canUse: [], // 用来操作的读取excel后的原始数据
        see: [], // 可以看到持仓的基金
        kong: [], // 看不到持仓数据的基金
        fenxi: [],
        time: "",
      },
      single: 0, // 记录只被持有一次的个数
      range: "",
      gupiao: [], // 记录根据股票进行分析的基金

      jingliList: {}, // 根据基金经理区分基金
      gaiNian: {}, // 存储根据概念区分基金
      chonghe: [], // 用来存储有重合的基金
      jijinType: {}, // 基金类型统计
      chartList: [], //用来显示echarts分析
      colorObj: {}, // 存储不同概念的颜色
      caches: null, // 判断是否有缓存
      showAll: false,
    };
  },
  components: { jiazai },
  created() {
    this.range = "A1:B300";
    // this.range = "C1:D300";
    // this.range = "E1:F300";
    this.caches = localStorage.getItem("zhengli");

    if (this.caches) {
      let time = JSON.parse(this.caches).time,
        now = new Date().getTime();
      // 超过三天未操作，就重新拉取数据
      if (now - time > 1000 * 60 * 60 * 24 * 3) {
        localStorage.removeItem("zhengli");
      }
    }
    this.autoRead();
  },
  methods: {
    // 自动读取本地excel文件
    async autoRead() {
      this.showAll = false;
      await this.$axios({
        method: "get",
        url: `wenjian`,
        responseType: "arraybuffer",
      }).then((res) => {
        let workbook = XLSX.read(res, {
            type: "buffer",
          }),
          sheetNames = workbook.SheetNames; // 工作表名称集合
        let worksheet = workbook.Sheets[sheetNames[0]], // 这里我们只读取第一张sheet1
          csv = XLSX.utils.sheet_to_json(worksheet, { range: this.range }),
          excelCode = [];

        csv.forEach((t) => {
          // 选出excel里的基金
          if (!excelCode.includes(t["代码"])) {
            this.zhengli.canUse.push({
              code: "" + t["代码"],
              name: t["名字"],
            });
            excelCode.push("" + t["代码"]);
          } else {
            // 选出excel里重复的
            this.zhengli.chongfu.push({
              code: "" + t["代码"],
              name: t["名字"],
            });
          }
        });
        this.getData();
      });
    },
    // 获取所有基金的持股
    getData() {
      // 获取所有基金的code
      let codes = this.zhengli.canUse.map((t) => t.code),
        httptype = false;
      // 获取缓存的基金数据
      if (this.caches) {
        // // 读取缓存的数据
        let kk = JSON.parse(this.caches),
          // 读取之前缓存的基金号
          sessionCode = kk.canUse.map((t) => t.code),
          // 选出文件里有但缓存里没有的基金,需要去http获取数据
          needHttp = codes.filter((t) => !sessionCode.includes(t));

        this.zhengli.see = kk.see.filter((t) => codes.includes(t.code)); // 可以看到持仓的基金
        this.zhengli.kong = kk.kong.filter((t) => codes.includes(t.code)); // 看不到持仓数据的基金
        this.zhengli.fenxi = kk.fenxi.filter((t) => codes.includes(t.code)); // 用到echart分析列表

        this.httpType(httptype, needHttp);
      } else {
        this.httpType(httptype, codes);
      }
    },
    // 切换发送获取数据的方式
    httpType(type, arrs) {
      if (type) {
        let inter = null,
          time = 100,
          num = 0;
        inter = setInterval(() => {
          if (num == arrs.length) {
            clearInterval(inter);
            inter = null;
          }
          // 获取新增的基金数据
          this.useHttp(arrs.length ? [arrs[num]] : []);
          num++;
        }, time);
      } else {
        this.useHttp(arrs);
      }
    },
    // 需要发送http获取数据
    async useHttp(codes) {
      if (codes.length) {
        for (let i = codes.length; i--; ) {
          if (codes[i]) {
            let all = [];
            all.push(
              this.$axios({
                method: "get",
                url: `chicang/${codes[i]}`,
              }),
              this.$axios({
                method: "get",
                url: `bili/${codes[i]}`,
              }),
              this.$axios({
                method: "get",
                url: `xiangqing/${codes[i]}`,
              })
            );
            await Promise.all(all).then((res) => {
              // 基金持仓
              let chicang = res[0].data.stock,
                reg = /\/\*.+?\*\//gi,
                xiangxi = res[2].data[0],
                bili = [],
                obj = {};

              if (chicang.length) {
                this.zhengli.see.push(...chicang);
              } else {
                this.zhengli.kong.push(
                  this.zhengli.canUse.find((k) => k.code == codes[i])
                );
              }

              // 基金持仓比例整理
              res[1]
                .replace(reg, "")
                .split("var")
                .filter((t) => {
                  if (t.length) {
                    bili.push(t.trim().slice(0, -1));
                  }
                });
              bili.forEach((t) => {
                let arr = t.split("=").map((t) => t.trim());
                if (arr[0] == "Data_assetAllocation") {
                  let k = eval("(" + arr[1] + ")");
                  obj["peizhi"] = k.series.map((t) => {
                    // 转译特殊字符
                    if (t.name.indexOf("�") > -1) {
                      t.name = "股票";
                    }
                    return {
                      name:
                        t.name != "净资产" ? t.name.slice(0, 2) + "" : "规模",
                      num:
                        t.name == "净资产"
                          ? t.data[0]
                            ? t.data[0].toFixed(2)
                            : ""
                          : t.data[0]
                          ? t.data[0].toFixed(2)
                          : "",
                    };
                  });
                }
              });
              // 基金详细数据
              obj.code = xiangxi.code; // 基金号
              obj.name = xiangxi.name; // 基金名称
              obj.theme =
                xiangxi.themeList && xiangxi.themeList.length
                  ? xiangxi.themeList.map((t) => t.field_name)
                  : []; // 概念
              obj.yue_1 = xiangxi.month; // 近1月
              obj.yue_3 = xiangxi.tmonth; // 近3月
              obj.yue_6 = xiangxi.hyear; // 近6月
              obj.nian = xiangxi.year; // 近1年
              obj.nowyear = xiangxi.nowyear; // 今年
              obj.tyear = xiangxi.tyear; // 成立以来
              obj.jingzhi = xiangxi.net; // 单位净值
              obj.jingTime = xiangxi.enddate; // 净值计算时间
              obj.zhangfu = xiangxi.rate; // 昨日涨幅
              obj.chengli = xiangxi.clrq; // 成立时间
              obj.feilv = xiangxi.sgfl; // 购买费率
              obj.fengxian = xiangxi.levelOfRisk; // 风险等级
              obj.leixing = xiangxi.fundtype; // 基金类型
              obj.jingli = xiangxi.manager; // 基金经理
              this.zhengli.fenxi.push(obj);
            });
          }
        }
        setTimeout(this.makeTongJi);
      } else {
        this.makeTongJi();
      }
    },
    // 将多维数组，拉成一维数组，并去除空数组
    makeTongJi() {
      // 统计数据
      for (let i = this.zhengli.see.length; i--; ) {
        let codes = this.gupiao.map((t) => t.code), // 股票代码数组
          see = this.zhengli.see[i],
          jijin = this.zhengli.canUse.find((t) => t.code == see.code);
        if (!codes.includes(see.zcCode)) {
          this.gupiao.push({
            id: i,
            zhangfu: see.rate, // 涨幅
            code: see.zcCode, //  股票代码
            name: see.zcName, // 股票名称
            jijin: [jijin.name], // 持有该股票的基金名称
          });
        } else {
          let gupiao = this.gupiao.find((t) => t.code == see.zcCode); // 找到股票数据
          if (!gupiao.jijin.includes(jijin.name)) {
            gupiao.jijin.push(jijin.name);
          }
        }
      }
      this.gupiao = this.gupiao.sort((a, b) => {
        return b.jijin.length - a.jijin.length;
      });
      // 统计有几个股票被持有1次
      this.gupiao.forEach((t) => {
        if (t.jijin.length == 1) {
          this.single++;
        }
      });
      // 将分析数据分组显示
      this.chartList = [];
      for (let i = 0; i < this.zhengli.fenxi.length; i += 3) {
        this.chartList.push(this.zhengli.fenxi.slice(i, i + 3));
      }
      this.makeColor();
      this.leiXingTongJi();
      this.chongHeFenXi();
      this.zhengli["time"] = new Date().getTime();
      localStorage.setItem("zhengli", JSON.stringify(this.zhengli));
      this.makeXiangQingChart();
    },
    // 基金类型统计
    leiXingTongJi() {
      let j = require("./data.json"),
        k = this.zhengli.fenxi;
      j.forEach((t) => {
        let leixing = Object.keys(this.jijinType);
        if (!leixing.includes(t[3])) {
          this.jijinType[t[3]] = [];
        }
        let z = k.find((d) => d.code == t[0]);
        if (z && !this.jijinType[t[3]].includes(z.name)) {
          this.jijinType[t[3]].push(z.name);
        }
      });
      Object.keys(this.jijinType).forEach((t) => {
        if (!this.jijinType[t].length) {
          delete this.jijinType[t];
        }
      });
    },
    // 重合分析
    chongHeFenXi() {
      for (let i = this.zhengli.canUse.length; i--; ) {
        this.zhengli.canUse[i]["gupiao"] = this.zhengli.see.filter(
          (t) => t.code == this.zhengli.canUse[i].code
        );
      }
      let arrs = [];
      this.zhengli.canUse.forEach((t) => {
        if (t.gupiao.length) {
          let gupiao = t.gupiao.map((k) => k.zcCode); // 选出当前基金所持股票的代码
          for (let i = this.zhengli.canUse.length; i--; ) {
            let jj = this.zhengli.canUse[i];
            if (
              // 排除自己且其他基金有股票数据
              jj.code != t.code &&
              jj.gupiao.length
            ) {
              let d = jj.gupiao.map((k) => k.zcCode),
                num = 0;
              gupiao.forEach((j) => {
                if (d.includes(j)) {
                  num++;
                }
              });
              if (num > this.chongheNum) {
                let a = new Set(t.gupiao.map((d) => d.zcCode)),
                  b = new Set(jj.gupiao.map((d) => d.zcCode)),
                  kk = [...new Set([...a].filter((x) => b.has(x)))],
                  linshi = t.gupiao
                    .filter((t) => kk.includes(t.zcCode))
                    .map((t) => t.zcName),
                  obj = {
                    one: t,
                    oneOther: t.gupiao
                      .map((d) => d.zcName)
                      .filter((f) => !linshi.includes(f)),
                    two: jj,
                    twoOther: jj.gupiao
                      .map((d) => d.zcName)
                      .filter((f) => !linshi.includes(f)),
                    num: num,
                    chong: linshi,
                  };
                arrs.push(obj);
              }
            }
          }
        }
      });
      for (let j = arrs.length; j--; ) {
        let one = arrs[j].one.code,
          two = arrs[j].two.code,
          sortArr = [one, two].sort();
        if (!this.chonghe.length) {
          this.chonghe.push(arrs[j]);
        } else {
          // 基金位置排序后如果相同，则视为同一组重合对比
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
    },
    // 点击基金经理名字
    showManager(c) {
      window.open(`http://fund.10jqka.com.cn//${c}/interduce.html#manager`);
    },
    // 点击基金号
    showJiJin(c) {
      window.open(`http://fund.10jqka.com.cn/${c}`);
    },
    // 点击基金号
    showJiJin2(c) {
      let kk = this.zhengli.fenxi.find((t) => t.jingli == c).code;
      window.open(`http://fund.10jqka.com.cn//${kk}/interduce.html#manager`);
    },
    // 点击股票名称
    seeGuPiao(c) {
      window.open(`http://stockpage.10jqka.com.cn/${c}`);
    },
    // 绘制每个基金的echrts
    makeXiangQingChart() {
      this.zhengli.fenxi.forEach(async (t, ind) => {
        new Promise((res) => {
          let kk = setInterval(() => {
            let tar = document.getElementById(`${t.code}`);
            if (tar) {
              clearInterval(kk);
              if (ind == this.zhengli.fenxi.length - 1) {
                this.showAll = true;
              }
              hua(tar, t, res);
            }
          }, 50);
        });
      });
      function hua(tar, data, res) {
        let option = {
          title: {
            text: "持仓比例",
            top: 8,
            right: 6,
            padding: 0,
            textStyle: {
              fontSize: 12,
            },
          },
          legend: {
            top: 26,
            right: 6,
            padding: 0,
            itemWidth: 18,
            itemHeight: 14,
            orient: "vertical",
            textStyle: {
              fontSize: 12,
            },
            data: data.peizhi.reduce((all, now) => {
              if (now.name != "规模") {
                all.push(now.name);
              }
              return all;
            }, []),
          },
          series: [
            {
              type: "pie", // 图形类型
              radius: ["60%", "85%"], // 图形内外圈半径
              center: ["32%", "50%"], // 图形位置
              hoverOffset: 4, // hover是扩大的偏移量
              label: {
                // 饼图图形上的文本
                show: false,
                position: "center",
                formatter: "{b}\n{d}%",
              },
              emphasis: {
                // 高亮的扇区标签样式
                label: {
                  show: true,
                  fontSize: "15",
                  fontWeight: "normal",
                },
              },
              labelLine: {
                show: false,
              },
              data: data.peizhi.reduce((all, now) => {
                if (now.name != "规模") {
                  all.push({ value: +now.num, name: now.name });
                }
                return all;
              }, []),
            },
          ],
        };
        res(echarts.init(tar).setOption(option));
      }
    },
    // 生产随机颜色
    makeColor() {
      let arr = [];
      this.zhengli.fenxi
        .map((t) => t.theme)
        .forEach((ty) => {
          if (ty) {
            arr.push(...ty);
          }
        });
      this.zhengli.fenxi.forEach((t) => {
        let names = Object.keys(this.jingliList);
        if (names.length) {
          if (!names.includes(t.jingli)) {
            this.jingliList[t.jingli] = [];
          }
          if (!this.jingliList[t.jingli].includes(t.name)) {
            this.jingliList[t.jingli].push(t.name);
          }
        } else {
          this.jingliList[t.jingli] = [t.name];
        }

        if (t.theme) {
          t.theme.forEach((d) => {
            if (arr.includes(d)) {
              if (!Object.keys(this.gaiNian).includes(d)) {
                this.gaiNian[d] = [];
              }
              if (!this.gaiNian[d].includes(t.name)) {
                this.gaiNian[d].push(t.name);
              }
            }
          });
        }
      });
      Array.from(new Set(arr)).forEach((t) => {
        let a = Math.floor(Math.random() * 255),
          b = Math.floor(Math.random() * 255),
          c = Math.floor(Math.random() * 255);
        this.colorObj[t] = `rgba(${a}, ${b},${c})`;
      });
    },
    // 根据持有量或当日收益排序
    toSort(type) {
      if (type) {
        //  按被持仓次数排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return b.jijin.length - a.jijin.length;
        });
      } else {
        //  按被日涨幅排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return b.zhangfu - a.zhangfu;
        });
      }
    },
    // 根据股票名称查询
    search() {
      if (this.jijins != "") {
        let code = this.gupiao.filter((t) => t.name == this.jijins)[0].code;
        let tar = this.$refs[code][0];
        tar.setAttribute("style", "background:red;");
        // 让元素顺滑的滚动到页面中间
        tar.scrollIntoView({
          behavior: "smooth",
          block: "center", // "start", "center", "end"
          inline: "nearest",
        });
        setTimeout(() => {
          this.$refs[code][0].removeAttribute("style");
        }, 5000);
      }
    },
    // 跳转到查看重复表格头部
    tochong() {
      this.$refs.chong.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    // 清除缓存，重新拉取数据
    clearCache() {
      localStorage.removeItem("zhengli");
      this.autoRead();
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
  margin: 10px;
}
ul {
  list-style-type: none;
}
.wap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 0;
}
td {
  padding: 2px;
  font-size: 12px;
}
.chonghe {
  tr {
    width: 100%;
  }
  th {
    width: 100%;
    font-size: 20px;
  }
  td {
    border: 1px solid rgb(188, 181, 181);
    padding: 0 4px;
  }
  td:nth-of-type(1),
  td:nth-of-type(4) {
    flex-shrink: 0;
    p:nth-of-type(1) {
      color: rgb(231, 14, 144);
    }
  }
  td:nth-of-type(2) {
    min-width: 62px;
    text-align: center;
  }
  .chongheTitle {
    text-align: center;
    td {
      font-size: 14px;
    }
  }
}
.gainian,
.noChiCang,
.excelChongFu,
.typeTongJi,
.typeJiJin {
  td {
    font-size: 12px;
    border: 1px solid rgb(188, 181, 181);
    border-collapse: collapse;
  }
  tr > td:nth-of-type(1) {
    width: 90px;
    flex-shrink: 0;
    text-align: center;
    color: rgb(50, 32, 214);
  }
}
.typeTongJi > tbody,
.excelChongFu > tbody,
.noChiCang > tbody {
  display: flex;
  flex-wrap: wrap;

  tr {
    display: flex;
    width: 33.2%;
    td:nth-of-type(1) {
      width: 70px !important;
      flex-shrink: 0;
    }
    td:nth-of-type(2) {
      width: 100%;
    }
  }
}
.shuju {
  height: 800px;
  overflow-y: scroll;
  td {
    font-size: 12px;
    border: 1px solid rgb(188, 181, 181);
  }
  th {
    font-size: 20px;
    border: 1px solid rgb(188, 181, 181);
  }

  tbody {
    tr {
      th {
        padding: 3px;
        font-size: 16px;
      }
      th:nth-of-type(2) {
        width: 90px;
      }
      th:nth-of-type(3) {
        width: 70px;
      }
      th:nth-of-type(2):hover,
      th:nth-of-type(3):hover {
        cursor: pointer;
        color: red;
      }
      td:nth-of-type(1),
      td:nth-of-type(2),
      td:nth-of-type(3) {
        font-size: 14px;
        text-align: center;
      }
      td:nth-of-type(1) {
        color: rgb(189, 8, 196);
      }
    }
  }
  .bg {
    background: rgba(230, 186, 156, 0.3);
  }
}
.stickyd {
  opacity: 0.3;
  display: inline-block;
  padding: 2px 4px 4px 4px;
  background: rgb(15, 188, 190);
  position: fixed;
  right: 20px;
  top: 20px;
  text-align: right;
  input {
    padding: 4px;
    margin-right: 5px;
  }
  &:hover {
    opacity: 1;
  }
}
.fenxi {
  width: 100%;
  tbody tr {
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
  }
  td {
    width: 380px;
    border: 1px solid rgb(188, 181, 181);
  }
  td:nth-of-type(2n) {
    margin: 0 5px;
  }
}
.bili {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bili > div {
  width: 170px;
  height: 110px;
  flex-shrink: 0;
}
.bili > ul {
  width: 190px;
  font-size: 12px;
  text-align: left;
}

.xiangqing {
  font-size: 12px;
}
.xiangqing > div {
  display: flex;
  justify-content: space-around;
  margin: 2px 0;
}
.xiangqing > div {
  p:nth-of-type(1) {
    width: 35%;
  }
  p:nth-of-type(2) {
    width: 65%;
  }
  p {
    display: flex;
    justify-content: center;
  }
}
.xiangqing > div p {
  width: 50%;
}
.xiangqing > div > p > span {
  display: inline-block;
  width: 50%;
}
.names {
  display: flex;
  p {
    width: 50%;
  }
  p:nth-of-type(2) {
    font-size: 14px;
    color: rgb(243, 33, 33);
  }
}
.zhang {
  display: flex;
  justify-content: space-between;
}
.zhang p {
  width: 49.5%;
  display: flex;
}

.zhang p span {
  width: 50%;
}
.zhang p span:nth-of-type(1) {
  text-align: right;
}
.showManager:hover {
  position: relative;
  cursor: pointer;
  background: rgb(229, 208, 208);
}
.showManager > span:nth-of-type(1) {
  width: 50%;
  text-align: right;
}
.leixingName {
  display: inline-block;
  width: 60px;
  text-align: right;
}
.jinglis {
  display: flex;
  flex-wrap: wrap;
}
.jinglis > tr {
  width: 50%;
  display: flex;
  font-size: 14px;
}
.jinglis > tr td:nth-of-type(2) {
  width: calc(100% - 85px);
}
.gai {
  display: flex;
  justify-content: flex-start !important;
}
.gai > span:nth-child(1) {
  width: 66px;
  text-align: right;
  flex-shrink: 0;
}
.gai > span:nth-child(2) {
  margin-right: 10px;
}
.gainians {
  display: flex;
}
.toChong {
  position: fixed;
  right: 10px;
  bottom: 60px;
  width: 40px;
  height: 50px;
  color: red;
  font-weight: bold;
  border: none;
  font-size: 40px;
  border-radius: 0 0 20% 20%;
  opacity: 0.5;
  background: none;
  outline: none;
}
.toChong:hover {
  cursor: pointer;
  opacity: 1;
  background: rgb(25, 233, 236);
}
.toChong:hover::before {
  content: "去重合分析头部";
  position: fixed;
  right: 10px;
  bottom: 95px;
  color: black;
  font-size: 12px;
  background: rgb(25, 233, 236);
  padding: 2px 4px;
  z-index: 80;
  border-radius: 5px;
}
.seegupiao:hover {
  cursor: pointer;
  background: rgb(32, 228, 100);
}
.clear {
  outline: none;
  font-size: 14px;
  margin: 20px 0 0 20px;
}
</style>