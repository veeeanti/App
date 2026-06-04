<script lang="ts" setup>
  import { SparklesIcon } from '@heroicons/vue/24/outline'
  import { flip, offset, shift, useFloating } from '@floating-ui/vue'
  import useAppStatistics from '~/composables/useAppStatistics'
  import type { IPost } from '~/assets/js/post.dto'

  const props = defineProps<{
    tags: IPost['tags']
  }>()

  const { tutorialChatWithAi } = useAppStatistics()
  const { t } = useI18n()
  const router = useRouter()
  const localePath = useLocalePath()

  const referenceEl = ref<HTMLElement>()
  const floatingEl = ref<HTMLElement>()

  const { floatingStyles } = useFloating(referenceEl, floatingEl, {
    placement: 'bottom-start',
    middleware: [offset(6), flip({ fallbackPlacements: ['bottom-end'] }), shift()]
  })

  const tagCandidates = computed(() => {
    if (props.tags.character.length > 0) {
      return props.tags.character
    }

    if (props.tags.copyright.length > 0) {
      return props.tags.copyright
    }

    return Object.values(props.tags).flat()
  })

  const normalizedTags = computed(() => {
    return Array.from(new Set(tagCandidates.value)).filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
  })

  function formatTagForQuery(tag: string) {
    return tag.replaceAll('_', ' ')
  }

  function onChatMenuOpen() {
    if (tutorialChatWithAi.value) {
      return
    }

    tutorialChatWithAi.value = true
  }

  async function onPostOpenTagInNewTab(tag: string) {
    const tagRoute = `/posts/rule34.xxx?tags=${encodeURIComponent(tag)}`
    const path = localePath(tagRoute)
    window.open(router.resolve({ path, query: {} }).href, '_blank', 'noopener,noreferrer')
  }
</script>

<template>
  <HeadlessMenu
    as="div"
    class="relative inline-block text-left"
  >
    <HeadlessMenuButton
      ref="referenceEl"
      :aria-label="t('common.chatWithAi')"
      class="group flex items-center gap-1 rounded-md px-1.5 py-1 hover:hover-bg-util focus-visible:focus-outline-util"
      @click="onChatMenuOpen"
    >
      <ClientOnly>
        <SparklesIcon
          :class="[
            'h-5 w-5 text-base-content group-hover:hover-text-util',
            !tutorialChatWithAi ? 'chat-with-ai-glow-icon' : ''
          ]"
          aria-hidden="true"
        />

        <template #fallback>
          <SparklesIcon
            aria-hidden="true"
            class="h-5 w-5 text-base-content group-hover:hover-text-util"
          />
        </template>
      </ClientOnly>

      <span class="text-sm font-medium text-base-content group-hover:hover-text-util">AI</span>
    </HeadlessMenuButton>

    <Teleport to="body">
      <Transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessMenuItems
          v-if="normalizedTags.length > 0"
          :style="floatingStyles"
          class="z-50 w-56 divide-y divide-base-0/20 rounded-md bg-base-1000 ring-1 ring-base-0/20 focus:outline-hidden"
        >
          <div class="py-1">
            <div class="px-4 py-2 text-sm font-medium text-base-content-highlight">
              {{ t('common.chatWithCharacters') }}
            </div>
          </div>

          <HeadlessMenuItem
            v-for="tag in normalizedTags"
            :key="tag"
            v-slot="{ active }"
          >
            <button
              :class="[active ? 'bg-base-0/20 text-[#F0489C]' : 'text-[#F0489C]']"
              class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
              @click="onPostOpenTagInNewTab(tag)"
            >
              <span class="truncate">{{ formatTagForQuery(tag) }}</span>
            </button>
          </HeadlessMenuItem>
        </HeadlessMenuItems>
      </Transition>
    </Teleport>
  </HeadlessMenu>
</template>

<style scoped>
  .chat-with-ai-glow-icon {
    animation: chatWithAiIconGlow 2.6s ease-in-out infinite;
  }

  @keyframes chatWithAiIconGlow {
    0%,
    100% {
      color: rgba(56, 189, 248, 0.8);
      filter: drop-shadow(0 0 3px rgba(56, 189, 248, 0.25));
    }
    50% {
      color: rgba(167, 139, 250, 0.95);
      filter: drop-shadow(0 0 4px rgba(167, 139, 250, 0.4)) drop-shadow(0 0 8px rgba(56, 189, 248, 0.25));
    }
  }
</style>