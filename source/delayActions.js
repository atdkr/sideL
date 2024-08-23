// 模組：user操作行為click(延遲click的秒數)
///////////////////////////////////////////////
// options內容: (timeout不是必填內容)
//  { role: 'button', name: 'Next', timeout: 毫秒 }
// 或 { role: 'button', name: 'Next' }
///////////////////////////////////////////////
// 不用.click({ delay: 毫秒 })的寫法，原因是{ delay: 毫秒 }會受page.setDefaultTimeout(豪秒)的限制
// playwright 的規則（{delay: 毫秒}不可以大於 setDefaultTimeout，會Timeout
///////////////////////////////////////////////
module.exports = { delayedAction, simulateTyping, createRandomDelay };


async function delayedAction(page, action, options, delay) {
    switch (action) {
        case 'clickBylocator':
            const element = await page.locator(options);
            await page.waitForTimeout(delay);
            await element.click({ timeout: options.timeout });
            break;
        case 'clickByRole':
            // console.log('options>>>', options);
            // console.log('delay>>>', delay);
            const button = await page.getByRole(options.role, { name: options.name });
            await page.waitForTimeout(delay);
            await button.click({ timeout: options.timeout });
            break;
        case 'clickWithFilter':
            // console.log('options>>>', options);
            // console.log('delay>>>', delay);
            const filteredElement = await page.locator(options.selector).filter(options.filterOptions).nth(options.nthIndex);
            await page.waitForTimeout(delay);
            await filteredElement.click({ timeout: options.timeout });
            break;
        case 'clickByText':
            // console.log('options>>>', options);
            // console.log('delay>>>', delay);
            const menuItem = await page.getByRole(options.role, { name: options.name });
            const buttonText = await menuItem.evaluate(node => node.innerText);
            if (buttonText.includes(options.text)) {
                const button = await menuItem.getByText(options.text);
                await page.waitForTimeout(delay);
                await button.click({ timeout: options.timeout });
            } else {
                console.error(`⚠️網頁不存在對應標籤>>>"${options.text}" `);
            }
            break;
        case 'clickWithRoleAndName':
            // console.log('options>>>', options);
            // console.log('delay>>>', delay);
            const parentElement = await page.getByRole(options.role, { name: options.name });
            const childElement = await parentElement.getByRole(options.targetRole, { name: options.targetName });
            await page.waitForTimeout(delay);
            await childElement.click({ timeout: options.timeout });
            break;
        default:
            console.error('⚠️操作類型錯誤');
            break;
    }
}

// 模擬user操作行為type(延遲type的秒數)
async function simulateTyping(page, selector, text, delay) {
    const inputElement = await page.locator(selector);
    for (const char of text) {
        await inputElement.type(char, { delay: delay });
    }
}

// 延遲時間 隨機1000~2000
function createRandomDelay() {
    return Math.floor(Math.random() * 1001) + 1000;
}