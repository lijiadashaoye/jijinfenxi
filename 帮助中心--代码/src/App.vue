<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  beforeDestroy() {
    sessionStorage.removeItem("canshuRuKou");
    sessionStorage.removeItem("canshuFenLei");
    sessionStorage.removeItem("canshuWenTi");
    sessionStorage.removeItem("canshuPaiXu");
    sessionStorage.removeItem("canshuKeFu");
  },
};
</script>

<style>
body,
html,
ul,
p {
  padding: 0;
  margin: 0;
}
.wap {
  padding: 10px;
}
.title {
  font-size: 20px;
  font-weight: bold;
  border-bottom: 1px solid rgb(143, 141, 141);
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.form {
  display: flex;
  flex-wrap: wrap;
}
.formItem {
  box-sizing: border-box;
  margin-bottom: 5px !important;
}

.isForm {
  width: 60%;
  padding-top: 10px;
}
</style>
