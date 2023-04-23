<script setup>

</script>

<script>
import { nextTick } from 'vue';

export default {
  props: ['data'],
  data() {
    return {
      open: false,
      editingName: false,
      initialDescription: this.data.description,
      currentDescription: this.data.description,
      descriptionChanged: false,
    };
  },
  created() {
    if (!this.data.id) {
      this.open = true;
    }

    if (this.data.name.length === 0) {
      this.editingName = true;

      nextTick(() => {
        this.$refs.element.querySelector('.input-name').focus();
      });
    }
  },
  watch: {
    open(val) {
      if (val === false) {
        this.editingName = false;
      }
    },
    data(val, prevVal) {
      if (!prevVal.id && val.id) {
        this.open = false;
      }

      this.initialDescription = val.description;
      this.currentDescription = val.description;
      this.descriptionChanged = false;
    },
    currentDescription(val) {
      this.descriptionChanged = val !== this.initialDescription;
    },
  },
  methods: {
    onElementClick() {
      if (this.open === false) {
        this.open = true;
      }
    },
    onToggleOpen(e) {
      this.open = !this.open;
      e.stopPropagation();
    },
    onEditNameClick() {
      this.editingName = true;

      nextTick(() => {
        this.$refs.element.querySelector('.input-name').select();
      });
    },
    onEditNameEnterPressed() {
      this.$emit('save');
      this.editingName = false
    },
    onUpdateDescriptionClick() {
      this.data.description = this.currentDescription;
      this.$emit('save-description');
    }
  },
};
</script>

<template>
  <div
    class="Story"
    :class="{ 'open': open }"
    ref="element"
    @click="onElementClick"
  >
    <div class="name-wrapper">
      <button
        v-if="open && data.id"
        class="btn-toggle-open"
        @click="onToggleOpen"
      >
        <font-awesome-icon icon="fa-solid fa-caret-up" v-if="open" size="lg" />
      </button>

      <input
        type="text"
        v-if="editingName"
        class="input-name"
        v-model="data.name"
        @keyup.enter="onEditNameEnterPressed"
      />

      <span
        v-if="!editingName"
        class="name"
      >{{ data.name }}</span>

      <button
        v-if="!editingName && open"
        class="btn-edit-name"
        @click="onEditNameClick"
      >
        <font-awesome-icon icon="fa-solid fa-pencil" size="sm" />
      </button>
    </div>

    <div
      v-if="!data.id"
      class="w-100 mt-1 d-flex justify-content-end"
    >
      <button
        :class="{ 'hide': data.name.trim().length === 0 }"
        class="btn-save"
        @click="$emit('save')"
      >
        Save
      </button>

      <button
        v-if="!data.id"
        class="btn-cancel"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>

    <div
      v-if="open"
      class="description-wrapper"
    >
      <span class="header">DESCRIPTION</span>

      <textarea
        rows="5"
        v-model="currentDescription"
      ></textarea>

      <button
        v-if="data.id && descriptionChanged"
        class="btn-update-description"
        @click="onUpdateDescriptionClick"
      >
        Update
      </button>
    </div>
  </div>
</template>

<style lang="scss">
@import '../assets/variables.scss';

.Story {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
  font-size: 14px;
  cursor: pointer;

  &.open {
    padding: 7px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    cursor: unset;
  }

  .name-wrapper {
    width: 100%;
    display: flex;

    .btn-toggle-open {
      padding: 0 7px;
    }

    .input-name {
      width: calc(100% - 10px - 10px);
      padding: 10px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
      font-size: 14px;
    }

    .name {
      flex: 1;
      padding: 8px;
      padding-left: 10px;
    }

    .btn-edit-name {
      padding: 0 7px;
    }
  }

  .btn-save {
    @include button();
    @include button_outline();
    @include button_sm();
  }

  .btn-cancel {
    @include button();
    @include button_neutral();
    @include button_outline('neutral');
    @include button_sm();
    margin-left: 5px;
  }

  .description-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;

    .header {
      margin-left: 5px;
      font-weight: bold;
      font-size: 11px;
    }

    textarea {
      @include styled_scrollbar();
      width: calc(100% - 10px - 10px);
      margin-top: 3px;
      padding: 10px;
      border-radius: 5px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgb(209, 213, 219) 0px 0px 0px 1px inset;
    }

    .btn-update-description {
      @include button();
      @include button_outline();
      @include button_xs();
      align-self: flex-end;
      margin-top: 5px;
    }
  }
}
</style>
