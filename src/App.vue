<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    />
  </header>

  <main>
    <div class="wrapper">
      <Autocomplete
        required
        name="autocomplete"
        label="Location"
        @update="handleInputChange"
      />
    </div>
    <TheWelcome />
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Autocomplete from '@/components/Autocomplete.vue'
import type { Option } from '@/types'

export default defineComponent({
  name: 'App',
  components: { Autocomplete },
  setup() {
    const inputValue = ref<string>('')
    const locations = ref<Option[]>([{ id: 'blah blah', label: 'node node' }])

    const handleInputChange = (value: string) => {
      console.log('app input change', value)
      inputValue.value = value
    }

    return { inputValue, handleInputChange, locations }
  },
})
</script>

<style scoped>
.wrapper {
  width: 300px;
  max-width: 400px;
}
</style>
