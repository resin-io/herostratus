import { browser } from '@wdio/globals';

describe('Electron Testing', () => {
	it('should print application title', async () => {
		console.log('Hello', await browser.getTitle(), 'application!');
	});

	it('should "flash from file"', async () => {
		const flashFromFileButton = $('button[data-testid="flash-from-file"]');
		await flashFromFileButton.waitForDisplayed({ timeout: 10000 });
		// const isDisplayed = await flashFromFileButton.isDisplayed();
		await flashFromFileButton.click();

		const selectTargetButton = $('button[data-testid="select-target-button"]');
		await selectTargetButton.waitForClickable({ timeout: 30000 });
		await selectTargetButton.click();

		// TODO: Select target using ENV variable for the drive
		const targetVirtualDrive = $('=/dev/disk8');
		await targetVirtualDrive.waitForDisplayed({ timeout: 10000 });
		await targetVirtualDrive.click();

		const validateTargetButton = $(
			'button[data-testid="validate-target-button"]',
		);
		await validateTargetButton.waitForClickable({ timeout: 10000 });
		await validateTargetButton.click();

		const flashNowButton = $('button[data-testid="flash-now-button"]');
		await flashNowButton.waitForClickable({ timeout: 10000 });
		await flashNowButton.click();

		// FIXME: not able to find the flashResults :(
		const flashResults = $('span[data-testid="flash-results"]');
		await flashResults.waitForDisplayed({ timeout: 20000 });

		expect(flashResults.getText()).toBe('Flash Completed!');

		// we're good;
		// now we should check the content of the image but we can do that outside wdio
	});
});
