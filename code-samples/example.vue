<template>
  <modal
    class="form-modal"
    V-model="show"
    :backdrop="false"
    :class="modalClass"
    :effect="effect === 'fade' ? 'fade' : effect === 'zoom' ? 'zoom' : ''"
    :large="size === 'large'"
    :small="size === 'small'"
    :width="width"
  >
    <!-- Modal Header -->
    <template slot="modal-header">
      <div class="modal-header" v-if="title">
        <span
          class="close fa fa-times"
          aria-hidden="true"
          @click="closeFormModal"
        ></span>
        <h4>
          <center v-if="titlePrettyPrint">{{ title | prettyPrint }}</center>
          <center v-else>{{ title }}</center>
        </h4>
      </div>
    </template>

    <!-- Modal Body -->
    <div slot="modal-body" class="modal-body">
      <div v-if="selected">
        <div class="thumbnail-preview text-center" v-if="thumbnail !== ''">
          <img :src="thumbnail" alt="thumbnail preview" />
        </div>

        <slot name="before-form"></slot>
        <vue-form-generator
          ref="formModalRef"
          :model="selected"
          :options="formOptions"
          :schema="fields"
          :tag="tag"
        ></vue-form-generator>
        <slot name="after-form"></slot>
      </div>
    </div>

    <!-- Modal Footer -->
    <div slot="modal-footer" class="modal-footer">
      <!-- Additional Buttons -->
      <template v-if="buttons">
        <template v-for="button in buttons">
          <button
            v-if="button.show"
            :class="button.class"
            :disabled="loader && saving"
            :key="button.valueKey"
            :value="button.value"
            :valueKey="button.valueKey"
            @click="postFormButton(button)"
          >
            {{ button.text }}
          </button>
        </template>
      </template>

      <!-- Common Buttons -->
      <loading-button
        class="btn btn-success"
        :loading="loader && saving"
        :disabled="submitDisabled"
        v-if="!noSubmit"
        @click.native="postForm()"
        >{{ saveText | prettyPrint }}</loading-button
      >

      <button
        type="button"
        class="btn"
        class="cancelButtonClass"
        :disabled="loader && saving"
        @click="closeFormModal"
      >
        {{ cancelText | prettyPrint }}
      </button>
    </div>
  </modal>
</template>

<script>
import axios from 'axios';
import objectToFormData from 'object-to-formdata';
import { modal } from 'vue-strap';
import loadingButton from '@/components/common/formElements/LoadingButton.vue';
import stringFilters from '@/filters/StringFilters.vue';

export default {
  name: 'form-modal',
  props: {
    action: {
      type: String,
      required: false,
    },
    buttons: {
      type: Object,
      required: false,
    },
    successText: {
      type: String,
      default: 'Data saved successfully',
      required: false,
    },
    width: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      model: null,
      Loader: false,
      submitDisabled: false,
    };
  },
  methods: {
    closeFormModal() {
      this.validateReset();
      this.$emit('close');
      this.loader = false;

      // Emit closedModal for child components //
      this.$bus.$emit('closedModal');
    },
    postForm() {
      this.post(this.url, this.callback, this.successText);
    },
    postFormButton(button) {
      const url = button.url ? button.url : this.url;
      const callback = button.callback ? button.callback : this.callback;
      const successText = button.successText ? button.successText : this.successText;
      const noSubmit = button.noSubmit ? button.noSubmit : false;

      if (!noSubmit) {
        this.post(url, callback, successText, button);
      } else if (callback) {
        this.$bus.$emit(callback);
      }
    },
    post(url, callback, successText, button = false) {
      if (this.validateForm()) {
        this.loader = true;

        if (this.selected) {
          const data = this.objectToFormData ? objectToFormData(this.selected) : this.selected;

          if (!this.noSubmit) {
            // Check for additional buttons key and value to add to data object //
            if (button.valuekey && button.value) {
              data[button.valuekey] = button.value;
            }

            axios.post(url, data, {
              headers: {
                'content-type': this.contentType,
                'X-CSRFToken': this.csrfToken,
              },
            })
            .then((response) => {
              const callbackResponse = {
                callback,
                config: response.config,
                data: response.data,
                headers: response.headers,
                response,
              };

              if (response.data.status) {
                if (this.showResponse !== false) {
                  this.$parent.$refs.standardAlert.formatAlert('Success!', successText, 'success');
                }

                if (callback !== null) {
                  this.$bus.$emit(callback, callbackResponse);
                }

                this.closeFormModal();
              } else {
                this.$parent.$refs.standardAlert.formatAlert('Error!', response.data.message, 'danger');
                this.loader = false;
              }
            })
            .catch((error) => {
              this.$parent.$refs.standardAlert.formatAlert('Error!', `System error. Please contact technical support. ${error}`, 'danger');

              this.closeFormModal();
            });
          } else {
            if (callback !== null) {
              this.$bus.$emit(callback);
            }

            this.closeFormModal();
          }
        }
      }
    },
    validateForm() {
      return this.$refs.formModalRef.validate();
    },
    validateReset() {
      return this.$refs.formModalRef.clearValidationErrors();
    },
  },
  components: {
    LoadingButton,
    modal,
    objectToFormData,
    stringFilters,
  },
  created() {
    this.$bus.$on('editing', () => {
      if (this.show) {
        this.submitDisabled = true;
      }
    });
  },
};
</script>

<style lang="scss">
.form-modal {
  .vue-form {
    > article:first-child,
    > details:first-child,
    > div:first-child,
    > fieldset:first-child,
    > section:first-child {
      border: 0;
      color: $brand-primary;
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      min-width: 0;
      padding: 0;

      @media all and (max-width: 991px) {
        flex-direction: column;
      }
    }
  }

  .modal-dialog {
    max-width: 100%;

    @media all and (max-width: 768px) {
      width: auto !important;
    }

    .close {
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      position: absolute;
      right: 7px;
      text-align: center;
      top: 5px;
    }
  }

  .thumbnail-preview {
    margin-bottom: 20px;

    img {
      max-height: 200px;
      max-width: 100%;
    }
  }
}
</style>
