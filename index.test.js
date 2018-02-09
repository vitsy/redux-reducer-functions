import {createStore} from 'redux'
import  {combineReducers} from './index'

const defState = {}

const reducer1 = {
  copyAction: (state = defState, action) => {
    return {...state, ...action}
  },
  both: (state = defState, action) => {
    return {...state, ...action}
  },
  other: (state = defState, action) => {
    return state
  }
}

const reducer2 = {

  both: (state = defState, action) => {
    return {...state, ...action}
  },
  other: (state = defState, action) => {
    return state
  }
}

describe('test with options(defaultReducerFunctionName:other, useCache:true, strictMode:false,}', () => {
    const reducer = combineReducers({
      reducer1,
      reducer2
    }, {
      defaultReducerFunctionName : 'other',
      useCache : true,
      strictMode:false
    })
  let store = createStore(reducer)

  it('should create function', () => {
    expect(reducer).toEqual(expect.any(Function))
  })

  it('should handle initial state', () => {
    expect(
       reducer({}, { type: '@@redux/INIT' })
    ).toEqual({ reducer1: {}, reducer2: {} })
  })

  it('should reducer1.copyAction = action.par', () => {
    let action = {type: 'reducer1.copyAction', par: 'Hi'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('Hi')
  })

  it('should called reducer1.both and reducer2.both and seat par ="both"' , () => {
    let action = {type: '[reducer1, reducer2].both', par: 'both'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('both')
    expect(store.getState().reducer2.par).toEqual('both')
  })

  it('should continuee work with cached functions', () => {
    let action = {type: '[reducer1, reducer2].both', par: 'both2'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('both2')
    expect(store.getState().reducer2.par).toEqual('both2')
    action = {type: '[reducer1, reducer2].both', par: 'both3'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('both3')
    expect(store.getState().reducer2.par).toEqual('both3')
  })

  it('should called reducer1.both only and set par = "only1" and preserve state for reducer2' , () => {
    action = {type: '[reducer1, reducer2].both', par: 'both3'}
    store.dispatch(action)
    let action = {type: 'reducer1.both', par: 'only1'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('only1')
    expect(store.getState().reducer2.par).toBeDefined()
    expect(store.getState().reducer2.par).toEqual('both3')
  })

})

describe('test with options(defaultReducerFunctionName:other, useCache:true, strictMode:true,}', () => {
  const reducer = combineReducers({
    reducer1,
    reducer2
  }, {
    defaultReducerFunctionName : 'other',
    useCache : true,
    strictMode:true
  })


  let store = createStore(reducer)
  it('should reducer1.copyAction = action.par', () => {
    let action = {type: 'reducer1.copyAction', par: 'Hi world'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('Hi world')
  })

  it('should called reducer1.both and reducer2.both and seat par ="both"' , () => {
    let action = {type: '[reducer1, reducer2].both', par: 'both'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('both')
    expect(store.getState().reducer2.par).toEqual('both')
  })

  it('should called reducer1.both only and set par ="only1"' , () => {
    let action = {type: 'reducer1.both', par: 'only1'}
    store.dispatch(action)
    expect(store.getState().reducer1.par).toEqual('only1')
    expect(store.getState().reducer2.par).toBeDefined()
    expect(store.getState().reducer2.par).toEqual('both')
  })
})