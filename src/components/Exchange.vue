<template>
  <div class="exchange">

    <div v-click-away="closeExchangeableList" class="relative">
      <div 
        class="exchange-field"
      >
        <input 
          type="number" 
          v-model="exchangeableValue"
          class="exchange-field__input"
        >
        <div 
          class="min-w-max flex items-center cursor-pointer"
          @click="toggleExhangeableList"
        >
          <img 
            :src="exchangeableCurrency.image" 
            class="exchange-field__img"
          >
          <div class="exchange-field__img">
            {{ exchangeableCurrency.ticker ? exchangeableCurrency.ticker.toUpperCase() : '' }}
          </div>
          <img src="@/assets/images/arrow.svg" alt="arrow">
        </div>
      </div>
      <CurrenciesList 
        v-show="exchangeableCurrenciesVisible"
        :listOfCurrencies="filteredListOfCurrencies"
        direction="from"
        @handleCurrency="handleCurrency"
        @closeCurreciesList="closeCurreciesList"
        @handleSearchTickerValue="handleSearchTickerValue"
      />
    </div>

    <img src="@/assets/images/swap.svg" alt="swap" class="exchange-swap">

    <div v-click-away="closeEstimatedList" class="relative">
      <div 
        class="exchange-field"
        :style="`border-color:${isSmallDepositError ? '#E03F3F' : '#C1D9E6'}`"
      >
        <div class="exchange-field__input cursor-default">
          {{ isSmallDepositError ? '-' : estimatedAmount }}
        </div>
        <div 
          class="flex items-center min-w-max cursor-pointer"
          @click="toggleEstimatedList"
        >
          <img 
            :src="estimatedCurrency.image" 
            class="exchange-field__img"
          >
          <div class="exchange-field__img">
            {{ estimatedCurrency.ticker ? estimatedCurrency.ticker.toUpperCase() : '' }}
          </div>
          <img src="@/assets/images/arrow.svg" alt="arrow">
        </div>
      </div>
      <CurrenciesList 
        v-show="estimatedCurrenciesVisible"
        :listOfCurrencies="filteredListOfCurrencies"
        direction="to"
        @handleCurrency="handleCurrency"
        @closeCurreciesList="closeCurreciesList"
        @handleSearchTickerValue="handleSearchTickerValue"
      />
    </div>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core'
import CurrenciesList from '@/components/CurrenciesList.vue'

export default {
  name: 'Exchange',
  components: {
    CurrenciesList
  },
  setup() {
    const store = useStore()
    const exchangeableValue = ref(0)
    const exchangeableCurrenciesVisible = ref(false)
    const estimatedCurrenciesVisible = ref(false)
    const searchedTicker = ref('')

    const getPairValue = () => store.dispatch('getEstimatedAmount', exchangeableValue.value)
    const handleCurrency = ({ currency, direction }) => {
      direction === 'from' 
        ? store.dispatch('setExchangeableCurrency', currency)
        : store.dispatch('setEstimatedCurrency', currency)

      closeCurreciesList()
    }
    const closeCurreciesList = () => {
      exchangeableCurrenciesVisible.value = false
      estimatedCurrenciesVisible.value = false
      searchedTicker.value = ''
    }
    const handleSearchTickerValue = searchedValue => searchedTicker.value = searchedValue

    const listOfCurrencies = computed(() => store.getters['listOfCurrencies'])
    const exchangeableCurrency = computed(() => store.getters['exchangeableCurrency'])
    const estimatedCurrency = computed(() => store.getters['estimatedCurrency'])
    const minExAmount = computed(() => store.getters['minExAmount'])
    const estimatedAmount = computed(() => store.getters['estimatedAmount'])
    const isSmallDepositError = computed(() => store.getters['isSmallDepositError'])

    const closeExchangeableList = () => exchangeableCurrenciesVisible.value = false
    const closeEstimatedList = () => estimatedCurrenciesVisible.value = false
    const toggleEstimatedList = () => estimatedCurrenciesVisible.value = !estimatedCurrenciesVisible.value
    const toggleExhangeableList = () => exchangeableCurrenciesVisible.value = !exchangeableCurrenciesVisible.value

    const filteredListOfCurrencies = computed(() => {
      if(searchedTicker.value) {
        return listOfCurrencies.value.filter(currency => {
          return currency.ticker.includes(searchedTicker.value.toLowerCase())
        })
      } else {
        return listOfCurrencies.value
      }
    })

    watch(() => exchangeableValue.value, () => getPairValue())
    watch(() => minExAmount.value, (to) => {
      if(to) {
        exchangeableValue.value = minExAmount.value
      }
    })

    return {
      listOfCurrencies,
      exchangeableCurrency,
      estimatedCurrency,
      exchangeableValue,
      estimatedAmount,
      estimatedCurrenciesVisible,
      isSmallDepositError,
      filteredListOfCurrencies,
      closeEstimatedList,
      getPairValue,
      toggleExhangeableList,
      toggleEstimatedList,
      closeCurreciesList,
      handleCurrency,
      closeExchangeableList,
      handleSearchTickerValue,
      exchangeableCurrenciesVisible
    }
  }
}
</script>
