<template>
  <el-form
    label-suffix=":"
    :model="form"
    :rules="rules"
    ref="form"
    label-width="180px"
    class="isForm"
    style="padding-bottom: 200px"
  >
    <el-form-item label="生效渠道" prop="qudao">
      <el-checkbox-group v-model="form.qudao" @change="checkQudao">
        <el-checkbox
          v-for="item in pageSet.appFlagList"
          :key="item.value"
          :label="item.name"
          name="qudao"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="生效设备" prop="shebei">
      <el-checkbox-group v-model="form.shebei" @change="checkSheBei">
        <el-checkbox
          v-for="item in pageSet.deviceTypeList"
          :key="item.value"
          :label="item.name"
          name="qudao"
        ></el-checkbox>
      </el-checkbox-group>
    </el-form-item>

    <el-form-item label="问题标题" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item
      label="问题内容"
      prop="neirong"
      size="small"
      style="width: 100%"
    >
      <Editor v-model="form.neirong" />
    </el-form-item>

    <el-form-item label="所属自助查询类型选择" prop="leixing">
      <el-select v-model="form.leixing" clearable multiple placeholder="请选择">
        <el-option
          v-for="item in fenleiList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="猜你想问所属页面选择" style="margin: 5px" required>
      <el-button type="text" @click="add">
        <i class="el-icon-plus"></i>
        添加
      </el-button>
      <span v-if="showError" style="color: #f56c6c; margin-left: 20px"
        >请正确填写数据！</span
      >
    </el-form-item>

    <div
      style="display: flex"
      v-for="(t, ind) in form.suoshu"
      :key="ind"
      prop="suoshu"
    >
      <el-form-item label="页面选择" required label-width="250px">
        <el-select
          v-model="t.yemian"
          clearable
          placeholder="请选择"
          @change="showError = false"
        >
          <el-option
            v-for="item in yemianList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可见用户选择" required label-width="120px">
        <el-select
          v-model="t.yonghu"
          clearable
          placeholder="请选择"
          @change="showError = false"
        >
          <el-option
            v-for="item in pageSet.visibleUserList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </div>

    <el-form-item label="生效时间" prop="time">
      <el-date-picker
        :value-format="'yyyy-MM-dd HH:mm:ss'"
        placeholder="请选择时间"
        v-model="form.time"
        type="datetime"
      ></el-date-picker>
    </el-form-item>

    <el-form-item label="是否启用" prop="qiyong">
      <el-radio-group v-model="form.qiyong">
        <el-radio label="是"></el-radio>
        <el-radio label="否"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" @click="submitForm"
        >保 存</el-button
      >
      <el-button size="small" @click="resetForm">取 消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Editor from "./editor.vue";
