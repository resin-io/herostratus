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

import { expect } from 'chai';
import * as _ from 'lodash';

import * as errors from '../../lib/shared/errors';

describe('Shared: Errors', function () {
	describe('.HUMAN_FRIENDLY', function () {
		it('should be a plain object', function () {
			expect(_.isPlainObject(errors.HUMAN_FRIENDLY)).to.be.true;
		});

		it('should contain title and description function properties', function () {
			expect(
				_.every(
					_.map(errors.HUMAN_FRIENDLY, (error) => {
						return _.isFunction(error.title) && _.isFunction(error.description);
					}),
				),
			).to.be.true;
		});
	});

	describe('.getTitle()', function () {
		it('should return a generic error message if the error is an empty object', function () {
			const error = {};
			// @ts-ignore
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should return the error message', function () {
			const error = new Error('This is an error');
			expect(errors.getTitle(error)).to.equal('This is an error');
		});

		it('should return the error code if there is no message', function () {
			const error = new Error();
			// @ts-ignore
			error.code = 'MYERROR';
			expect(errors.getTitle(error)).to.equal('Error code: MYERROR');
		});

		it('should prioritize the message over the code', function () {
			const error = new Error('Foo bar');
			// @ts-ignore
			error.code = 'MYERROR';
			expect(errors.getTitle(error)).to.equal('Foo bar');
		});

		it('should prioritize the code over the message if the message is an empty string', function () {
			const error = new Error('');
			// @ts-ignore
			error.code = 'MYERROR';
			expect(errors.getTitle(error)).to.equal('Error code: MYERROR');
		});

		it('should prioritize the code over the message if the message is a blank string', function () {
			const error = new Error('    ');
			// @ts-ignore
			error.code = 'MYERROR';
			expect(errors.getTitle(error)).to.equal('Error code: MYERROR');
		});

		it('should understand an error-like object with a code', function () {
			const error = {
				code: 'MYERROR',
			};

			// @ts-ignore
			expect(errors.getTitle(error)).to.equal('Error code: MYERROR');
		});

		it('should understand an error-like object with a message', function () {
			const error = {
				message: 'Hello world',
			};

			// @ts-ignore
			expect(errors.getTitle(error)).to.equal('Hello world');
		});

		it('should understand an error-like object with a message and a code', function () {
			const error = {
				message: 'Hello world',
				code: 'MYERROR',
			};

			// @ts-ignore
			expect(errors.getTitle(error)).to.equal('Hello world');
		});

		it('should display an error code 0', function () {
			const error = new Error();
			// @ts-ignore
			error.code = 0;
			expect(errors.getTitle(error)).to.equal('Error code: 0');
		});

		it('should display an error code 1', function () {
			const error = new Error();
			// @ts-ignore
			error.code = 1;
			expect(errors.getTitle(error)).to.equal('Error code: 1');
		});

		it('should display an error code -1', function () {
			const error = new Error();
			// @ts-ignore
			error.code = -1;
			expect(errors.getTitle(error)).to.equal('Error code: -1');
		});

		it('should not display an empty string error code', function () {
			const error = new Error();
			// @ts-ignore
			error.code = '';
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should not display a blank string error code', function () {
			const error = new Error();
			// @ts-ignore
			error.code = '   ';
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should return a generic error message if no information was found', function () {
			const error = new Error();
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should return a generic error message if no code and the message is empty', function () {
			const error = new Error('');
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should return a generic error message if no code and the message is blank', function () {
			const error = new Error('   ');
			expect(errors.getTitle(error)).to.equal('An error occurred');
		});

		it('should rephrase an ENOENT error', function () {
			const error = new Error('ENOENT error');
			// @ts-ignore
			error.path = '/foo/bar';
			// @ts-ignore
			error.code = 'ENOENT';
			expect(errors.getTitle(error)).to.equal(
				'No such file or directory: /foo/bar',
			);
		});

		it('should rephrase an EPERM error', function () {
			const error = new Error('EPERM error');
			// @ts-ignore
			error.code = 'EPERM';
			expect(errors.getTitle(error)).to.equal(
				"You're not authorized to perform this operation",
			);
		});

		it('should rephrase an EACCES error', function () {
			const error = new Error('EACCES error');
			// @ts-ignore
			error.code = 'EACCES';
			expect(errors.getTitle(error)).to.equal(
				"You don't have access to this resource",
			);
		});

		it('should rephrase an ENOMEM error', function () {
			const error = new Error('ENOMEM error');
			// @ts-ignore
			error.code = 'ENOMEM';
			expect(errors.getTitle(error)).to.equal('Your system ran out of memory');
		});
	});

	describe('.getDescription()', function () {
		it('should understand an error-like object with a description', function () {
			const error = {
				description: 'My description',
			};

			// @ts-ignore
			expect(errors.getDescription(error)).to.equal('My description');
		});

		it('should understand an error-like object with a stack', function () {
			const error = {
				stack: 'My stack',
			};

			// @ts-ignore
			expect(errors.getDescription(error)).to.equal('My stack');
		});

		it('should understand an error-like object with a description and a stack', function () {
			const error = {
				description: 'My description',
				stack: 'My stack',
			};

			// @ts-ignore
			expect(errors.getDescription(error)).to.equal('My description');
		});

		it('should stringify and beautify an object without any known property', function () {
			const error = {
				name: 'John Doe',
				job: 'Developer',
			};

			// @ts-ignore
			expect(errors.getDescription(error)).to.equal(
				['{', '  "name": "John Doe",', '  "job": "Developer"', '}'].join('\n'),
			);
		});

		it('should return the stack for a basic error', function () {
			const error = new Error('Foo');
			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should prefer a description property to a stack', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.description = 'My description';
			expect(errors.getDescription(error)).to.equal('My description');
		});

		it('should return the stack if the description is an empty string', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.description = '';
			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should return the stack if the description is a blank string', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.description = '   ';
			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should get a generic description for ENOENT', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.code = 'ENOENT';
			expect(errors.getDescription(error)).to.equal(
				"The file you're trying to access doesn't exist",
			);
		});

		it('should get a generic description for EPERM', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.code = 'EPERM';
			expect(errors.getDescription(error)).to.equal(
				'Please ensure you have necessary permissions for this task',
			);
		});

		it('should get a generic description for EACCES', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.code = 'EACCES';
			const message =
				'Please ensure you have necessary permissions to access this resource';
			expect(errors.getDescription(error)).to.equal(message);
		});

		it('should get a generic description for ENOMEM', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.code = 'ENOMEM';
			const message =
				'Please make sure your system has enough available memory for this task';
			expect(errors.getDescription(error)).to.equal(message);
		});

		it('should prefer a description property than a code description', function () {
			const error = new Error('Foo');
			// @ts-ignore
			error.code = 'ENOMEM';
			// @ts-ignore
			error.description = 'Memory error';
			expect(errors.getDescription(error)).to.equal('Memory error');
		});

		describe('given userFriendlyDescriptionsOnly is false', function () {
			it('should return the stack for a basic error', function () {
				const error = new Error('Foo');
				expect(errors.getDescription(error)).to.equal(error.stack);
			});

			it('should return the stack if the description is an empty string', function () {
				const error = new Error('Foo');
				// @ts-ignore
				error.description = '';
				expect(errors.getDescription(error)).to.equal(error.stack);
			});

			it('should return the stack if the description is a blank string', function () {
				const error = new Error('Foo');
				// @ts-ignore
				error.description = '   ';
				expect(errors.getDescription(error)).to.equal(error.stack);
			});
		});
	});

	describe('.createError()', function () {
		it('should be an instance of Error', function () {
			const error = errors.createError({
				title: 'Foo',
				description: 'Something happened',
			});

			expect(error).to.be.an.instanceof(Error);
		});

		it('should correctly add both a title and a description', function () {
			const error = errors.createError({
				title: 'Foo',
				description: 'Something happened',
			});

			expect(errors.getTitle(error)).to.equal('Foo');
			expect(errors.getDescription(error)).to.equal('Something happened');
		});

		it('should correctly add a code', function () {
			const error = errors.createError({
				title: 'Foo',
				description: 'Something happened',
				code: 'ENOENT',
			});

			expect(error.code).to.equal('ENOENT');
		});

		it('should correctly add only a title', function () {
			const error = errors.createError({
				title: 'Foo',
			});

			expect(errors.getTitle(error)).to.equal('Foo');
			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should ignore an empty description', function () {
			const error = errors.createError({
				title: 'Foo',
				description: '',
			});

			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should ignore a blank description', function () {
			const error = errors.createError({
				title: 'Foo',
				description: '     ',
			});

			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should throw if no title', function () {
			expect(() => {
				// @ts-ignore
				errors.createError({});
			}).to.throw('Invalid error title: undefined');
		});

		it('should throw if there is a description but no title', function () {
			expect(() => {
				// @ts-ignore
				errors.createError({
					description: 'foo',
				});
			}).to.throw('Invalid error title: undefined');
		});

		it('should throw if title is empty', function () {
			expect(() => {
				errors.createError({
					title: '',
				});
			}).to.throw('Invalid error title: ');
		});

		it('should throw if title is blank', function () {
			expect(() => {
				errors.createError({
					title: '    ',
				});
			}).to.throw('Invalid error title:    ');
		});
	});

	describe('.createUserError()', function () {
		it('should be an instance of Error', function () {
			const error = errors.createUserError({
				title: 'Foo',
				description: 'Something happened',
			});

			expect(error).to.be.an.instanceof(Error);
		});

		it('should correctly add both a title and a description', function () {
			const error = errors.createUserError({
				title: 'Foo',
				description: 'Something happened',
			});

			expect(errors.getTitle(error)).to.equal('Foo');
			expect(errors.getDescription(error)).to.equal('Something happened');
		});

		it('should correctly add only a title', function () {
			// @ts-ignore
			const error = errors.createUserError({
				title: 'Foo',
			});

			expect(errors.getTitle(error)).to.equal('Foo');
			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should correctly add a code', function () {
			// @ts-ignore
			const error = errors.createUserError({
				title: 'Foo',
				code: 'ENOENT',
			});

			// @ts-ignore
			expect(error.code).to.equal('ENOENT');
		});

		it('should ignore an empty description', function () {
			const error = errors.createUserError({
				title: 'Foo',
				description: '',
			});

			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should ignore a blank description', function () {
			const error = errors.createUserError({
				title: 'Foo',
				description: '     ',
			});

			expect(errors.getDescription(error)).to.equal(error.stack);
		});

		it('should throw if no title', function () {
			expect(() => {
				// @ts-ignore
				errors.createUserError({});
			}).to.throw('Invalid error title: undefined');
		});

		it('should throw if title is empty', function () {
			expect(() => {
				// @ts-ignore
				errors.createUserError({
					title: '',
				});
			}).to.throw('Invalid error title: ');
		});

		it('should throw if there is a description but no title', function () {
			expect(() => {
				// @ts-ignore
				errors.createUserError({
					description: 'foo',
				});
			}).to.throw('Invalid error title: undefined');
		});

		it('should throw if title is blank', function () {
			expect(() => {
				// @ts-ignore
				errors.createUserError({
					title: '   ',
				});
			}).to.throw('Invalid error title:    ');
		});
	});

	describe('.toJSON()', function () {
		it('should convert a simple error', function () {
			const error = new Error('My error');
			expect(errors.toJSON(error)).to.deep.equal({
				code: undefined,
				description: undefined,
				message: 'My error',
				stack: error.stack,
				report: undefined,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});

		it('should convert an error with a description', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.description = 'My description';

			expect(errors.toJSON(error)).to.deep.equal({
				code: undefined,
				description: 'My description',
				message: 'My error',
				stack: error.stack,
				report: undefined,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});

		it('should convert an error with a code', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.code = 'ENOENT';

			expect(errors.toJSON(error)).to.deep.equal({
				code: 'ENOENT',
				description: undefined,
				message: 'My error',
				stack: error.stack,
				report: undefined,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});

		it('should convert an error with a description and a code', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.description = 'My description';
			// @ts-ignore
			error.code = 'ENOENT';

			expect(errors.toJSON(error)).to.deep.equal({
				code: 'ENOENT',
				description: 'My description',
				message: 'My error',
				stack: error.stack,
				report: undefined,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});

		it('should convert an error with a report value', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.report = true;

			expect(errors.toJSON(error)).to.deep.equal({
				code: undefined,
				description: undefined,
				message: 'My error',
				stack: error.stack,
				report: true,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});

		it('should convert an error without a message', function () {
			const error = new Error();

			expect(errors.toJSON(error)).to.deep.equal({
				code: undefined,
				description: undefined,
				message: '',
				stack: error.stack,
				report: undefined,
				stderr: undefined,
				stdout: undefined,
				syscall: undefined,
				name: 'Error',
				errno: undefined,
				device: undefined,
			});
		});
	});

	describe('.fromJSON()', function () {
		it('should return an Error object', function () {
			const error = new Error('My error');
			const result = errors.fromJSON(errors.toJSON(error));
			expect(result).to.be.an.instanceof(Error);
		});

		it('should convert a simple JSON error', function () {
			const error = new Error('My error');
			const result = errors.fromJSON(errors.toJSON(error));

			expect(result.message).to.equal(error.message);
			// @ts-ignore
			expect(result.description).to.equal(error.description);
			// @ts-ignore
			expect(result.code).to.equal(error.code);
			expect(result.stack).to.equal(error.stack);
			// @ts-ignore
			expect(result.report).to.equal(error.report);
		});

		it('should convert a JSON error with a description', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.description = 'My description';
			const result = errors.fromJSON(errors.toJSON(error));

			expect(result.message).to.equal(error.message);
			// @ts-ignore
			expect(result.description).to.equal(error.description);
			// @ts-ignore
			expect(result.code).to.equal(error.code);
			expect(result.stack).to.equal(error.stack);
			// @ts-ignore
			expect(result.report).to.equal(error.report);
		});

		it('should convert a JSON error with a code', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.code = 'ENOENT';
			const result = errors.fromJSON(errors.toJSON(error));

			expect(result.message).to.equal(error.message);
			// @ts-ignore
			expect(result.description).to.equal(error.description);
			// @ts-ignore
			expect(result.code).to.equal(error.code);
			expect(result.stack).to.equal(error.stack);
			// @ts-ignore
			expect(result.report).to.equal(error.report);
		});

		it('should convert a JSON error with a report value', function () {
			const error = new Error('My error');
			// @ts-ignore
			error.report = false;
			const result = errors.fromJSON(errors.toJSON(error));

			expect(result.message).to.equal(error.message);
			// @ts-ignore
			expect(result.description).to.equal(error.description);
			// @ts-ignore
			expect(result.code).to.equal(error.code);
			expect(result.stack).to.equal(error.stack);
			// @ts-ignore
			expect(result.report).to.equal(error.report);
		});
	});
});
