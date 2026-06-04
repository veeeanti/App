export type DialogManagerDialog = 'installPwa' | 'feedback' | 'newsletter' | 'review'

export function useDialogManagerState() {
  const { timesTheAppHasBeenOpened, promptInstallPwa, promptFeedback, promptNewsletter, promptReview } =
    useAppStatistics()
  const isStandaloneDisplayMode = useState('isStandaloneDisplayMode', () => false)

  if (import.meta.client) {
    onMounted(() => {
      isStandaloneDisplayMode.value = window.matchMedia('(display-mode: standalone)').matches
    })
  }

  const pendingDialog = computed<DialogManagerDialog | undefined>(() => {
    if (timesTheAppHasBeenOpened.value >= 3 && !promptInstallPwa.value && !isStandaloneDisplayMode.value) {
      return 'installPwa'
    }

    if (timesTheAppHasBeenOpened.value >= 6 && !promptFeedback.value) {
      return 'feedback'
    }

    if (timesTheAppHasBeenOpened.value >= 9 && !promptNewsletter.value) {
      return 'newsletter'
    }

    if (timesTheAppHasBeenOpened.value >= 12 && !promptReview.value) {
      return 'review'
    }
  })

  function closeDialog(dialog = pendingDialog.value) {
    switch (dialog) {
      case 'installPwa':
        promptInstallPwa.value = true
        break

      case 'feedback':
        promptFeedback.value = true
        break

      case 'newsletter':
        promptNewsletter.value = true
        break

      case 'review':
        promptReview.value = true
        break
    }
  }

  return {
    pendingDialog,
    closeDialog
  }
}