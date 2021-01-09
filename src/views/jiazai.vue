<template>
  <div class="wap">
    <div class="zhong">
      <p>首次预计10分钟加载完</p>
      <ul class="content">
        <li v-for="i of arr" :key="i"></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [],
    };
  },
  created() {
    this.arr = Array.from({ length: 20 }, (v, index) => (v ? "" : index));
  },
  methods: {},
};
</script>

<style scoped>
.wap {
  background: rgb(224, 222, 222);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 50;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.wap > p {
  position: absolute;
  top: 48%;
  left: 41%;
  text-align: center;
  font-size: 20px;
}
.zhong {
  width: 210px;
  height: 200px;
  position: relative;
}
.zhong > p {
  position: absolute;
  top: 44%;
  left: 2px;
}
.content {
  width: 100%;
  height: 100%;
  position: relative;
  animation: zhuan 4s linear infinite;
  list-style-type: none;
}
.content > p {
  position: absolute;
}
.content > li {
  background: red;
  width: 40px;
  height: 1px;
  position: absolute;
  transform-origin: 20px 0;
}
.content > li:nth-child(1) {
  top: 20px;
  left: calc(50% - 20px);
  transform: rotate(90deg);
}
.content > li:nth-child(2) {
  bottom: 20px;
  left: calc(50% - 20px);
  transform: rotate(90deg);
}
.content > li:nth-child(3) {
  top: 50%;
  left: 0;
}
.content > li:nth-child(4) {
  top: 50%;
  right: 0;
}
.content > li:nth-child(5) {
  top: 12%;
  left: calc(50% - 44px);
  transform: rotate(70deg);
}
.content > li:nth-child(6) {
  top: 19%;
  left: calc(60% - 88px);
  transform: rotate(42deg);
}
.content > li:nth-child(7) {
  top: 29%;
  left: calc(50% - 84px);
  transform: rotate(23deg);
}
.content > li:nth-child(8) {
  top: 38%;
  left: calc(50% - 95px);
  transform: rotate(18deg);
}
.content > li:nth-child(9) {
  top: 12%;
  right: calc(50% - 44px);
  transform: rotate(-70deg);
}
.content > li:nth-child(10) {
  top: 19%;
  right: calc(60% - 88px);
  transform: rotate(-42deg);
}
.content > li:nth-child(11) {
  top: 29%;
  right: calc(50% - 84px);
  transform: rotate(-23deg);
}
.content > li:nth-child(12) {
  top: 38%;
  right: calc(50% - 95px);
  transform: rotate(-18deg);
}
.content > li:nth-child(13) {
  bottom: 12%;
  left: calc(50% - 44px);
  transform: rotate(-70deg);
}
.content > li:nth-child(14) {
  bottom: 19%;
  left: calc(60% - 88px);
  transform: rotate(-42deg);
}
.content > li:nth-child(15) {
  bottom: 29%;
  left: calc(50% - 84px);
  transform: rotate(-23deg);
}
.content > li:nth-child(16) {
  bottom: 38%;
  left: calc(50% - 95px);
  transform: rotate(-18deg);
}
.content > li:nth-child(17) {
  bottom: 12%;
  right: calc(50% - 44px);
  transform: rotate(70deg);
}
.content > li:nth-child(18) {
  bottom: 19%;
  right: calc(60% - 88px);
  transform: rotate(42deg);
}
.content > li:nth-child(19) {
  bottom: 29%;
  right: calc(50% - 84px);
  transform: rotate(23deg);
}
.content > li:nth-child(20) {
  bottom: 38%;
  right: calc(50% - 95px);
  transform: rotate(18deg);
}

@keyframes zhuan {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>