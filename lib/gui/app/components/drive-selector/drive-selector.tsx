/*
 * Copyright 2019 balena.io
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ExclamationTriangleSvg from '@fortawesome/fontawesome-free/svgs/solid/triangle-exclamation.svg';
import ChevronDownSvg from '@fortawesome/fontawesome-free/svgs/solid/chevron-down.svg';
import type * as sourceDestination from 'etcher-sdk/build/source-destination/';
import * as React from 'react';
import type { ModalProps, TableColumn } from 'rendition';
import { Flex, Txt, Badge, Link } from 'rendition';
import styled from 'styled-components';

import type {
	DriveStatus,
	DrivelistDrive,
} from '../../../../shared/drive-constraints';
import {
	getDriveImageCompatibilityStatuses,
	isDriveValid,
	isDriveSizeLarge,
} from '../../../../shared/drive-constraints';
import { compatibility, warning } from '../../../../shared/messages';
import prettyBytes from 'pretty-bytes';
import { getDrives, hasAvailableDrives } from '../../models/available-drives';
import { getImage, isDriveSelected } from '../../models/selection-state';
import { store } from '../../models/store';
import { logEvent, logException } from '../../modules/analytics';
import { open as openExternal } from '../../os/open-external/services/open-external';
import type { GenericTableProps } from '../../styled-components';
import { Alert, Modal, Table } from '../../styled-components';

import type { SourceMetadata } from '../../../../shared/typings/source-selector';
import { middleEllipsis } from '../../utils/middle-ellipsis';
import * as i18next from 'i18next';

interface UsbbootDrive extends sourceDestination.UsbbootDrive {
	progress: number;
}

interface DriverlessDrive {
	displayName: string; // added in app.ts
	description: string;
	link: string;
	linkTitle: string;
	linkMessage: string;
	linkCTA: string;
}

type Drive = DrivelistDrive | DriverlessDrive | UsbbootDrive;

function isUsbbootDrive(drive: Drive): drive is UsbbootDrive {
	return (drive as UsbbootDrive).progress !== undefined;
}

function isDriverlessDrive(drive: Drive): drive is DriverlessDrive {
	return (drive as DriverlessDrive).link !== undefined;
}

function isDrivelistDrive(drive: Drive): drive is DrivelistDrive {
	return typeof (drive as DrivelistDrive).size === 'number';
}

const DrivesTable = styled((props: GenericTableProps<Drive>) => (
	<Table<Drive> {...props} />
))`
	[data-display='table-head'],
	[data-display='table-body'] {
		> [data-display='table-row'] > [data-display='table-cell'] {
			&:nth-child(2) {
				width: 32%;
			}

			&:nth-child(3) {
				width: 15%;
			}

			&:nth-child(4) {
				width: 15%;
			}

			&:nth-child(5) {
				width: 32%;
			}
		}
	}
`;

function badgeShadeFromStatus(status: string) {
	switch (status) {
		case compatibility.containsImage():
			return 16;
		case compatibility.system():
		case compatibility.tooSmall():
			return 5;
		default:
			return 14;
	}
}

const InitProgress = styled(
	({
		value,
		...props
	}: {
		value: number;
		props?: React.ProgressHTMLAttributes<Element>;
	}) => {
		return <progress max="100" value={value} {...props} />;
	},
)`
	/* Reset the default appearance */
	appearance: none;

	::-webkit-progress-bar {
		width: 130px;
		height: 4px;
		background-color: #dde1f0;
		border-radius: 14px;
	}

	::-webkit-progress-value {
		background-color: #1496e1;
		border-radius: 14px;
	}
