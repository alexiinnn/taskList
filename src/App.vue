<template>
  <div id="app">
    <TasksList/>
  </div>
</template>

<script>
import TasksList from './components/TasksList'
import store from './store'

export default {
  name: 'App',
  components: {
    TasksList
  },
  store
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
