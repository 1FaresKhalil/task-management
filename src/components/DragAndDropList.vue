<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@/utils/cn'
import { checkAllCompleted, checkAllNotCompleted } from '@/utils/helper'
import draggable from 'vuedraggable'

const isEdit = ref(0)
const editTitle = ref('')
const editDescription = ref('')
const editStatus = ref<'todo' | 'in-progress' | 'completed'>('todo')

const emit = defineEmits([
  'onChangeAdd',
  'onChangeRemove',
  'onChangeForCompletedTask',
  'onChangeForTask',
  'deleteTask',
  'editTask'
])

const props = defineProps({
  tasks: {
    type: Array as PropType<
      {
        title: string
        description: string
        completed: boolean
        createdAt: number
        status: string
      }[]
    >,
    default: () => []
  },
  completedTasks: {
    type: Array as PropType<
      {
        title: string
        description: string
        completed: boolean
        createdAt: number
        status: string
      }[]
    >,
    default: () => []
  }
})

function onChangeForCompletedTask() {
  const allCompleted = checkAllCompleted(props.completedTasks)
  emit('onChangeForCompletedTask', allCompleted)
}

function onChangeForTask() {
  const allNotCompleted = checkAllNotCompleted(props.tasks)
  emit('onChangeForTask', allNotCompleted)
}

function onChangeAdd(task: { completed: boolean; status: string }) {
  if (task.completed) {
    task.status = 'completed'
    emit('onChangeAdd', task)
  } else if (task.status === 'todo') {
    task.status = 'in-progress'
  }
}

function onChangeRemove(task: { completed: boolean; status: string }) {
  if (!task.completed) {
    task.status = 'todo'
    emit('onChangeRemove', task)
  }
}

function deleteTask(task: { createdAt: number }) {
  emit('deleteTask', task)
}

function onUpdateSubmit() {
  if (!editTitle.value) return
  emit('editTask', isEdit.value, {
    title: editTitle.value,
    description: editDescription.value,
    status: editStatus.value
  })
  isEdit.value = 0
  editTitle.value = ''
  editDescription.value = ''
  editStatus.value = 'todo'
}

function isEditingTask(task: {
  createdAt: number
  title: string
  description: string
  status: string
}) {
  isEdit.value = task.createdAt
  editTitle.value = task.title
  editDescription.value = task.description
  editStatus.value = task.status as 'todo' | 'in-progress' | 'completed'
}

function onBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement | null
  if (
    !relatedTarget ||
    !['INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(relatedTarget.tagName)
  ) {
    isEdit.value = 0
    editTitle.value = ''
    editDescription.value = ''
    editStatus.value = 'todo'
  }
}
</script>

<template>
  <h2 class="mt-4 text-center" v-if="!props.tasks || props.tasks.length === 0">No task yet!</h2>
  <template
    v-if="
      (props.tasks && props.tasks.length > 0) ||
      (props.completedTasks && props.completedTasks.length > 0)
    "
  >
    <draggable
      class="mt-4 space-y-3"
      :list="props.tasks"
      group="task"
      itemKey="title"
      @change="onChangeForTask"
    >
      <template #item="{ element }">
        <div
          :id="element"
          :class="
            cn(
              'group select-none flex items-center gap-3 justify-between px-4 py-3 text-black transition-all duration-150 rounded-lg cursor-pointer bg-emerald-600 hover:rounded-md',
              element.completed && 'bg-emerald-800 cursor-default'
            )
          "
        >
          <template v-if="isEdit === element.createdAt">
            <form class="w-full" @submit.prevent="onUpdateSubmit">
              <input
                autofocus
                @blur="onBlur"
                type="text"
                v-model="editTitle"
                class="w-full bg-transparent input border-emerald-800 focus:border-emerald-800 focus:ring-emerald-700"
              />
              <textarea
                v-model="editDescription"
                class="w-full mt-2 bg-transparent textarea border-emerald-800 focus:border-emerald-800 focus:ring-emerald-700"
              />
              <select v-model="editStatus" class="w-full mt-2 select select-bordered text-white">
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <button type="submit" class="btn btn-primary w-full mt-2">Save</button>
            </form>
          </template>
          <template v-else>
            <div class="flex items-center gap-3">
              <input
                @change="onChangeAdd(element)"
                type="checkbox"
                v-model="element.completed"
                class="checkbox bg-slate-300"
              />
              <div>
                <span :class="cn('text-lg font-bold', element.completed && 'line-through')">
                  {{ element.title }}
                </span>
                <p :class="cn('text-sm', element.completed && 'line-through')">
                  {{ element.description }}
                </p>
                <p class="text-sm">Status: {{ element.status }}</p>
              </div>
            </div>
            <div class="items-center hidden gap-2 transition-all group-hover:flex">
              <button @click="deleteTask(element)" class="btn btn-error btn-sm">
                <i class="text-white fa-solid fa-trash-can"></i>
              </button>
              <button @click="isEditingTask(element)" class="btn btn-info btn-sm">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          </template>
        </div>
      </template>
    </draggable>
    <div class="mt-4">
      <h3>Completed</h3>
      <draggable
        class="mt-4 space-y-3"
        :list="props.completedTasks"
        group="task"
        itemKey="title"
        @change="onChangeForCompletedTask"
      >
        <template #item="{ element }">
          <div
            :class="
              cn(
                'group select-none flex items-center gap-3 justify-between px-4 py-3 text-black transition-all duration-150 rounded-lg cursor-pointer bg-emerald-600 hover:rounded-md',
                element.completed && 'bg-emerald-800 cursor-default'
              )
            "
          >
            <div class="flex items-center gap-3">
              <input
                @change="onChangeRemove(element)"
                type="checkbox"
                v-model="element.completed"
                class="checkbox bg-slate-300"
              />
              <div>
                <span :class="cn('text-lg font-bold', element.completed && 'line-through')">
                  {{ element.title }}
                </span>
                <p :class="cn('text-sm', element.completed && 'line-through')">
                  {{ element.description }}
                </p>
                <p class="text-sm">Status: {{ element.status }}</p>
              </div>
            </div>

            <div class="hidden transition-all group-hover:block">
              <button @click="deleteTask(element)" class="btn btn-error btn-sm">
                <i class="text-white fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        </template>
      </draggable>
    </div>
  </template>
</template>
