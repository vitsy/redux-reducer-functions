
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

export function requestPosts(reddit) {
  return {
    type: 'postsByReddit.requestPosts',
    reddit
  }
}

export function receivePosts(reddit, posts) {
  return {
    type: 'postsByReddit.receivePosts',
    reddit: reddit,
    posts,
    receivedAt: Date.now()
  }
}

function fetchPosts(reddit) {
  return {
    type: '*fetchPosts',
    reddit
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

export function startFetchPosts(reddit) {
      return fetchPosts(reddit)
}
