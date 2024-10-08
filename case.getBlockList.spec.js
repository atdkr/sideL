
import { test, expect, chromium } from '@playwright/test';
const fs = require('fs');
const path = require('path');
const { delayedAction, simulateTyping, createRandomDelay } = require('./source/delayActions');

const now = new Date();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');

const filePath = path.join(__dirname, 'config', 'loginAccount.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');
// 讀帳密txt
const accounts = fileContent.split('\n').map(line => {
    const [account, password] = line.split(/\s+/).map(item => item.trim());
    return { account, password };
});
if (accounts.length === 0) {
    console.error('沒有帳密');
}
// console.log(accounts);

test('下載黑名單+存檔', async ({ page }) => {
    for (const { account, password } of accounts) {
        console.log(`登入帳號>>> ${account}`);
        /*當所有事件腳本超過__時壓為timeout*/
        test.setTimeout(180000);
        /**當單筆事件超過__時壓為Timeout*/
        page.setDefaultTimeout(7000);
        // const browser = await chromium.launch();
        // const context = await browser.newContext({
        //     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        // });
        // 存 nick_name
        let getBlocker = [];

        await page.goto('https://www.plurk.com/login');
        await page.waitForSelector('#input_nick_name');
        // await page.locator('#input_nick_name').click();
        await delayedAction(page, 'clickBylocator', '#input_nick_name', createRandomDelay());
        await simulateTyping(page, '#input_nick_name', account, 100);
        await delayedAction(page, 'clickBylocator', '#input_password', createRandomDelay());
        await simulateTyping(page, '#input_password', password, 100);
        await delayedAction(page, 'clickBylocator', '#login_submit', createRandomDelay());
        await page.waitForSelector('#navbar-account');
        await delayedAction(page, 'clickBylocator', '#navbar-account', createRandomDelay());
        await page.waitForSelector('#layout_body > div.pop-view.pop-menu > div.pop-view-content');
        console.log('登入成功');

        await page.goto('https://www.plurk.com/Friends/?page=blocked_users');
        let apiResponse, getApiData;
        let hasMoreData = true;
        while (hasMoreData) {
            // 等待黑名單API回應
            apiResponse = await page.waitForResponse(/getBlockedByOffset/, { timeout: 20000 });
            getApiData = await apiResponse.json();
            console.log('getApiData.length', getApiData.length);

            // 把API data.nick_name存入陣列
            getApiData.forEach(item => {
                getBlocker.push(item.nick_name.replace('@', ''));
            });

            // 檢查API資料長度，當筆數===30等於資料還沒拿完
            if (getApiData.length === 30) {
                await page.locator('.content_inner').click();
                await page.locator('.content_inner').press('End');
            } else {
                hasMoreData = false;
            }
        }
        console.log('獲得黑名單>>>', getBlocker);
        console.log('黑名單數量>>>', getBlocker.length);
        // 將getBlocker存成txt
        const outputDir = path.join(__dirname, 'output');
        const outputPath = path.join(outputDir, `getBlockListList_${account}.txt`);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        fs.writeFileSync(outputPath, getBlocker.join('\n'), 'utf8');
        console.log(`檔案路徑>>>${outputPath}`);
        // 登出
        await page.goto('https://www.plurk.com/s');
        await page.waitForSelector('#header');
        await delayedAction(page, 'clickBylocator', '#more', createRandomDelay());
        await page.waitForSelector('.pd_menu');
        await delayedAction(page, 'clickBylocator', '#more > div > ul > li:last-child', createRandomDelay());
    }
    await page.close();
});
test('整合複數黑名單', async ({ page }) => {
});