import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [
            { imageUrl: 'https://media.timeout.com/images/104692494/image.jpg', 
            id: 'aldkfja', 
            title: 'Meetup in New York',
            date: new Date(),
            location: 'New York',
            description: 'New York, New York'},
            { imageUrl: 'https://photos.mandarinoriental.com/is/image/MandarinOriental/paris-2017-home?wid=2880&hei=1280&fmt=jpeg&crop=9,336,2699,1200&anchor=1358,936&qlt=75,0&fit=wrap&op_sharpen=0&resMode=sharp2&op_usm=0,0,0,0&iccEmbed=0&printRes=72', 
            id: 'aldkfja123', 
            title: 'Meetup in Paris',
            date: new Date(),
            location: 'Paris',
            description: 'Ooh la laa'}
        ],
        user: null,
        loading: false,
        error: null
    },
    mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    
       createMeetup (state, payload) {
           state.loadedMeetups.push(payload)
       },
       updateMeetup (state, payload) {
         const meetup = state.loadedMeetups.find(meetup => {
           return meetup.id === payload.id
         })
         if (payload.title) {
           meetup.title = payload.title
         }
         if (payload.description) {
           meetup.description = payload.description
         }
         if (payload.date) {
           meetup.date = payload.date
         }
       },
       setUser(state, payload) {
           state.user = payload
       },
       setLoading(state, payload) {
           state.loading = payload
       },
       setError(state, payload) {
           state.error = payload
       },
       clearError(state) {
           state.error = null
       }
    },
    actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = []
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              location: obj[key].location,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', true)
          }
        )
    },
    
        createMeetup ({commit, getters}, payload) {
            const meetup = {
                title: payload.title,
                location: payload.location,
                description: payload.description,
                date: payload.date.toISOString(),
                creatorId: getters.user.id

            }
            let imageUrl
            let key
            firebase.database().ref('meetups').push(meetup)
            .then((data) => {
                 key = data.key;
                
                return key
            })
            .then(key => {
              const filename = payload.image.name
              const ext = filename.slice(filename.lastIndexOf('.'))
              return firebase.storage().ref('meetups/' + key + '.' + ext).put(payload.image)
            })
            .then(fileData => {
              let imagePath = fileData.metadata.fullPath;
  // creating ref to our image file and get the url
  return firebase.storage().ref().child(imagePath).getDownloadURL();
              //imageUrl = fileData.metadata.downloadURLs[0]
              //return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
            })
            .then(url => {
              imageUrl = url;
              return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl});
            })
            .then(() => {
              commit('createMeetup', {
                  ...meetup, 
                  imageUrl: imageUrl,
                  id: key
                })
            })
            .catch((error) => {
                console.log(error)
            })
            
        },
        updateMeetupData ({commit}, payload) {
          commit('setLoading', true)
          const updateObj = {}
          if (payload.title) {
            updateObj.title = payload.title
          }
          if (payload.description) {
            updateObj.description = payload.description
          }
          if (payload.date) {
            updateObj.date = payload.date
          }
          firebase.database().ref('meetups').child(payload.id).update(updateObj)
          .then(() => {
            commit('setLoading', false)
            commit('updateMeetup', payload)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
        },
        signUserUp ({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                commit('setLoading', false)
                const newUser = {
                    id: user.user.uid,
                    registeredMeetups: []
                }
                commit('setUser', newUser)
            }
            )
            .catch (
                error => {
                commit('setLoading', false)
                commit('setError', error)
                console.log(error)
            })
                
        },
        signUserIn({commit}, payload) {
            commit('setLoading', true)
            commit('clearError')
            firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
            .then(
                user => {
                    commit('setLoading', false)
                    const newUser = {
                        id: user.user.uid,
                        registeredMeetups: []
                    }
                    commit ('setUser', newUser)
                }
            )
            .catch (
                error => {
                    commit('setLoading', false)
                    commit('setError', error)
                    console.log(error)
                }
            )
        },
        autoSignin({commit}, payload) {
          commit('setUser', {id:payload.uid, registeredMeetups: []})
        },
        logout({commit}) {
          firebase.auth().signOut()
          commit('setUser', null)
        },
        clearError({commit}) {
            commit('clearError')
        }
    },
    getters: {
        loadedMeetups (state) {
            return state.loadedMeetups.sort((meetupA, meetupB) => {
                return meetupA.date > meetupB.date
            })
        },
        featuredMeetups (state, getters) {
            return getters.loadedMeetups.slice(0, 5)
        },
        loadedMeetup (state) {
            return (meetupId) => {
                return state.loadedMeetups.find((meetup) => {
                    return meetup.id == meetupId
                })
            }
        },
        user (state) {
            return state.user
        },
        loading (state) {
            return state.loading
        },
        error (state) {
            return state.error
        }
    }
})/*

import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/New_york_times_square-terabass.jpg',
        id: 'afajfjadfaadfa323',
        title: 'Meetup in New York',
        date: new Date(),
        location: 'New York',
        description: 'New York, New York!'
      },
      {
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Paris_-_Blick_vom_gro%C3%9Fen_Triumphbogen.jpg',
        id: 'aadsfhbkhlk1241',
        title: 'Meetup in Paris',
        date: new Date(),
        location: 'Paris',
        description: 'It\'s Paris!'
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups (state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    loadMeetups ({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = []
          const obj = data.val()
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)
        })
        .catch(
          (error) => {
            console.log(error)
            commit('setLoading', false)
          }
        )
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          const key = data.key
          commit('createMeetup', {
            ...meetup,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
      // Reach out to firebase and store it
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: []
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, registeredMeetups: []})
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    loadedMeetups (state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups (state, getters) {
      return getters.loadedMeetups.slice(0, 5)
    },
    loadedMeetup (state) {
      return (meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id === meetupId
        })
      }
    },
    user (state) {
      return state.user
    },
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  }
})*/


