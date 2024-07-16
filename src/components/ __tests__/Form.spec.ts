import { mount } from '@vue/test-utils'
import Form from '@/components/Form.vue'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Form.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Form)
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('emits addTask event with the correct payload on submit', async () => {
    await wrapper.find('input[type="text"]').setValue('New Task')
    await wrapper.find('textarea').setValue('Task description')
    await wrapper.find('select').setValue('todo')
    await wrapper.find('form').trigger('submit.prevent')

    const emitted = wrapper.emitted().addTask
    expect(emitted).toBeTruthy()
    expect(emitted[0]).toEqual([
      {
        title: 'New Task',
        description: 'Task description',
        completed: false,
        createdAt: expect.any(Number),
        status: 'todo'
      }
    ])
  })
})
