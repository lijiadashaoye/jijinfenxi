<template>
  <div class="wap">
    <el-form
      ref="form"
      label-suffix=":"
      :model="form"
      label-width="140px"
      class="form"
    >
      <el-form-item label="问题顺序配置维度" class="formItem">
        <el-select
          @change="getYeMian"
          size="small"
          v-model="form.weidu"
          placeholder="请选择"
        >
          <el-option
            v-for="tar in pageSet.questionDimensionList"
            :key="tar.name"
            :label="tar.name"
            :value="tar.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择页面" class="formItem">
        <el-select size="small" v-model="form.page" placeholder="请选择">
          <el-option
            v-for="tar in pageList"
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
      pageSet: [],
      form: {
        weidu: "",
        page: "",
      },
      pageList: [],
      // 表格的源数据
      tableData: {
        type: "paixu", // 控制表格显示类型
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示数量
        totalNum: 10, // 总共条数
        titles: [
          {
            title: "展示顺序",
            key: "shunxu",
            minWidth: "100",
          },
          {
            title: "标题",
            key: "biaoti",
            minWidth: "130",
          },
          {
            title: "内容关键字",
            key: "neirong",
            minWidth: "180",
            fuWenBen: true,
          },
          {
            title: "用户",
            key: "yonghu",
            minWidth: "100",
          },
        ],
        lists: [],
      },
    };
  },
  created() {
    // 获取各种下拉初始化数据
    let canshu = sessionStorage.getItem("canshuPaiXu");
    if (canshu) {
      this.pageSet = { ...JSON.parse(canshu) };
    } else {
      this.$http
        .getPeiZhi({ vm: this, url: "/questionOrder/forQuestionOrderPage" })
        .then((res) => {
          if (res.status == 200) {
            this.pageSet = { ...res.data.data };
            sessionStorage.setItem("canshuPaiXu", JSON.stringify(this.pageSet));
          }
        });
    }
  },

  methods: {
    // 根据维度获取页面
    getYeMian() {
      this.form.page = "";
      this.$http
        .getYeMianData({ vm: this, data: this.form.weidu })
        .then((res) => {
          if (res.status == 200) {
            this.pageList = res.data.data[Object.keys(res.data.data)[0]];
          }
        });
    },
    // 执行查询
    search() {
      if (this.form.page != "") {
        let obj = {
          pageNum: this.tableData.currentPage,
          pageSize: this.tableData.pageSize,
        };
        if (this.form.weidu === 1) {
          // 页面(入口)id
          obj.entranceId = this.form.page;
        } else {
          obj.categoryId = this.form.page;
        }
        this.$http
          .getPaiXuList({
            vm: this,
            data: obj,
          })
          .then((res) => {
            if (res.status == 200) {
              this.httpData = res.data.data;
              this.tableData.currentPage = this.httpData.currentPage;
              this.tableData.totalNum = this.httpData.totalCount;
              this.tableData.lists = this.httpData.data.map((t) => ({
                id: t.questionId,
                shunxu: t.sortOrder,
                biaoti: t.title,
                neirong: t.content,
                yonghu: t.visibleUserStr,
              }));
            }
          });
      } else {
        this.$message({
          message: `请选择页面！`,
          type: "error",
        });
      }
    },
    // 重置
    reset() {
      Object.keys(this.form).forEach((str) => {
        this.form[str] = "";
      });
    },
    tableEmit(data) {
      let obj = null;
      if (data.type == "yiwei") {
        obj = {
          orderType: data.to ? 1 : 2, //排序操作类型 1:顺序加1 2:顺序减1
          questionId: data.data.id, //问题id
          categoryId: "",
          entranceId: "",
        };
        if (this.form.weidu === 1) {
          // 页面(入口)id
          obj.entranceId = this.form.page;
        } else {
          obj.categoryId = this.form.page;
        }
      }
      switch (data.type) {
        case "search": // 分页
          this.search();
          break;
        case "yiwei": // 排序
          this.$http
            .paiXu({
              vm: this,
              data: obj,
            })
            .then((res) => {
              if (res.status == 200) {
                this.search();
              }
            });
          break;
      }
    },
  },
};
</script>

<style>
</style>