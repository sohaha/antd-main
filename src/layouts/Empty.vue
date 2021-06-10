<script>
// 占位使用
export default {
  name: 'Empty',
  render(h) {
    return h(
      'div',
      {
        attrs: {
          id: 'Empty',
        },
      },
      this.$slots.default
    );
  },
};
</script>
