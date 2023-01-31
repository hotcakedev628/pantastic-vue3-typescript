<template>
  <div class="autocomplete">
    <label :for="name" class="label">{{ label }}</label>
    <input
      v-bind="inputAttrs"
      type="text"
      :value="inputValue"
      @focus="isFocused = true"
      @blur.passive="handleBlur"
      @input="handleInputChange"
      @keydown.down="handleArrowDown"
      @keydown.up="handleArrowUp"
      @keydown.enter="handleEnter"
    />
    <ul v-if="isOpen" class="list">
      <li
        v-for="(location, idx) in locations"
        :key="idx"
        :class="{ active: idx === arrowCounter }"
        @click="handleSelect"
      >
        {{ location.label }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, onMounted } from 'vue'
import type { PropType } from 'vue'
import type { Option } from '@/types'
import { fetchLocations } from '@/api/locations'

export default defineComponent({
  name: 'Autocomplete',
  props: {
    label: {
      type: String as PropType<string>,
    },
    name: {
      type: String as PropType<string>,
      required: true,
    },
    initialValue: {
      type: [String, Number] as PropType<any | null>,
      default: null,
    },
    inputAttrs: {
      type: Object as PropType<any | null>,
    },
    onBlur: {
      type: Function as PropType<() => any>,
      required: false,
    },
    options: {
      type: Array as PropType<Option[]>,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const { initialValue, options } = toRefs(props)
    const inputValue = ref<string>('')
    const isFocused = ref<boolean>(false)
    const isOpen = ref<boolean>(false)
    const isSelected = ref<boolean>(false)
    const arrowCounter = ref<number>(-1)
    const locations = ref<Option[]>([])

    const handleBlur = () => {
      setTimeout(async () => {
        isFocused.value = false
        isOpen.value = false

        if (props.onBlur) props.onBlur()
      }, 100)
    }

    const getLocations = async () => {
      const fetchedLocations = await fetchLocations({
        query: inputValue.value,
      })

      locations.value = fetchedLocations.map(location => ({
        id: location.place_id,
        label: location.display_name,
      }))
    }

    const debounce = <T>(fn: T, wait: number) => {
      let timer: ReturnType<typeof setTimeout>

      return (event: Event) => {
        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {
          if (typeof fn === 'function') {
            fn(event)
          }
        }, wait)
      }
    }

    const setInputValue = (e: { target: { value: string } }) => {
      inputValue.value = e.target.value
      isSelected.value = false
    }

    const handleInputChange = debounce(setInputValue, 220)

    const handleArrowDown = () => {
      if (arrowCounter.value < locations.value.length) {
        arrowCounter.value = arrowCounter.value + 1
      }
    }

    const handleArrowUp = () => {
      if (arrowCounter.value > 0) {
        arrowCounter.value = arrowCounter.value - 1
      }
    }

    const handleEnter = () => {
      inputValue.value = locations.value[arrowCounter.value].label
      arrowCounter.value = -1
      isSelected.value = true
      context.emit('update:modelValue', inputValue.value)
    }

    const handleSelect = (e: any) => {
      inputValue.value = e.target.innerText
      isSelected.value = true
      context.emit('update:modelValue', inputValue.value)
    }

    watch(inputValue, async newInputValue => {
      if (newInputValue) {
        if (!options.value) {
          await getLocations()
        } else {
          locations.value = options.value.filter(option =>
            option.label.includes(newInputValue)
          )
        }

        if (!isSelected.value) isOpen.value = true
      } else {
        locations.value = []
        isOpen.value = false
      }
    })

    onMounted(() => {
      // this handles updates after component has mounted
      inputValue.value = initialValue.value
      if (options.value) locations.value = options.value
    })

    return {
      arrowCounter,
      inputValue,
      locations,
      isFocused,
      isOpen,
      handleBlur,
      handleSelect,
      handleInputChange,
      handleArrowDown,
      handleArrowUp,
      handleEnter,
    }
  },
})
</script>

<style scoped>
.autocomplete {
  display: flex;
  flex-direction: column;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  background: #fff;
  color: #000;
}

li {
  cursor: default;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  padding: 1px 5px;
}

li:hover {
  background-color: #000;
  color: #fff;
}

li.active {
  background-color: #000;
  color: #fff;
}
</style>
