/* eslint-disable */

<template>
    <form class="job__list">
        <table>
            <tr class="jobs__header">
                <td class="header__item">
                    <span>Название</span>
                    <font-awesome-icon icon="sort-amount-down"
                                       class="icon__sort"
                                       @click="sort($event, 'name', false)"
                    />
                    <font-awesome-icon icon="sort-amount-up"
                                       class="icon__sort"
                                       @click="sort($event, 'name')"
                    />
                </td>
                <td class="header__item">
                    <span>Исполнитель</span>
                    <font-awesome-icon icon="sort-amount-down"
                                       class="icon__sort"
                                       @click="sort($event, 'employee', false)"
                    />
                    <font-awesome-icon icon="sort-amount-up"
                                       class="icon__sort"
                                       @click="sort($event, 'employee')"
                    />
                </td>
                <td class="header__item">
                    <span>Затраченное время</span>
                    <font-awesome-icon icon="sort-amount-down"
                                       class="icon__sort"
                                       @click="sort($event, 'time', false)"
                    />
                    <font-awesome-icon icon="sort-amount-up"
                                       class="icon__sort"
                                       @click="sort($event, 'time')"
                    />
                </td>
                <td class="header__item">
                    <span>Стоимость работы</span>
                    <font-awesome-icon icon="sort-amount-down"
                                       class="icon__sort"
                                       @click="sort($event, 'cost', false)"
                    />
                    <font-awesome-icon icon="sort-amount-up"
                                       class="icon__sort"
                                       @click="sort($event, 'cost')"
                    />
                </td>
                <td class="header__item">
                    <span>Действия</span>
                </td>
            </tr>
            <tr class="filter"></tr>
                <td class="filter__value"
                    colspan="4"
                >
                    <input type="text"
                        placeholder="Поиск..."
                        class="input input--search"
                        v-model="searchValue"
                    >
                </td>
            <task-item
                :key="task.id"
                v-for="task in sortedTasks"
                :task="task"
                @remove="remove"
                @update="update"
            />
            <add-task @add="add"/>
            <tr class="summary__header">
                <td class="header__item">Общее количество</td>
                <td class="header__item"></td>
                <td class="header__item">Общее время</td>
                <td class="header__item">Общая стоимость</td>
                <td class="header__item"></td>
            </tr>
            <tr class="summary">
                <td class="summary__item">{{ sortedTasks.length }}</td>
                <td class="summary__item"></td>
                <td class="summary__item">{{ totalTime }}</td>
                <td class="summary__item">{{ totalCost }}</td>
                <td class="summary__item"></td>
            </tr>
        </table>
        <button class="button"
                type="submit"
                :disabled="!activeSend"
                @click="sendData"
        >Отправить</button>
    </form>
</template>

<script>
import TaskItem from './TaskItem'
import AddTask from './AddTask'
import uuidv4 from 'uuid/v4'

export default {
  name: 'TasksList',
  components: {
    TaskItem,
    AddTask
  },
  data () {
    return {
      searchValue: '',
      sortedTasks: [],
      calcTasks: [],
      tasks: [],
      users: []
    }
  },
  computed: {
    filteredTasks () {
      return this.calcTasks.filter(task => Object.values(task).find(item => (item + '').indexOf(this.searchValue) > -1))
    },
    originalTasks: {
      get () {
        return this.$store.getters.getCalcTasksOrig
      }
    },
    activeSend () {
      return JSON.stringify(this.calcTasks) !== JSON.stringify(this.originalTasks)
    },
    totalTime () {
      let totalTime = 0
      this.sortedTasks.forEach(item => { totalTime += +item.time })
      return totalTime
    },
    totalCost () {
      let totalCost = 0
      this.sortedTasks.forEach(item => { totalCost += +item.cost })
      return totalCost
    }
  },
  watch: {
    filteredTasks () {
      this.sortedTasks = this.filteredTasks
    }
  },
  methods: {
    sort (event, sortKey, asc = true) {
      Array.from(this.$el.querySelectorAll('.icon__sort')).forEach(item => item.classList.remove('icon__sort--active'))
      this.sortedTasks.sort((task, nextTask) => {
        return isNaN(+task[sortKey]) ? (asc ? 1 : -1) * nextTask[sortKey].localeCompare(task[sortKey]) : (asc ? 1 : -1) * (+nextTask[sortKey] - task[sortKey])
      })
      event.currentTarget.classList.toggle('icon__sort--active')
    },
    remove (id) {
      this.calcTasks = this.calcTasks.filter(item => item.id !== id)
      this.tasks = this.tasks.filter(item => item.id !== id)
    },
    add (task) {
      this.sortedTasks.push(task)
      this.calcTasks.push(task)
      const userId = this.$store.getters.getUserByName(task.employee) ? this.$store.getters.getUserByName(task.employee).id : uuidv4().toUpperCase()
      console.log(userId)
      this.tasks.push({
        id: task.id,
        name: task.name,
        user_id: userId,
        time: task.time
      })
      if (!this.$store.getters.getUserByName(task.employee)) {
        this.users.push({
          id: userId,
          name: task.employee,
          price: task.cost / task.time
        })
      }
    },
    update (task) {
      const taskIndex = this.tasks.indexOf(this.tasks.find(item => item.id === task.id))
      let userId
      if (this.users.find(user => user.name === task.employee)) {
        userId = this.users.find(user => user.name === task.employee).id
        const userIndex = this.users.indexOf(this.users.find(user => user.id === userId))
        this.users[userIndex] = {
          id: userId,
          name: task.employee,
          price: task.cost / task.time
        }
      } else {
        userId = uuidv4().toUpperCase()
        this.users.push({
          id: userId,
          name: task.employee,
          price: task.cost / task.time
        })
      }
      this.tasks[taskIndex] = {
        id: task.id,
        name: task.name,
        user_id: userId,
        time: task.time
      }
    },
    sendData (event) {
      event.preventDefault()
      this.$store.dispatch('sendData', [this.users, this.tasks])
      console.log(this.users)
      console.log(this.tasks)
    }
  },
  mounted () {
    this.$store.dispatch('loadUsers')
    this.$store.dispatch('loadTasks')
    this.sortedTasks = this.filteredTasks
    this.calcTasks = this.$store.getters.getCalcTasks
    this.tasks = this.$store.getters.getTasks
    this.users = this.$store.getters.getUsers
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    .job__list {
        width: 100%;
        table {
            width: 100%;
            .jobs__header {
                width: 100%;
            }

            td {
                text-align: left;
            }
        }
    }

    .icon__sort {
        &.icon__sort--active {
            color: blue
        }
    }

    .button {
        background-color: #9b4dca;
        border: 0.1rem solid #9b4dca;
        border-radius: .4rem;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-size: 0.9rem;
        font-weight: 700;
        height: 2.4rem;
        letter-spacing: .1rem;
        line-height: 2rem;
        padding: 0 3.0rem;
        text-align: center;
        text-decoration: none;
        text-transform: uppercase;
        white-space: nowrap;

        &:hover {
            background-color: #606c76;
            border-color: #606c76;
            color: #fff;
            outline: 0;
        }

        &:disabled {
            background-color: #cccccc;
            border-color: #cccccc;
            cursor: default;
        }
    }

    .input {
        border: 1px solid gray;
        &.input--search {
            width: calc(100% - 10px);
            border-radius: 3px;
            padding: 0 5px;
        }
    }

    .summary__header {
        background: #ddd;
    }
</style>
