<template>
        <div class="container">
          <login :mode="$route.query.mode||'PWD'" ></login>
        </div>
</template>

<script>
import login from '@/components/login.vue'

export default {
  data() {
    return {
    };
  },
  components: {
      login
  },
};
</script>