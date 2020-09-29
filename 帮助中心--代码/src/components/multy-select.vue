<template>
  <el-cascader
    clearable
    filterable
    :show-all-levels="false"
    :props="{multiple:true}"
    v-model="value"
    @change="isChange"
    :options="datas"
  ></el-cascader>
</template>

<script>
export default {
  data() {
    return {
      value: []
    };
  },
  props: ["datas"],
  methods: {
    isChange() {
         this.$emit("selectEmit", this.value);
    }
  }
};
</script>

<style>
</style>