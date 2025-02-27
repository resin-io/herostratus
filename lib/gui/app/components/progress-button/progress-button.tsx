/*
 * Copyright 2016 balena.io
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

import * as React from 'react';
import { Flex, Button, ProgressBar, Txt } from 'rendition';
import { default as styled } from 'styled-components';

import { fromFlashState } from '../../modules/progress-status';
import { StepButton } from '../../styled-components';
import * as i18next from 'i18next';

const FlashProgressBar = styled(ProgressBar)`
	> div {
		width: 100%;
		height: 12px;
		color: white !important;
		text-shadow: none !important;
		transition-duration: 0s;

		> div {
			transition-duration: 0s;
		}
	}

	width: 100%;
	height: 12px;
	margin-bottom: 6px;
	border-radius: 14px;
	font-size: 16px;
	line-height: 48px;

	background: #2f3033;
`;

interface ProgressButtonProps {
	type: 'decompressing' | 'flashing' | 'verifying';
	active: boolean;
	percentage: number;
	position: number;
	disabled: boolean;
	cancel: (type: string) => void;
	callback: () => void;
	warning?: boolean;
}

const colors = {
	decompressing: '#00aeef',
	flashing: '#da60ff',
	verifying: '#1ac135',
} as const;

const CancelButton = styled(({ type, onClick, ...props }) => {
	const status = type === 'verifying' ? i18next.t('skip') : i18next.t('cancel');
	return (
		<Button plain onClick={() => onClick(status)} {...props}>
			{status}
		</Button>
	);
})`
	font-weight: 600;

	&&& {
		width: auto;
		height: auto;
		font-size: 14px;
	}
`;

export class ProgressButton extends React.PureComponent<ProgressButtonProps> {
	public render() {
		const percentage = this.props.percentage;
		const warning = this.props.warning;
		const { status, position } = fromFlashState({
			type: this.props.type,
			percentage,
			position: this.props.position,
		});
		const type = this.props.type || 'default';
		if (this.props.active) {
			return (
				<>
					<Flex
						alignItems="baseline"
						justifyContent="space-between"
						width="100%"
						style={{
							marginTop: 42,
							marginBottom: '6px',
							fontSize: 16,
							fontWeight: 600,
						}}
					>
						<Flex>
							<Txt data-testid="flash-status" color="#fff">
								{status}&nbsp;
							</Txt>
							<Txt color={colors[type]}>{position}</Txt>
						</Flex>
						{type && (
							<CancelButton
								type={type}
								onClick={this.props.cancel}
								color="#00aeef"
							/>
						)}
					</Flex>
					<FlashProgressBar background={colors[type]} value={percentage} />
				</>
			);
		}
		return (
			<StepButton
				primary={!warning}
				warning={warning}
				onClick={this.props.callback}
				disabled={this.props.disabled}
				data-testid={'flash-now-button'}
				style={{
					marginTop: 30,
				}}
			>
				{i18next.t('flash.flashNow')}
			</StepButton>
		);
	}
}
