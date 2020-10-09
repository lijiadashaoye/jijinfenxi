<template>
  <div class="wap">
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
      // 表格的源数据
      tableData: {
        type: "normal", // 控制表格显示类型
        currentPage: 1, // 当前页码
        pageSize: 10, // 每页显示数量
        totalNum: 10, // 总共条数
        buttonName: "新 增",
        titles: [
          {
            title: "在线客服启用位置",
            key: "weizhi",
            minWidth: "130",
          },
          {
            title: "最近操作时间",
            key: "caozuoTime",
            minWidth: "130",
            sortable: true,
          },
          {
            title: "启用状态",
            key: "qiyong",
            minWidth: "80",
          },
          {
            title: "生效时间",
            key: "shengxiao",
            minWidth: "130",
            sortable: true,
          },
          {
            title: "生效渠道",
            key: "qudao",
            minWidth: "130",
          },
          {
            title: "生效设备",
            key: "shebei",
            minWidth: "130",
          },
        ],
        lists: [],
      },
    };
  },
  created() {
    // 获取各种下拉初始化数据
    let canshu = sessionStorage.getItem("canshuKeFu");
    if (canshu) {
      this.pageSet = { ...JSON.parse(canshu) };
    } else {
      this.$http
        .getPeiZhi({ vm: this, url: "/onlineService/forOnlineServicePage" })
        .then((res) => {
          if (res.status == 200) {
            this.pageSet = { ...res.data.data };
            sessionStorage.setItem("canshuKeFu", JSON.stringify(this.pageSet));
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
        effectTimeOrderParam: this.tableData.effectTimeOrderParam, // 生效时间排序 1:升序 2;降序
        updateTimeOrderParam: this.tableData.updateTimeOrderParam, // 最近操作时间排序 1:升序 2;降序
      };

      this.$http
        .getKeFuList({
          vm: this,
          data: obj,
        })
        .then((res) => {
          if (res.status == 200) {
            this.httpData = res.data.data;
            this.tableData.currentPage = this.httpData.currentPage;
            this.tableData.totalNum = this.httpData.totalCount;
            this.tableData.lists = this.httpData.data.map((t) => ({
              id: t.id,
              weizhi: this.pageSet.onlineServiceEntranceList.filter(
                (d) => d.value === t.entranceType
              )[0].name,
              qiyong: this.pageSet.enableList.filter(
                (d) => d.value === t.enableStatus
              )[0].name,
              caozuoTime: t.updTime,
              shengxiao: t.effectTime,
              qudao: t.appFlagStr,
              shebei: this.pageSet.deviceTypeList.filter(
                (d) => d.value === t.deviceType
              )[0].name,
            }));
          }
        });
    },
    tableEmit(data) {
      switch (data.type) {
        case "add": // 新增
          this.$router.push({
            name: "kefu_edit",
          });
          break;
        case "edit": // 修改
          this.$router.push({
            name: "kefu_edit",
            params: this.httpData.data.filter((t) => t.id === data.data.id)[0],
          });
          break;
        case "delete": // 删除
          this.$http
            .keFuDeleteData({
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