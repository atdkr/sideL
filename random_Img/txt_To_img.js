// @ts-ignore
const fs = require('fs');
const path = require("path");
// https://github.com/tkrkt/text2png
// npm install text2png
const text2png = require('text2png');
// const sharp = require('sharp');
const { createCanvas, registerFont } = require('canvas');
// npm install canvas

const outputDir = path.join(__dirname, 'random_Img');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}


// fs.writeFileSync('out.png', text2png('Hello!', { color: 'blue' }));

// 讀取 input.txt 檔案
const inputText = fs.readFileSync('input.txt', 'utf8');

// 用換行讀取記事本
const lines = inputText.split('\n');
// 註冊字體
registerFont('C:\\_imageUse\\Cubic_11.ttf', { family: 'Cubic' });

// 設定圖片
// stroke=文字邊框
const options = {
    font: '20pt Iansui',
    color: 'black',
    lineSpacing: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: 'white',
    textAlign: 'center',
    strokeWidth: 0.2,
    strokeColor: 'white',
    width: 100
};

// 生成每一行文字的圖片
lines.forEach((line, index) => {
    const outputFileName = path.join(outputDir, `output${index + 1}.png`);
    const imageBuffer = text2png(line, options);
    fs.writeFileSync(outputFileName, imageBuffer);
    console.log(`Generated ${outputFileName}`);
});