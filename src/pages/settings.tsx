import { api } from '~/utils/api'
import styles from './settings.module.css'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useOnLeavePageConfirmation } from '~/utils/useOnLeavePageConfirmation'
import { useEffect, useState } from 'react'
import Button from '~/components/Button'
import Input from '~/components/Input'
import classNames from 'classnames'
import { useKey } from 'react-use'

export default function Home() {
	const { data, refetch } = api.sensor.getAll.useQuery()

	const createSensor = api.sensor.create.useMutation()
	const updateSensor = api.sensor.update.useMutation()

	const router = useRouter()

	useKey('Escape', () => {
		router.back()
	})

	const [isAdd, setIsAdd] = useState(!!router.query.isAdd)
	const [originSensorID, setOriginSensorID] = useState(router.query.id as string)

	const originSensor = data?.cards.find((e) => e.id == originSensorID)

	useEffect(() => {
		if (router.query.isAdd) {
			setIsAdd(true)
		}
	}, [router.query.isAdd])

	useEffect(() => {
		if (router.query.id) {
			setOriginSensorID(router.query.id as string)
		}
	}, [router.query.id])

	const initialName = originSensor ? originSensor.name : ''
	const [name, setName] = useState<string | undefined>(undefined)

	const initialSensorID = originSensor ? originSensor.sensorID : ''
	const [sensorID, setSensorID] = useState<string | undefined>(undefined)

	const initialMeasurementDuration = originSensor ? originSensor.measurementDuration.toString() : ''
	const [measurementDuration, setMeasurementDuration] = useState<string | undefined>(undefined)

	const initialType = originSensor ? originSensor.type : ''
	const [type, setType] = useState<string | undefined>(undefined)

	const [overrideChangesMade, setOverrideChangesMade] = useState(false)
	const [saving, setSaving] = useState(false)

	useEffect(() => {
		if ((originSensorID && !originSensor) || (!isAdd && !originSensorID)) {
			setOverrideChangesMade(true)
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			router.replace('/')
		}
	}, [isAdd, originSensor, originSensorID, router])

	function reset() {
		setName(undefined)
		setSensorID(undefined)
		setMeasurementDuration(undefined)
		setType(undefined)
	}

	const changesMade = !!(
		((initialName !== name && name) ??
			(initialSensorID !== sensorID && sensorID) ??
			(initialMeasurementDuration !== measurementDuration && measurementDuration) ??
			(initialType !== type && type)) &&
		!overrideChangesMade
	)

	const changesMadeStyle = changesMade
		? {
				opacity: 1,
				y: 0,
				transition: { ease: [0, 0.58, 0.58, 1.25] },
		  }
		: {
				opacity: 0,
				y: 30,
				transition: { ease: [0.49, -0.28, 0.96, 0.66] },
		  }

	const [doShake, setDoShake] = useState(false)

	useOnLeavePageConfirmation(changesMade, () => {
		setDoShake(true)
		setTimeout(() => {
			setDoShake(false)
		}, 500)
	})

	return (
		<>
			<motion.div
				className={styles.overlay}
				transition={{ duration: 0.1 }}
				initial={{ scale: 1.1, opacity: 0 }}
				animate={{ scale: 1, opacity: 1, transition: { ease: [0, 0.58, 0.58, 1.25], duration: 0.2, delay: 0.1 } }}
				exit={{ scale: 1.1, opacity: 0, transition: { ease: [0.49, -0.28, 0.96, 0.66], duration: 0.2 } }}
			>
				<div className={styles.card}>
					<div className={styles.header}>
						{!isAdd && (
							<Button type={'none'}>
								<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 14 17" fill="none">
									<path
										d="M6.39056 0.890549C5.34426 0.890549 4.48819 1.74661 4.48819 2.79291H2.58583C1.53953 2.79291 0.683472 3.64897 0.683472 4.69527H14C14 3.64897 13.1439 2.79291 12.0976 2.79291H10.1953C10.1953 1.74661 9.33922 0.890549 8.29292 0.890549H6.39056ZM2.58583 6.59763V15.748C2.58583 15.9572 2.73802 16.1094 2.94728 16.1094H11.7552C11.9645 16.1094 12.1167 15.9572 12.1167 15.748V6.59763H10.2143V13.2559C10.2143 13.7886 9.79578 14.2071 9.26312 14.2071C8.73046 14.2071 8.31194 13.7886 8.31194 13.2559V6.59763H6.40958V13.2559C6.40958 13.7886 5.99106 14.2071 5.4584 14.2071C4.92574 14.2071 4.50722 13.7886 4.50722 13.2559V6.59763H2.60486H2.58583Z"
										fill="#F32323"
									/>
								</svg>
							</Button>
						)}
						<h2>{isAdd ? 'Sensor hinzufügen' : 'Sensor bearbeiten'}</h2>
						<Button
							type={'none'}
							onClick={() => {
								router.back()
							}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 14" fill="none">
								<path
									d="M0.812805 3.28768L4.52512 6.99999L0.812805 10.7123L3.28768 13.1872L6.99999 9.47486L10.7123 13.1872L13.1872 10.7123L9.47486 6.99999L13.1872 3.28768L10.7123 0.812805L6.99999 4.52512L3.28768 0.812805L0.812805 3.28768Z"
									fill="white"
								/>
							</svg>
						</Button>
					</div>
					<div className={styles.seperator}></div>
					<div className={styles.content}>
						<Input
							width={'100%'}
							value={name ?? initialName}
							onChange={(e) => {
								setName(e.target.value)
							}}
						>
							Name
						</Input>
						<Input
							width={'100px'}
							value={sensorID ?? initialSensorID}
							onChange={(e) => {
								setSensorID(e.target.value)
							}}
						>
							Sensor ID
						</Input>
						<Input
							width={'60px'}
							value={measurementDuration ?? initialMeasurementDuration}
							onChange={(e) => {
								setMeasurementDuration(e.target.value)
							}}
							unit={'Minuten'}
						>
							Messung alle
						</Input>
						<Input
							width={'200px'}
							value={type ?? initialType}
							onChange={(e) => {
								setType(e.target.value)
							}}
						>
							Sensortyp
						</Input>

						<motion.div className={classNames(styles.unsafedChanges, !changesMade && styles.hideUnsafedChanges, doShake && styles.doShake)} animate={changesMadeStyle}>
							<p>Ungespeicherte Änderungen</p>
							<div className={styles.buttonRow}>
								<Button
									type={'secondary'}
									onClick={() => {
										reset()
										isAdd && router.back()
									}}
								>
									{isAdd ? 'Abbrechen' : 'Zurücksetzen'}
								</Button>
								<Button
									type={'primary'}
									loading={saving}
									onClick={async () => {
										if (isAdd) {
											setSaving(true)
											try {
												await createSensor.mutateAsync({ name: name ?? '', sensorID: sensorID ?? '', measurementDuration: parseInt(measurementDuration ?? '0'), type: type ?? '' })
												await refetch()
												setOverrideChangesMade(true)
												router.back()
											} catch (error) {
												setSaving(false)
											}
										} else {
											console.log('update')
											setSaving(true)
											try {
												await updateSensor.mutateAsync({
													id: originSensorID,
													name: name,
													sensorID: sensorID,
													measurementDuration: measurementDuration ? parseInt(measurementDuration) : undefined,
													type: type,
												})
												await refetch()
												setSaving(false)
												reset()
											} catch (error) {
												setSaving(false)
											}
										}
									}}
								>
									{isAdd ? 'Hinzufügen' : 'Speichern'}
								</Button>
							</div>
						</motion.div>
					</div>
				</div>
			</motion.div>
		</>
	)
}
