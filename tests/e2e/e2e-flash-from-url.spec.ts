import { browser } from '@wdio/globals';

describe('Electron Testing', () => {
	it('should print application title', async () => {
		console.log('Hello', await browser.getTitle(), 'application!');
	});

	it('should "select an url source"', async () => {
		const flashFromUrlButton = $('button[data-testid="flash-from-url"]');
		await flashFromUrlButton.waitForDisplayed({ timeout: 10000 });
		// const isDisplayed = await flashFromFileButton.isDisplayed();
		await flashFromUrlButton.click();

		const enterValidUrlInput = $('input[data-testid="source-url-input"]');
		await enterValidUrlInput.waitForDisplayed({ timeout: 10000 });

		// TODO: use an env variable for the URL
		await enterValidUrlInput.setValue(
			'https://api.balena-cloud.com/download?deviceType=raspberrypi4-64&version=5.2.8&fileType=.zip&developmentMode=true',
		);

		const sourceUrlOkButton = $('button[data-testid="source-url-ok-button"]');
		await sourceUrlOkButton.waitForDisplayed({ timeout: 10000 });
		await sourceUrlOkButton.click();
	});

	it('should "select a virtual target"', async () => {
		const selectTargetButton = $('button[data-testid="select-target-button"]');
		await selectTargetButton.waitForClickable({ timeout: 30000 });
		await selectTargetButton.click();

		// target drive is set in the github custom test action
		// if you run the test locally, pass the varibale
		const targetVirtualDrive = $(`=${process.env.TARGET_DRIVE}`);
		await targetVirtualDrive.waitForDisplayed({ timeout: 10000 });
		await targetVirtualDrive.click();

		const validateTargetButton = $(
			'button[data-testid="validate-target-button"]',
		);
		await validateTargetButton.waitForClickable({ timeout: 10000 });
		await validateTargetButton.click();
	});

	it('should "start flashing"', async () => {
		const flashNowButton = $('button[data-testid="flash-now-button"]');
		await flashNowButton.waitForClickable({ timeout: 10000 });
		await flashNowButton.click();
	});

	it('should get the "Flash Completed" screen', async () => {
		const flashResults = $('[data-testid="flash-results"]');
		await flashResults.waitForDisplayed({ timeout: 180000 });

		const flashResultsText = await flashResults.getText();
		expect(flashResultsText).toBe('Flash Completed!');

		// we're good;
		// now we should check the content of the image but we can do that outside wdio
	});
});
