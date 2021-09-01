<template>
  <div class="logo row">
    <div class="logo-image">
      <Logo />
    </div>
  </div>
</template>

<script>
import Logo from "../components/Logo.vue";
export default {
  name: "Header",
  components: { Logo },
};
</script>
<style scoped>
.logo {
  padding-top: 8px;
  padding-bottom: 4px;
}

.logo-image {
  margin-left: 26px;
}
</style>