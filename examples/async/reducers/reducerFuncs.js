const defStatePostsByReddit = {
  isFetching: false,
  didInvalidate: false,
  items: []
}

export function selectReddit(state = 'reactjs', action) {
  return action.reddit
}

function applyAction(state, action, additional){
  const reddit = state[action.reddit] || defStatePostsByReddit
  return{
    ...state,
    [action.reddit]: { ...reddit,  ...additional }
  }
}

export function invalidateReddit(state, action) {
  return applyAction (state, action, { idInvalidate: true } )
}

export function requestPosts(state, action) {
  return applyAction (state, action, {
      isFetching: true,
      didInvalidate: false
    }
  )
}

export function receivePosts(state, action) {
  return applyAction(state, action, {
      isFetching: false,
      didInvalidate: false,
      items: action.posts,
      lastUpdated: action.receivedAt
    }
  )
}


export function other(state = {}, action) {
  return state;
}


