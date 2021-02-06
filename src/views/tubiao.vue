<template>
  <div>
    <jiazai v-if="!showAll" />
    <button class="toChong" @click="tochong" v-show="showAll">
      <!--js 特殊字符表 http://www.360doc.com/content/19/0316/09/281812_821845466.shtml -->
      &#9650;
    </button>
    <button class="tochart" @click="tochart" v-show="showAll">&#9660;</button>
    <button class="clear" @click="clearJiJin">清除缓存，重新拉取数据</button>

    <div v-show="showAll">
      <div class="sticky">
        <div class="searchGP">
          <div>
            <input
              type="text"
              placeholder="输入股票名称"
              v-model="jijins"
              @keyup.enter="search"
            />
          </div>
          <button @click="search">搜索股票(支持模糊搜索)</button>
        </div>
        <div class="showModel">
          <label>
            概念类型统计
            <input type="checkbox" v-model="showGaiNian" />
          </label>
          <label>
            基金类型统计
            <input type="checkbox" v-model="showLeiXing" />
          </label>
          <label>
            没有持仓数据
            <input type="checkbox" v-model="showKong" />
          </label>
          <label>
            excel里重复
            <input type="checkbox" v-model="showChongFu" />
          </label>
          <label>
            基金经理统计
            <input type="checkbox" v-model="showJingLi" />
          </label>
          <label>
            股票市场统计
            <input type="checkbox" v-model="showGuPiao" />
          </label>
          <label>
            基金持仓分析
            <input type="checkbox" v-model="showJiJinChiCang" />
          </label>
          <label>
            重合分析
            <input type="checkbox" v-model="showChongHe" />
          </label>
          <label>
            股票数据统计
            <input type="checkbox" v-model="showTongJi" />
          </label>
          <label>
            基金完整分析
            <input type="checkbox" v-model="showFenXi" @change="makeChart" />
          </label>
        </div>
      </div>

      <!-- 根据概念区分 -->
      <table class="gainians1" collpase v-if="showGaiNian">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="2">概念类型统计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in Object.keys(gaiNian)" :key="ind">
            <td>
              <p>
                {{ t }}
              </p>
              <p>
                {{ gaiNian[t].length + "个" }}
              </p>
            </td>
            <td>{{ gaiNian[t].join("  ") }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 基金类型统计 -->
      <div class="gainians2" v-if="showLeiXing">
        <table class="typeJiJin" collpase>
          <thead>
            <tr>
              <th style="padding: 20px 0" colspan="2">基金类型统计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, ind) in Object.keys(jijinType)" :key="ind">
              <td>{{ t }}</td>
              <td>{{ jijinType[t].join("  ") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 没有持仓数据的 -->
      <table class="noChiCang" collpase v-if="showKong">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="4">
              没有持仓数据的，{{ `${zhengli.kong.length}个` }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in zhengli.kong" :key="ind">
            <td>{{ t.code }}</td>
            <td>{{ t.name }}</td>
          </tr>
        </tbody>
      </table>
      <!-- excel 里重复的 -->
      <table class="excelChongFu" collpase v-if="showChongFu">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="4">
              excel 里重复的{{ `${zhengli.chongfu.length}个` }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in zhengli.chongfu" :key="ind">
            <td>{{ t.code }}</td>
            <td>{{ t.name }}（{{ t.num }}次）</td>
          </tr>
        </tbody>
      </table>
      <!-- 基金经理汇总 -->
      <table collpase class="typeTongJi" v-if="showJingLi">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="6">基金经理统计</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in jingliList" :key="ind">
            <td
              title="点击查看基金经理数据"
              class="showManager"
              @click="showJiJin2(t.name)"
            >
              <span> {{ t.name }}{{ `(${t.jijin.length}个)` }}</span>
            </td>
            <td>{{ t.jijin.join("  ") }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 根据概念区分 -->
      <table class="gupiaoTable" collpase v-if="showGuPiao">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="3">股票市场统计</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>行业</td>
            <td>股票数量</td>
            <td>股票名称</td>
            <td>基金数量</td>
            <td>基金名称</td>
          </tr>
          <tr v-for="(t, ind) in sortGupiaoShiChang" :key="ind">
            <td>
              <p>
                {{ t.name }}
              </p>
              <p>
                {{ t.data.xiangxi }}
              </p>
              <p>
                {{ t.data.shichang }}
              </p>
            </td>
            <td>
              {{ t.data.name.length }}
            </td>
            <td>
              {{ t.data.name.join("  ") }}
            </td>
            <td>{{ t.num }}</td>
            <td>{{ t.data.jijin.join("  ") }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 将基金持仓进行分析 -->
      <table class="jiJinChiCang" collpase v-if="showJiJinChiCang">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="3">
              基金持仓分析，共{{ this.zhengli.canUse.length }}个基金
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in chiCangFenXi" :key="ind">
            <td>
              <p>{{ t.name }}</p>
              <p>{{ t.code }}</p>
            </td>
            <td v-for="(s, sIn) in t.gupiao" :key="sIn">
              <p>{{ s.zcName }}</p>
              <p>{{ s.hangye }}</p>
              <p>{{ s.ccRate + "%" }}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 重合分析 -->
      <table ref="chong" class="chonghe" collpase v-if="showChongHe">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="4">重合分析</th>
          </tr>
        </thead>
        <tbody>
          <tr class="chongheTitle">
            <td>基金</td>
            <td>重合数量</td>
            <td>重合的股票</td>
            <td>不重合的股票</td>
          </tr>
          <tr v-for="(t, ind) in chonghe" :key="ind">
            <td>
              <p>
                <span @contextmenu="toChart1($event, t.one.code)">{{
                  t.one.code
                }}</span>
                &nbsp;
                <span @contextmenu="toChart($event, t.one.code)">{{
                  t.one.name
                }}</span>
              </p>
              <p>
                <span @contextmenu="toChart1($event, t.two.code)">{{
                  t.two.code
                }}</span>
                &nbsp;
                <span @contextmenu="toChart($event, t.two.code)">{{
                  t.two.name
                }}</span>
              </p>
            </td>
            <td style="font-size: 14px">{{ t.num }}</td>
            <td>{{ t.chong.join(" ") }}</td>
            <td>
              <p>{{ t.oneOther.join(" ") }}</p>
              <p>{{ t.twoOther.join(" ") }}</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 数据统计 -->
      <table class="shuju" collpase v-if="showTongJi">
        <thead>
          <tr>
            <th style="padding: 20px 0" colspan="4">股票数据统计</th>
          </tr>

          <tr class="lists">
            <th>股票名称</th>
            <th title="点击排序" @click="toSort()">被持仓次数</th>
            <th title="点击排序" @click="toSort1()">日涨幅 %</th>
            <th>
              共{{ zhengli.canUse.length }}个基金，
              {{ zhengli.kong.length }}个看不到持仓，
              <span>{{ single }} 个股票被持有一次</span>
              <span
                style="
                  background: green;
                  margin-left: 20px;
                  font-weight: normal;
                  color: #fff;
                  padding: 2px 5px;
                  cursor: pointer;
                "
                @click="makeExcel"
                >保存为excel</span
              >
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, ind) in gupiao" :key="ind" :ref="t.code">
            <td
              :id="t.id"
              :class="{ bg: t.jijin.length >= shaixuan, seegupiao: true }"
              @contextmenu="seeGuPiao($event, t.code)"
            >
              <p title="点击查看股票">{{ t.name }}</p>
              <p style="font-size: 12px; color: blue" v-if="t.hangye1">
                {{ "(" + t.hangye1 + ")" }}
              </p>
              <p style="font-size: 12px; color: blue" v-if="t.hangye2">
                {{ "(" + t.hangye2 + ")" }}
              </p>
              <p style="font-size: 12px; color: blue" v-if="t.shichang">
                {{ "(" + t.shichang + ")" }}
              </p>
            </td>
            <td>{{ t.jijin.length }}</td>
            <td>{{ t.zhangfu }}</td>
            <td>{{ t.jijin.join(" , ") }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 每个基金的分析 -->
    <table class="fenxi" collpase v-if="showFenXi" ref="chart">
      <thead>
        <tr>
          <th style="padding: 20px 0" colspan="3">
            基金详情，{{ `共 ${zhengli.fenxi.length} 个` }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, ind) in chartList" :key="ind">
          <td v-for="(t, ind) in d" :key="ind" :ref="`${t.code}_chart`">
            <div>
              <div class="names">
                <p>{{ t.name }}</p>
                <p
                  title="点击查看基金"
                  class="showManager"
                  @click="showJiJin(t.code)"
                  @contextmenu="oncontextmenu($event, t.code)"
                >
                  <span>{{ t.code }}</span>
                </p>
                <p
                  title="点击查看基金经理管理的基金"
                  class="showManager"
                  @click="showManager(t.code)"
                  @contextmenu="oncontextmenu($event, t.code)"
                >
                  {{ t.jingli }}
                </p>
                <p>
                  <span>概念:</span>
                  <span
                    v-for="(d, ind) of t.theme"
                    :key="ind"
                    :style="{ color: colorObj[d], fontWeight: 'bold' }"
                  >
                    {{ d }}
                  </span>
                </p>
              </div>
              <div class="bili">
                <div :ref="`${t.code}_pie`"></div>
                <ul>
                  <li>
                    <span class="leixingName"> {{ `${t.leixing}：` }}</span>
                    <span>{{ t.fengxian }}</span>
                  </li>
                  <li v-for="(d, ind) of t.peizhi" :key="ind">
                    <span class="leixingName">{{ `${d.name}：` }}</span>
                    <span v-if="d.name != '规模'">{{
                      d.num ? d.num + " %" : "--"
                    }}</span>
                    <span v-else>{{ d.num ? d.num + " 亿" : "--" }}</span>
                    <span v-if="d.name == '规模' && t.chengli"
                      >{{ " (" + t.chengli.slice(5) + ")" }}
                    </span>
                  </li>
                </ul>
                <ul>
                  <li>
                    <span class="leixingName">成立日期：</span>
                    <span>{{ t.chengli }}</span>
                  </li>
                  <li>
                    <span class="leixingName">净值：</span>
                    <span>{{ t.jingzhi }}</span>
                  </li>
                  <li>
                    <span class="leixingName">统计日期：</span>
                    <span>{{ `${t.jingTime}` }}</span>
                  </li>
                  <li>
                    <span class="leixingName">日涨幅：</span>
                    <span>{{ `${t.zhangfu}%` }}</span>
                  </li>
                  <li>
                    <span class="leixingName">购买费率：</span>
                    <span>{{ t.feilv ? t.feilv + "%" : "" }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <div class="xiangqing">
              <div class="zhang">
                <p>
                  <span>近1月：</span>&nbsp;
                  <span>{{ t.yue_1 + " %" }}</span>
                </p>
                <p>
                  <span>近3月：</span>&nbsp;
                  <span>{{ t.yue_3 + " %" }}</span>
                </p>
              </div>
              <div class="zhang">
                <p>
                  <span>近6月：</span>&nbsp;
                  <span>{{ t.yue_6 + " %" }}</span>
                </p>
                <p>
                  <span>近1年：</span>&nbsp;
                  <span>{{ t.nian + " %" }}</span>
                </p>
              </div>
              <div class="zhang">
                <p>
                  <span>今年：</span>&nbsp;
                  <span>{{ t.nowyear + " %" }}</span>
                </p>
                <p style="color: red">
                  <span>成立以来：</span>&nbsp;
                  <span>{{ t.tyear + " %" }}</span>
                </p>
              </div>
            </div>

            <!-- 排名分析 -->
            <table class="paiming" collpase>
              <tbody>
                <tr>
                  <td>同类排名</td>
                  <td v-for="(l, ind) in Object.keys(t.paiming)" :key="ind">
                    <p>{{ t.paiming[l][3] }}</p>
                    <span>{{ t.paiming[l][0] }}</span>
                    <hr />
                    <span> {{ t.paiming[l][1] }}</span>
                    <div class="jinjie">
                      <p :class="{ hao3: t.paiming[l][2] > 3, hao: true }"></p>
                      <p :class="{ hao2: t.paiming[l][2] > 2, hao: true }"></p>
                      <p :class="{ hao1: t.paiming[l][2] > 1, hao: true }"></p>
                      <p :class="{ hao0: t.paiming[l][2] > 0, hao: true }"></p>
                      <p>{{ setName(t.paiming[l][2]) }}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- 收益走势 -->
            <div :class="{ zoushi: t.shouyi }" :ref="`${t.code}_qushi`">
              <select @change="changeTime($event.target.value, t.code)">
                <option value="50">成立以来</option>
                <option value="1">最近1年</option>
                <option value="3">最近3年</option>
                <option value="5">最近5年</option>
              </select>

              <div></div>
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
      shaixuan: 5, // 用来筛选被持有量
      chongheNum: 4, // 用来定义重合数量
      httptype: true, // 如果有服务器请求数量限制，就要用 true，隔段时间请求一次，同花顺那边也有限制
      // 将读取的excel文件进行数据整理
      httpEnd: -1, // 如果http请求出错，就不保存这次刷新读取excel的数据
      zhengli: {
        chongfu: [], // excel里重复添加的基金
        canUse: [], // 用来操作的读取excel后的原始数据
        see: [], // 可以看到持仓的基金
        kong: [], // 看不到持仓数据的基金
        fenxi: [], // 底下 echarts分析用到
        time: "",
      },
      shichang: {
        // 证券市场数据
        hushen: [], // 沪深300
        zhong: [], // 中证500
        shang: [], // 上证指数
        chuang: [], // 上证指数
        time: "", // 用来验证数据是否为最新的，同一天内是不会再http拉取
      },
      single: 0, // 记录只被持有一次的个数
      range: "",
      gupiao: [], // 记录根据股票进行分析的基金
      jingliList: [], // 根据基金经理区分基金
      gaiNian: {}, // 存储根据概念区分基金
      chonghe: [], // 用来存储有重合的基金
      jijinType: {}, // 基金类型统计
      chartList: [], //用来显示echarts分析
      colorObj: {}, // 存储不同概念的颜色
      caches: null, // 判断是否有缓存
      showAll: false, // 用来控制显示页面DOM表示加载完
      gupiaoShiChang: {}, // 股票市场类型区分
      sortGupiaoShiChang: [], // 股票市场类型区分的排序
      chiCangFenXi: [], // 基金持仓分析

      showGaiNian: false, // 显示概念分析
      showLeiXing: false, // 显示基金类型分析
      showKong: false, // 没有持仓数据的
      showChongFu: false, // excel 里重复的
      showJingLi: false, // 显示基金经理分析
      showGuPiao: false, // 将股票按类型分析
      showJiJinChiCang: false, // 将基金持仓进行分析
      showChongHe: true, // 显示重合分析
      showTongJi: true, // 股票数据统计
      showFenXi: false, // 显示走势分析

      GetTime: 200, // 如果请求的数量太多，容易让node http请求报错，用来控制请求发送的间隔时间
      readType: false, // true为读取两列，false为读取多列

      chiyou: false, // 被持有次数排序
      zhang: false, // 被持有次数排序
    };
  },
  components: { jiazai },
  created() {
    let num = 180

    this.range = `A1:B${num}`;
    this.readType = false;
    this.testShiChang();
  },
  methods: {
    // 读取市场数据
    testShiChang() {
      // 如果基金太多，localStorage 会存不下
      let arr = [
        // 获取已经存储的数据
        this.$axios({
          method: "get",
          url: `getPageData`,
          headers: {
            "Content-Type": "tapplication/json;charset=utf-8",
          },
        }),
        this.$axios({
          method: "get",
          url: `shiChang`,
          headers: {
            "Content-Type": "tapplication/json;charset=utf-8",
          },
        }),
      ];
      Promise.all(arr)
        .then((res) => {
          if (res[0]) {
            this.caches = res[0];
            let time = this.caches.time,
              now = new Date().getTime();
            // 超过三天未操作，就重新拉取数据
            if (now - time > 1000 * 60 * 60 * 24 * 3) {
              this.clearShiChang();
            }
          }
          if (!res[1]) {
            // 如果没有添加过市场数据，则需要初始化
            this.getShiChang();
          } else {
            // 获取当天时间
            let day = new Date().getTime() - 1000 * 60 * 60 * 24;
            if (res[1].time < day) {
              this.getShiChang();
            } else {
              this.shichang = res[1];
              this.shichang.time = day;
            }
          }
        })
        .then(this.autoRead); // 获取基金的数据
    },
    // 获取市场数据
    getShiChang() {
      let shichangs = [
        // 获取沪深300
        this.$axios({
          method: "get",
          url: `hushen`,
          headers: {
            "Content-Type": "text/javascript;charset=utf-8",
          },
        }).then((res) => {
          let k = JSON.parse(res.split("=")[1]);
          return k;
        }),
        // 获取中证500
        this.$axios({
          method: "get",
          url: `zhongzheng`,
          headers: {
            "Content-Type": "text/javascript;charset=utf-8",
          },
        }).then((res) => {
          let k = JSON.parse(res.split("=")[1]);
          return k;
        }),
        // 获取上证
        this.$axios({
          method: "get",
          url: `shangzheng`,
          headers: {
            "Content-Type": "text/javascript;charset=utf-8",
          },
        }).then((res) => {
          let k = JSON.parse(res.split("=")[1]);
          return k;
        }),
        // 获取创业板
        this.$axios({
          method: "get",
          url: `chuangyeban`,
          headers: {
            "Content-Type": "text/javascript;charset=utf-8",
          },
        }).then((res) => {
          let k = JSON.parse(res.split("=")[1]);
          return k;
        }),
      ];
      Promise.all(shichangs).then((res) => {
        // 获取沪深300
        let hs = res[0],
          hsNames = Object.keys(hs),
          // 获取中证500
          zz = res[1],
          zzNames = Object.keys(zz),
          // 获取上证
          sz = res[2],
          szNames = Object.keys(sz),
          // 获取创业板
          cy = res[3],
          cyNames = Object.keys(cy);

        for (let i = hsNames.length; i--; ) {
          let time = hsNames[i].replace(/-/g, "/");
          this.shichang.hushen.unshift([time, hs[hsNames[i]]]);
        }
        for (let i = zzNames.length; i--; ) {
          let time = zzNames[i].replace(/-/g, "/");
          this.shichang.zhong.unshift([time, zz[zzNames[i]]]);
        }
        for (let i = szNames.length; i--; ) {
          let time = szNames[i].replace(/-/g, "/");
          this.shichang.shang.unshift([time, sz[szNames[i]]]);
        }
        for (let i = cyNames.length; i--; ) {
          let time = cyNames[i].replace(/-/g, "/");
          this.shichang.chuang.unshift([time, cy[cyNames[i]]]);
        }
        this.upShiChangData();
      });
    },
    // 把市场数据存储为文件
    upShiChangData() {
      this.shichang.time = new Date().getTime();
      this.$axios({
        method: "post",
        url: `upShiChang`,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        data: this.shichang,
      });
    },
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
          excelCode = [];

        let xlsxs = XLSX.utils.sheet_to_json(worksheet, { range: this.range });
        // let xlsxs = XLSX.utils.sheet_to_json(worksheet, {
        //   // c:col 表示列，r:row 表示行 s:start 表示起始位置 e:end 表示结束位置
        //   s: { c: 0, r: 0 },
        //   e: { c: 1, r: 900 },
        // });
        xlsxs.forEach((t) => {
          if (this.readType) {
            // 选出excel里的基金，包括没有持仓数据的基金
            if (!excelCode.includes(t["代码"])) {
              this.zhengli.canUse.push({
                code: "" + t["代码"],
                name: "" + t["名字"],
              });
              excelCode.push("" + t["代码"]);
            } else {
              let tar = this.zhengli.chongfu.find((r) => r.code == t["代码"]);
              if (tar) {
                tar["num"]++;
                tar.name = "" + t["名字"];
              } else {
                // 选出excel里重复的
                this.zhengli.chongfu.push({
                  code: "" + t["代码"],
                  name: "" + t["名字"],
                  num: 2,
                });
              }
            }
          } else {
            let reg = /代码(.*)/gi;
            Object.keys(t).forEach((str) => {
              // if (t[str] == "007350") {
              //   console.log(t);
              // }
              if (reg.test(str)) {
                // 选出excel里的基金，包括没有持仓数据的基金
                if (!excelCode.includes("" + t[str])) {
                  this.zhengli.canUse.push({
                    code: "" + t[str],
                    name: "" + t["名字" + str.slice(2)],
                  });
                  excelCode.push("" + t[str]);
                } else {
                  let tar = this.zhengli.chongfu.find((r) => r.code == t[str]);
                  if (tar) {
                    tar["num"]++;
                    tar.name = "" + t["名字" + str.slice(2)];
                  } else {
                    // 选出excel里重复的
                    this.zhengli.chongfu.push({
                      code: "" + t[str],
                      name: "" + t["名字" + str.slice(2)],
                      num: 2,
                    });
                  }
                }
              }
            });
          }
        });
        this.getData();
      });
    },
    // 将股票存为excel
    makeExcel() {
      let obj = {};
      this.gupiao.forEach((t) => {
        if (t.hangye1) {
          if (!(t.hangye1 in obj)) {
            obj[t.hangye1] = {
              gupiao: [t.name],
              jijin: t.jijin,
            };
          } else {
            obj[t.hangye1].xiangxi = obj[t.hangye1].xiangxi
              ? obj[t.hangye1].xiangxi
              : t.hangye2;
            obj[t.hangye1].gupiao.push(t.name);
            obj[t.hangye1].jijin = Array.from(
              new Set([...obj[t.hangye1].jijin, ...t.jijin])
            );
          }
        }
      });
      let mergeNum = 1, // 越过第一行
        ws = XLSX.utils.json_to_sheet(
          [{ A: "行业", B: "行业详细", C: "股票", D: "基金" }],
          { skipHeader: true } // 输出时不自动添加header
        ),
        wb = XLSX.utils.book_new();
      ws["!merges"] = [];

      Object.keys(obj).forEach((t) => {
        let jijin = obj[t].jijin,
          gupiao = obj[t].gupiao;
        if (jijin.length >= gupiao.length) {
          let merge1 = {
            s: {
              //s为开始
              c: 0, //开始列  从0开始
              r: mergeNum, //开始取值范围 从0开始
            },
            e: {
              //e结束
              c: 0, //结束列
              //结束范围，行号的索引值。但实际上，行对应的索引值=表格里的行号-1
              // jijin.length只能得出一共有几行数据，length-1才是索引值
              r: jijin.length - 1 + mergeNum,
            },
          };
          let merge2 = {
            s: {
              //s为开始
              c: 1, //开始列  从0开始
              r: mergeNum, //开始取值范围 从0开始
            },
            e: {
              //e结束
              c: 1, //结束列
              r: jijin.length - 1 + mergeNum, //结束范围
            },
          };
          XLSX.utils.sheet_add_json(
            ws,
            jijin.map((s, index) => ({
              A: t,
              B: obj[t].xiangxi ? obj[t].xiangxi : "",
              C: gupiao[index] ? gupiao[index] : "",
              D: s,
            })),
            {
              skipHeader: true,
              origin: `A${mergeNum + 1}`, // origin：数据填充的起始单元格
            }
          );
          ws["!merges"].push(merge1, merge2);
          mergeNum += jijin.length;
        } else {
          let merge1 = {
            s: {
              //s为开始
              c: 0, //开始列
              r: mergeNum, //开始取值范围
            },
            e: {
              //e结束
              c: 0, //结束列
              r: mergeNum + gupiao.length - 1, //结束范围
            },
          };
          let merge2 = {
            s: {
              //s为开始
              c: 1, //开始列
              r: mergeNum, //开始取值范围
            },
            e: {
              //e结束
              c: 1, //结束列
              r: mergeNum + gupiao.length - 1, //结束范围
            },
          };
          XLSX.utils.sheet_add_json(
            ws,
            gupiao.map((s, index) => ({
              A: t,
              B: obj[t].xiangxi ? obj[t].xiangxi : "",
              C: s,
              D: jijin[index] ? jijin[index] : "",
            })),
            {
              skipHeader: true,
              origin: `A${mergeNum + 1}`,
            }
          );
          ws["!merges"].push(merge1, merge2);
          mergeNum += obj[t].gupiao.length;
        }
      });

      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${Math.floor(Math.random() * 100)}.xlsx`);
    },
    // 获取所有基金的持股
    getData() {
      // 获取所有基金的code
      let codes = this.zhengli.canUse.map((t) => "" + t.code);
      // 获取缓存的基金数据
      if (this.caches) {
        // 读取之前缓存的基金号
        let sessionCode = this.caches.canUse.map((t) => t.code),
          // 选出文件里有但缓存里没有的基金,需要去http获取数据
          needHttp = codes.filter((t) => !sessionCode.includes(t));
        // 可以看到持仓的基金
        this.zhengli.see = this.caches.see.filter((t) => {
          if (codes.includes(t.code)) {
            t.name = this.zhengli.canUse.find((s) => s.code == t.code).name;
            return t;
          }
        });
        this.zhengli.kong = this.caches.kong.filter((t) =>
          codes.includes(t.code)
        );
        this.zhengli.fenxi = this.caches.fenxi.filter((t) => {
          if (codes.includes(t.code)) {
            t.name = this.zhengli.canUse.find((s) => s.code == t.code).name;
            return t;
          }
        }); // 用到echart分析列表
        this.httpType(this.httptype, needHttp);
      } else {
        this.httpType(this.httptype, codes);
      }
    },
    // 切换发送获取数据的方式
    httpType(type, arrs) {
      if (type) {
        if (arrs.length) {
          this.httpEnd = arrs.length;
          // 控制请求间隔时间
          let inter = null; // 用来清除定时
          inter = setInterval(() => {
            if (this.httpEnd < 0) {
              clearInterval(inter);
              inter = null;
            } else {
              // 获取新增的基金数据
              this.useHttp([arrs[this.httpEnd]]);
              this.httpEnd--;
            }
          }, this.GetTime);
        } else {
          this.makeTongJi();
        }
      } else {
        if (arrs.length) {
          this.useHttp(arrs);
        } else {
          this.makeTongJi();
        }
      }
    },
    // 需要发送http获取数据
    async useHttp(codes) {
      for (let i = codes.length; i--; ) {
        if (codes[i]) {
          let all = [];
          // 获取持仓数据
          all.push(
            this.$axios({
              method: "get",
              url: `chicang/${codes[i]}`,
              headers: {
                "Content-Type": "text/html;charset=utf-8",
              },
            }).then((res) => {
              return res.data.stock;
            }),
            // 获取持仓比例数据
            this.$axios({
              method: "get",
              url: `bili/${codes[i]}`,
              headers: {
                "Content-Type": "application/javascript;charset=utf-8",
              },
            }).then((res) => {
              let bili = [];
              res
                .replace(/\/\*.+?\*\//gi, "")
                .split("var")
                .filter((t) => {
                  if (t.length) {
                    bili.push(t.trim().slice(0, -1));
                  }
                });
              return bili;
            }),
            // 获取基金详情
            this.$axios({
              method: "get",
              url: `xiangqing/${codes[i]}`,
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
            }).then((res) => {
              return res.data[0];
            }),
            this.$axios({
              method: "get",
              url: `paiming/${codes[i]}`,
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
            }),
            // 用天天基金拉数据
            // this.$axios({
            //   method: "get",
            //   url: `shouyiqushi/${codes[i]}`,
            //   headers: {
            //     "Content-Type": "application/json",
            //   },
            // }).then((res) => {
            //   let k = eval("(" + res.split("=")[1].slice(0, -1) + ")").split(
            //     "|"
            //   );
            //   return k;
            // }),

            // 获取基金自己的收益趋势，用同花顺拉数据
            this.$axios({
              method: "get",
              url: `shouyiqushi/${codes[i]}`,
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
            }).then((res) => {
              let k = JSON.parse(res.split("=")[1]),
                kk = k.map((t) => [
                  `${t[0].slice(0, 4)}/${t[0].slice(4, 6)}/${t[0].slice(6)}`,
                  t[1],
                ]);
              return kk;
            }),
            // 获取同类收益趋势
            this.$axios({
              method: "get",
              url: `tonglei/${codes[i]}`,
              headers: {
                "Content-Type": "application/json;charset=utf-8",
              },
            }).then((res) => {
              let k = Object.keys(res)
                .reverse()
                .map((t) => [t.replace(/-/g, "/"), res[t]]);
              return k;
            })
          );
          await Promise.all(all).then((res) => {
            // 基金持仓
            let obj = {
              shouyi: {
                one: [], // 基金自己
                two: [], // 同类平均
                three: [], // 沪深300
                four: [], // 中证500
                five: [], // 上证指数
                six: [], // 创业板指数
              },
            };
            if (res[0].length) {
              this.zhengli.see.push(...res[0]);
            } else {
              this.zhengli.kong.push(
                this.zhengli.canUse.find((k) => k.code == codes[i])
              );
            }
            // 基金持仓比例整理
            res[1].forEach((t) => {
              let arr = t.split("=").map((t) => t.trim());
              // 资产配置
              if (arr[0] == "Data_assetAllocation") {
                let k = JSON.parse(arr[1]).series;
                obj["peizhi"] = k.map((t) => {
                  return {
                    name: t.name != "净资产" ? t.name.slice(0, 2) + "" : "规模",
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
            // 收益排名
            if (res[3]) {
              let kk = res[3].nowCommonTypeRank,
                zz = {};
              if (kk) {
                Object.keys(kk).forEach((t) => {
                  zz[t] = [kk[t][0], kk[t][1]];
                  let num = +kk[t][2];
                  if (num > 75) {
                    zz[t][2] = 4;
                  }
                  if (num <= 75 && num > 50) {
                    zz[t][2] = 3;
                  }
                  if (num <= 50 && num > 25) {
                    zz[t][2] = 2;
                  }
                  if (num <= 25) {
                    zz[t][2] = 1;
                  }
                  switch (t) {
                    case "week":
                      zz[t][3] = "近1周";
                      zz[t][4] = 1;
                      break;
                    case "month":
                      zz[t][3] = "近1月";
                      zz[t][4] = 2;
                      break;
                    case "tmonth":
                      zz[t][3] = "近3月";
                      zz[t][4] = 3;
                      break;
                    case "hyear":
                      zz[t][3] = "近6月";
                      zz[t][4] = 4;
                      break;
                    case "year":
                      zz[t][3] = "近1年";
                      zz[t][4] = 5;
                      break;
                    case "twoyear":
                      zz[t][3] = "近2年";
                      zz[t][4] = 6;
                      break;
                    case "tyear":
                      zz[t][3] = "近3年";
                      zz[t][4] = 7;
                      break;
                    case "fyear":
                      zz[t][3] = "近5年";
                      zz[t][4] = 8;
                      break;
                    case "nowyear":
                      zz[t][3] = "今年来";
                      zz[t][4] = 9;
                      break;
                  }
                });
              } else {
                console.log(codes[i]);
              }

              let sortSS = [];
              Object.keys(zz).forEach((t) => {
                sortSS.push({
                  name: t,
                  sort: zz[t][4],
                });
              });
              sortSS = sortSS.sort((a, b) => a.sort - b.sort);
              obj["paiming"] = {};
              for (let i = 0; i < sortSS.length; i++) {
                obj["paiming"][sortSS[i].name] = zz[sortSS[i].name];
              }
            }
            // 用天天基金拉数据
            // for (let i = res[4].length; i--; ) {
            //   let sp = res[4][i].split("_");
            //   if (sp.length == 4) {
            //     obj.shouyi[res[2].name].unshift([
            //       sp[0],
            //       sp[1] ? sp[1] : "0.00",
            //     ]);
            //   }
            // }

            // 自己的收益趋势，用同花顺拉数据
            for (let i = res[4].length; i--; ) {
              let time = res[4][i][0],
                jishu = parseFloat(res[4][0][1]),
                num = Math.abs(
                  ((parseFloat(res[4][i][1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj.shouyi.one.unshift([time, num]);
            }
            let jishuTime, tonglei, hushen, zhong, shang, chuang;
            try {
              jishuTime = obj.shouyi.one[0][0];
              tonglei = res[5].filter(
                (t) => new Date(t[0]) >= new Date(jishuTime)
              );
              hushen = this.shichang.hushen.filter(
                (t) => new Date(t[0]) >= new Date(jishuTime)
              );
              zhong = this.shichang.zhong.filter(
                (t) => new Date(t[0]) >= new Date(jishuTime)
              );
              shang = this.shichang.shang.filter(
                (t) => new Date(t[0]) >= new Date(jishuTime)
              );
              chuang = this.shichang.chuang.filter(
                (t) => new Date(t[0]) >= new Date(jishuTime)
              );
            } catch {
              console.log(obj.shouyi);
              console.log(res[2]);
              console.log(res[5]);
            }
            // 同类平均收益趋势
            for (let i = tonglei.length; i--; ) {
              let time = tonglei[i][0],
                jishu = parseFloat(tonglei[0][1]),
                num = Math.abs(
                  ((parseFloat(tonglei[i][1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj.shouyi.two.unshift([time, num]);
            }
            // 整理沪深的展示数据
            for (let i = hushen.length; i--; ) {
              let tar = hushen[i],
                jishu = +hushen[0][1],
                num = Math.abs(
                  ((parseFloat(tar[1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj["shouyi"].three.unshift([tar[0], num]);
            }
            // 整理中证500的展示数据
            for (let i = zhong.length; i--; ) {
              let tar = zhong[i],
                jishu = +zhong[0][1],
                num = Math.abs(
                  ((parseFloat(tar[1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj["shouyi"].four.unshift([tar[0], num]);
            }
            // 整理上证指数的展示数据
            for (let i = shang.length; i--; ) {
              let tar = shang[i],
                jishu = +shang[0][1],
                num = Math.abs(
                  ((parseFloat(tar[1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj["shouyi"].five.unshift([tar[0], num]);
            }
            // 整理创业板指数的展示数据
            for (let i = chuang.length; i--; ) {
              let tar = chuang[i],
                jishu = +chuang[0][1],
                num = Math.abs(
                  ((parseFloat(tar[1]) - jishu) / jishu) * 100
                ).toFixed(2);
              obj["shouyi"].six.unshift([tar[0], num]);
            }
            // 基金详细数据
            obj.code = res[2].code; // 基金号
            obj.name = this.zhengli.canUse.find((t) => t.code == codes[i]).name; // 基金名称
            obj.theme =
              res[2].themeList && res[2].themeList.length
                ? res[2].themeList.map((t) => t.field_name)
                : []; // 概念
            obj.yue_1 = res[2].month; // 近1月
            obj.yue_3 = res[2].tmonth; // 近3月
            obj.yue_6 = res[2].hyear; // 近6月
            obj.nian = res[2].year; // 近1年
            obj.nowyear = res[2].nowyear; // 今年
            obj.tyear = res[2].tyear; // 成立以来
            obj.jingzhi = res[2].net; // 单位净值
            obj.jingTime = res[2].enddate; // 净值计算时间
            obj.zhangfu = res[2].rate; // 昨日涨幅
            obj.chengli = res[2].clrq; // 成立时间
            obj.feilv = res[2].sgfl; // 购买费率
            obj.fengxian = res[2].levelOfRisk; // 风险等级
            obj.leixing = res[2].fundtype; // 基金类型
            obj.jingli = res[2].manager; // 基金经理
            this.zhengli.fenxi.push(obj);
          });
        }
      }
      this.makeTongJi();
    },
    // 将多维数组，拉成一维数组，并去除空数组
    async makeTongJi() {
      if (this.httpEnd < 0) {
        // 统计数据
        for (let i = this.zhengli.see.length; i--; ) {
          let codes = this.gupiao.map((t) => t.code), // 股票代码数组
            see = this.zhengli.see[i],
            jijinname = this.zhengli.canUse.find((t) => t.code == see.code)
              .name;
          if (!codes.includes(see.zcCode)) {
            this.gupiao.push({
              id: i,
              zhangfu: see.rate, // 涨幅
              code: see.zcCode, //  股票代码
              name: see.zcName, // 股票名称
              jijin: [jijinname], // 持有该股票的基金名称
            });
          } else {
            let gupiao = this.gupiao.find((t) => t.code == see.zcCode); // 找到股票数据
            if (!gupiao.jijin.includes(jijinname)) {
              gupiao.jijin.push(jijinname);
            }
          }
        }
        // 统计有几个股票被持有1次
        this.gupiao.forEach((t) => {
          if (t.jijin.length == 1) {
            this.single++;
          }
        });
        // 当前页面的股票数据排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return b.jijin.length - a.jijin.length;
        });
        // 如果有缓存数据
        if (this.caches && this.caches.gupiao) {
          // 当前页面的股票
          let httpArr = [];
          // 从缓存中找到有行业数据的当前页面中出现的股票
          for (let i = this.gupiao.length; i--; ) {
            let cachesTar = this.caches.gupiao.find(
              (t) => t.code == this.gupiao[i].code && t.hangye1
            ); // 从所有股票中找到当前页面用到的股票
            if (cachesTar) {
              this.gupiao[i] = Object.assign(cachesTar, this.gupiao[i]);
            } else {
              httpArr.push(this.gupiao[i]);
            }
          }
          if (httpArr.length) {
            await this.getHangYe(httpArr);
          }
        } else {
          await this.getHangYe(this.gupiao);
        }

        // 根据股票持仓进行划分
        for (let i = this.gupiao.length; i--; ) {
          let keys = Object.keys(this.gupiaoShiChang),
            t = this.gupiao[i];
          if (t.hangye1) {
            if (!keys.includes(t.hangye1)) {
              this.gupiaoShiChang[t.hangye1] = {
                jijin: [],
                shichang: t.shichang,
                xiangxi: t.hangye2,
                name: [t.name],
              };
            } else {
              let kk = this.gupiaoShiChang[t.hangye1].name;
              if (!kk.includes(t.name)) {
                kk.push(t.name);
              }
            }
          }
          // 将持有该股票的基金记录下来
          t.jijin.forEach((f) => {
            if (
              this.gupiaoShiChang[t.hangye1] &&
              !this.gupiaoShiChang[t.hangye1].jijin.includes(f)
            ) {
              this.gupiaoShiChang[t.hangye1].jijin.push(f);
            }
          });
        }

        let sortedObjKeys = Object.keys(this.gupiaoShiChang),
          linshi = [];
        for (let i = sortedObjKeys.length; i--; ) {
          linshi.push({
            name: sortedObjKeys[i],
            num: this.gupiaoShiChang[sortedObjKeys[i]].jijin.length,
            data: this.gupiaoShiChang[sortedObjKeys[i]],
          });
        }

        this.sortGupiaoShiChang = linshi.sort((a, b) => b.num - a.num);

        this.chartList = [];
        for (let i = 0; i < this.zhengli.fenxi.length; i += 2) {
          this.chartList.push(this.zhengli.fenxi.slice(i, i + 2));
        }
        await this.makeColor();
        await this.leiXingTongJi();
        await this.chongHeFenXi();
        this.showAll = true;
        let aaa = [];
        if (this.caches && this.caches.gupiao) {
          aaa.push(...this.caches.gupiao);
        }
        aaa.push(...this.gupiao);
        // 将所有股票数据合到一起，数量最多
        let kk = aaa.reduce((all, now) => {
          let k = all.find((s) => s.code == now.code);
          if (!k) {
            all.push(now);
          } else {
            k = Object.assign(k, now);
          }
          return all;
        }, []);
        this.zhengli["time"] = new Date().getTime();

        // 去除未能编译的文字
        // for (let i = kk.length; i--; ) {
        //   let reg = /�/gi;
        //   if (
        //     (kk[i].hangye1 && reg.test(kk[i].hangye1)) ||
        //     (kk[i].hangye2 && reg.test(kk[i].hangye2)) ||
        //     (kk[i].name && reg.test(kk[i].name)) ||
        //     (kk[i].shichang && reg.test(kk[i].shichang))
        //   ) {
        //     kk.splice(i, 1);
        //   }
        // }
        // for (let i = this.zhengli.see.length; i--; ) {
        //   let reg = /�/gi;
        //   if (
        //     (this.zhengli.see[i].hangye &&
        //       reg.test(this.zhengli.see[i].hangye)) ||
        //     (this.zhengli.see[i].name && reg.test(this.zhengli.see[i].name)) ||
        //     (this.zhengli.see[i].zcName && reg.test(this.zhengli.see[i].zcName))
        //   ) {
        //     this.zhengli.see.splice(i, 1);
        //   }
        // }

        // 存储本页面使用的数据
        await this.$axios({
          method: "post",
          url: `savePageData`,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          data: { ...this.zhengli, gupiao: kk },
        }).then((res) => {
          // 只有获取数据的请求全部成功且结束后，存储本次的请求数据
          if (res) {
            console.log("数据已经存储完毕！");
            // this.lllllll();
          } else {
            console.log("数据无法存储！");
          }
          if (this.showFenXi) {
            this.makeXiangQingChart();
            this.changeTime(50, "");
          }
        });
      }
    },
    lllllll() {
      let shipin = [
          "贵州茅台",
          "五粮液",
          "泸州老窖",
          "山西汾酒",
          "伊利股份",
          "洋河股份",
          "今世缘",
          "安井食品",
          "华润啤酒",
          "金龙鱼",
          "酒鬼酒",
          "顺鑫农业",
          "青岛啤酒",
          "海天味业",
          "古井贡酒",
          "农夫山泉",
          "元祖股份",
          "天味食品",
          "汤臣倍健",
          "百润股份",
          "桃李面包",
          "洽洽食品",
          "双汇发展",
          "口子窖",
          "绝味食品",
          "恒顺醋业",
          "光明乳业",
          "蒙牛乳业",
        ],
        xinengyuan = [
          "宁德时代",
          "隆基股份",
          "立讯精密",
          "通威股份",
          "汇川技术",
          "亿纬锂能",
          "赣锋锂业",
          "华友钴业",
          "阳光电源",
          "捷佳伟创",
          "天赐材料",
          "先导智能",
          "万华化学",
          "新宙邦",
          "中航光电",
          "当升科技",
          "紫光国微",
          "迈为股份",
          "欣旺达",
          "舜宇光学科技",
          "TCL科技",
          "航天电",
          "睿创微",
          "中国巨",
          "信义光",
          "福斯特",
          "宏达电子",
          "卓胜微",
          "京东方A",
          "韦尔股份",
          "宏发股份",
          "歌尔股份",
          "盛新锂能",
          "西部超导",
          "寒锐钴业",
          "国瓷材料",
          "雅克科技",
          "火炬电子",
          "杉杉股份",
          "风华高科",
          "锦浪科技",
          "鹏鼎控股",
          "北方华创",
          "蓝思科技",
          "鸿远电子",
          "富瀚微",
          "龙蟠科技",
          "天齐锂业",
          "多氟多",
          "振华科技",
          "圣邦股份",
          "特斯拉",
          "德赛电池",
          "嘉元科技",
          "杭可科技",
          "派能科技",
          "正泰电器",
          "天奈科技",
          "新洁能",
          "士兰微",
          "锐科激光",
          "容百科技",
          "法拉电子",
          "东方日升",
          "德方纳米",
          "天华超净",
          "至纯科技",
          "闻泰科技",
          "赢合科技",
          "亿华通",
          "蓝特光学",
          "璞泰来",
          "大全新能源",
          "北控城市资源",
          "ASM Pacific",
        ],
        keji = [
          "腾讯控股",
          "美团-W",
          "海康威视",
          "广联达",
          "小米集团-W",
          "金山办公",
          "恒生电子",
          "深信服",
          "金蝶国际",
          "宝信软件",
          "用友网络",
          "吉比特",
          "完美世界",
          "亿联网络",
          "中科创达",
          "中兴通讯",
          "脸谱网",
          "新东方",
          "东方通",
          "三七互娱",
          "中国长城",
          "万兴科技",
          "超图软件",
          "久远银海",
          "明源云",
          "中国软件国际",
          "京东集团-SW",
        ],
        xiaofei = [
          "美的集团",
          "中国中免",
          "海尔智家",
          "分众传媒",
          "万科A",
          "顺丰控股",
          "恩捷股份",
          "格力电器",
          "安踏体育",
          "石头科技",
          "宋城演艺",
          "保利地产",
          "科沃斯",
          "春秋航空",
          "亚马逊",
          "思摩尔国际",
          "欧派家居",
          "芒果超媒",
          "李宁",
          "周大生",
          "锦江酒店",
          "新宝股份",
          "敏华控股",
          "海信家电",
          "金科股份",
          "密尔克卫",
          "九毛九",
          "中公教育",
          "上海机场",
          "苏泊尔",
          "视源股份",
          "尚品宅配",
          "盈趣科技",
          "申洲国际",
          "创科实业",
          "江山欧派",
          "隆平高科",
          "龙大肉食",
          "晨光文具",
          "希望教育",
          "新高教集团",
          "华夏视听教育",
          "周黑鸭",
        ],
        yiliao = [
          "迈瑞医疗",
          "长春高新",
          "恒瑞医药",
          "药明康德",
          "爱尔眼科",
          "泰格医药",
          "欧普康视",
          "智飞生物",
          "药明生物",
          "通策医疗",
          "金域医学",
          "康泰生物",
          "华海药业",
          "云南白药",
          "药石科技",
          "健帆生物",
          "康龙化成",
          "人福医药",
          "贝达药业",
          "爱美客",
          "新和成",
          "美年健康",
          "三诺生物",
          "片仔癀",
          "博腾股份",
          "信达生物",
          "老百姓",
          "迈克生物",
          "卫宁健康",
          "英科医疗",
          "安图生物",
          "益丰药房",
          "昭衍新药",
          "锦欣生殖",
          "司太立",
          "通化东宝",
          "百济神州",
          "甘李药业",
          "丽珠集团",
          "万泰生物",
          "九典制药",
          "九强生物",
          "健康元",
          "国药一致",
          "迪安诊断",
          "蓝帆医疗",
          "达安基因",
          "一心堂",
          "乐普医疗",
          "马应龙",
          "中新药业",
          "羚锐制药",
          "同仁堂",
          "康弘药业",
          "以岭药业",
          "众生药业",
          "东阿阿胶",
          "华兰生物",
          "国际医学",
          "康方生物-B",
          "启明医疗-B",
          "青松股份",
          "微创医疗",
        ],
        zhizao = [
          "三一重工",
          "海大集团",
          "东方雨虹",
          "紫金矿业",
          "荣盛石化",
          "恒立液压",
          "日月股份",
          "扬农化工",
          "华鲁恒升",
          "桐昆股份",
          "航发动力",
          "龙蟒佰利",
          "永兴材料",
          "太阳纸业",
          "中航高科",
          "神火股份",
          "旗滨集团",
          "西部矿业",
          "华测检测",
          "坚朗五金",
          "光威复材",
          "国瓷材料",
          "鸿路钢构",
          "杰瑞股份",
          "恒力石化",
          "良信股份",
          "宝钛股份",
          "菲利华",
          "中简科技",
          "晶盛机电",
          "航天发展",
          "春风动力",
          "伟星新材",
          "玉禾田",
          "联化科技",
          "洛阳钼业",
          "陕西煤业",
          "中环股份",
          "安车检测",
          "牧原股份",
          "圣农发展",
          "中航沈飞",
          "卫星石化",
          "高德红外",
          "赤峰黄金",
          "埃斯顿",
          "华润万象生活",
          "ST抚钢",
          "三友化工",
          "海容冷链",
          "华能水电",
          "博汇纸业",
          "中南建设",
          "中直股份",
          "中国西电",
          "中国船舶",
          "景嘉微",
          "中密控股",
          "上海沪工",
          "*ST湘电",
          "洪都航空",
          "阳光城",
          "爱乐达",
          "彤程新材",
          "方大特钢",
          "浙富控股",
          "北新建材",
          "航发控制",
          "顺发恒业",
          "浙江鼎力",
          "中国神华",
          "淮北矿业",
          "南山铝业",
          "兖州煤业",
          "云南铜业",
          "云铝股份",
          "隆华科技",
          "雅化集团",
          "铂力特",
          "信义玻璃",
          "中车时代电气",
        ],
        jinrong = [
          "中国平安",
          "东方财富",
          "招商银行",
          "宁波银行",
          "兴业银行",
          "平安银行",
          "中国太保",
          "常熟银行",
          "中信证券",
          "新华保险",
          "香港交易所",
          "建设银行",
          "工商银行",
          "兴业证券",
          "成都银行",
          "中国光大银行",
          "中国光大控股",
          "洛斯保险",
        ],
        qiche = [
          "长城汽车",
          "吉利汽车",
          "星宇股份",
          "比亚迪",
          "福耀玻璃",
          "均胜电子",
          "三花智控",
          "比亚迪股份",
          "宇通客车",
          "长安汽车",
          "科达利",
          "永达汽车",
          "赛轮轮胎",
          "华域汽车",
          "玲珑轮胎",
          "敏实集团",
          "科博达",
          "北汽蓝谷",
          "威孚高科",
          "上汽集团",
          "回天新材",
          "耐世特",
          "美东汽车",
        ];
      let arr = [[], [], [], [], [], [], [], []];
      for (let i = this.zhengli.see.length; i--; ) {
        let tar = this.zhengli.see[i];
        if (shipin.includes(tar.zcName) && !arr[0].includes(tar.name)) {
          arr[0].unshift(tar.name);
        }
        if (xinengyuan.includes(tar.zcName) && !arr[1].includes(tar.name)) {
          arr[1].unshift(tar.name);
        }
        if (keji.includes(tar.zcName) && !arr[2].includes(tar.name)) {
          arr[2].unshift(tar.name);
        }
        if (xiaofei.includes(tar.zcName) && !arr[3].includes(tar.name)) {
          arr[3].unshift(tar.name);
        }
        if (yiliao.includes(tar.zcName) && !arr[4].includes(tar.name)) {
          arr[4].unshift(tar.name);
        }
        if (zhizao.includes(tar.zcName) && !arr[5].includes(tar.name)) {
          arr[5].unshift(tar.name);
        }
        if (jinrong.includes(tar.zcName) && !arr[6].includes(tar.name)) {
          arr[6].unshift(tar.name);
        }
        if (qiche.includes(tar.zcName) && !arr[7].includes(tar.name)) {
          arr[7].unshift(tar.name);
        }
      }
      console.log(arr);
    },
    // 用来获取股票行业数据
    async getHangYe(arr) {
      let codeArrs = [[], []];
      // 区分内地和香港
      arr.forEach((t) => {
        if (t.code.length == 6 && !new RegExp("^hk", "i").test(t.code)) {
          codeArrs[0].push(t);
        }
        if (new RegExp("^hk", "i").test(t.code)) {
          codeArrs[1].push(t);
        }
      });
      for (let i = arr.length; i--; ) {
        let reg = /^hk/i,
          reg1 = /\d+/g;
        if (
          arr[i].code.length == 6 &&
          !reg.test(arr[i].code) &&
          reg1.test(arr[i].code.slice(2))
        ) {
          // if (arr[i].code !== "005930") {
          // 获取内地的
          await this.$axios({
            method: "get",
            url: `hangyeDaLu/${arr[i].code}`,
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => {
            arr[i]["hangye1"] = res.jbzl.sshy;
            arr[i]["hangye2"] = res.jbzl.sszjhhy;
            arr[i]["shichang"] = res.jbzl.ssjys;
            let reg = /.+�+/gi;
            if (reg.test("" + arr[i]["name"])) {
              arr[i]["name"] = res.SecurityShortName;
            }
          });
          // } else {
          // // 有一些股票无法获取到数据，只能暂时删除
          //  console.log(arr[i])
          //   let inde = this.caches.gupiao.findIndex((t) => t.code == "005930");
          //   this.caches.gupiao.splice(inde, 1);
          //        let inde2 = this.caches.gupiao.findIndex((t) => t.code == "005930");
          //        console.log(inde2)
          // }
        } else if (
          new RegExp("^hk", "i").test(arr[i].code) &&
          reg1.test(arr[i].code.slice(2))
        ) {
          // 获取香港的
          await this.$axios({
            method: "get",
            url: `hangyeHK/${"0" + arr[i].code.slice(2)}`,
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
          }).then((res) => {
            if (res.gszl) {
              arr[i]["hangye1"] = res.gszl.sshy;
              arr[i]["shichang"] = res.zqzl.jys;
              let reg = /.+�+/gi;
              if (reg.test("" + arr[i]["name"])) {
                arr[i]["name"] = res.zqzl.zqjc;
              }
            }
          });
        }
      }
    },
    makeChart() {
      if (this.showFenXi) {
        this.makeXiangQingChart();
        this.changeTime(50, "");
      }
    },
    // 基金类型统计
    leiXingTongJi() {
      let j = require("../../leixing.json"),
        k = this.zhengli.fenxi;
      j.forEach((t) => {
        let leixing = Object.keys(this.jijinType);
        if (!leixing.includes(t[1])) {
          this.jijinType[t[1]] = [];
        }
        let z = k.find((d) => d.code == t[0]);
        if (z && !this.jijinType[t[1]].includes(z.name)) {
          this.jijinType[t[1]].push(z.name);
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
      for (let i = this.zhengli.see.length; i--; ) {
        let zz = Object.keys(this.gupiaoShiChang),
          name = this.zhengli.canUse.find(
            (g) => g.code == this.zhengli.see[i].code
          ).name;
        for (let k = zz.length; k--; ) {
          let hy = this.gupiaoShiChang[zz[k]];
          if (
            hy.jijin.includes(name) &&
            hy.name.includes(this.zhengli.see[i].zcName)
          ) {
            this.zhengli.see[i]["hangye"] = zz[k];
          }
        }
      }
      for (let i = this.zhengli.canUse.length; i--; ) {
        this.zhengli.canUse[i]["gupiao"] = this.zhengli.see.filter(
          (t) => t.code == this.zhengli.canUse[i].code
        );
      }
      let arrs = [],
        t = this.zhengli.canUse;
      for (let h = t.length; h--; ) {
        if (t[h].gupiao.length) {
          let gupiao = t[h].gupiao.map((k) => k.zcCode); // 选出当前基金所持股票的代码
          for (let i = t.length; i--; ) {
            if (
              // 排除自己且其他基金有股票数据
              t[i].code != t[h].code &&
              t[i].gupiao.length
            ) {
              let d = t[i].gupiao.map((k) => k.zcCode),
                num = 0;
              gupiao.forEach((j) => {
                if (d.includes(j)) {
                  num++;
                }
              });
              if (num > this.chongheNum) {
                let a = new Set(t[h].gupiao.map((d) => d.zcCode)),
                  b = new Set(t[i].gupiao.map((d) => d.zcCode)),
                  kk = [...new Set([...a].filter((x) => b.has(x)))], // 取交集
                  linshi = t[h].gupiao
                    .filter((t) => kk.includes(t.zcCode))
                    .map((t) => t.zcName),
                  obj = {
                    one: t[h],
                    oneOther: t[h].gupiao
                      .map((d) => d.zcName)
                      .filter((f) => !linshi.includes(f)),
                    two: t[i],
                    twoOther: t[i].gupiao
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
      }

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
      this.chonghe = this.chonghe.sort((a, b) => b.num - a.num);
      for (let i = this.chonghe.length; i--; ) {
        let gupiaos = [
          ...this.chonghe[i].one.gupiao,
          ...this.chonghe[i].two.gupiao,
        ];
        if (this.chonghe[i].chong.length) {
          this.chonghe[i].chong.forEach((d, ind) => {
            let tar = gupiaos.find((t) => t.zcName == d);
            if (tar && tar.hangye) {
              this.chonghe[i].chong[ind] = d;
            }
          });
        }
        if (this.chonghe[i].oneOther.length) {
          this.chonghe[i].oneOther.forEach((d, ind) => {
            let tar = gupiaos.find((t) => t.zcName == d);
            if (tar && tar.hangye) {
              this.chonghe[i].oneOther[ind] = d;
            }
          });
        }
        if (this.chonghe[i].twoOther.length) {
          this.chonghe[i].twoOther.forEach((d, ind) => {
            let tar = gupiaos.find((t) => t.zcName == d);
            if (tar && tar.hangye) {
              this.chonghe[i].twoOther[ind] = d;
            }
          });
        }
      }

      this.chiCangFenXi = this.zhengli.canUse.reduce((all, now) => {
        if (now.gupiao && now.gupiao.length) {
          all.push(now);
        }
        return all;
      }, []);
      // 根据持有量排序
      for (let i = this.chiCangFenXi.length; i--; ) {
        this.chiCangFenXi[i].gupiao = this.chiCangFenXi[i].gupiao.sort(
          (a, b) => +b.ccRate - +a.ccRate
        );
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
    seeGuPiao(e, c) {
      e.preventDefault();
      let target = e.target;
      target.classList.add("toChartRightClick");
      let x = e.offsetX,
        y = e.offsetY, // 找到鼠标右键单击时的相对坐标
        spans = document.createElement("span");
      let str = `position: absolute;background: rgb(133, 240, 241);
        padding: 2px 6px;
        width: 100px !important;
        cursor: pointer;
        border-radius: 3px;
        text-align:center;
        color: rgb(0, 166, 14);`;
      if (target.offsetWidth - 50 > x) {
        spans.style = `${str}left:${x}px;top:${y - 15}px;
       `;
      } else {
        spans.style = `${str}left:${target.offsetWidth - 50}px;top:${
          y - 15
        }px;`;
      }

      spans.innerHTML = "点击打开同花顺";
      spans.addEventListener("click", () => {
        window.open(`http://stockpage.10jqka.com.cn/${c}`);
      });
      target.appendChild(spans);
      setTimeout(() => {
        target.classList.remove("toChartRightClick");
        target.removeChild(spans);
      }, 3000);
    },
    // 绘制每个基金的echrts 饼图
    makeXiangQingChart() {
      this.zhengli.fenxi.forEach(async (t) => {
        new Promise((res) => {
          let kk = setInterval(() => {
            let tar = this.$refs[`${t.code}_pie`];
            if (tar) {
              clearInterval(kk);
              hua(tar[0], t, res);
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
              center: ["34%", "48%"], // 图形位置
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
    // 转换时间
    makeTime(e) {
      let da = new Date();
      let one1 = da.getFullYear() - e; //  取得年
      let one2 =
        da.getMonth() + 1 < 10 ? `0${da.getMonth() + 1}` : da.getMonth() + 1; //  取得月
      let one3 = da.getDate() < 10 ? `0${da.getDate()}` : da.getDate(); //  取得日
      return `${one1}/${one2}/${one3}`;
    },
    // 修改收益走势时间段
    changeTime(e, target) {
      new Promise((res) => {
        let time = this.makeTime(e);
        if (!target) {
          let data = this.zhengli.fenxi.map((t) => {
            let shouyi = t.shouyi,
              obj = {
                code: t.code,
                name: t.name,
              };
            Object.keys(shouyi).forEach((name) => {
              obj[name] = shouyi[name].filter(
                (d) => new Date(d[0]) > new Date(time)
              );
            });
            return obj;
          });
          res(data);
        } else {
          let tar = this.zhengli.fenxi.find((t) => t.code == target),
            obj = {
              code: target,
              name: tar.name,
            };
          Object.keys(tar.shouyi).forEach((name) => {
            obj[name] = tar.shouyi[name].filter(
              (d) => new Date(d[0]) > new Date(time)
            );
          });
          res([obj]);
        }
      }).then((d) => {
        this.makeShouYiChart(d);
      });
    },
    // 绘制每个基金的收益走势图
    makeShouYiChart(showData) {
      showData.forEach((t) => {
        new Promise((res) => {
          let kk = setInterval(() => {
            let tar = this.$refs[`${t.code}_qushi`];
            if (tar) {
              clearInterval(kk);
              let endData = {},
                names = Object.keys(t);
              for (let i = names.length; i--; ) {
                if (names[i] != "code" && names[i] != "name") {
                  switch (names[i]) {
                    case "one":
                      endData[t.name] = t[names[i]];
                      break;
                    case "two":
                      endData["同类平均"] = t[names[i]];
                      break;
                    case "three":
                      endData["沪深300"] = t[names[i]];
                      break;
                    case "four":
                      endData["中证500"] = t[names[i]];
                      break;
                    case "five":
                      endData["上证指数"] = t[names[i]];
                      break;
                    case "six":
                      endData["创业板指数"] = t[names[i]];
                      break;
                  }
                }
              }
              qushi(tar[0].children[1], endData, t.name, res);
            }
          });
        });
      });
      // 执行画图
      function qushi(tar, datas, jiJinName, res) {
        let option = {
          color: [
            "#7a77be", // 创业板指数
            "#9500ff", // 上证指数
            "#0290af", // 中证500
            "#070100", // 沪深300
            "#e78325", // 同类平均
            "#ff0202", // 当前基金
          ],
          title: {
            itemGap: 0,
            text: "收益走势对比图",
            textStyle: {
              fontSize: 12,
              lineHeight: 14,
              height: 20,
              fontWeight: "bold",
              color: "#bb5100",
            },
            padding: 0,
            left: 3,
            top: 20,
          },
          legend: {
            right: 10,
            top: 40,
            padding: 0,
            itemGap: 13,
            itemWidth: 10,
            itemHeight: 8,
            data: Object.keys(datas).reverse(),
            borderWidth: 0,
            textStyle: {
              fontSize: 12,
            },
          },
          grid: {
            left: 2,
            right: 5,
            bottom: 0,
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(50,50,50,0.8)",
            axisPointer: {
              type: "cross",
              label: {
                fontSize: 10,
                backgroundColor: "rgba(50,50,50,0.7)",
                color: "#08d62e",
                formatter: (t) => {
                  if (t.axisDimension == "x") {
                    return `${t.value}`;
                  } else {
                    return `${t.value.toFixed(2)} %`;
                  }
                },
              },
            },
            textStyle: {
              fontSize: 12,
            },
            triggerOn: "mousemove",
            hideDelay: 10,
            formatter: (e) => {
              let str = "";
              e.forEach((d) => {
                let kk = datas[jiJinName].find(
                  (t) => t[0].slice(5) == d.axisValue
                )[0];
                if (!str) {
                  str += `<p style="font-size:14px;color:#ffaa16;padding-right:20px;">${kk}</p>`;
                }
                str += `<div style="display:flex;justify-content:space-between;">
                          <p style="width:calc(100% - 52px);text-align:right;">${d.seriesName} :&nbsp;</p>
                          <p style="width:50px;text-align:left;color:#ffaa16;flex-shrink:0;">${d.value}%</p>
                        </div>`;
              });
              return str;
            },
          },
          xAxis: {
            type: "category",
            axisLine: {
              // x轴线设置
              // show: false,
              lineStyle: {
                color: "#b9b8c0",
                width: 0.5,
              },
            },
            axisLabel: {
              // x轴刻度文字设置
              color: "#000",
              fontSize: 9,
              fontWeight: "bold",
              margin: 7,
              align: "center",
              padding: [3, 0, 0, 0],
            },
            axisTick: {
              // 坐标刻度标尺点设置
              length: 3,
            },
            splitLine: {
              show: false,
            },
            data: datas[jiJinName].map((t) => t[0].slice(5)),
          },
          yAxis: {
            minInterval: 2,
            axisLine: {
              lineStyle: {
                color: "#b9b8c0",
              },
            },
            axisTick: {
              // 坐标刻度标尺点设置
              length: 3,
            },
            axisLabel: {
              color: "#165cff",
              fontSize: 10,
              formatter: "{value}%",
              margin: 6,
            },
          },
          series: Object.keys(datas).map((n) => {
            return {
              type: "line",
              symbol: "pin",
              symbolSize: 4,
              showSymbol: false,
              name: n,
              lineStyle: {
                width: 0.6,
              },
              data: datas[n].map((t) => t[1]),
            };
          }),
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
        let names = this.jingliList.map((g) => g.name),
          obj = {};
        if (!names.length || !names.includes(t.jingli)) {
          obj["name"] = t.jingli; // 基金经理
          obj["jijin"] = [t.name]; // 基金名称
          this.jingliList.push(obj);
        } else {
          let kk = this.jingliList.find((s) => s.name == t.jingli);
          if (!kk.jijin.includes(t.name)) {
            kk.jijin.push(t.name);
          }
        }
        // 涉及的概念
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
    toSort() {
      if (this.chiyou) {
        //  按被持仓次数排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return b.jijin.length - a.jijin.length;
        });
      } else {
        //  按被日涨幅排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return a.jijin.length - b.jijin.length;
        });
      }
      this.chiyou = !this.chiyou;
    },
    toSort1() {
      if (this.zhang) {
        //  按被持仓次数排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return a.zhangfu - b.zhangfu;
        });
      } else {
        //  按被日涨幅排序
        this.gupiao = this.gupiao.sort((a, b) => {
          return b.zhangfu - a.zhangfu;
        });
      }
      this.zhang = !this.zhang;
    },
    // 根据股票名称查询
    search() {
      if (this.jijins != "") {
        let reg = new RegExp(this.jijins, "gi"),
          code = this.gupiao.find((t) => reg.test(t.name)).code;
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
        }, 3000);
      }
    },
    // 清除已经获取的市场数据，重新拉取
    clearShiChang() {
      this.$axios({
        method: "get",
        url: `clearShiChang`,
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
      }).then((res) => {
        if (res) {
          this.getShiChang();
        }
      });
    },
    // 清除已经获取的基金数据，重新拉取
    clearJiJin() {
      if (confirm("确定要重新获取所有数据吗？")) {
        this.$axios({
          method: "get",
          url: `clearJiJin`,
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        }).then((res) => {
          if (res) {
            this.reGetData();
          }
        });
      }
    },
    // 清除缓存，重新拉取数据
    reGetData() {
      this.jijins = ""; // 搜索基金用
      // 将读取的excel文件进行数据整理
      this.zhengli = {
        chongfu: [], // excel里重复添加的基金
        canUse: [], // 用来操作的读取excel后的原始数据
        see: [], // 可以看到持仓的基金
        kong: [], // 看不到持仓数据的基金
        fenxi: [],
        time: "",
      };
      this.shichang = {
        // 证券市场数据
        hushen: [], // 沪深300
        zhong: [], // 中证500
        shang: [], // 上证指数
        chuang: [], // 上证指数
        time: "",
      };
      this.single = 0; // 记录只被持有一次的个数
      this.gupiao = []; // 记录根据股票进行分析的基金
      this.jingliList = []; // 根据基金经理区分基金
      this.gaiNian = {}; // 存储根据概念区分基金
      this.chonghe = []; // 用来存储有重合的基金
      this.jijinType = {}; // 基金类型统计
      this.colorObj = {}; // 存储不同概念的颜色
      this.caches = null; // 判断是否有缓存
      this.showAll = false;
      window.location.reload();
      this.autoRead();
    },
    // 设置排名显示的文字
    setName(t) {
      switch (t) {
        case 1:
          return "不佳";
        case 2:
          return "一般";
        case 3:
          return "良好";
        case 4:
          return "优秀";
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
    // 跳转到查看chart
    tochart() {
      if (this.showFenXi) {
        this.$refs.chart.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    },

    // 阻止鼠标右键事件
    oncontextmenu(e, t) {
      e.preventDefault();
      console.log(t);
      let jijin = this.zhengli.canUse.find((td) => td.code == t).name;
      alert(`基金---  ${jijin}  ${t}  ---已经被console.log`);
      console.log(this.zhengli);
    },
    // 点击基金跳转到它的图表分析
    toChart(e, code) {
      e.preventDefault();
      let target = e.target;
      target.classList.add("toChartRightClick");
      let x = e.offsetX,
        y = e.offsetY, // 找到鼠标右键单击时的相对坐标
        spans = document.createElement("span");
      let str = `position: absolute;background:rgb(133, 240, 241);
        padding: 2px 6px;
        width: 80px !important;
        cursor: pointer;
        border-radius: 3px;
        text-align:center;
        color: black;`;
      if (target.offsetWidth - 50 > x) {
        spans.style = `${str}left:${x}px;top:${y - 15}px;
       `;
      } else {
        spans.style = `${str}left:${target.offsetWidth - 50}px;top:${
          y - 15
        }px;`;
      }

      spans.innerHTML = "点击查看图表";
      spans.addEventListener("click", () => {
        if (this.showFenXi && code) {
          this.$refs[`${code}_chart`].scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
          });
          target.removeChild(spans);
        } else {
          alert("没有图表，请在右侧勾选！");
        }
      });
      target.appendChild(spans);
      setTimeout(() => {
        target.classList.remove("toChartRightClick");
        target.removeChild(spans);
      }, 3000);
    },
    // 点击基金跳转到它的同花顺
    toChart1(e, code) {
      e.preventDefault();
      let target = e.target;
      target.classList.add("toChartRightClick");
      let x = e.offsetX,
        y = e.offsetY, // 找到鼠标右键单击时的相对坐标
        spans = document.createElement("span");
      let str = `position: absolute;background: rgb(233, 160, 108);
        padding: 2px 6px;
        width: 90px !important;
        cursor: pointer;
        border-radius: 3px;
        text-align:center;
        color: rgb(0, 166, 14);`;
      if (target.offsetWidth - 50 > x) {
        spans.style = `${str}left:${x}px;top:${y - 15}px;
       `;
      } else {
        spans.style = `${str}left:${target.offsetWidth - 50}px;top:${
          y - 15
        }px;`;
      }

      spans.innerHTML = "点击打开同花顺";
      spans.addEventListener("click", () => {
        this.showJiJin(code);
      });
      target.appendChild(spans);
      setTimeout(() => {
        target.classList.remove("toChartRightClick");
        target.removeChild(spans);
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  border: 0;
  border-collapse: collapse;
}
ul {
  list-style-type: none;
  color: rgb(133, 240, 241);
}

.gainians1,
.gainians2 {
  width: calc(100% - 155px);
  thead {
    tr {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
  }
}
.gainians1 {
  tr {
    width: 100%;
    display: flex;
  }
  td {
    font-size: 12px;
    border: 1px solid rgb(188, 181, 181);
    border-collapse: collapse;
    box-sizing: border-box;
    padding: 2px;
  }
  tr > td:nth-of-type(1) {
    width: 100px;
    flex-shrink: 0;
    text-align: center;
    color: rgb(50, 32, 214);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
  tr > td:nth-of-type(2) {
    width: 100%;
  }
}

.noChiCang > tbody,
.excelChongFu > tbody {
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.4%;
}

.typeJiJin,
.noChiCang,
.excelChongFu {
  width: calc(100% - 155px);
  tbody {
    tr {
      width: 100%;
      display: flex;
    }
    td {
      font-size: 12px;
      border: 1px solid rgb(188, 181, 181);
      border-collapse: collapse;
      box-sizing: border-box;
      padding: 2px;
    }
    tr > td:nth-of-type(1) {
      width: 80px;
      flex-shrink: 0;
      text-align: center;
      color: rgb(50, 32, 214);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;
    }
    tr > td:nth-of-type(2) {
      width: 100%;
    }
  }
}

.typeJiJin > tbody > tr {
  width: 100%;
}
.typeTongJi {
  width: calc(100% - 155px);
  thead {
    tr {
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
  }
  tbody {
    display: grid;
    grid-template-columns: 33% 33% 34%;

    tr {
      width: 100%;
      display: flex;
    }
    td {
      font-size: 12px;
      border: 1px solid rgb(188, 181, 181);
      border-collapse: collapse;
      box-sizing: border-box;
      padding: 2px;
    }
    tr > td:nth-of-type(1) {
      width: 80px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: rgb(50, 32, 214);
    }
    tr > td:nth-of-type(2) {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
}

.chonghe {
  width: calc(100% - 155px);
  th {
    font-size: 20px;
  }
  tbody tr {
    display: grid;
    grid-template-columns: 25% 35px 40% calc(35% - 35px);
  }
  td {
    font-size: 12px;
    box-sizing: border-box;
    border: 1px solid rgb(188, 181, 181);
    padding: 4px;
  }
  td:nth-of-type(1) {
    text-align: right;
  }
  td:nth-of-type(1),
  td:nth-of-type(4) {
    flex-shrink: 0;
    p:nth-of-type(1) {
      color: rgb(231, 14, 144);
    }
  }
  td:nth-of-type(2) {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .chongheTitle td {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 16px;
    border: 1px solid rgb(188, 181, 181);
    padding: 0;
  }
}

.shuju {
  width: calc(100% - 155px);
  margin-top: 10px;
  box-sizing: border-box;
  thead {
    .lists {
      display: flex;
      th {
        font-size: 16px;
        padding: 3px;
        border: 1px solid rgb(188, 181, 181);
      }
      th:nth-of-type(1) {
        width: 150px;
        flex-shrink: 0;
        font-size: 14px;
      }
      th:nth-of-type(2),
      th:nth-of-type(3) {
        width: 70px;
        flex-shrink: 0;
        font-size: 14px;
      }
      th:nth-of-type(2):hover,
      th:nth-of-type(3):hover {
        cursor: pointer;
        color: red;
      }
      th:nth-of-type(4) {
        width: 100%;
      }
    }

    tr:nth-of-type(3) {
      display: flex;
      th {
        padding: 3px;
        border: 1px solid rgb(188, 181, 181);
      }
      th:nth-of-type(1) {
        width: 100px;
        flex-shrink: 0;
        font-size: 14px;
      }
      th:nth-of-type(2),
      th:nth-of-type(3) {
        width: 70px;
        flex-shrink: 0;
        font-size: 14px;
      }
      th:nth-of-type(4) {
        width: 100%;
      }
    }
  }
  tbody {
    tr {
      display: flex;
      td {
        padding: 2px;
        border: 1px solid rgb(211, 202, 202);
        vertical-align: middle;
      }
      td:nth-of-type(1) {
        width: 152px;
        flex-shrink: 0;
        color: rgb(189, 8, 196);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
      }
      td:nth-of-type(1):hover {
        cursor: pointer;
        background: rgb(192, 255, 220);
      }
      td:nth-of-type(2),
      td:nth-of-type(3) {
        width: 72px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      td:nth-of-type(1),
      td:nth-of-type(2),
      td:nth-of-type(3) {
        font-size: 14px;
        text-align: center;
      }

      td:nth-of-type(4) {
        font-size: 12px;
        width: 100%;
      }
    }
  }
  .bg {
    background: rgba(230, 186, 156, 0.3);
  }
}

.fenxi {
  width: 100%;
  tbody tr {
    margin-bottom: 2px;
    display: flex;
    justify-content: center;
  }
  td {
    box-sizing: border-box;
    margin: 5px;
    width: 640px;
    border: 1px solid rgb(250, 167, 243);
  }
}

.zoushi {
  width: 100%;
  height: 325px;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
  div:nth-child(2) {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    height: 340px;
  }
  select {
    position: absolute;
    right: 8px;
    top: -10px;
    z-index: 44444;
    padding: 2px 4px;
    outline: cadetblue;
    option {
      padding: 4px;
    }
  }
}
.bili {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bili > div:nth-child(1) {
  width: 170px;
  height: 116px;
  flex-shrink: 0;
}
.bili > ul {
  width: 170px;
  font-size: 12px;
  text-align: left;
  color: black;
}
.xiangqing {
  font-size: 12px;
  div {
    display: flex;
    justify-content: space-around;
    padding: 2px 0;
    p {
      width: 50%;
      span {
        display: inline-block;
        width: 50%;
      }
    }
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
}
.names {
  display: flex;
  p:nth-of-type(1) ~ p {
    padding: 2px 4px;
    margin-right: 10px;
    font-size: 12px;
  }
  p:nth-of-type(1) {
    font-size: 14px;
    color: rgb(243, 33, 33);
    margin: 0 10px 0 2px;
  }
  p:nth-of-type(4) {
    span:not(:first-child) {
      margin-right: 10px;
    }
  }
}
.zhang {
  display: flex;
  justify-content: space-between;
  background: rgb(240, 230, 239);
  p {
    width: 49.5%;
    display: flex;
    margin: 0;
    span {
      width: 50%;
    }
    span:nth-of-type(1) {
      text-align: right;
    }
  }
}
.showManager:hover {
  position: relative;
  cursor: pointer;
  background: rgb(229, 208, 208);
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
  span:nth-child(1) {
    width: 66px;
    text-align: right;
    flex-shrink: 0;
  }
  span:nth-child(2) {
    margin-right: 10px;
  }
}

.toChong {
  position: fixed;
  right: 5px;
  bottom: 65px;
  width: 40px;
  height: 40px;
  color: red;
  font-weight: bold;
  border: none;
  font-size: 30px;
  border-radius: 20%;
  opacity: 0.5;
  background: none;
  outline: none;
  z-index: 8330;
}
.toChong:hover {
  cursor: pointer;
  opacity: 1;
  background: rgb(3, 99, 100);
}
.toChong:hover::before {
  content: "去重合分析头部";
  position: fixed;
  right: 35px;
  bottom: 75px;
  color: rgb(239, 240, 241);
  font-size: 12px;
  background: rgb(3, 99, 100);
  padding: 2px 4px;
  border-radius: 5px 0 0 5px;
}

.tochart {
  position: fixed;
  right: 5px;
  bottom: 20px;
  width: 40px;
  height: 40px;
  color: rgb(76, 0, 255);
  font-weight: bold;
  border: none;
  font-size: 30px;
  border-radius: 20%;
  opacity: 0.5;
  background: none;
  outline: none;
  z-index: 8330;
}
.tochart:hover {
  cursor: pointer;
  opacity: 1;
  background: rgb(25, 233, 236);
}
.tochart:hover::before {
  content: "去完整分析";
  position: fixed;
  right: 35px;
  bottom: 30px;
  color: black;
  font-size: 12px;
  background: rgb(25, 233, 236);
  padding: 2px 4px;
  border-radius: 5px 0 0 5px;
}

.clear {
  outline: none;
  font-size: 14px;
  margin-top: 10px;
}
.paiming {
  margin: 0 !important;
  background: rgb(241, 243, 235);
  width: 100% !important;
  font-size: 12px;
  tr {
    padding: 0 !important;
    margin: 0 !important;
    justify-content: flex-start !important;
  }
  td {
    border: none;
  }
  td:nth-of-type(1) {
    width: 40px;
    flex-shrink: 0;
    line-height: 15px;
    font-size: 12px;
    letter-spacing: 2px;
    color: rgb(135, 57, 245);
    text-align: center;
    margin: 5px;
  }
  td:nth-of-type(1) ~ td {
    p {
      padding: 2px 0;
    }
    width: 50px !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0px;
    padding: 3px 5px;
    span:nth-of-type(1) {
      color: rgb(4, 0, 255);
    }
    span:nth-of-type(2) {
      color: black;
    }
    hr {
      width: 85%;
      margin: 2px auto;
      border: none;
      border-top: 1px solid rgb(168, 168, 168);
    }
    .jinjie {
      margin-top: 5px;
    }
  }
}
.jinjie {
  margin-top: 8px;
  .hao {
    box-sizing: border-box;
    border: 1px solid rgb(220, 219, 219);
  }
  p:not(:last-child) {
    height: 10px;
    width: 40px;
    border-bottom: 0;
  }
  :last-child() {
    margin-top: 5px;
  }
  .hao3 {
    background: #16adff;
    border: none;
    border-bottom: 1px solid #16adff;
  }
  .hao2 {
    border: none;
    background: #6bcbff;
    border-bottom: 1px solid #6bcbff;
  }
  .hao1 {
    border: none;
    background: #96daff;
    border-bottom: 1px solid #96daff;
  }
  .hao0 {
    border: none;
    background: #c3e8ff;
    border-bottom: 1px solid #c3e8ff;
  }
}
.searchGP {
  opacity: 0.3;
  display: inline-block;
  padding: 2px 0;
  background: rgb(15, 188, 190);
  text-align: right;
  input {
    padding: 2px;
    width: 145px;
  }
  &:hover {
    opacity: 1;
  }
  button {
    font-size: 12px;
  }
}
.showModel {
  font-size: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgb(222, 212, 135);
  label {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    padding: 2px 0 2px 4px;
  }
  label:hover {
    background: rgb(230, 205, 255);
    cursor: pointer;
  }
}
.sticky {
  position: sticky;
  top: 15px;
  float: right;
}
.toChartRightClick {
  position: relative;
}
.gupiaoTable {
  width: calc(100% - 155px);
  tbody {
    tr {
      display: grid;
      grid-template-columns: 20% 36px 15% 36px calc(65% - 72px);
    }

    td {
      box-sizing: border-box;
      border: 1px solid rgb(224, 222, 222);
      padding: 2px;
    }
    tr:nth-of-type(1) {
      font-size: 14px;
      text-align: center;
      td {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    tr:nth-of-type(1) ~ tr {
      td:nth-of-type(1) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        p:nth-of-type(1) {
          color: red;
          font-size: 16px;
        }
        p:nth-of-type(2) {
          color: rgb(240, 52, 253);
          font-size: 12px;
          text-align: center;
        }
        p:nth-of-type(3) {
          color: rgb(17, 3, 3);
          font-size: 12px;
          text-align: center;
        }
      }
      td:nth-of-type(2),
      td:nth-of-type(4) {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      }
      td:nth-of-type(3),
      td:nth-of-type(5) {
        font-size: 12px;
      }
    }
  }
}
.jiJinChiCang {
  width: calc(100% - 155px);
  tbody tr {
    display: grid;
    grid-template-columns: 20% 8% 8% 8% 8% 8% 8% 8% 8% 8% 8%;
    td {
      box-sizing: border-box;
      border: 1px solid rgb(224, 222, 222);
      padding: 2px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    td:nth-of-type(1) {
      p:nth-of-type(1) {
        color: rgb(249, 0, 0);
        font-size: 14px;
      }
      p:nth-of-type(2) {
        color: rgb(50, 10, 134);
        font-size: 12px;
      }
    }
    td:nth-of-type(1) ~ td {
      p:nth-of-type(1) {
        color: rgb(167, 7, 34);
        font-size: 12px;
      }
      p:nth-of-type(2) {
        color: rgb(16, 1, 48);
        font-size: 12px;
      }
      p:nth-of-type(3) {
        color: rgb(0, 166, 14);
        font-size: 12px;
      }
    }
  }
}
</style>