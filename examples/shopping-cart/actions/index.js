import shop from '../api/shop'


function receiveProducts(products) {
  return {
    type: 'products.receiveProducts',
    products: products
  }
}

export function getAllProducts() {
  return dispatch => {
    shop.getProducts(products => {
      dispatch(receiveProducts(products))
    })
  }
}

function addToCartUnsafe(productId) {
  return {
    type: '[products, cart].addToCart',
    productId
  }
}

export function addToCart(productId) {
  return (dispatch, getState) => {
    if (getState().products.byId[productId].inventory > 0) {
      dispatch(addToCartUnsafe(productId))
    }
  }
}

export function checkout(products) {
  return (dispatch, getState) => {
    const cart = getState().cart

    dispatch({
      type: 'cart.checkoutSuccess'
    })
    shop.buyProducts(products, () => {
      dispatch({
        type: 'cart.checkoutSuccess',
        cart
      })
      // Replace the line above with line below to rollback on failure:
      // dispatch({ type: 'cart.checkoutFailure', cart })
    })
  }
}
