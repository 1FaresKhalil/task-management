<script setup lang="ts">
import { ref } from 'vue'
import Form from '../components/Form.vue'
import DragAndDropList from '../components/DragAndDropList.vue'

type Task = {
  title: string
  description: string
  completed: boolean
  createdAt: number
  status: 'todo' | 'in-progress' | 'completed'
}

const tasks = ref<Task[]>([])
const completedTasks = ref<Task[]>([])

function addTask(task: Task) {
  if (task.status === 'completed') {
    task.completed = true
    completedTasks.value.push(task)
  } else {
    task.completed = false
    tasks.value.push(task)
  }
}

function addCompletedTasks(ct: Task) {
  completedTasks.value.push(ct)
  tasks.value = tasks.value.filter((t) => t.createdAt !== ct.createdAt)
}

function removeCompletedTasks(rt: Task) {
  completedTasks.value = completedTasks.value.filter((t) => t.createdAt !== rt.createdAt)
  tasks.value.push(rt)
}

function onChangeForCompletedTask(allCompleted: boolean) {
  if (!allCompleted) {
    completedTasks.value = completedTasks.value.map((task) => ({
      ...task,
      completed: true,
      status: 'completed'
    }))
  }
}

function onChangeForTask(allNotCompleted: boolean) {
  if (!allNotCompleted) {
    tasks.value = tasks.value.map((task) => ({
      ...task,
      completed: false,
      status: 'todo'
    }))
  }
}

function deleteTask(task: Task) {
  if (task.completed) {
    completedTasks.value = completedTasks.value.filter((t) => t.createdAt !== task.createdAt)
  } else {
    tasks.value = tasks.value.filter((t) => t.createdAt !== task.createdAt)
  }
}

function onUpdateSubmit(isEdit: number, updatedTask: Task) {
  if (!updatedTask) return

  const taskIndex = tasks.value.findIndex((t) => t.createdAt === isEdit)

  if (taskIndex !== -1) {
    if (updatedTask.status === 'completed') {
      addCompletedTasks({ ...tasks.value[taskIndex], ...updatedTask, completed: true })
    } else {
      tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updatedTask }
    }
  }
}
</script>

<template>
  <main>
    <h1 class="mt-4 text-2xl italic font-bold text-center text-emerald-600">Task Management App</h1>
    <div class="w-full p-4 mx-auto mt-4 md:w-3/5 xl:w-1/2">
      <Form @add-task="(t) => addTask(t)" />
      <DragAndDropList
        :tasks="tasks"
        :completed-tasks="completedTasks"
        @on-change-add="addCompletedTasks"
        @on-change-remove="removeCompletedTasks"
        @on-change-for-completed-task="onChangeForCompletedTask"
        @on-change-for-task="onChangeForTask"
        @delete-task="deleteTask"
        @edit-task="onUpdateSubmit"
      />
    </div>
  </main>
</template>
