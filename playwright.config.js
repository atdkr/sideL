const { defineConfig, devices } = require('@playwright/test');
const path = require('node:path');
const fs = require('fs');

const projectName = path.basename(__dirname);

function getOutputFolder() {
    if (fs.existsSync('outputFolder.txt')) {
        const outputFolder = fs.readFileSync('outputFolder.txt', 'utf-8').trim();
        const concurrentFolder = `${outputFolder}_${(new Date()).getMonth() + 1}-${(new Date()).getDate()}-${(new Date()).getHours()}h.${(new Date()).getMinutes()}m.${(new Date()).getSeconds()}s`;
        return concurrentFolder;
    } else {
        const defaultFolder = `C:\_side_report/${projectName}/${(new Date()).getMonth() + 1}-${(new Date()).getDate()}-${(new Date()).getHours()}h.${(new Date()).getMinutes()}m.${(new Date()).getSeconds()}s`;
        return defaultFolder;
    }
}
module.exports = defineConfig({
    retries: 2,
    reporter: [
        ['list', { printSteps: true }],
        ['html', { outputFolder: getOutputFolder() }]
    ],
    expect: {
        timeout: 10 * 1000
    },
    use: {
        testIdAttribute: 'data-'
    },
    projects: [
        {
            name: 'mobile-Chrome',
            testMatch: '*/*mobile.spec.js',
            use: {
                ...devices['mobile Chrome'],
                viewport: { width: 425, height: 731 },
                isMobile: true,
                userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            },
        },
        {
            name: 'Chrome',
            testIgnore: '*/*mobile.spec.js',
            use: {
                ...devices['Desktop Chrome'],
                isMobile: false,
                browserName: 'chromium',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            },
        },
        {
            name: 'Edge',
            testIgnore: '*/*mobile.spec.js',
            use: {
                ...devices['Desktop MicrosoftEdge'],
                isMobile: false,
                channel: 'msedge',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.100.0'
            },
        },
        {
            name: 'Safari',
            testIgnore: '*/*mobile.spec.js',
            use: {
                ...devices['Desktop Safari'],
                isMobile: false,
                channel: 'webkit',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Safari/605.1.15'
            },
        },
        {
            name: 'FireFox',
            testIgnore: '*/*mobile.spec.js',
            use: {
                ...devices['FireFox'],
                isMobile: false,
                browserName: 'firefox',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
            },
        }
    ]
});
