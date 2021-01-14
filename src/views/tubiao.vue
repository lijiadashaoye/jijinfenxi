<template>
  <div>
    <jiazai v-if="!showAll" />
    <button class="toChong" @click="tochong" v-show="showAll">
      <!--js 特殊字符表 http://www.360doc.com/content/19/0316/09/281812_821845466.shtml -->
      &#8607;
    </button>
    <button class="clear" @click="clearCache">清除缓存，重新拉取数据</button>

    <div class="wap" v-show="showAll">
      <div class="gainians">
        <!-- 根据概念区分 -->
        <table class="gainians1" collpase>
          <thead>
            <tr>
              <th colspan="2">概念类型统计</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(t, ind) in Object.keys(gaiNian)" :key="ind">
              <td>{{ t }}</td>
              <td>{{ gaiNian[t].join("  ") }}</td>
            </tr>
          </tbody>
        </table>
        <div class="gainians2">
          <!-- 基金类型统计 -->
          <table class="typeJiJin" collpase>
            <thead>
              <tr>
                <th colspan="2">基金类型统计</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, ind) in Object.keys(jijinType)" :key="ind">
                <td>{{ t }}</td>
                <td>{{ jijinType[t].join("  ") }}</td>
              </tr>
            </tbody>
          </table>
          <!-- 没有持仓数据的 -->
          <table class="noChiCang" collpase v-if="zhengli.kong.length">
            <thead>
              <tr>
                <th colspan="4">
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
          <table class="excelChongFu" collpase v-if="zhengli.chongfu.length">
            <thead>
              <tr>
                <th colspan="4">
                  excel 里重复的{{ `${zhengli.chongfu.length}个` }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(t, ind) in zhengli.chongfu" :key="ind">
                <td>{{ t.code }}</td>
                <td>{{ t.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 基金经理汇总 -->
      <table class="typeTongJi" collpase>
        <thead>
          <tr>
            <th colspan="6">基金经理汇总</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(t, ind) in jingliList"
            :class="{ changeWidth: jingliList.length < 3 }"
            :key="ind"
          >
            <td
              title="点击查看基金经理数据"
              class="showManager"
              @click="showJiJin2(t.name)"
            >
              {{ t.name }}
            </td>
            <td>{{ t.jijin.join("  ") }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 重合分析 -->
      <table ref="chong" class="chonghe" collpase v-if="chonghe.length">
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
          <tr v-for="(t, ind) in chonghe" :key="ind">
            <td>
              <p>{{ t.one.name }}</p>
              <p>{{ t.two.name }}</p>
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
      <table class="shuju" collpase>
        <thead>
          <tr>
            <th colspan="4">数据统计</th>
          </tr>

          <tr class="lists">
            <th>股票名称</th>
            <th title="点击排序" @click="toSort(true)">被持仓次数</th>
            <th title="点击排序" @click="toSort(false)">日涨幅 %</th>
            <th>
              共{{ zhengli.canUse.length }}个基金，
              {{ zhengli.kong.length }}个看不到持仓，
              <span>{{ single }} 个股票被持有一次</span>
            </th>
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
          <tr v-for="(t, ind) in gupiao" :key="ind" :ref="t.code">
            <td
              :id="t.id"
              :class="{ bg: t.jijin.length >= shaixuan, seegupiao: true }"
              @click="seeGuPiao(t.code)"
            >
              <span title="点击查看股票">{{ t.name }}</span>
            </td>
            <td>{{ t.jijin.length }}</td>
            <td>{{ t.zhangfu }}</td>
            <td>{{ t.jijin.join(" , ") }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 每个基金的分析 -->
      <table class="fenxi" collpase>
        <thead>
          <tr>
            <th colspan="3">基金详情，{{ `共 ${zhengli.fenxi.length} 个` }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(d, ind) in chartList" :key="ind">
            <td v-for="(t, ind) in d" :key="ind">
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
                    @contextmenu="oncontextmenu($event, t.name)"
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
                        <p
                          :class="{ hao3: t.paiming[l][2] > 3, hao: true }"
                        ></p>
                        <p
                          :class="{ hao2: t.paiming[l][2] > 2, hao: true }"
                        ></p>
                        <p
                          :class="{ hao1: t.paiming[l][2] > 1, hao: true }"
                        ></p>
                        <p
                          :class="{ hao0: t.paiming[l][2] > 0, hao: true }"
                        ></p>
                        <p>{{ setName(t.paiming[l][2]) }}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- 收益走势 -->
              <div v-if="t.shouyi" class="zoushi" :ref="`${t.code}_qushi`">
                <div></div>
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
      shichang: {
        // 证券市场数据
        hushen: [], // 沪深300
        zhong: [], // 中证500
        shang: [], // 上证指数
        chuang: [], // 上证指数
        time: "",
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
      showAll: false,
    };
  },
  components: { jiazai },
  created() {
    this.range = "A1:B900";
    // this.range = "C1:D900";
    // this.range = "F1:G900";

    this.caches = localStorage.getItem("zhengli");
    if (this.caches) {
      let time = JSON.parse(this.caches).time,
        now = new Date().getTime();
      // 超过三天未操作，就重新拉取数据
      if (now - time > 1000 * 60 * 60 * 24 * 3) {
        localStorage.removeItem("zhengli");
      }
    }

    this.$axios({
      method: "get",
      url: `shichang`,
    }).then((res) => {
      if (!res) {
        // 如果没有添加过市场数据，则需要初始化
        this.getShiChang();
      } else {
        // 获取当天时间
        let day = new Date().getDate();
        if (res.time < day) {
          this.getShiChang();
        } else {
          this.shichang = res;
          this.shichang.time = day;
        }
      }
    });
    // 获取金的数据
    this.autoRead();
  },
  methods: {
    // 获取市场数据
    getShiChang() {
      let shichangs = [
        // 获取沪深300
        this.$axios({
          method: "get",
          url: `hushen`,
        }),
        // 获取中证500
        this.$axios({
          method: "get",
          url: `zhongzheng`,
        }),
        // 获取上证
        this.$axios({
          method: "get",
          url: `shangzheng`,
        }),
        // 获取创业板
        this.$axios({
          method: "get",
          url: `chuangyeban`,
        }),
      ];
      Promise.all(shichangs).then((res) => {
        // 获取沪深300
        let hs = eval("(" + res[0].split("=")[1] + ")"),
          hsNames = Object.keys(hs),
          // 获取中证500
          zz = eval("(" + res[1].split("=")[1] + ")"),
          zzNames = Object.keys(zz),
          // 获取上证
          sz = eval("(" + res[2].split("=")[1] + ")"),
          szNames = Object.keys(sz),
          // 获取创业板
          cy = eval("(" + res[3].split("=")[1] + ")"),
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
      let day = new Date().getDate(); // 获取时间
      this.shichang.time = day;
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
        // 如果有服务器请求数量限制，就要用 true，隔段时间请求一次
        httptype = true;
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
        if (arrs.length) {
          // 控制请求间隔时间
          let time = 100,
            inter = null,
            num = 0; // 用来清除定时
          inter = setInterval(() => {
            if (num == arrs.length) {
              clearInterval(inter);
              inter = null;
            } else {
              // 获取新增的基金数据
              this.useHttp([arrs[num]]);
              num++;
            }
          }, time);
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
            }),
            this.$axios({
              method: "get",
              url: `paiming/${codes[i]}`,
            }),
            this.$axios({
              method: "get",
              url: `shouyiqushi/${codes[i]}`,
            }),
            this.$axios({
              method: "get",
              url: `tonglei/${codes[i]}`,
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
              // 资产配置
              if (arr[0] == "Data_assetAllocation") {
                let k = eval("(" + arr[1] + ")");
                obj["peizhi"] = k.series.map((t) => {
                  // 转译特殊字符
                  if (t.name.indexOf("�") > -1) {
                    t.name = "股票";
                  }
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
              obj["paiming"] = {};
              let kk = res[3].nowCommonTypeRank;
              Object.keys(kk).forEach((t) => {
                obj.paiming[t] = [kk[t][0], kk[t][1]];
                let num = +kk[t][2];
                if (num > 75) {
                  obj.paiming[t][2] = 4;
                }
                if (num <= 75 && num > 50) {
                  obj.paiming[t][2] = 3;
                }
                if (num <= 50 && num > 25) {
                  obj.paiming[t][2] = 2;
                }
                if (num <= 25) {
                  obj.paiming[t][2] = 1;
                }
                switch (t) {
                  case "fyear":
                    obj.paiming[t][3] = "近5年";
                    break;
                  case "hyear":
                    obj.paiming[t][3] = "近6月";
                    break;
                  case "month":
                    obj.paiming[t][3] = "近1月";
                    break;
                  case "nowyear":
                    obj.paiming[t][3] = "今年来";
                    break;
                  case "tmonth":
                    obj.paiming[t][3] = "近3月";
                    break;
                  case "twoyear":
                    obj.paiming[t][3] = "近2年";
                    break;
                  case "tyear":
                    obj.paiming[t][3] = "近3年";
                    break;
                  case "week":
                    obj.paiming[t][3] = "近1周";
                    break;
                  case "year":
                    obj.paiming[t][3] = "近1年";
                    break;
                }
              });
            }

            let shouyiqushi = [], // 基金自己的 echarts 展示数据
              tonglei = [], // 同类平均的 echarts 展示数据
              shang = [], // 用来保存根据基金与上证的交集筛选出的市场数据
              zhong = [], // 用来保存根据基金与中证500的交集筛选出的市场数据
              hushen = [], // 用来保存根据基金与沪深300的交集筛选出的市场数据
              chuang = [], // 用来保存根据基金与创业板的交集筛选出的市场数据
              jiaoji = null, // 以基金的整张为基础获取交集
              minTime = []; // 取最小交集;

            // res[4] 累计收益率走势
            if (res[4]) {
              let k = eval("(" + res[4].split("=")[1].slice(0, -1) + ")").split(
                "|"
              );
              for (let i = k.length; i--; ) {
                let sp = k[i].split("_");
                if (sp.length == 4) {
                  shouyiqushi.unshift([sp[0], sp[1] ? sp[1] : "0.00"]);
                }
              }
            }
            // res[5] 同类
            if (res[5]) {
              let names = Object.keys(res[5]).reverse();
              for (let i = names.length; i--; ) {
                let time = names[i].replace(/-/g, "/"),
                  jishu = +res[5][names[0]],
                  num = Math.abs(
                    ((parseFloat(res[5][names[i]]) - jishu) / jishu) * 100
                  ).toFixed(2);
                tonglei.unshift([time, num]);
              }
            }

            let shouyiqushiTime = shouyiqushi.map((t) => t[0]), // 收益趋势的时间集合
              tongleiTime = tonglei.map((t) => t[0]); // 同类平均的时间集合
            // 取交集
            jiaoji = shouyiqushiTime.filter((x) => tongleiTime.includes(x));
            // 筛选市场数据
            shang = this.shichang.shang
              .map((t) => t[0])
              .filter((x) => jiaoji.includes(x));
            zhong = this.shichang.zhong
              .map((t) => t[0])
              .filter((x) => jiaoji.includes(x));
            hushen = this.shichang.hushen
              .map((t) => t[0])
              .filter((x) => jiaoji.includes(x));
            chuang = this.shichang.chuang
              .map((t) => t[0])
              .filter((x) => jiaoji.includes(x));

            // 寻找最小交集
            if (shouyiqushiTime.length) {
              minTime = [
                shouyiqushiTime,
                jiaoji,
                shang,
                zhong,
                hushen,
                chuang,
              ].reduce((all, now) => {
                if (all.length < now.length) {
                  return all;
                } else {
                  return now;
                }
              });
              obj["shouyi"] = {
                [xiangxi.name]: shouyiqushi.filter((t) =>
                  minTime.includes(t[0])
                ),
                同类平均: tonglei.filter((t) => minTime.includes(t[0])),
                沪深300: [],
                中证500: [],
                上证指数: [],
                创业板指数: [],
              };
              // 整理沪深的展示数据
              for (let i = minTime.length; i--; ) {
                let tar = this.shichang.hushen.find((t) => t[0] == minTime[i]),
                  tar0 = this.shichang.hushen.find((t) => t[0] == minTime[0]),
                  jishu = +tar0[1],
                  num = Math.abs(
                    ((parseFloat(tar[1]) - jishu) / jishu) * 100
                  ).toFixed(2);
                obj["shouyi"]["沪深300"].unshift([tar[0], num]);
              }
              // 整理中证500的展示数据
              for (let i = minTime.length; i--; ) {
                let tar = this.shichang.zhong.find((t) => t[0] == minTime[i]),
                  tar0 = this.shichang.zhong.find((t) => t[0] == minTime[0]),
                  jishu = +tar0[1],
                  num = Math.abs(
                    ((parseFloat(tar[1]) - jishu) / jishu) * 100
                  ).toFixed(2);
                obj["shouyi"]["中证500"].unshift([tar[0], num]);
              }
              // 整理上证指数的展示数据
              for (let i = minTime.length; i--; ) {
                let tar = this.shichang.shang.find((t) => t[0] == minTime[i]),
                  tar0 = this.shichang.shang.find((t) => t[0] == minTime[0]),
                  jishu = +tar0[1],
                  num = Math.abs(
                    ((parseFloat(tar[1]) - jishu) / jishu) * 100
                  ).toFixed(2);
                obj["shouyi"]["上证指数"].unshift([tar[0], num]);
              }
              // 整理创业板指数的展示数据
              for (let i = minTime.length; i--; ) {
                let tar = this.shichang.chuang.find((t) => t[0] == minTime[i]),
                  tar0 = this.shichang.chuang.find((t) => t[0] == minTime[0]),
                  jishu = +tar0[1],
                  num = Math.abs(
                    ((parseFloat(tar[1]) - jishu) / jishu) * 100
                  ).toFixed(2);
                obj["shouyi"]["创业板指数"].unshift([tar[0], num]);
              }
            } else {
              obj["shouyi"] = null;
            }

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
            if (obj["shouyi"]) {
              this.zhengli.fenxi.push(obj);
            } else {
              this.zhengli.fenxi.unshift(obj);
            }
          });
        } else {
          console.log(codes[i]);
        }
      }
      // setTimeout(() => {
      this.makeTongJi();
      // }, 50);
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
      for (let i = 0; i < this.zhengli.fenxi.length; i += 2) {
        this.chartList.push(this.zhengli.fenxi.slice(i, i + 2));
      }
      this.makeColor();
      this.leiXingTongJi();
      this.chongHeFenXi();
      this.showAll = true;
      this.makeXiangQingChart();
      this.makeShouYiChart();

      setTimeout(() => {
        this.zhengli["time"] = new Date().getTime();
        localStorage.setItem("zhengli", JSON.stringify(this.zhengli));
      });
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
    // 绘制每个基金的收益走势图
    makeShouYiChart() {
      this.zhengli.fenxi.forEach(async (t) => {
        new Promise((res) => {
          let kk = setInterval(() => {
            let tar = this.$refs[`${t.code}_qushi`];
            if (tar) {
              clearInterval(kk);
              if (t.shouyi) {
                let legends = Object.keys(t.shouyi).map((aa) => t.shouyi[aa]),
                  names = Object.keys(t.shouyi);
                qushi(tar[0].children[0], legends, names, res);
              }
            }
          }, 50);
        });
      });
      // 执行画图
      function qushi(tar, legends, names, res) {
        let times = legends[0].map((t) => t[0]);
        let option = {
          color: [
            "#ff025b",
            "#9500ff",
            "#0290af",
            "#070100",
            "#e78325",
            "#070100",
            "#7a77be",
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
            left: 0,
            top: 23,
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
                    return `${t.value.toFixed(2)}%`;
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
              e.forEach((d, ind) => {
                if (!str) {
                  str += `<p style="font-size:14px;color:#ffaa16;padding-right:20px;">${
                    times[d.dataIndex]
                  }</p>`;
                }
                str += `<div style="display:flex;justify-content:space-between;">
                          <p style="width:calc(100% - 52px);text-align:right;">${names[ind]} :&nbsp;</p>
                          <p style="width:50px;text-align:left;color:#ffaa16;flex-shrink:0;">${d.data}%</p>
                        </div>`;
              });
              return str;
            },
          },
          legend: {
            right: 10,
            top: 45,
            padding: 0,
            itemGap: 13,
            itemWidth: 10,
            itemHeight: 8,
            data: names,
            borderWidth: 0,
            textStyle: {
              fontSize: 12,
            },
          },
          grid: {
            left: 0,
            right: 10,
            bottom: 0,
            containLabel: true,
          },
          xAxis: {
            type: "category",
            axisLine: {
              // x轴线设置
              // show: false,
              lineStyle: {
                color: "#b9b8c0",
                width: 1,
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
            data: times.map((t) => t.slice(5)),
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
            },
          },
          series: legends.map((w, index) => {
            return {
              type: "line",
              symbol: "pin",
              symbolSize: 4,
              showSymbol: false,
              name: names[index],
              lineStyle: {
                width: 0.6,
              },
              data: w.map((t) => t[1]),
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
        let names = this.jingliList.map((t) => t.name),
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
      this.jijins = ""; // 搜索基金用
      this.shaixuan = 4; // 用来筛选被持有量
      this.chongheNum = 3; // 用来定义重合数量
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
      this.chartList = []; //用来显示echarts分析
      this.colorObj = {}; // 存储不同概念的颜色
      this.caches = null; // 判断是否有缓存
      this.showAll = false;
      location.reload();
      setTimeout(() => {
        this.autoRead();
      }, 50);
    },
    // 转换收益走势的时间
    makeTime(t) {
      let da = new Date(t);
      let one1 = da.getFullYear(); //  取得年
      let one2 = da.getMonth() + 1; //  取得月
      let one3 = da.getDate(); //  取得日
      return `${one1}-${one2}-${one3}`;
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
    oncontextmenu(e, t) {
      e.preventDefault();
      console.log(t);
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  border-collapse: collapse;
}
ul {
  list-style-type: none;
}
.wap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-bottom: 0;
  margin: 0;
  width: 100%;
}
.gainians {
  thead {
    tr {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
  }
  display: flex;
  .gainians1 {
    width: 40%;
    box-sizing: border-box;
  }
  .gainians2 {
    width: calc(60% - 10px);
    box-sizing: border-box;
    margin-left: 10px;
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
      width: 90px;
      flex-shrink: 0;
      text-align: center;
      color: rgb(50, 32, 214);
    }
    tr > td:nth-of-type(2) {
      width: 100%;
    }
  }
}
.typeJiJin,
.noChiCang,
.excelChongFu {
  width: 100%;
  tbody {
    display: flex;
    flex-wrap: wrap;
    tr {
      width: 50%;
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
      width: 90px;
      flex-shrink: 0;
      text-align: center;
      color: rgb(50, 32, 214);
    }
    tr > td:nth-of-type(2) {
      width: 100%;
    }
  }
}
.typeTongJi {
  width: 90%;

  thead {
    tr {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 10px 0;
    }
  }
  tbody {
    display: grid;
    grid-template-columns: 33% 33% 33%;
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
    }
    tr > td:nth-of-type(2) {
      width: 100%;
    }
  }
}

.chonghe {
  max-width: 100%;
  th {
    font-size: 20px;
  }
  td {
    font-size: 12px;
    box-sizing: border-box;
    border: 1px solid rgb(188, 181, 181);
    padding: 2px 4px;
  }
  td:nth-of-type(1) {
    width: 200px;
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
      font-size: 16px;
      border: 1px solid rgb(188, 181, 181);
    }
  }
}

.shuju {
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
  thead {
    tr {
      width: 100%;
    }
    .lists {
      display: flex;
      width: 100%;
      th {
        font-size: 16px;
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
      width: 100%;
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
      width: 100%;
      td {
        padding: 3px;
        border: 1px solid rgb(188, 181, 181);
        vertical-align: middle;
      }
      td:nth-of-type(1) {
        width: 100px;
        flex-shrink: 0;
        color: rgb(189, 8, 196);
      }
      td:nth-of-type(1):hover {
        cursor: pointer;
        background: rgb(192, 255, 220);
      }
      td:nth-of-type(2),
      td:nth-of-type(3) {
        width: 70px;
        flex-shrink: 0;
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
    width: 600px;
    border: 1px solid rgb(235, 235, 235);
  }
}

.zoushi {
  width: 100%;
  height: 320px;
  flex-shrink: 0;
  position: relative;
  z-index: 5;
  div {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 2px;
    height: 340px;
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
    margin-right: 20px;
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
  margin: 20px 0 0 10px;
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

    // color: #ff025b;
    // color: #9500ff;
    // color: #0290af;
    // color: #070100;
    // color: #e78325;
    color: #000000;
  }
}
</style>