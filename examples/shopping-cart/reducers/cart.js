const initialState = {
  addedIds: [],
  quantityById: {}
}


export function addToCart(state = initialState, action) {
  let {addedIds, quantityById} = state
  if (addedIds.indexOf(action.productId) < 0) {
    addedIds = [...addedIds, action.productId]
  }
  const {productId} = action
  return {
    addedIds,
    quantityById : { ...quantityById, [productId]: (quantityById[productId] || 0) + 1 }
  }
}


export function checkoutSuccess(state, action) {
  return initialState
}

export function checkoutFailure(state, action) {
  return action.cart
}

export function other(state = initialState, action) {
  return state
}

export function getQuantity(state, productId) {
  return state.quantityById[productId] || 0
}

export function getAddedIds(state) {
  return state.addedIds
}
