import fetch from 'isomorphic-fetch'

export function selectReddit(reddit) {
  return {
    type: 'selectedReddit.selectReddit',
    reddit
  }
}

export function invalidateReddit(reddit) {
  return {
    type: 'postsByReddit.invalidateReddit',
    reddit
  }
}

function requestPosts(reddit) {
  return {
    type: 'postsByReddit.requestPosts',
    reddit
  }
}

function receivePosts(reddit, json) {
  return {
    type: 'postsByReddit.receivePosts',
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

function fetchPosts(reddit) {
  return dispatch => {
    dispatch(requestPosts(reddit))
    return fetch(`https://www.reddit.com/r/${reddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(reddit, json)))
  }
}

function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}
