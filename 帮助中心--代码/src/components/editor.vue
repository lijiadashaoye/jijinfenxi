<template>
  <div class="wap">
    <div ref="toolbar" class="toolbar"></div>
    <span v-if="show" class="pla">请输入</span>
    <div ref="text" class="text"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  model: {
    prop: "inData",
    event: "returnBack",
  },
  computed: {
    inData: {
      set: function (t) {
        let k = t;
        if (this.checkVal(t)) {
          k = "";
          this.show = true;
        } else {
          this.show = false;
        }
        this.$emit("returnBack", k);
      },
      get: function (t) {
        return t.$attrs.inData;
      },
    },
  },
  data() {
    return {
      editor: null,
      show: true,
    };
  },
  mounted() {
    // 文档：https://www.kancloud.cn/wangfupeng/wangeditor3/332599
    this.editor = new E(this.$refs.toolbar, this.$refs.text);
    // this.editor.customConfig.uploadImgShowBase64 = true; // 转成base64
    this.editor.customConfig.showLinkImg = false; // 隐藏上传网络图片选项
    this.editor.customConfig.onchangeTimeout = 200;
    this.editor.customConfig.onchange = (html) => {
      this.inData = html;
    };

    // 上传图片到服务器

    // 测试用上传图片地址
    // this.editor.customConfig.uploadImgServer =
    //   "http://app-test4.bicai365.com/omp/finsuitFileUpload/forUpload";
    // 生产环境用上传图片地址
    this.editor.customConfig.uploadImgServer =
      this.$axios.defaults.baseURL + "/finsuitFileUpload/forUpload";

    // 上传图片时携带自定义参数
    // editor.customConfig.uploadImgParams = {
    //   token: "abcdef12345",
    // };
    // 跨域传递 cookie
    this.editor.customConfig.withCredentials = true;

    this.editor.customConfig.uploadImgTimeout = 50000; // 上传超时
    this.editor.customConfig.uploadImgHooks = {
      // 将图片插入富文本编辑器内
      customInsert: (insertImg, result) => {
        var url =
          this.$axios.defaults.baseURL +
          "/finsuitImgDisplay/show?path=" +
          result.data[0];
        insertImg(url);
      },
      // before: () => {
      //   console.log(8);
      // },
      // success: () => {
      //   console.log(9);
      // },
    };

    this.editor.create();
    if (this.inData !== "") {
      this.editor.txt.html("" + this.inData);
      this.show = false;
    }
  },
  methods: {
    checkVal(str) {
      let num = 0,
        reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g;
      while (num < str.length && str != "") {
        num++;
        let k = str.match(reg);
        if (k) {
          str = str.replace(k[0], "");
        }
      }
      return str == "";
    },
  },
};
</script>

<style>
.wap {
  padding: 0;
  position: relative;
  min-width: 420px;
  z-index: 2 !important;
}
.toolbar {
  width: 50px;
  display: flex!;
  flex-wrap: wrap;
  border: 1px solid rgb(199, 196, 196);
  width: 100%;
}
.toolbar > div {
  padding: 0 3px !important;
}
.text {
  width: 100%;
  box-sizing: border-box !important;
  border: 1px solid rgb(199, 196, 196);
  min-height: 150px;
}
.w-e-text {
  overflow-y: hidden !important;
}
.pla {
  position: absolute;
  left: 15px;
  top: 40px;
  color: rgb(167, 164, 164);
}
.w-e-droplist {
  background: rgb(158, 190, 177) !important;
}
</style>

