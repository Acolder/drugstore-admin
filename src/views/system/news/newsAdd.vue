<template>
  <div>
    <info :newsAdd="true"></info>
  </div>
</template>

<script>
import newsInfo from './newsInfo';
export default {
  data() {
    return {};
  },
  components: {
    'info': newsInfo
  }
};
</script>

<style>

</style>
