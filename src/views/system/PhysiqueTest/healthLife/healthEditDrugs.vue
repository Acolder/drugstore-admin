<template>
  <div>
    <info :healthLife="4"></info>
  </div>
</template>

<script>
import healthLifeInfo from './healthLifeInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': healthLifeInfo
  }
};
</script>

<style>

</style>