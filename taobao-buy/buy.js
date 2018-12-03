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
      // return something
      document.querySelector('#J-input-user').value = u;
      document.querySelector('#password_rsainput').value = p;
    }, userName, passWord);
    await page.waitFor('#J-login-btn');
    await page.click('#J-login-btn');
    try {
      await page.waitFor(1000);
      await page.click('#J_SelectAll2');
    } catch (e) {
      await page.waitFor(1000);
      await page.evaluate((u, p) => {
        document.querySelector('#J-input-user').value = u;
        document.querySelector('#password_rsainput').value = p;
      }, userName, passWord);
      await page.click('#J-login-btn');
    }
  }
  //定时提交
  const count = 1;
  const buy_on_time = async (buytime) => {
    while (true) {
      if (moment(new Date()).format('YYYY-MM-DD HH:mm:ss') == buytime) {
        while (true) {
          try {
            await page.waitFor('#J_SelectAllCbx2');
            const checkInput = await page.$('#J_SelectAllCbx2');
            const checked = await page.evaluate(input => {
              return input.checked;
            }, checkInput);
            if (checked) {
              await page.click('#J_Go');
            } else {
              await page.waitFor('#J_SelectAll1');
              await page.click('#J_SelectAll1');
              await page.waitFor(500)
              continue;
            }
            await page.click('#submitOrder_1 > div > a.go-btn');
          } catch (e) {
            console.log('error')
            await page.goBack();
            await page.waitFor(1000)
          }
        }
      }
      console.log('实时监控---------->' + (++count));
      await page.waitFor(100);
    }
  }

  login('&*****', '*******');
  buy_on_time('2018-12-07 09:00:00');
})();

