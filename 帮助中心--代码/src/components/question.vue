<template>
  <div class="wap">
    <el-form
      ref="form"
      label-suffix=":"
      :model="form"
      label-width="110px"
      class="form"
    >
      <el-form-item label="搜索" class="formItem">
        <el-input
          v-model="form.search"
          placeholder="请输入关键词"
          size="small"
        ></el-input>
      </el-form-item>

      <el-form-item label="问题搜索维度" class="formItem" v-if="pageSet">
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

      <el-form-item label="页面" class="formItem">
        <el-select size="small" v-model="form.yemian" placeholder="请选择">
          <el-option
            v-for="tar in yemianList"
            :key="tar.name"
            :label="tar.name"
            :value="tar.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="search">查 询</el-button>
        <el-button size="small" @click="reset">重 置</el-button>
        <el-button size="small" type="info" plain @click="daochu"
          >导出问题库</el-button
        >
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
      pageSet: null, // 页面初始化数据
      yemianList: [], // 页面的下拉数据
      form: {
        search: "",
        weidu: "",
        yemian: "",
      },

      // 表格的源数据
      tableData: {
        type: "tree", // 控制表格显示类型
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示数量
        totalNum: 10, // 总共条数
        buttonName: "新 增",
        effectTimeOrderParam: 2, // 生效时间排序 1:升序 2;降序
        updateTimeOrderParam: 2, // 最近操作时间排序 1:升序 2;降序
        titles: [
          {
            title: "标题",
            key: "title",
            minWidth: "130",
          },
          {
            title: "内容",
            key: "content",
            minWidth: "130",
            fuWenBen: true,
          },
          {
            title: "所属分类",
            key: "fenlei",
            minWidth: "130",
          },
          {
            title: "所属页面",
            key: "page",
            minWidth: "130",
          },
          {
            title: "用户类型",
            key: "yonghu",
            minWidth: "130",
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
            title: "生效设备",
            key: "shebei",
            minWidth: "130",
          },
          {
            title: "生效渠道",
            key: "qudao",
            minWidth: "130",
          },
        ],
        lists: [],
      },
    };
  },
  created() {
    // 获取各种下拉初始化数据
    let canshu = sessionStorage.getItem("canshuWenTi");
    if (canshu) {
      this.pageSet = { ...JSON.parse(canshu) };
    } else {
      this.$http
        .getPeiZhi({ vm: this, url: "/helpQuestion/forQuestionPage" })
        .then((res) => {
          if (res.status == 200) {
            this.pageSet = { ...res.data.data };
            sessionStorage.setItem("canshuWenTi", JSON.stringify(this.pageSet));
          }
        });
    }
    this.search();
  },
  methods: {
    // 根据维度获取页面
    getYeMian() {
      this.form.yemian = "";
      this.$http
        .getYeMianData({ vm: this, data: this.form.weidu })
        .then((res) => {
          if (res.status == 200) {
            this.yemianList = res.data.data[Object.keys(res.data.data)[0]];
          }
        });
    },
    // 执行查询
    search() {
      let obj = {
        pageNum: this.tableData.currentPage,
        pageSize: this.tableData.pageSize,
        effectTimeOrderParam: this.tableData.effectTimeOrderParam, // 生效时间排序 1:升序 2;降序
        updateTimeOrderParam: this.tableData.updateTimeOrderParam, // 最近操作时间排序 1:升序 2;降序
      };
      if (this.form.keywords !== "") {
        obj.keywords = this.form.search; // 搜索关键字
      }
      if (this.form.weidu !== "") {
        obj.dimension = this.form.weidu; // 问题维度
      }
      if (this.form.yemian !== "") {
        if (this.form.weidu === 1) {
          // 问题分类id
          obj.categoryId = this.form.yemian;
        } else {
          // 页面id
          obj.entranceId = this.form.yemian;
        }
      }
      // 获取列表数据
      this.$http
        .getWenTiList({
          vm: this,
          data: obj,
        })
        .then((res) => {
          if (res.status == 200) {
            this.httpData = res.data.data;
            this.tableData.currentPage = this.httpData.currentPage;
            this.tableData.totalNum = this.httpData.totalCount;

            this.tableData.lists = this.httpData.data.map((t) => {
              let obj = {
                id: t.id, // 问题分类id
                title: t.title, // 标题
                content: t.content, // 内容
                caozuoTime: t.updTime, // 最近操作时间
                shengxiao: t.effectTime, // 生效时间
                shebei: this.pageSet.deviceTypeList.filter(
                  // 生效设备
                  (f) => f.value === t.deviceType
                )[0].name,
                qudao: this.pageSet.appFlagList.filter(
                  // 生效渠道
                  (f) => f.value === t.appFlag
                )[0].name,
                fenlei: t.typeStr, // 所属分类
              };

              if (t.questionEntranceRelationList.length) {
                obj.children = t.questionEntranceRelationList.map((k) => ({
                  id: k.id,
                  page: k.entranceName, // 所属页面
                  yonghu: k.visibleUserStr, // 用户类型
                  isChildren: true,
                }));
              } else {
                obj.page = t.entranceStr; // 所属页面
                obj.yonghu = t.visibleUserStr; // 用户类型
              }
              return obj;
            });
          }
        });
    },
    // 重置
    reset() {
      Object.keys(this.form).forEach((str) => {
        this.form[str] = "";
      });
      this.search();
    },
    // 导出问题库
    daochu() {
      let a = document.createElement("a");
      a.href = `${this.$axios.defaults.baseURL}/helpQuestion/export`; //  URL对象
      a.target = "_blank";
      a.click(); // 模拟点击
    },
    tableEmit(data) {
      switch (data.type) {
        case "add": // 新增
          this.$router.push({
            name: "question_edit",
          });
          break;
        case "edit": // 修改
          this.$router.push({
            name: "question_edit",
            params: this.httpData.data.filter((t) => t.id === data.data.id)[0],
          });
          break;
        case "delete": // 删除
          this.$http
            .wenTiDeleteData({
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