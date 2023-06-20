<script>
export default {
  props: ['open', 'onClose', 'fullHeight'],
  created() {
    this.onWindowKeydown = (e) => {
      if (e.code === 'Escape') {
        this.onClose();
      }
    };

    if (this.open) {
      window.addEventListener('keydown', this.onWindowKeydown);
    }
  },
  watch: {
    open: function(val) {
      if (val === true) { // opened
        window.addEventListener('keydown', this.onWindowKeydown);
      } else { // closed
        window.removeEventListener('keydown', this.onWindowKeydown);
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onWindowKeydown);
  },
};
</script>

<template>
  <div class="Window" :class="{ 'open': open, 'full-height': fullHeight }">
    <div class="content">
      <button
        class="icon-close"
        @click="onClose"
      >
        <font-awesome-icon icon="fa-solid fa-times" />
      </button>

      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.Window {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 997;

  &.open {
    display: flex;
  }

  .content {
    position: relative;
    max-width: calc(100% - ($window-padding * 2) - ($window-padding * 2));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: $window-padding;
    border-radius: 10px;
    background-color: $window-background-color;
    color: $window-text-color;

    .icon-close {
      position: absolute;
      top: 15px;
      right: 15px;
      background-color: transparent;
      font-size: 22px;
      color: $window-text-color;
      cursor: pointer;
    }
  }

  &.full-height {
    
    .content {
      height: calc(100% - ($window-padding * 2) - ($window-padding * 2));
    }
  }
}
</style>
