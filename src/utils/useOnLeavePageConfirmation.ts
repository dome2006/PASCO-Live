/* eslint-disable @typescript-eslint/no-misused-promises */
/**
 * Asks for confirmation to leave/reload if there are unsaved changes.
 */
import Router, { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useOnLeavePageConfirmation = (unsavedChanges: boolean, callback: () => void) => {
	const router = useRouter()

	useEffect(() => {
		// For reloading.
		window.onbeforeunload = () => {
			if (unsavedChanges) {
				return 'Einige Änderungen sind noch nicht gespeichert. Möchtes du die Seite wirklich schließen?'
			}
		}

		// For changing in-app route.
		if (unsavedChanges) {
			const beforeHistoryChange = async () => {
				router.events.off('beforeHistoryChange', beforeHistoryChange)
				await router.push(router.pathname, undefined, { shallow: true })
				router.events.on('beforeHistoryChange', beforeHistoryChange)
                callback()
			}

			router.events.on('beforeHistoryChange', beforeHistoryChange)
			return () => {
				router.events.off('beforeHistoryChange', beforeHistoryChange)
				window.onbeforeunload = null
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [unsavedChanges])
}
