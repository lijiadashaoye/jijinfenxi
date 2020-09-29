<template>
  <div class="wap">
    <el-form
      ref="form"
      label-suffix=":"
      :model="form"
      label-width="80px"
      class="form"
    >
      <el-form-item label="是否启用" class="formItem" v-if="pageSet">
        <el-select size="small" v-model="form.qiyong" placeholder="请选择">
          <el-option
            v-for="tar in pageSet.qiyongList"
            :key="tar.name"
            :label="tar.name"
            :value="tar.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="渠道" class="formItem" v-if="pageSet">
        <el-select size="small" v-model="form.qudao" placeholder="请选择">
          <el-option
            v-for="tar in pageSet.appFlagList"
            :key="tar.name"
            :label="tar.name"
            :value="tar.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="search">查 询</el-button>
        <el-button size="small" @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>
    <Table :datas="tableData" @tableEmit="tableEmit" />
  </div>
</template>

<script>
import Table from "@/components/table.vue";

export default {
  components: { Table },
  data() {
    return {
      form: {
        qiyong: "",
        qudao: 0,
      },
      pageSet: null,
      // 表格的源数据
      tableData: {
        type: "normal", // 控制表格显示类型
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示数量
        totalNum: 10, // 总共条数
        buttonName: "新 增",
        titles: [
          {
            title: "类型",
            key: "leixing",
            minWidth: "100",
          },
          {
            title: "创建人",
            key: "creater",
            minWidth: "80",
          },
          {
            title: "最近操作时间",
            key: "caozuoTime",
            minWidth: "130",
            sortable: true,
          },
          {
            title: "生效时间",
            key: "shengxiao",
            minWidth: "130",
            sortable: true,
          },
          {
            title: "是否启用",
            key: "qiyong",
            minWidth: "80",
          },
          {
            title: "生效渠道",
            key: "shengxiaoqudao",
            minWidth: "130",
          },
          {
            title: "生效设备",
            key: "shengxiaoshebei",
            minWidth: "130",
          },
        ],
        lists: [],
      },
    };
  },
  created() {
    // 获取各种下拉初始化数据
    let canshu = sessionStorage.getItem("canshuFenLei");
    if (canshu) {
      this.pageSet = { ...JSON.parse(canshu) };
    } else {
      this.$http
        .getPeiZhi({
          vm: this,
          url: "/questionCategory/forQuestionCategoryPage",
        })
        .then((res) => {
          if (res.status == 200) {
            let k = res.data.data;
            // entranceTypeList; // 入口类型 1:app类 2:活动类
            // enableList; // 是否可用 1:可用 2:不可用
            // appFlagList; //生效渠道 0:全部 1:比财 2:拼财
            // deviceTypeList; // 生效设备 0:全部 1:安卓 2:苹果
            this.pageSet = {};
            this.pageSet.qiyongList = [
              {
                name: "全部",
                value: "",
              },
            ].concat(k.enableList);
            this.pageSet.appFlagList = k.appFlagList;
            this.pageSet.entranceTypeList = k.entranceTypeList;
            this.pageSet.deviceTypeList = k.deviceTypeList;

            sessionStorage.setItem(
              "canshuFenLei",
              JSON.stringify(this.pageSet)
            );
          }
        });
    }
    this.search();
  },
  methods: {
    // 执行查询
    search() {
      let obj = {
        pageNum: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        appFlag: this.form.qudao, // 渠道
        effectTimeOrderParam: this.tableData.effectTimeOrderParam, // 生效时间排序 1:升序 2;降序
        updateTimeOrderParam: this.tableData.updateTimeOrderParam, // 最近操作时间排序 1:升序 2;降序
      };
      if (this.form.qiyong !== "") {
        obj.enableStatus = this.form.qiyong; // 是否启用
      }
      this.$http
        .getFenLeiList({
          vm: this,
          data: obj,
        })
        .then((res) => {
          if (res.status == 200) {
            this.httpData = res.data.data;
            this.tableData.currentPage = this.httpData.currentPage;
            this.tableData.totalNum = this.httpData.totalCount;

            this.tableData.lists = this.httpData.data.map((t) => ({
              id: t.id, // 问题分类id
              leixing: t.questionTypeTitle,
              creater: t.updName,
              caozuoTime: t.updTime,
              shengxiao: t.effectTime,
              qiyong: this.pageSet.qiyongList.filter(
                (d) => d.value === t.enableStatus
              )[0].name,
              shengxiaoqudao: this.pageSet.appFlagList.filter(
                (d) => d.value === t.appFlag
              )[0].name,
              shengxiaoshebei: this.pageSet.deviceTypeList.filter(
                (d) => d.value === t.deviceType
              )[0].name,
            }));
          }
        });
    },
    // 重置
    reset() {
      this.form.qiyong = "";
      this.form.qudao = 0;
      this.search();
    },
    // 监听表格
    tableEmit(data) {
      switch (data.type) {
        case "add": // 新增
          this.$router.push({
            name: "fenlei_edit",
          });
          break;
        case "edit": // 修改
          this.$router.push({
            name: "fenlei_edit",
            params: this.httpData.data.filter((t) => t.id === data.data.id)[0],
          });
          break;
        case "delete": // 删除
          this.$http
            .fenleiDeleteData({
              vm: this,
              data: data.data.id,
            })
            .then((res) => {
              if (res.status == 200) {
                this.$message({
                  message: "删除成功！",
                  type: "success",
                });
                this.search();
              } else {
                this.$message({
                  message: "删除失败，请重试！",
                  type: "error",
                });
              }
            });

          break;
        case "search": // 分页
          this.search();
          break;
      }
    },
  },
};
</script>

<style>
</style>