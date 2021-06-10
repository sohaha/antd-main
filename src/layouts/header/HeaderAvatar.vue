<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar" />
      <span class="name"> {{ user.name }}</span>
    </div>
    <template v-slot:overlay>
      <a-menu :class="['avatar-menu']" @click="clickItem">
        <a-menu-item key="info">
          <a-icon type="user" />
          <span>个人中心</span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="logout">
          <a-icon style="margin-right: 8px;" type="poweroff" />
          <span>退出登录</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script>
import { mapGetters } from 'vuex';
import { logout } from '@/api/user';

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  methods: {
    clickItem({ key }) {
      if (typeof this[key] !== 'function') {
        this.$message.warn(`未实现方法：${key}`, 3);
        return;
      }
      this[key]();
    },
    logout() {
      logout();
      this.$router.push('/login');
    },
  },
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>
