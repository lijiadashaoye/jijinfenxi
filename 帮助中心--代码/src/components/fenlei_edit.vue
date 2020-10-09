<template>
  <div>
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

      <el-form-item
        label="展示顺序"
        prop="showNum"
        style="width: 378px"
        required
      >
        <el-input min="1" type="number" v-model="form.showNum"></el-input>
      </el-form-item>

      <el-form-item label="分类问题标题" prop="title" style="width: 378px">
        <el-input v-model="form.title"></el-input>
      </el-form-item>

      <el-form-item prop="icon" label="图标" style="max-width: 378px">
        <imgUpload v-model="form.icon" />
      </el-form-item>

      <el-form-item label="生效时间" prop="time">
        <el-date-picker
          :value-format="'yyyy-MM-dd HH:mm:ss'"
          placeholder="请选择时间"
          v-model="form.time"
          type="datetime"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="是否启用" prop="qiyong">
        <el-radio-group v-model="form.qiyong">
          <el-radio label="是"></el-radio>
          <el-radio label="否"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <div class="save">
      <el-button size="small" type="primary" @click="submitForm"
        >保 存</el-button
      >
      <el-button size="small" type="info" @click="resetForm">取 消</el-button>
    </div>
  </div>
</template>

<script>
import imgUpload from "@/components/upImg.vue";
export default {
  components: { imgUpload },
  data() {
    var validShowNum = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入展示顺序"));
      } else {
        if (value < 0) {
          callback(new Error("展示顺序应为正整数"));
        } else {
          callback();
        }
      }
    };
    return {
      pageSet: [], // 配置页面的原数据
      form: {
        qudao: ["全部"], // 生效渠道
        shebei: ["全部"], // 生效设备
        showNum: "", // 展示顺序
        title: "", // 分类问题标题
        icon: "", // 图标
        time: "", // 生效时间
        qiyong: "", // 是否启用
      },
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
        showNum: [{ validator: validShowNum, trigger: "blur" }],
        title: [
          { required: true, message: "请输入分类问题标题", trigger: "blur" },
        ],
        icon: [{ required: true, message: "请上传图标", trigger: "change" }],
      },
    };
  },
  created() {
    this.pageSet = JSON.parse(sessionStorage.getItem("canshuFenLei"));
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
        showNum: +k.showOrder, // 展示顺序
        title: k.questionTypeTitle, // 分类问题标题
        icon: k.imgUrl, // 图标
        time: k.effectTime, // 生效时间
        qiyong: this.pageSet.qiyongList.filter(
          (t) => t.value === k.enableStatus
        )[0].name, // 是否启用
      };
    }
  },
  methods: {
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
    // 提交数据
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
            showOrder: +this.form.showNum, // 展示顺序
            questionTypeTitle: this.form.title, // 分类问题标题
            imgUrl: this.form.icon, // 图片url
            effectTime: this.form.time, // 生效时间
            enableStatus: this.pageSet.qiyongList.filter(
              (t) => t.name === this.form.qiyong
            )[0].value, //生效状态
          };
          let id = this.$route.params.id,
            fnName = "fenleiAddData";
          if (id) {
            // 修改
            obj.id = id;
            fnName = "fenleiUpData";
          }
          // console.log(obj);
          // console.log(fnName);

          this.$http[fnName]({
            vm: this,
            data: obj,
          }).then((res) => {
            if (res.data.code == 0) {
              this.$router.push({
                name: "fenlei",
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
            message: "请正确输入数据！",
            type: "error",
          });
        }
      });
    },
    // 取消
    resetForm() {
      this.$router.push({
        name: "fenlei",
      });
    },
  },
};
</script>

<style>
.part {
  border-bottom: 5px solid rgb(219, 216, 216);
}
.add {
  padding: 10px 0 10px 50px;
}
.save {
  padding: 10px 0 0 50px;
}
</style>