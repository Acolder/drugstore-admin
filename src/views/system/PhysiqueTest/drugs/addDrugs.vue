<template>
  <div>
    <info :drugAdd="true"></info>
  </div>
</template>

<script>
import DrugInfo from './DrugInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': DrugInfo
  }
};
</script>

<style>

</style>