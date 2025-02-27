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
import * as React from 'react';
import type { FlexProps } from 'rendition';
import { Flex, Txt } from 'rendition';

import type { DriveStatus } from '../../../../shared/drive-constraints';
import { getDriveImageCompatibilityStatuses } from '../../../../shared/drive-constraints';
import { compatibility, warning } from '../../../../shared/messages';
import prettyBytes from 'pretty-bytes';
import { getImage, getSelectedDrives } from '../../models/selection-state';
import {
	ChangeButton,
	DetailsText,
	StepButton,
	StepNameButton,
} from '../../styled-components';
import { middleEllipsis } from '../../utils/middle-ellipsis';
import * as i18next from 'i18next';

interface TargetSelectorProps {
	targets: any[];
	disabled: boolean;
	openDriveSelector: () => void;
	reselectDrive: () => void;
	flashing: boolean;
	show: boolean;
	tooltip: string;
}

function getDriveWarning(status: DriveStatus) {
	switch (status.message) {
		case compatibility.containsImage():
			return warning.sourceDrive();
		case compatibility.largeDrive():
			return warning.largeDriveSize();
		case compatibility.system():
			return warning.systemDrive();
		default:
			return '';
	}
}

const DriveCompatibilityWarning = ({
	warnings,
	...props
}: {
	warnings: string[];
} & FlexProps) => {
	const systemDrive = warnings.find(
		(message) => message === warning.systemDrive(),
	);
	return (
		<Flex tooltip={warnings.join(', ')} {...props}>
			<ExclamationTriangleSvg
				fill={systemDrive ? '#fca321' : '#8f9297'}
				height="1em"
			/>
		</Flex>
	);
};

export function TargetSelectorButton(props: TargetSelectorProps) {
	const targets = getSelectedDrives();

	if (targets.length === 1) {
		const target = targets[0];
		const warnings = getDriveImageCompatibilityStatuses(
			target,
			getImage(),
			true,
		).map(getDriveWarning);
		return (
			<>
				<StepNameButton plain tooltip={props.tooltip}>
					{warnings.length > 0 && (
						<DriveCompatibilityWarning warnings={warnings} mr={2} />
					)}
					{middleEllipsis(target.description, 20)}
				</StepNameButton>
				{!props.flashing && (
					<ChangeButton plain mb={14} onClick={props.reselectDrive}>
						{i18next.t('target.change')}
					</ChangeButton>
				)}
				{target.size != null && (
					<DetailsText>{prettyBytes(target.size)}</DetailsText>
				)}
			</>
		);
	}

	if (targets.length > 1) {
		const targetsTemplate = [];
		for (const target of targets) {
			const warnings = getDriveImageCompatibilityStatuses(
				target,
				getImage(),
				true,
			).map(getDriveWarning);
			targetsTemplate.push(
				<DetailsText
					key={target.device}
					tooltip={`${target.description} ${target.displayName} ${
						target.size != null ? prettyBytes(target.size) : ''
					}`}
					px={21}
				>
					{warnings.length > 0 ? (
						<DriveCompatibilityWarning warnings={warnings} mr={2} />
					) : null}
					<Txt mr={2}>{middleEllipsis(target.description, 14)}</Txt>
					{target.size != null && <Txt>{prettyBytes(target.size)}</Txt>}
				</DetailsText>,
			);
		}
		return (
			<>
				<StepNameButton plain tooltip={props.tooltip}>
					{targets.length} {i18next.t('target.targets')}
				</StepNameButton>
				{!props.flashing && (
					<ChangeButton plain onClick={props.reselectDrive} mb={14}>
						{i18next.t('target.change')}
					</ChangeButton>
				)}
				{targetsTemplate}
			</>
		);
	}

	return (
		<StepButton
			primary
			tabIndex={targets.length > 0 ? -1 : 2}
			disabled={props.disabled}
			onClick={props.openDriveSelector}
			data-testid="select-target-button"
		>
			{i18next.t('target.selectTarget')}
		</StepButton>
	);
}
