import { mount } from '@vue/test-utils'
import HomeView from '@/views/HomeView.vue'
import Form from '@/components/Form.vue'
import DragAndDropList from '@/components/DragAndDropList.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('HomeView.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(HomeView)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('contains the Form component', () => {
    expect(wrapper.findComponent(Form).exists()).toBe(true)
  })

  it('contains the DragAndDropList component', () => {
    expect(wrapper.findComponent(DragAndDropList).exists()).toBe(true)
  })

  it('adds a task correctly', async () => {
    const task = {
      title: 'New Task',
      description: 'Task description',
      completed: false,
      createdAt: Date.now(),
      status: 'todo'
    }
    wrapper.vm.addTask(task)
    expect(wrapper.vm.tasks).toContainEqual(task)
  })

  it('adds a completed task correctly', async () => {
    const task = {
      title: 'Completed Task',
      description: 'Task description',
      completed: true,
      createdAt: Date.now(),
      status: 'completed'
    }
    wrapper.vm.addTask(task)
    expect(wrapper.vm.completedTasks).toContainEqual(task)
  })
})
