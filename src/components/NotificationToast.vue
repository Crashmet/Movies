<template>
  <div>
    <b-toast />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'NotificationToast',
  computed: {
    ...mapGetters(['messagePool']),
  },
  watch: {
    messagePool: 'showNotification',
    // следим за messagePool и если появились изменения показываем их в всплывающем окне
  },
  methods: {
    showNotification({ variant, msg, title }) {
      this.$bvToast.toast(msg, {
        title: title,
        variant: variant,
        solid: true,
      });
      // метод bootstrap для вывода настраеваемых всплывающих окон
    },
  },
};
</script>
