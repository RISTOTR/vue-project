import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        loadedMeetups: [
            { imageUrl: 'https://media.timeout.com/images/104692494/image.jpg', 
            id: 'aldkfja', 
            title: 'Meetup in New York',
            date: '2019-07-17'},
            { imageUrl: 'https://photos.mandarinoriental.com/is/image/MandarinOriental/paris-2017-home?wid=2880&hei=1280&fmt=jpeg&crop=9,336,2699,1200&anchor=1358,936&qlt=75,0&fit=wrap&op_sharpen=0&resMode=sharp2&op_usm=0,0,0,0&iccEmbed=0&printRes=72', 
            id: 'aldkfja123', 
            title: 'Meetup in Paris',
            date: '2019-07-19'}
        ],
        user: {
            id: 'alkdjsa12',
            registeredMeetups: ['aldkfja123']
        }
    },
    mutations: {
       
    },
    actions: {

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
        }
    }
})