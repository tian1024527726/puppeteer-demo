const puppeteer = require('puppeteer');
const moment = require('moment');

(async () => {
  const browser = await puppeteer.launch({
    //mac上
    executablePath: '../chrome-mac/Chromium.app/Contents/MacOS/Chromium',
    //windows上
    // executablePath: '../chrome-win/chrome.exe',
    headless: false
  })
  const page = await browser.newPage();
  console.log('加载页面---------------------->开始');
  await page.goto('https://cart.taobao.com/cart.htm', { 'timeout': 9999999 });
  console.log('加载页面---------------------->结束');
  //登录淘宝购物车
  const login = async (userName, passWord) => {
    //点击密码登录
    await page.click('#J_Quick2Static');
    await page.waitFor('#J_OtherLogin > a.alipay-login');
    //选择支付宝登录
    await page.click('#J_OtherLogin > a.alipay-login');
    await page.waitFor(2000);
    // //选择密码登录
    await page.click('#J-loginMethod-tabs > li:nth-child(2)');
    await page.evaluate((u, p) => {
      document.querySelector('#J-input-user').value = u;
      document.querySelector('#password_rsainput').value = p;
    }, userName, passWord);
    await page.waitFor('#J-login-btn');
    await page.click('#J-login-btn');
    try {
      await page.waitFor('#J_SelectAll1',{timeout:2000});
      await page.click('#J_SelectAll1');
    } catch (e) {
      await page.evaluate((u, p) => {
        document.querySelector('#J-input-user').value = u;
        document.querySelector('#password_rsainput').value = p;
      }, userName, passWord);
      await page.click('#J-login-btn');
      await page.waitFor(3000);
      await page.click('#J_SelectAll1');
    }
    await page.waitFor(2000);
    const checkInput = await page.$('#J_SelectAllCbx2');
    //检查是否全选
    let checked = await page.evaluate(input => {
      return input.checked;
    }, checkInput);
    console.log('全选状态1--------->' + checked);
  }
  //定时提交
  const buy_on_time = async (buytime) => {
    let count = 1;
    while (true) {
      if (moment(new Date()).format('YYYY-MM-DD HH:mm:ss') == buytime) {
        while (true) {
          try {
            const summitInput = await page.$('#J_Go');
            if (summitInput) {
              await page.click('#J_Go');
            }
            await page.click('#submitOrder_1 > div > a.go-btn');
          } catch (e) {
            console.log('error---------->')
            console.log(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            await page.waitFor(100)
          }
        }
      }
      console.log('实时监控---------->' + (++count));
      await page.waitFor(100);
    }
  }

  await login('88888', '999999');
  await buy_on_time('2018-12-07 09:00:00');
})();



