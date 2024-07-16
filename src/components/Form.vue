<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['addTask'])

const title = ref('')
const description = ref('')
const status = ref<'todo' | 'in-progress' | 'completed'>('todo')

function onSubmit() {
  if (!title.value) return
  emit('addTask', {
    title: title.value,
    description: description.value,
    completed: status.value === 'completed',
    createdAt: new Date().getTime(),
    status: status.value
  })

  title.value = ''
  description.value = ''
  status.value = 'todo'
}
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col items-center justify-center gap-4">
    <input
      type="text"
      v-model="title"
      placeholder="Task title"
      class="w-full input input-bordered"
    />
    <textarea
      v-model="description"
      placeholder="Task description"
      class="w-full textarea textarea-bordered"
    />
    <select v-model="status" class="w-full select select-bordered">
      <option value="todo">Todo</option>
      <option value="in-progress">In Progress</option>
      <option value="completed">Completed</option>
    </select>
    <button type="submit" class="btn btn-primary w-full">Add Task</button>
  </form>
</template>
