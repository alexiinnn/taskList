import Vue from 'vue'
import Vuex from 'vuex'
import uuidv4 from 'uuid/v4'
Vue.use(Vuex)

const store = new Vuex.Store({

  state: {
    users: [],
    tasks: []
  },

  actions: {
    loadUsers ({ commit, state }) {
      if (!state.users.length) {
        // with help of vue-resource
        // this.$http.get('some_url').then((response) => {
        //   state.users = response.data
        // })
        const users = [{
          id: '4F0C3B4C-D8D8-4F01-9D9D-03758936EC05',
          name: 'Иванов',
          price: 500
        }, {
          id: 'A518B7DC-6BB2-4945-AC10-06A296660BDC',
          name: 'Петров',
          price: 250
        }, {
          id: '7B1D6B3F-F986-4E5A-92FD-0CB361140A23',
          name: 'Сидоров',
          price: 1000
        }]
        commit('UPDATE_USERS', users)
      }
    },
    loadTasks ({ commit, state }) {
      if (!state.tasks.length) {
        // with help of vue-resource
        // this.$http.get('some_url').then((response) => {
        //   state.tasks = response.data
        // })
        const tasks = [{
          id: 'CAACE586-37BC-454E-8FAF-0FEC73C69969',
          name: 'Разработка сервера',
          user_id: '7B1D6B3F-F986-4E5A-92FD-0CB361140A23',
          time: 42
        },
        {
          id: 'A08E2244-E864-4304-BEDF-124D7A447135',
          name: 'Разработка интерфейса',
          user_id: '4F0C3B4C-D8D8-4F01-9D9D-03758936EC05',
          time: 56
        },
        {
          id: '143B5AB2-C63F-4D56-880C-126BC5DFAE4A',
          name: 'написание инструкции',
          user_id: 'A518B7DC-6BB2-4945-AC10-06A296660BDC',
          time: 2.5
        }]
        commit('UPDATE_TASKS', tasks)
      }
    },
    updateData ({commit, state}, data) {
      data.forEach(item => {
        if (!state.users.some(val => {
          return val.name === item.employee
        })) {
          commit('ADD_USER', {
            id: uuidv4().toUpperCase(),
            name: item.employee,
            price: item.cost / item.time
          })
        }
        if (!state.tasks.some(val => {
          return val.id === item.id
        })) {
          commit('ADD_TASK', {
            id: item.id,
            name: item.name,
            user_id: state.users.find(user => user.name === item.employee).id,
            time: item.time
          })
        }
        if (!state.tasks.some(val => {
          return JSON.stringify(val) === JSON.stringify(item)
        }) && (state.tasks.some(val => {
          return val.id === item.id
        }))) {

        }
      })
      state.tasks.forEach(task => {
        if (!data.some(val => {
          return val.id === task.id
        })) {
          console.log(task)
          commit('REMOVE_TASK', task)
        }
      })
      // with help of vue-resource
      // this.$http.put('some_url', [state.users, state.tasks]).then((response) => {
      //   some actions
      // })
    },
    sendData ({commit, state}, [users, tasks]) {
      commit('UPDATE_TASKS', tasks)
      commit('UPDATE_USERS', users)

      // with help of vue-resource
      // this.$http.put('some_url', [state.users, state.tasks]).then((response) => {
      //   some actions
      // })
    }
  },
  mutations: {
    UPDATE_USERS (state, newUsers) {
      state.users = newUsers
    },
    UPDATE_TASKS (state, newTasks) {
      state.tasks = newTasks
    },
    ADD_USER (state, newUser) {
      state.users.push(newUser)
    },
    ADD_TASK (state, newTask) {
      state.tasks.push(newTask)
    },
    REMOVE_TASK (state, task) {
      state.tasks = state.tasks.filter(item => task.id !== item.id)
    }
  },
  getters: {
    getTasks: state => state.tasks,
    getUsers: state => state.users,
    getCalcTasks: state => state.tasks.map(task => {
      return {
        id: task.id,
        name: task.name,
        employee: state.users.find(user => user.id === task.user_id).name,
        time: '' + task.time,
        cost: task.time * state.users.find(user => user.id === task.user_id).price + ''
      }
    }),
    getCalcTasksOrig: state => state.tasks.map(task => {
      return {
        id: task.id,
        name: task.name,
        employee: state.users.find(user => user.id === task.user_id).name,
        time: '' + task.time,
        cost: task.time * state.users.find(user => user.id === task.user_id).price + ''
      }
    }),
    getEmployeeNames: state => state.users.map(user => user.name),
    getUserByName: state => username => state.users.find(user => user.name === username)
  }
})

export default store
