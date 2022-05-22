<template>
  <div class="root min-h-screen flex flex-col justify-center">
    <div class="root-header">
      <div class="root-header__title">
        Crypto Exchange
      </div>
      <div class="root-header__subtitle">
        Exchange fast and easy
      </div>
    </div>
    <div class="root-body flex items-center justify-center">
      <Exchange />
    </div>
    <div class="root-footer">
      <div class="root-footer__title">
        Your Ethereum address
      </div>
      <input type="text" class="root-footer__field">
      <div class="inline-grid relative">
        <button class="root-footer__btn">
          Exchange
        </button>
        <span v-if="isSmallDepositError" class="root-footer__error">
          This pair is disabled now
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Exchange from '@/components/Exchange.vue'
import { useStore } from 'vuex'
import { computed } from '@vue/runtime-core'

export default {
  name: 'App',
  components: {
    Exchange
  },
  setup() {
    const store = useStore()

    const isSmallDepositError = computed(() => store.getters['isSmallDepositError'])
    
    // created
    store.dispatch('getListOfCurrencies')

    return { isSmallDepositError }
  }
}
</script>
