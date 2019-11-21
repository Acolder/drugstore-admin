<template>
  <div>
    <info :healthLife="3"></info>
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