<template>
  <div class="upImgWaper">
    <span class="uping" v-if="uping">上传中...</span>
    <div class="showImg" @click="upImg" title="添加图片">
      <img
        v-if="imgUrl"
        :src="`${this.$axios.defaults.baseURL}/finsuitImgDisplay/show?path=${imgUrl}`"
        class="isImg"
      />
      <div v-else>
        <p>选择图片</p>
        <p>小于3M png/jpeg/jpg/gif</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  model: {
    prop: "imgUrl",
    event: "selectImg",
  },
  data() {
    return {
      uping: false,
    };
  },
  computed: {
    imgUrl: {
      get: function (t) {
        return t.$attrs.imgUrl;
      },
    },
  },
  methods: {
    // 执行上传，并生成本地预览
    upImg() {
      let inputs = document.createElement("input");
      inputs.setAttribute("type", "file");
      inputs.click();
      inputs.onchange = (event) => {
        let file_data = event.path[0].files[0];
        let type1 = String(file_data.type.split("/")[0]).toLowerCase();
        let type2 = String(file_data.type.split("/")[1]).toLowerCase();
        if (type1 === "image") {
          let isLt2M = file_data.size / 1024 / 1024 > 3;
          if (isLt2M) {
            this.$message.error("图片不能大于 3M");
          } else if (
            type2 == "png" ||
            type2 == "jpeg" ||
            type2 == "jpg" ||
            type2 == "gif" ||
            type2 == "bmp"
          ) {
            this.uping = true;
            let formData = new FormData();
            formData.append("file", file_data);
            let ok = false;
            // 设置超时
            setTimeout(() => {
              if (!ok) {
                this.uping = false;
              }
            }, 6000);

            // 执行上传
            this.$http
              .UPImg({
                vm: this,
                data: formData,
              })
              .then((res) => {
                let data = res.data;
                if (data.result) {
                  this.$emit("selectImg", data.data[0]);
                } else {
                  this.$message.error(data.description);
                  this.uping = false;
                }
              });
          } else {
            this.$message.error("请使用 png/jpeg/jpg/gif 类型图片！");
          }
        } else {
          this.$message.error("请选择图片类型文件！");
        }
      };
    },
  },
};
</script>

<style scoped='true' lang="scss">
.isImg {
  display: block;
  width: 200px;
}
.upImgWaper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgb(245, 245, 245);
  border-radius: 5px;
  position: relative;
  min-width: 100px;
}
.showImg {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}
.showImg > div > p:nth-of-type(1) {
  padding: 0;
  font-size: 16px;
  line-height: 16px;
  color: rgb(209, 206, 206);
  text-align: center;
}
.showImg > div > p:nth-of-type(2) {
  padding: 0;
  font-size: 12px;
  line-height: 16px;
  color: rgb(209, 206, 206);
  text-align: center;
}
.toDelete {
  position: absolute;
  top: -6px;
  right: -5px;
  z-index: 5;
}
.toDelete:hover {
  cursor: pointer;
  color: red;
}
.uping {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 100px;
  background: rgb(230, 228, 228);
  font-size: 14px;
  font-weight: bold;
  color: rgb(107, 103, 103);
}
</style>
