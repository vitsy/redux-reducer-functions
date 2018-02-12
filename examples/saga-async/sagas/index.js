/* eslint-disable no-constant-condition */
import { take, put, call, fork, select } from 'redux-saga/effects'
import fetch from 'isomorphic-fetch'
import * as actions from '../actions'


export function fetchPostsApi(reddit) {
  return fetch(`http://www.reddit.com/r/${reddit}.json` )
     .then(response => response.json() )
     .then(json => json.data.children.map(child => child.data) )
}


export function *fetchPosts(reddit) {
  yield put( actions.requestPosts(reddit) )
  const posts = yield call(fetchPostsApi, reddit)
  yield put( actions.receivePosts(reddit, posts) )
}



export function* redditChange() {
  while(true) {
    const {reddit} = yield take('*fetchPosts')
    yield fork(fetchPosts, reddit)
  }
}

export default function* root() {
  yield fork(redditChange)
}


