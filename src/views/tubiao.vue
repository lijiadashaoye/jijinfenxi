<template>
  <div>
    <!-- 手动选择文件 -->
    <!-- <input
      type="file"
      style="margin-bottom:20px;"
      @change="readExcel"
    /> -->
    <!-- echarts 显示 -->
    <div
      v-if="chartShow"
      id="main"
      :style="{width:`${setWidth}px`,height:`${setHeight}px`}"
    ></div>

    <jiazai
      v-if="!toShow"
      :show="!toShow"
    />

    <div class="kong">
      <div>
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

        <div style="display:flex;">
          <table
            style="margin:10px 10px 0 0;"
            border="1"
            collpase
            v-if="toShow&&httpData.kong.length"
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
            style="margin-top:10px;"
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
      <div style="width:60%;flex-shrink:0">
        <!-- 根据概念区分 -->
        <table
          style="margin-bottom:20px"
          border="1"
          collpase
          v-if="toShow&&Object.keys(gaiNian).length"
        >
          <thead>
            <tr>
              <th colspan="2">概念类型统计</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="t in Object.keys(gaiNian)"
              :key="t"
            >
              <td style="width:85px;text-align:center;">{{t}}</td>
              <td>{{gaiNian[t].join('  ')}}</td>
            </tr>
          </tbody>
        </table>
        <!-- 基金类型统计 -->
        <table
          style="margin-bottom:20px"
          border="1"
          collpase
          v-if="toShow&&Object.keys(jijinType).length"
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
              <td style="width:85px;text-align:center;">{{t}}</td>
              <td>{{jijinType[t].join('  ')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 基金类型统计 -->
    <table
      style="margin-bottom:20px"
      border="1"
      collpase
      v-if="toShow&&Object.keys(jingliList).length"
    >
      <thead>
        <tr>
          <th colspan="2">基金经理汇总</th>
        </tr>
      </thead>
      <tbody class="jinglis">
        <tr
          v-for="t in Object.keys(jingliList)"
          :key="t"
        >
          <td style="width:85px;text-align:center;">{{t}}</td>
          <td>{{jingliList[t].join('  ')}}</td>
        </tr>
      </tbody>
    </table>

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

    <!-- 每个基金的分析 -->
    <table
      border="1"
      collpase
      v-if="toShow&&httpData.fenxi.length"
    >
      <thead>
        <tr>
          <th :colspan="httpData.fenxi.length">一共 {{`${httpData.fenxi.length}个`}}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="fenxi">
          <td
            v-for="t in httpData.fenxi"
            :key="t.code"
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

                <li v-if="t.theme.length">
                  <span class="leixingName">
                    概念：</span>
                  <span
                    v-for="(d,ind) of t.theme"
                    :key="ind"
                    :style="{color:colorObj[d],fontWeight:'bold'}"
                  >
                    {{d}}
                  </span>

                </li>

                <p style="text-align:center;color:red;">
                </p>
              </ul>
            </div>
            <div class="xiangqing">
              <div>
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

              <p>
                <span style="text-align:right;">净值：</span>&nbsp;
                <span>{{t.jingzhi}}</span>&nbsp;
                <span style="text-align:right;">购买费率：</span>&nbsp;
                <span>{{t.feilv?t.feilv+'%':''}}</span>
              </p>
              <div class="zhang">
                <p> <span>近1周：</span>&nbsp;
                  <span>{{t.week+' %'}}</span>
                </p>
                <p> <span>近1月：</span>&nbsp;
                  <span>{{t.yue_1+' %'}}</span>
                </p>
              </div>

              <div class="zhang">
                <p>
                  <span>近3月：</span>&nbsp;
                  <span>{{t.yue_3+' %'}}</span>
                </p>
                <p>
                  <span>近6月：</span>&nbsp;
                  <span>{{t.yue_6+' %'}}</span>
                </p>
              </div>
              <div class="zhang">
                <p>
                  <span>近1年：</span>&nbsp;
                  <span>{{t.nian+' %'}}</span>
                </p>
                <p>
                  <span>成立以来：</span>&nbsp;
                  <span>{{t.nowyear+' %'}}</span>
                </p>
              </div>

            </div>
          </td>

        </tr>
      </tbody>
    </table>

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
      jijinType: {},
      chartShow: false,
      toShowFew: false,
      numQuFen: [], // 用来将被持有数量太少的股票的基金进行分组
      chongfu: [],
      colorObj: {}, // 存储每个概念的颜色
      gaiNian: {}, // 存储根据概念区分基金
      jingliList: {}, // 根据基金经理区分基金
    };
  },
  components: { jiazai },
  created() {
    this.range = "A1:B200";
    // this.range = "C1:D200";
    // this.range = "E1:F200";

    this.autoRead();
  },
  methods: {
    // 自动读取本地excel文件
    async autoRead() {
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
          csv = XLSX.utils.sheet_to_json(worksheet, { range: this.range });
        this.allDatas = csv.map((t) => ({
          code: "" + t["代码"],
          name: "" + t["名字"],
        }));
      });
      // 选出excel里重复的
      let excelCode = [];
      for (let i = this.allDatas.length; i--; ) {
        if (!excelCode.includes(this.allDatas[i].code)) {
          excelCode.push(this.allDatas[i].code);
        } else {
          this.chongfu.push(this.allDatas.splice(i, 1)[0]);
        }
      }
      this.getData(excelCode);
    },
    // 获取所有基金的持股
    async getData(excelCode) {
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
          fenxi: kk.fenxi.filter((t) => excelCode.includes(t.code)),
          kong: kk.kong.filter((t) => excelCode.includes(t.code)),
          see: kk.see.filter((t) => excelCode.includes(t.code)),
        };
        // 获取新增的基金数据
        if (needHttp.length) {
          let proArr = [];
          for (let i = needHttp.length; i--; ) {
            proArr.push(
              await this.$axios({
                method: "get",
                url: `jijin/${needHttp[i]}`,
              })
            );
          }
          // 获取多余的基金的数据
          await Promise.all(proArr).then((res) => {
            // 需要再次查看http获取的数据中的基金是否为空
            let dd = res.map((t) => t.data.stock);
            for (let i = dd.length; i--; ) {
              if (dd[i].length) {
                this.httpData.see.push(...dd[i]);
              } else {
                this.httpData.kong.push({
                  code: needHttp[i],
                  name: this.allDatas.find((t) => t.code == needHttp[i]).name,
                });
              }
            }
          });
          this.getXiangXi(needHttp, this.httpData.fenxi);
        } else {
          this.makeTongJi();
        }
      } else {
        for (let j = 0; j < excelCode.length; j += 3) {
          let arr = excelCode.slice(j, j + 3),
            p = [];
          for (let i = 0; i < arr.length; i++) {
            p.push(
              await this.$axios({
                method: "get",
                url: `jijin/${arr[i]}`,
              })
            );
          }
          Promise.all(p).then((res) => {
            let zz = res.map((t) => t.data.stock);
            for (let i = 0; i < zz.length; i++) {
              if (zz[i].length) {
                this.httpData.see.push(...zz[i]);
              } else {
                this.httpData.kong.push(
                  this.allDatas.find((k) => k.code == arr[i])
                );
              }
            }
          });
        }
        this.getXiangXi(excelCode, []);
      }
    },
    // 获取每个基金的详细数据
    async getXiangXi(excelCode, arr) {
      let reg = /\/\*.+?\*\//gi;
      for (let j = 0; j < excelCode.length; j += 3) {
        let datas = excelCode.slice(j, j + 3),
          pro = [];
        for (let i = datas.length; i--; ) {
          pro.push(
            await this.$axios({
              method: "get",
              url: `bili/${datas[i]}`,
            })
          );
        }
        Promise.all(pro).then((res) => {
          res.forEach((d) => {
            let zz = [],
              obj = {};
            d.replace(reg, "")
              .split("var")
              .filter((t) => {
                if (t.length) {
                  zz.push(t.trim().slice(0, -1));
                }
              });
            zz.forEach((t) => {
              let arr = t.split("=").map((t) => t.trim()),
                k;
              switch (arr[0]) {
                case "fS_code": // 基金号
                  obj["code"] = arr[1].slice(1, -1);
                  break;
                case "Data_assetAllocation": // 资产配置
                  k = eval("(" + arr[1] + ")");
                  obj["peizhi"] = k.series.map((t) => ({
                    name: t.name == "净资产" ? "规模" : t.name.slice(0, 2) + "",
                    num:
                      t.name == "净资产"
                        ? t.data[0]
                          ? t.data[0].toFixed(2)
                          : ""
                        : t.data[0]
                        ? t.data[0].toFixed(2)
                        : "",
                  }));
                  break;
                case "Data_currentFundManager": // 现任基金经理
                  k = eval("(" + arr[1] + ")")[0];
                  obj["jingli"] = k.name;
                  break;
              }
            });
            arr.push(obj);
          });
          this.httpData.fenxi = arr;
        });
      }
      this.getXiangXi2(excelCode);
    },
    // 获取每个基金的详细数据
    async getXiangXi2(excelCode) {
      let fenxi = this.httpData.fenxi;
      for (let j = 0; j < excelCode.length; j += 3) {
        let datas = excelCode.slice(j, j + 3),
          pro = [];
        for (let i = datas.length; i--; ) {
          pro.push(
            await this.$axios({
              method: "get",
              url: `xiangqing/${datas[i]}`,
            })
          );
        }
        Promise.all(pro).then((res) => {
          res.forEach((d) => {
            let data = d.data[0],
              tar = fenxi.find((t) => t.code == data.code);
            tar.name = data.name; // 基金名称
            tar.theme = data.themeList.length
              ? data.themeList.map((t) => t.field_name)
              : []; // 基金涉及主题
            tar.week = data.week; // 近1周
            tar.yue_1 = data.month; // 近1月
            tar.yue_3 = data.tmonth; // 近3月
            tar.yue_6 = data.hyear; // 近6月
            tar.nian = data.year; // 近1年
            tar.nowyear = data.nowyear; // 近1年
            tar.jingzhi = data.net; // 单位净值
            tar.jingTime = data.enddate.slice(5); // 净值计算时间
            tar.zhangfu = data.rate;
            tar.chengli = data.clrq; // 成立时间
            tar.feilv = data.sgfl; // 购买费率
            tar.fengxian = data.levelOfRisk; // 风险等级
            tar.leixing = data.fundtype.slice(0, 2); // 基金类型
          });
        });
      }
      this.makeTongJi();
    },
    // 将多维数组，拉成一维数组，并去除空数组
    makeTongJi() {
      // 统计数据
      this.jishu = this.httpData.see
        .reduce((all, now, index) => {
          let kk = Array.from(new Set(all.map((u) => u.code)));
          if (!kk.includes(now.zcCode)) {
            all.push({
              id: index,
              zhangfu: now.rate, // 涨幅
              code: now.zcCode, //  股票代码
              name: now.zcName,
              num: 0,
              jijin: [],
              jijinCode: [], // 基金的代码
            });
          }

          let inJishu = all.find((h) => h.code == now.zcCode), // 找出股票的数据
            jijin = this.allDatas.find((h) => h.code == now.code); // 找出基金的名字
          inJishu.jijin.push(jijin.name);
          inJishu.jijinCode.push({
            name: jijin.name,
            code: jijin.code,
          });
          inJishu.num++;
          return all;
        }, [])
        .sort((a, b) => {
          return b.num - a.num;
        });

      // 统计有几个股票被持有1次
      this.jishu.forEach((t) => {
        if (t.num == 1) {
          this.single += +t.num;
        }
      });

      setTimeout(() => {
        this.makeColor();
        this.toShow = true;
        sessionStorage.setItem("httpData", JSON.stringify(this.httpData));
        // 持有量小于一定数目个的数据
        // this.jishu = this.jishu.filter(t=>t.num<3);
        this.chongHeFenXi();
        this.leiXingTongJi();
        this.makeXiangQingChart();

        // this.makeChart();
        // this.getCompany();
        // this.makeNumQuFen();
      });
    },
    // 基金类型统计
    leiXingTongJi() {
      let j = require("./data.json"),
        k = this.httpData.fenxi;
      j.forEach((t) => {
        let leixing = Object.keys(this.jijinType);
        if (!leixing.includes(t[3])) {
          this.jijinType[t[3]] = [];
        }
        let z = k.find((d) => d.code == t[0]);
        if (z) {
          this.jijinType[t[3]].push(k.find((d) => d.code == t[0]).name);
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
      });
    },
    showManager(c) {
      window.open(`http://fund.10jqka.com.cn//${c}/interduce.html#manager`);
    },
    showJiJin(c) {
      window.open(`http://fund.10jqka.com.cn/${c}`);
    },
    makeXiangQingChart() {
      setTimeout(() => {
        this.httpData.fenxi.forEach((t) => {
          let tar = document.getElementById(`${t.code}`);
          hua(tar, t);
        });
      });
      function hua(tar, data) {
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
              radius: ["62%", "85%"], // 图形内外圈半径
              center: ["34%", "50%"], // 图形位置
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
        echarts.init(tar).setOption(option);
      }
    },
    // 生产随机颜色
    makeColor() {
      let arr = [];
      this.httpData.fenxi
        .map((t) => t.theme)
        .forEach((ty) => {
          if (ty) {
            arr.push(...ty);
          }
        });
      this.httpData.fenxi.forEach((t) => {
        let names = Object.keys(this.jingliList);
        if (names.length) {
          if (!names.includes(t.jingli)) {
            this.jingliList[t.jingli] = [];
          }
          this.jingliList[t.jingli].push(t.name);
        } else {
          this.jingliList[t.jingli] = [t.name];
        }

        if (t.theme && t.theme.length) {
          t.theme.forEach((d) => {
            if (arr.includes(d)) {
              if (!Object.keys(this.gaiNian).includes(d)) {
                this.gaiNian[d] = [];
              }
              this.gaiNian[d].push(t.name);
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
    ////////////////////////////////////////////////////////////////////////////////////////////////
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
          return b.zhangfu - a.zhangfu;
        });
      }
    },
    // 根据股票名称查询
    search() {
      if (this.jijins != "") {
        let code = this.jishu.filter((t) => t.name == this.jijins)[0].code;
        let tar = this.$refs[code][0];
        tar.setAttribute("style", "background:red;");
        // 让元素顺滑的滚动到页面中间
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
        // 选出excel里重复的
        let excelCode = [];
        for (let i = this.allDatas.length; i--; ) {
          if (!excelCode.includes(this.allDatas[i].code)) {
            excelCode.push(this.allDatas[i].code);
          } else {
            this.chongfu.push(this.allDatas.splice(i, 1)[0]);
          }
        }
        this.getData(excelCode);
      };
    },
    async getCompany() {
      for (let i = this.jishu.length; i--; ) {
        let reg = /^\d./gi;
        if (reg.test(this.jishu[i].code)) {
          await this.$axios({
            method: "get",
            url: `gongsi/${this.jishu[i].code}`,
          }).then((res) => {
            if (res.resultCode == 0 && Object.keys(res.data).length) {
              this.jishu[i].hangye = `(${res.data.businessType.replace(
                " — ",
                "-"
              )})`;
            }
          });
        }
      }
    },
    // getCompany() {
    //   this.jishu.forEach((d) => {
    //     let reg = /^\d./gi;
    //     if (reg.test(d.code)) {
    //        this.$axios({
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
      }, 0);
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
  margin-top: 30px;
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
.fenxi {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.fenxi td {
  padding: 3px;
  flex-shrink: 0;
  width: 320px;
  text-align: center;
  margin-bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.bili {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bili > div {
  width: 100%;
  height: 110px;
}
.bili > ul {
  width: 150px;
  flex-shrink: 0;
  font-size: 12px;
  text-align: left;
}

.xiangqing {
  font-size: 12px;
}
.xiangqing > p {
  display: flex;
  justify-content: space-between;
}
.xiangqing > div {
  display: flex;
  justify-content: space-around;
  margin: 2px 0;
}
.xiangqing > div p {
  width: 50%;
  display: flex;
  justify-content: center;
}
.xiangqing > div p {
  width: 50%;
}
.xiangqing span {
  display: inline-block;
  width: 50%;
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
  transform: scale(1.2);
  transform-origin: 50% 50%;
  color: red;
}
.showManager > span:nth-of-type(1) {
  width: 50%;
  text-align: right;
}
.leixingName {
  display: inline-block;
  width: 38px;
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
</style>