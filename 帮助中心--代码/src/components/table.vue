<template>
  <div class="tables">
    <el-button
      @click="toAdd"
      size="mini"
      type="primary"
      v-if="datas.buttonName"
      >{{ datas.buttonName }}</el-button
    >
    <!-- normal -->
    <el-table
      v-if="datas.type == 'normal'"
      @sort-change="sortChange"
      size="normal"
      :data="datas.lists"
      border
      style="width: 100%; margin: 15px 0"
    >
      <el-table-column
        align="center"
        width="50"
        type="index"
        label="编号"
      ></el-table-column>

      <el-table-column
        :minWidth="tar.minWidth"
        v-for="tar in datas.titles"
        :key="tar.key"
        align="center"
        :label="tar.title"
        :sortable="tar.sortable"
      >
        <template slot-scope="scope">
          <span v-if="!tar.hasImg">{{ scope.row[tar.key] }}</span>
          <img v-else style="max-width: 80px" :src="scope.row[tar.key]" />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="text"
            style="padding: 5px 10px"
            size="mini"
            plain
            @click="handleEdit(scope.row)"
            >修改</el-button
          >

          <el-button
            style="padding: 5px 10px"
            size="mini"
            type="text"
            plain
            @click="dialogClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- tree -->
    <el-table
      @sort-change="sortChange"
      v-if="datas.type == 'tree'"
      :data="datas.lists"
      style="width: 100%; margin: 15px 0"
      row-key="id"
      border
      :tree-props="{ children: 'children' }"
    >
      <el-table-column
        :minWidth="tar.minWidth"
        v-for="tar in datas.titles"
        :key="tar.key"
        align="center"
        :label="tar.title"
        :sortable="tar.sortable"
      >
        <template slot-scope="scope">
          <span v-if="tar.fuWenBen" v-html="scope.row[tar.key]"></span>
          <span v-else> {{ scope.row[tar.key] }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope" v-if="!scope.row.isChildren">
          <el-button
            type="text"
            style="padding: 5px 10px"
            size="mini"
            plain
            @click="handleEdit(scope.row)"
            >修改</el-button
          >

          <el-button
            style="padding: 5px 10px"
            size="mini"
            type="text"
            plain
            @click="dialogClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- paixu -->
    <el-table
      v-if="datas.type == 'paixu'"
      size="normal"
      :data="datas.lists"
      border
      style="width: 100%; margin: 15px 0"
    >
      <el-table-column
        :minWidth="tar.minWidth"
        v-for="tar in datas.titles"
        :key="tar.key"
        align="center"
        :label="tar.title"
      >
        <template slot-scope="scope">
          <span v-if="tar.fuWenBen" v-html="scope.row[tar.key]"></span>
          <span v-else> {{ scope.row[tar.key] }}</span>

          <i
            v-if="tar.key == 'shunxu'"
            @click="yiwei(scope.row, true)"
            class="el-icon-top paixu"
            title="向上移动一位"
          ></i>
          <i
            v-if="tar.key == 'shunxu'"
            @click="yiwei(scope.row, false)"
            class="el-icon-bottom paixu"
            title="向下移动一位"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogSure(false)">取 消</el-button>
        <el-button size="mini" type="primary" @click="dialogSure(true)"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      align="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="datas.currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="datas.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="datas.totalNum"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      dialogData: null,
    };
  },
  props: ["datas"],
  methods: {
    // 点击表格的删除按钮
    dialogClick(e) {
      this.dialogData = e;
      setTimeout(() => (this.dialogVisible = true));
    },
    // 弹框的确认按钮
    dialogSure(type) {
      if (type) {
        this.handleDelete(this.dialogData);
      }
      this.dialogData = null;
      this.dialogVisible = false;
    },
    // 点击排序
    sortChange(e) {
      if (e.order) {
        let label =
          e.column.label == "生效时间"
            ? "effectTimeOrderParam"
            : "updateTimeOrderParam";
        this.datas[label] = this.datas[label] == 1 ? 2 : 1;
        this.$emit("tableEmit", {
          type: "search",
        });
      } else {
        this.datas.effectTimeOrderParam = 2;
        this.datas.updateTimeOrderParam = 2;
        this.$emit("tableEmit", {
          type: "search",
        });
      }
    },
    // 新增
    toAdd() {
      this.$emit("tableEmit", {
        type: "add",
      });
    },
    // 修改
    handleEdit(data) {
      this.$emit("tableEmit", {
        type: "edit",
        data: data,
      });
    },
    // 删除
    handleDelete(data) {
      this.$emit("tableEmit", {
        type: "delete",
        data: data,
      });
    },
    // 分页变更显示量
    handleSizeChange(val) {
      this.datas.pageSize = val;
      this.$emit("tableEmit", {
        type: "search",
      });
    },
    // 分页切换页码
    handleCurrentChange(val) {
      this.datas.currentPage = val;
      this.$emit("tableEmit", {
        type: "search",
      });
    },
    yiwei(data, type) {
      this.$emit("tableEmit", {
        type: "yiwei",
        data: data,
        to: type,
      });
    },
  },
};
</script>

<style>
.paixu {
  width: 10px;
  cursor: pointer;
  margin-left: 12px;
}
.paixu:hover {
  transform: scale(1.5);
  font-weight: bold;
}
</style>