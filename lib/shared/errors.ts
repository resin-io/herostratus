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

export type ErrorWithPath = Error & {
	path?: string;
	code?: keyof typeof HUMAN_FRIENDLY;
};

/**
 * @summary Human-friendly error messages
 */
export const HUMAN_FRIENDLY = {
	ENOENT: {
		title: (error: ErrorWithPath) => {
			return `No such file or directory: ${error.path}`;
		},
		description: () => "The file you're trying to access doesn't exist",
	},
	EPERM: {
		title: () => "You're not authorized to perform this operation",
		description: () =>
			'Please ensure you have necessary permissions for this task',
	},
	EACCES: {
		title: () => "You don't have access to this resource",
		description: () =>
			'Please ensure you have necessary permissions to access this resource',
	},
	ENOMEM: {
		title: () => 'Your system ran out of memory',
		description: () =>
			'Please make sure your system has enough available memory for this task',
	},
} as const;

/**
 * @summary Get user friendly property from an error
 *
 * @example
 * const error = new Error('My error');
 * error.code = 'ENOMEM';
 *
 * const friendlyDescription = getUserFriendlyMessageProperty(error, 'description');
 *
 * if (friendlyDescription) {
 *   console.log(friendlyDescription);
 * }
 */
function getUserFriendlyMessageProperty(
	error: ErrorWithPath,
	property: 'title' | 'description',
): string | undefined {
	if (typeof error.code !== 'string') {
		return undefined;
	}
	return HUMAN_FRIENDLY[error.code]?.[property]?.(error);
}

function isBlank(s: string | number | null | undefined) {
	if (typeof s === 'number') {
		s = s.toString();
	}
	return (s ?? '').trim() === '';
}

/**
 * @summary Get the title of an error
 *
 * @description
 * Try to get as much information as possible about the error
 * rather than falling back to generic messages right away.
 */
export function getTitle(error: ErrorWithPath): string {
	const codeTitle = getUserFriendlyMessageProperty(error, 'title');
	if (codeTitle !== undefined) {
		return codeTitle;
	}

	const message = error.message;
	if (!isBlank(message)) {
		return message;
	}

	const code = error.code;
	if (!isBlank(code)) {
		return `Error code: ${code}`;
	}

	return 'An error occurred';
}

/**
 * @summary Get the description of an error
 */
export function getDescription(
	error: ErrorWithPath & { description?: string },
): string {
	if (!isBlank(error.description)) {
		return error.description as string;
	}
	const codeDescription = getUserFriendlyMessageProperty(error, 'description');
	if (codeDescription !== undefined) {
		return codeDescription;
	}
	if (error.stack) {
		return error.stack;
	}
	return JSON.stringify(error, null, 2);
}

/**
 * @summary Create an error
 */
export function createError(options: {
	title: string;
	description?: string;
	report?: boolean;
	code?: keyof typeof HUMAN_FRIENDLY;
}): ErrorWithPath & { description?: string; report?: boolean } {
	if (isBlank(options.title)) {
		throw new Error(`Invalid error title: ${options.title}`);
	}

	const error: ErrorWithPath & {
		description?: string;
		report?: boolean;
		code?: string;
	} = new Error(options.title);
	error.description = options.description;

	if (options.report === false) {
		error.report = false;
	}

	if (options.code !== undefined) {
		error.code = options.code;
	}

	return error;
}

/**
 * @summary Create a user error
 *
 * @description
 * User errors represent invalid states that the user
 * caused, that are not errors on the application itself.
 * Therefore, user errors don't get reported to analytics
 * and error reporting services.
 */
export function createUserError(options: {
	title: string;
	description: string;
	code?: keyof typeof HUMAN_FRIENDLY;
}): Error {
	return createError({
		title: options.title,
		description: options.description,
		report: false,
		code: options.code,
	});
}

/**
 * @summary Convert an Error object to a JSON object
 * @function
 * @public
 *
 * @param {Error} error - error object
 * @returns {Object} json error
 *
 * @example
 * const error = errors.toJSON(new Error('foo'))
 *
 * console.log(error.message);
 * > 'foo'
 */
export function toJSON(
	error: Error & {
		description?: string;
		report?: boolean;
		code?: string;
		syscall?: string;
		errno?: number;
		stdout?: string;
		stderr?: string;
		device?: string;
	},
): any {
	return {
		name: error.name,
		message: error.message,
		description: error.description,
		stack: error.stack,
		report: error.report,
		code: error.code,
		syscall: error.syscall,
		errno: error.errno,
		stdout: error.stdout,
		stderr: error.stderr,
		device: error.device,
	};
}

/**
 * @summary Convert a JSON object to an Error object
 */
export function fromJSON(json: any): Error {
	return Object.assign(new Error(json.message), json);
}
