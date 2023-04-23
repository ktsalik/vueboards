<script setup>

</script>

<script>
export default {
  props: ['open'],
  emits: ['close'],
  data() {
    return {
      position: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.onWindowClick = (e) => {
      if (!this.$refs.element.parentNode.contains(e.target)) {
        this.$emit('close');
      }
    };

    if (this.open) {
      window.addEventListener('click', this.onWindowClick);
    }
  },
  beforeUnmount() {
    window.removeEventListener('click', this.onWindowClick);
  },
  watch: {
    open: function(val) {
      if (val) {
        const parentEl = this.$refs.element.parentElement;
        const pos = parentEl.getBoundingClientRect();
        this.position.x = pos.x + (pos.width / 2);
        this.position.y = pos.y + pos.height;

        window.addEventListener('click', this.onWindowClick);
      } else {
        window.removeEventListener('click', this.onWindowClick);
      }
    }
  }
};
</script>

<template>
  <div
    class="ContextMenu"
    :class="{ 'open': open }"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
    ref="element"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.ContextMenu {
  position: fixed;
  display: none;
  transform: translate(-50%, 0);
  padding: 10px;
  border-radius: 5px;
  background-color: $component-background-color;
  box-shadow: $component-box-shadow;
  z-index: 997;

  &.open {
    display: flex;
  }
}
</style>
