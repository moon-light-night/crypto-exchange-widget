<template>
  <div class="currencies">
    <div class="currencies-search">
      <input 
        type="text"
        v-model="inputSearch"
        placeholder="Search"
        class="currencies-search__field"
        @input="handleSearchTickerValue($event.target.value)"
      >
      <img
        class="cursor-pointer"
        src="@/assets/images/close.svg" 
        alt="close"
        @click="closeCurreciesList"
      >
    </div>
    <ul class="currencies-list">
      <li  
        v-for="currency in listOfCurrencies" 
        :key="currency.ticker"
        class="currencies-list__item flex" 
        @click="handleCurrency(currency)"
      >
        <img :src="currency.image" width="20" height="20" :alt="currency.ticker">
        <span>{{ currency.ticker.toUpperCase() }}</span> 
        {{ currency.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
export default {
  name: 'CurrenciesList',
  props: {
    listOfCurrencies: {
      type: Array,
      default: () => []
    },
    direction: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const inputSearch = ref('')

    const handleCurrency = currency => {
      emit('handleCurrency', { currency, direction: props.direction })
      inputSearch.value = ''
    }
    const closeCurreciesList = () => {
      emit('closeCurreciesList')
      inputSearch.value = ''
    }
    const handleSearchTickerValue = value => {
      inputSearch.value = value
      emit('handleSearchTickerValue', inputSearch.value)
    }

    return { inputSearch, handleCurrency, closeCurreciesList, handleSearchTickerValue }
  }
}
</script>