export default {
  components: { Editor },
  data() {
    return {
      showError: false, // 猜你想问所属页面选择错误提示
      form: {
        qudao: ["全部"], // 生效渠道
        shebei: ["全部"], // 生效设备
        title: "", // 问题标题
        neirong: "", // 问题内容
        leixing: [], // 所属自助查询类型选择
        suoshu: [
          // 猜你想问所属页面选择
          {
            yemian: "",
            yonghu: "",
          },
        ],
        time: "", // 生效时间
        qiyong: "", // 是否启用
      },
      pageSet: [], // 配置页面的原数据
      fenleiList: [], // 所属自助查询类型选择
      yemianList: [], // 页面选择
      rules: {
        qudao: [
          { required: true, message: "请选择生效渠道", trigger: "change" },
        ],
        shebei: [
          { required: true, message: "请选择生效设备", trigger: "change" },
        ],
        title: [{ required: true, message: "请输入问题标题", trigger: "blur" }],
        neirong: [
          { required: true, message: "请输入问题内容", trigger: "blur" },
        ],
        leixing: [
          {
            required: true,
            message: "请选择所属自助查询类型",
            trigger: "change",
          },
        ],
        time: [
          { required: true, message: "请选择生效时间", trigger: "change" },
        ],
        qiyong: [
          { required: true, message: "请选择是否启用", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.pageSet = JSON.parse(sessionStorage.getItem("canshuWenTi"));
    // 获取猜你想问所属页面选择的页面选择下拉数据
    Promise.all([
      this.$http.getYeMianData({ vm: this, data: 1 }), // 页面
      this.$http.getYeMianData({ vm: this, data: 2 }), // 分类
    ]).then((res) => {
      this.yemianList = res[0].data.data[Object.keys(res[0].data.data)[0]];
      this.fenleiList = res[1].data.data[Object.keys(res[1].data.data)[0]];
    });

    let id = this.$route.params.id;
    if (id) {
      let k = this.$route.params;
      this.form = {
        qudao: [
          this.pageSet.appFlagList.filter((t) => t.value === k.appFlag)[0].name,
        ], // 生效渠道
        shebei: [
          this.pageSet.deviceTypeList.filter((t) => t.value === k.deviceType)[0]
            .name,
        ], // 生效设备
        title: k.title, // 问题标题
        neirong: k.content, // 问题内容
        leixing: k.questionTypeRelationList.map((t) => t.typeId),
        suoshu: k.questionEntranceRelationList.map((t) => ({
          yemian: t.entranceId,
          yonghu: +t.visibleUser,
        })),

        time: k.effectTime, // 生效时间
        qiyong: this.pageSet.enableList.filter(
          (t) => t.value === k.enableStatus
        )[0].name, // 是否启用
      };
    }
  },
  methods: {
    // 猜你想问所属页面选择添加
    add() {
      this.form.suoshu.push({
        yemian: "",
        yonghu: "",
      });
    },
    checkQudao() {
      let num = this.pageSet.appFlagList.length - 1;
      if (this.form.qudao.includes("全部") && this.form.qudao.length == num) {
        this.form.qudao = this.form.qudao.filter((t) => t !== "全部");
      }
      if (!this.form.qudao.includes("全部") && this.form.qudao.length == num) {
        this.form.qudao = ["全部"];
      }
    },
    checkSheBei() {
      let num = this.pageSet.deviceTypeList.length - 1;
      if (this.form.shebei.includes("全部") && this.form.shebei.length == num) {
        this.form.shebei = this.form.shebei.filter((t) => t !== "全部");
      }
      if (
        !this.form.shebei.includes("全部") &&
        this.form.shebei.length == num
      ) {
        this.form.shebei = ["全部"];
      }
    },
    // 保存数据
    submitForm() {
      this.$refs.form.validate((valid) => {
        // 验证猜你想问所属页面选择
        let validSuoShu = () => {
          let k = [];
          this.form.suoshu.forEach((t) => {
            Object.keys(t).forEach((d) =>
              t[d] == "" ? k.push(false) : k.push(true)
            );
          });

          if (k.includes(false)) {
            this.showError = true;
            return false;
          } else {
            return true;
          }
        };

        if (valid && validSuoShu()) {
          let obj = {
            appFlag: this.pageSet.appFlagList.filter(
              (t) => t.name === this.form.qudao[0]
            )[0].value, //生效渠道
            deviceType: this.pageSet.deviceTypeList.filter(
              (t) => t.name === this.form.shebei[0]
            )[0].value, //生效设备
            title: this.form.title,
            content: this.form.neirong,
            effectTime: this.form.time,
            enableStatus: this.pageSet.enableList.filter(
              (t) => t.name === this.form.qiyong
            )[0].value, //生效状态
            questionTypeRelationList: this.form.leixing.map((t) => ({
              typeId: t,
              categoryTitle: this.fenleiList.filter((d) => d.value === t)[0]
                .name,
            })),
            questionEntranceRelationList: this.form.suoshu.map((t) => ({
              entranceId: t.yemian, // 页面id
              entranceName: this.yemianList.filter(
                (d) => d.value === t.yemian
              )[0].name, // 页面名称
              visibleUser: t.yonghu, // 可见用户
            })),
          };
          let id = this.$route.params.id,
            fnName = "wenTiAddData";
          if (id) {
            // 修改
            obj.id = id;
            fnName = "wenTiUpData";
          }
          // console.log(obj);
          // console.log(fnName);

          this.$http[fnName]({
            vm: this,
            data: obj,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$router.push({
                name: "question",
              });
              this.$message({
                message: "保存成功！",
                type: "success",
              });
            } else {
              this.$message({
                message: "未成功保存数据！",
                type: "error",
              });
            }
          });
        } else {
          this.$message({
            message: `请正确填写数据！`,
            type: "error",
          });
        }
      });
    },
    // 取消
    resetForm() {
      this.$router.push({
        name: "question",
      });
    },
  },
};
</script>
