const defaultState = {
  visibleIds: [],
  byId: {}
}
export function addToCart(state, action) {
  const {productId} = action
  const byId = state.byId
  return {...state, byId: {...byId, [productId]: {...byId[productId], inventory: byId[productId].inventory - 1}}}
}

export function receiveProducts(state = defaultState, action) {
  return {
    ...state,
    visibleIds: action.products.map(product => product.id),
    byId: action.products.reduce((obj, product) => {
      obj[product.id] = product
      return obj
    }, {})
  }
}

export function other(state = defaultState, action) {
  return state
}

export function getProduct(state = defaultState, id) {
  return state.byId[id]
}

export function getVisibleProducts(state = defaultState) {
  return state.visibleIds.map(id => getProduct(state, id))
}
