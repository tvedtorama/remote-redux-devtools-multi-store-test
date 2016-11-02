var redux = require('redux')
/*var createSagaMiddleware = requre('redux-saga')
var delay = createSagaMiddleware.delay
var sagaEffects = require('redux-saga/effects')
var put = sagaEffects.put
var actionChannel = sagaEffects.actionChannel
var take = sagaEffects.take
var select = sagaEffects.select */

var thunk = require('redux-thunk').default


var createStore = redux.createStore
var applyMiddleware = redux.applyMiddleware
var compose = redux.compose
var devTools = require('remote-redux-devtools')

function counter(state, action) {
  if (state === undefined) state = {num: 0, }
  switch (action.type) {
  case 'INCREMENT':
    return {num: state.num + 1, scenarioId: state.scenarioId}
  case 'DECREMENT':
    return {num: state.num - 1, scenarioId: state.scenarioId}
  case 'SCENARIO_ID':
    return {num: state.num, scenarioId: action.scenarioId}
  default:
    return state
  }
}

var composeWithDevTools = devTools.composeWithDevTools

function aThunk() {
  return function(dispatcher) {
    var fun = function() {
      dispatcher({ type: 'INCREMENT' })
      setTimeout(fun, 1000)
    }
    setTimeout(fun, 1000)
  }
}

function createScenarioStore(scenarioId) {

  // This causes the remote dev tool to use remotedev.io, which can be accessed at remotedev.io/local
  var composeEnhancers = composeWithDevTools({ realtime: true, name: `scenario_${scenarioId}` }) 
  
  var store = createStore(counter, composeEnhancers(applyMiddleware(thunk))) 

  store.dispatch({type: 'SCENARIO_ID', scenarioId: scenarioId})
  store.subscribe(function() { console.log(store.getState().scenarioId, store.getState().num) })

  store.dispatch(aThunk())

  return store
}

var store = createScenarioStore('Scenario1') // createStore(counter, devTools({realtime: true}))
var store2 = createScenarioStore('Scenario2') // createStore(counter, devTools({realtime: true}))


/*function incrementer() {
  setTimeout(function() {
    store.dispatch({ type: 'INCREMENT' })
    incrementer()
  }, 1000)
}

incrementer() */
