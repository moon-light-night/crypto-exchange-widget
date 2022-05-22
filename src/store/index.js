import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    apiKey: 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd',
    listOfCurrenciesURL: 'https://api.changenow.io/v1/currencies?active=true&fixedRate=true',
    minExAmountURL: 'https://api.changenow.io/v1/min-amount/',
    pairValueURL: 'https://api.changenow.io/v1/exchange-amount/',
    exchangeableCurrency: {},
    estimatedAmount: 0,
    estimatedCurrency: {},
    listOfCurrencies: [],
    minExAmount: 0,
    isSmallDepositError: false,
    errors: {
      smallDeposit: 'deposit_too_small'
    }
  },
  actions: {
    getListOfCurrencies({ state, commit, dispatch }) {
      axios
        .get(state.listOfCurrenciesURL)
        .then(({ data }) => {
          commit('setListOfCurrencies', data)
          dispatch('getMinExAmount', { from: data[0].ticker, to: data[1].ticker })
          commit('setDefaultPair', { exchangeableCurrency: data[0], estimatedCurrency: data[1] })
        })
        .catch(e => console.log(e))
    },
    getMinExAmount({ state, commit }, { from, to }) {
      axios
        .get(`${state.minExAmountURL}${from}_${to}?api_key=${state.apiKey}`)
        .then(({ data }) => commit('setMinExAmount', data.minAmount))
        .catch(e => console.log(e))
    },
    getEstimatedAmount({ state, commit }, pairValue) {
      axios
        .get(`${state.pairValueURL}${pairValue}/${state.exchangeableCurrency.ticker}_${state.estimatedCurrency.ticker}/?api_key=${state.apiKey}`)
        .then(({ data }) => commit('setEstimatedAmount', data))
        .catch(e => commit('setError', e.response.data.error))
    },
    setExchangeableCurrency({ state, dispatch, commit }, currency) {
      commit('setExchangeableCurrency', currency)
      dispatch('getMinExAmount', { from: currency.ticker, to: state.estimatedCurrency.ticker })
    },
    setEstimatedCurrency({ state, dispatch, commit }, currency) {
      commit('setEstimatedCurrency', currency)
      dispatch('getMinExAmount', { from: state.exchangeableCurrency.ticker, to: currency.ticker })
    }
  },
  mutations: {
    setListOfCurrencies(store, data) {
      store.listOfCurrencies = data
    },
    setDefaultPair(state, { exchangeableCurrency, estimatedCurrency }) {
      state.exchangeableCurrency = exchangeableCurrency
      state.estimatedCurrency = estimatedCurrency
    },
    setMinExAmount(state, data) {
      state.minExAmount = data
    },
    setEstimatedAmount(state, data) {
      state.estimatedAmount = data.estimatedAmount
      if(state.isSmallDepositError) {
        state.isSmallDepositError = false
      }
    },
    setExchangeableCurrency(state, currency) {
      state.exchangeableCurrency = currency
    },
    setEstimatedCurrency(state, currency) {
      state.estimatedCurrency = currency
    },
    setError(state, error) {
      switch (error) {
        case state.errors.smallDeposit:
          state.isSmallDepositError = true
          break;
      }
    }
  },
  getters: {
    listOfCurrencies: state => state.listOfCurrencies,
    exchangeableCurrency: state => state.exchangeableCurrency,
    estimatedCurrency: state => state.estimatedCurrency,
    minExAmount: state => state.minExAmount,
    estimatedAmount: state => state.estimatedAmount,
    isSmallDepositError: state => state.isSmallDepositError
  }
})
