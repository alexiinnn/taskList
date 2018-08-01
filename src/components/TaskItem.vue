<template>
    <tr class="job__item">
        <td class="job__name">
            <input type="text"
                   class="job__input"
                   v-model="task.name"
                   value="comTask.name"
                   :readonly="!isEditable"
                   @change="$emit('update', task)"
            >
        </td>
        <td class="job__employee">
            <input type="text"
            class="job__input"
            v-model="task.employee"
            value="comTask.employee"
            :readonly="!isEditable"
            @change="$emit('update', task)"
            >
        </td>
        <td class="job__time">
            <input type="text"
                   class="job__input"
                   v-model="task.time"
                   value="comTask.time"
                   :readonly="!isEditable"
                   @change="$emit('update', task)"
            >
        <td class="job__cost">
            <input type="text"
                   class="job__input"
                   v-model="task.cost"
                   value="comTask.cost"
                   :readonly="!isEditable"
                   @change="$emit('update', task)"
            >
        </td>
        <td class="job__actions">
            <font-awesome-icon icon="edit"
                @click="isEditable=!isEditable"
            />
            <font-awesome-icon icon="trash"
                               @click="isRemoved=!isRemoved"
            />
        </td>
        <div class="confirmation"
            :class="{'confirmation--hidden': !isRemoved}"
        >
            <span>Вы действительно хотите удалить эту запись?</span>
            <font-awesome-icon icon="check-circle"
                               @click="$emit('remove', task.id)"
            />
            <font-awesome-icon icon="times-circle"
                               @click="isRemoved=!isRemoved"
            />
        </div>
    </tr>
</template>

<script>
export default {
  name: 'TaskItem',
  data () {
    return {
      jsonTask: JSON.stringify(this.task),
      isEditable: false,
      isRemoved: false
    }
  },
  props: {
    task: {
      default: []
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
