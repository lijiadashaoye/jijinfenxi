<template>
  <el-form
    label-suffix=":"
    :model="form"
    :rules="rules"
    ref="form"
    label-width="160px"
    class="isForm"
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

    <el-form-item label="类型选择" prop="leixing">
      <el-select
        @change="getRukouList"
        v-model="form.leixing"
        clearable
        placeholder="请选择"
      >
        <el-option
          v-for="item in pageSet.entranceTypeList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="入口选择" prop="rukou">
      <el-select v-model="form.rukou" clearable placeholder="请选择">
        <el-option
          v-for="item in rukouList"
          :key="item.name"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="展示时间" prop="time">
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
export default {
  data() {
    return {
      form: {
        qudao: ["全部"], // 生效渠道
        shebei: ["全部"], // 生效设备
        leixing: "", // 类型选择
        rukou: "", // 入口选择
        time: "", // 生效时间
        qiyong: "", // 是否启用
      },
      pageSet: [], // 配置页面的原数据
      rukouList: [], // 入口选择下拉数据
      rules: {
        qudao: [
          { required: true, message: "请选择生效渠道", trigger: "change" },
        ],
        shebei: [
          { required: true, message: "请选择生效设备", trigger: "change" },
        ],
        time: [
          { required: true, message: "请选择生效时间", trigger: "change" },
        ],
        qiyong: [
          { required: true, message: "请选择是否启用", trigger: "change" },
        ],
        leixing: [{ required: true, message: "请选择类型", trigger: "change" }],
        rukou: [{ required: true, message: "请选择入口", trigger: "change" }],
      },
    };
  },
  created() {
    this.pageSet = JSON.parse(sessionStorage.getItem("canshuRuKou"));
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
        leixing: k.entranceType, // 类型选择
        rukou: k.entranceName, // 入口选择
        time: k.effectTime, // 生效时间
        qiyong: this.pageSet.qiyongList.filter(
          (t) => t.value === k.enableStatus
        )[0].name, // 是否启用
      };
      this.getRukouList();
    }
  },

  methods: {
    // 获取入口类型数据
    getRukouList() {
      this.$http
        .rukouList({ vm: this, data: this.form.leixing })
        .then((res) => {
          if (res.status == 200) {
            this.rukouList = res.data.data;
          }
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
        if (valid) {
          let obj = {
            appFlag: this.pageSet.appFlagList.filter(
              (t) => t.name === this.form.qudao[0]
            )[0].value, //生效渠道
            deviceType: this.pageSet.deviceTypeList.filter(
              (t) => t.name === this.form.shebei[0]
            )[0].value, //生效设备
            entranceType: this.form.leixing, //入口类型
            entranceName: this.form.rukou, //入口名称
            effectTime: this.form.time, //生效时间
            enableStatus: this.pageSet.qiyongList.filter(
              (t) => t.name === this.form.qiyong
            )[0].value, //生效状态
          };

          let id = this.$route.params.id,
            fnName = "rukouAddData";
          if (id) {
            obj.id = id;
            fnName = "rukouUpData";
          }
          // console.log(obj);
          // console.log(fnName);
          this.$http[fnName]({
            vm: this,
            data: obj,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$router.push({
                name: "rukou",
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
        name: "rukou",
      });
    },
  },
};
</script>
