<template>
  <div>
    <info :newsAdd="false"></info>
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