`;

export interface DriveSelectorProps
	extends Omit<ModalProps, 'done' | 'cancel' | 'onSelect'> {
	write: boolean;
	multipleSelection: boolean;
	showWarnings?: boolean;
	cancel: (drives: DrivelistDrive[]) => void;
	done: (drives: DrivelistDrive[]) => void;
	titleLabel: string;
	emptyListLabel: string;
	emptyListIcon: JSX.Element;
	selectedList?: DrivelistDrive[];
	updateSelectedList?: () => DrivelistDrive[];
	onSelect?: (drive: DrivelistDrive) => void;
}

interface DriveSelectorState {
	drives: Drive[];
	image?: SourceMetadata;
	missingDriversModal: { drive?: DriverlessDrive };
	selectedList: DrivelistDrive[];
	showSystemDrives: boolean;
}

function isSystemDrive(drive: Drive) {
	return isDrivelistDrive(drive) && drive.isSystem;
}

export class DriveSelector extends React.Component<
	DriveSelectorProps,
	DriveSelectorState
> {
	private unsubscribe: (() => void) | undefined;
	tableColumns: Array<TableColumn<Drive>>;
	originalList: DrivelistDrive[];

	constructor(props: DriveSelectorProps) {
		super(props);

		const defaultMissingDriversModalState: { drive?: DriverlessDrive } = {};
		const selectedList = this.props.selectedList || [];
		this.originalList = [...(this.props.selectedList || [])];

		this.state = {
			drives: getDrives(),
			image: getImage(),
			missingDriversModal: defaultMissingDriversModalState,
			selectedList,
			showSystemDrives: false,
		};

		this.tableColumns = [
			{
				field: 'description',
				label: i18next.t('drives.name'),
				render: (description: string, drive: Drive) => {
					if (isDrivelistDrive(drive)) {
						const isLargeDrive = isDriveSizeLarge(drive);
						const hasWarnings =
							this.props.showWarnings && (isLargeDrive || drive.isSystem);
						return (
							<Flex alignItems="center">
								{hasWarnings && (
									<ExclamationTriangleSvg
										height="1em"
										fill={drive.isSystem ? '#fca321' : '#8f9297'}
									/>
								)}
								<Txt ml={(hasWarnings && 8) || 0}>
									{middleEllipsis(description, 32)}
								</Txt>
							</Flex>
						);
					}
					return <Txt>{description}</Txt>;
				},
			},
			{
				field: 'description',
				key: 'size',
				label: i18next.t('drives.size'),
				render: (_description: string, drive: Drive) => {
					if (isDrivelistDrive(drive) && drive.size !== null) {
						return prettyBytes(drive.size);
					}
				},
			},
			{
				field: 'description',
				key: 'link',
				label: i18next.t('drives.location'),
				render: (_description: string, drive: Drive) => {
					return (
						<Txt>
							{drive.displayName}
							{isDriverlessDrive(drive) && (
								<>
									{' '}
									-{' '}
									<b>
										<a onClick={() => this.installMissingDrivers(drive)}>
											{drive.linkCTA}
										</a>
									</b>
								</>
							)}
						</Txt>
					);
				},
			},
			{
				field: 'description',
				key: 'extra',
				// We use an empty React fragment otherwise it uses the field name as label
				label: <></>,
				render: (_description: string, drive: Drive) => {
					if (isUsbbootDrive(drive)) {
						return this.renderProgress(drive.progress);
					} else if (isDrivelistDrive(drive)) {
						return this.renderStatuses(drive);
					}
				},
			},
		];
	}

	private driveShouldBeDisabled(drive: Drive, image?: SourceMetadata) {
		return (
			isUsbbootDrive(drive) ||
			isDriverlessDrive(drive) ||
			!isDriveValid(drive, image, this.props.write) ||
			(this.props.write && drive.isReadOnly)
		);
	}

	private getDisplayedDrives(drives: Drive[]): Drive[] {
		return drives.filter((drive) => {
			return (
				isUsbbootDrive(drive) ||
				isDriverlessDrive(drive) ||
				isDriveSelected(drive.device) ||
				this.state.showSystemDrives ||
				!drive.isSystem
			);
		});
	}

	private getDisabledDrives(drives: Drive[], image?: SourceMetadata): string[] {
		return drives
			.filter((drive) => this.driveShouldBeDisabled(drive, image))
			.map((drive) => drive.displayName);
	}

	private renderProgress(progress: number) {
		return (
			<Flex flexDirection="column">
				<Txt fontSize={12}>Initializing device</Txt>
				<InitProgress value={progress} />
			</Flex>
		);
	}

	private warningFromStatus(
		status: string,
		drive: { device: string; size: number },
	) {
		switch (status) {
			case compatibility.containsImage():
				return warning.sourceDrive();
			case compatibility.largeDrive():
				return warning.largeDriveSize();
			case compatibility.system():
				return warning.systemDrive();
			case compatibility.tooSmall():
				return warning.tooSmall(
					{
						size:
							this.state.image?.recommendedDriveSize ||
							this.state.image?.size ||
							0,
					},
					drive,
				);
			default:
				return '';
		}
	}

	private renderStatuses(drive: DrivelistDrive) {
		const statuses: DriveStatus[] = getDriveImageCompatibilityStatuses(
			drive,
			this.state.image,
			this.props.write,
		).slice(0, 2);
		return (
			// the column render fn expects a single Element
			<>
				{statuses.map((status) => {
					const badgeShade = badgeShadeFromStatus(status.message);
					const warningMessage = this.warningFromStatus(status.message, {
						device: drive.device,
						size: drive.size || 0,
					});
					return (
						<Badge
							key={status.message}
							shade={badgeShade}
							mr="8px"
							tooltip={this.props.showWarnings ? warningMessage : ''}
						>
							{status.message}
						</Badge>
					);
				})}
			</>
		);
	}

	private installMissingDrivers(drive: DriverlessDrive) {
		if (drive.link) {
			logEvent('Open driver link modal', {
				url: drive.link,
			});
			this.setState({ missingDriversModal: { drive } });
		}
	}

	componentDidMount() {
		this.unsubscribe = store.subscribe(() => {
			const drives = getDrives();
			const image = getImage();
			this.setState({
				drives,
				image,
				selectedList:
					(this.props.updateSelectedList && this.props.updateSelectedList()) ||
					[],
			});
		});
	}

	componentWillUnmount() {
		this.unsubscribe?.();
	}

	render() {
		const { cancel, done, ...props } = this.props;
		const { selectedList, drives, image, missingDriversModal } = this.state;

		const displayedDrives = this.getDisplayedDrives(drives);
		const disabledDrives = this.getDisabledDrives(drives, image);
		const numberOfSystemDrives = drives.filter(isSystemDrive).length;
		const numberOfDisplayedSystemDrives =
			displayedDrives.filter(isSystemDrive).length;
		const numberOfHiddenSystemDrives =
			numberOfSystemDrives - numberOfDisplayedSystemDrives;
		const hasSystemDrives = selectedList.filter(isSystemDrive).length;
		const showWarnings = this.props.showWarnings && hasSystemDrives;

		return (
			<Modal
				titleElement={
					<Flex alignItems="baseline" mb={18}>
						<Txt fontSize={24} align="left">
							{this.props.titleLabel}
						</Txt>
						<Txt
							fontSize={11}
							ml={12}
							color="#5b82a7"
							style={{ fontWeight: 600 }}
						>
							{i18next.t('drives.find', { length: drives.length })}
						</Txt>
					</Flex>
				}
				titleDetails={<Txt fontSize={11}>{getDrives().length} found</Txt>}
				cancel={() => cancel(this.originalList)}
				done={() => done(selectedList)}
				action={i18next.t('drives.select', { select: selectedList.length })}
				primaryButtonProps={{
					primary: !showWarnings,
					warning: showWarnings,
					disabled: !hasAvailableDrives(),
					'data-testid': 'validate-target-button',
				}}
				{...props}
			>
				{!hasAvailableDrives() ? (
					<Flex
						flexDirection="column"
						justifyContent="center"
						alignItems="center"
						width="100%"
					>
						{this.props.emptyListIcon}
						<b>{this.props.emptyListLabel}</b>
					</Flex>
				) : (
					<>
						<DrivesTable
							refFn={() => {
								// noop
							}}
							checkedItems={selectedList}
							checkedRowsNumber={selectedList.length}
							multipleSelection={this.props.multipleSelection}
							columns={this.tableColumns}
							data={displayedDrives}
							disabledRows={disabledDrives}
							getRowClass={(row: Drive) =>
								isDrivelistDrive(row) && row.isSystem ? ['system'] : []
							}
							rowKey="displayName"
							onCheck={(rows) => {
								if (rows == null) {
									rows = [];
								}
								let newSelection = rows.filter(isDrivelistDrive);
								if (this.props.multipleSelection) {
									if (rows.length === 0) {
										newSelection = [];
									}
									const deselecting = selectedList.filter(
										(selected) =>
											newSelection.filter(
												(row) => row.device === selected.device,
											).length === 0,
									);
									const selecting = newSelection.filter(
										(row) =>
											selectedList.filter(
												(selected) => row.device === selected.device,
											).length === 0,
									);
									deselecting.concat(selecting).forEach((row) => {
										if (this.props.onSelect) {
											this.props.onSelect(row);
										}
									});
									this.setState({
										selectedList: newSelection,
									});
									return;
								}
								if (this.props.onSelect) {
									this.props.onSelect(newSelection[newSelection.length - 1]);
								}
								this.setState({
									selectedList: newSelection.slice(newSelection.length - 1),
								});
							}}
							onRowClick={(row: Drive) => {
								if (
									!isDrivelistDrive(row) ||
									this.driveShouldBeDisabled(row, image)
								) {
									return;
								}
								if (this.props.onSelect) {
									this.props.onSelect(row);
								}
								const index = selectedList.findIndex(
									(d) => d.device === row.device,
								);
								const newList = this.props.multipleSelection
									? [...selectedList]
									: [];
								if (index === -1) {
									newList.push(row);
								} else {
									// Deselect if selected
									newList.splice(index, 1);
								}
								this.setState({
									selectedList: newList,
								});
							}}
						/>
						{numberOfHiddenSystemDrives > 0 && (
							<Link
								mt={15}
								mb={15}
								fontSize="14px"
								onClick={() => this.setState({ showSystemDrives: true })}
							>
								<Flex alignItems="center">
									<ChevronDownSvg height="1em" fill="currentColor" />
									<Txt ml={8}>
										{i18next.t('drives.showHidden', {
											num: numberOfHiddenSystemDrives,
										})}
									</Txt>
								</Flex>
							</Link>
						)}
					</>
				)}
				{this.props.showWarnings && hasSystemDrives ? (
					<Alert className="system-drive-alert" style={{ width: '67%' }}>
						{i18next.t('drives.systemDriveDanger')}
					</Alert>
				) : null}

				{missingDriversModal.drive !== undefined && (
					<Modal
						width={400}
						title={missingDriversModal.drive.linkTitle}
						cancel={() => this.setState({ missingDriversModal: {} })}
						done={() => {
							try {
								if (missingDriversModal.drive !== undefined) {
									openExternal(missingDriversModal.drive.link);
								}
							} catch (error: any) {
								logException(error);
							} finally {
								this.setState({ missingDriversModal: {} });
							}
						}}
						action={i18next.t('yesContinue')}
						cancelButtonProps={{
							children: i18next.t('cancel'),
						}}
						children={
							missingDriversModal.drive.linkMessage ||
							i18next.t('drives.openInBrowser', {
								link: missingDriversModal.drive.link,
							})
						}
					/>
				)}
			</Modal>
		);
	}
}
