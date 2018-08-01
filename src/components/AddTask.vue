/* eslint-disable */

<template>
    <tr class="job__item">
        <td class="job__name">
            <input type="text"
                   class="job__input"
                   v-model="task.name"
                   value="comTask.name"
            >
        </td>
        <td class="job__employee">
            <input type="text"
            class="job__input"
            v-model="task.employee"
            value="comTask.employee"
            >
        </td>
        <td class="job__time">
            <input type="number"
                   min="0.1"
                   class="job__input"
                   v-model="task.time"
                   value="comTask.time"
            >
        <td class="job__cost">
            <input type="number"
                   min="1"
                   class="job__input"
                   v-model="task.cost"
                   value="comTask.cost"
            >
        </td>
        <td class="job__actions">
            <font-awesome-icon icon="plus-circle"
                @click="add"
                v-if="isFilled"
            />
        </td>
    </tr>
</template>

<script>
import uuidv4 from 'uuid/v4'

export default {
  name: 'AddTask',
  data () {
    return {
      task: {
        name: '',
        employee: '',
        time: '',
        cost: ''
      }
    }
  },
  computed: {
    isFilled () {
      return Object.values(this.task).every(val => !!val)
    }
  },
  methods: {
    add () {
      if (this.task) this.task.id = uuidv4().toUpperCase()
      this.$emit('add', this.task)
      this.task = {
        name: '',
        employee: '',
        time: '',
        cost: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .job__item {
        width: 100%;
        position: relative;
        border-radius: 3px;
        vertical-align: top;
        text-align: left;
        padding: 0;
        margin: 0;
        transform: scale(1); //hack

        .job__input {

            border: 1px solid blue;
            border-radius: 3px;
            &:read-only {
                border: 1px solid transparent;
            }
        }

        .confirmation {
            position: absolute;
            top: 0;
            right: 0;
            width: calc(100% - 10px);
            height: 100%;
            border-radius: 3px;
            opacity: 1;
            transition: ease-in-out .3 all;
            background: aliceblue;
            z-index: 10;
            padding: 0 5px;

            &.confirmation--hidden {
                opacity: 0;
                width: 0;
            }
        }

    }


</style>
