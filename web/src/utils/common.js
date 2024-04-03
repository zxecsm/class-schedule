// 处理标题
export function updateTitle() {
  document.title = `hello ${_getData('username') || ''}`;
}
export function formatScheduleData(data) {
  return data.reduce((pre, cur) => {
    let { week, durationId } = cur;
    pre[`${week}_${durationId}`] = cur
    return pre;
  }, {})
}
// 本地储存
export function _setData(key, data) {
  data = JSON.stringify({ data });
  localStorage.setItem('hello_' + key, encodeURIComponent(data));
}
//本地读取
export function _getData(key) {
  let d = localStorage.getItem('hello_' + key);
  return d && JSON.parse(decodeURIComponent(d)).data;
}
export function _delData(key) {
  if (key) {
    localStorage.removeItem('hello_' + key);
  } else {
    localStorage.clear();
  }
}
export function toChinese(num) {
  switch (num) {
    case 1:
      return '周一'
    case 2:
      return '周二'
    case 3:
      return '周三'
    case 4:
      return '周四'
    case 5:
      return '周五'
    case 6:
      return '周六'
    case 7:
      return '周日'
  }
}
// 操作提示弹窗
export const { _success, _err } = (function () {
  let timer = null;
  let box = document.createElement('div'),
    textbox = document.createElement('div');
  box.style.cssText = `
    width: 100%;
    min-height: 100px;
    position: fixed;
    top: 30px;
    transform: translateY(-100%);
    font-size: 18px;
    opacity: 0;
    text-align: center;
    z-index: 1000;
    pointer-events: none;`;
  textbox.style.cssText = `
    display: inline-block;
    max-height: 100%;
    max-width: 80%;
    line-height: 30px;
    overflow: hidden;
    font-weight: bold;
    box-sizing: border-box;
    padding: 5px 10px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.6);`;
  box.appendChild(textbox);
  document.body.appendChild(box);
  function mstc(flag, str, again) {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    str = str || (flag ? '操作成功~' : '操作失败~');
    let color = flag ? 'white' : 'rgba(245,27,112,1)';
    if (!again) {
      box.style.transition = '0s';
      box.style.transform = 'translateY(-100%)';
      box.style.opacity = '0';
      box.clientWidth;
    }

    textbox.innerText = str;
    textbox.style.color = color;
    box.style.transition = '0.5s ease-out';
    box.style.transform = 'none';
    box.style.opacity = '1';

    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      box.style.transition = '1s ease-out';
      box.style.transform = 'translateY(-100%)';
      box.style.opacity = '0';
    }, 5000);
  }
  function _success(str, again) {
    playSound(`/img/blop.mp3`);
    mstc(true, str, again);
  }
  function _err(str, again) {
    playSound(`/img/error.mp3`);
    mstc(false, str, again);
  }
  return {
    _success,
    _err,
  };
})();
// 提示音
export function playSound(src) {
  let sound = document.createElement('audio');
  sound.src = src;
  sound.play();
  sound.onended = function () {
    sound.onended = null;
    sound = null;
  };
}
//节流
export function throttle(callback, wait) {
  let timer = null,
    pretime = 0,
    res = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    let now = Date.now(),
      tt = wait - (now - pretime);
    if (tt <= 0) {
      res = callback.call(this, ...args);
      pretime = now;
    } else {
      timer = setTimeout(() => {
        timer = null;
        res = callback.call(this, ...args);
        pretime = now;
      }, tt);
    }
    return res;
  };
}
//防抖
export function debounce(callback, wait, immedia) {
  let timer = null,
    res = null;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    } else {
      if (immedia) res = callback.call(this, ...args);
    }
    timer = setTimeout(() => {
      timer = null;
      if (!immedia) res = callback.call(this, ...args);
    }, wait);
    return res;
  };
}
export function isUserName(str) {
  let reg =
    /^[\u2E80-\u2FDF\u3040-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FFF\uA960-\uA97F\uAC00-\uD7FF\w -]+$/g;
  return str && reg.test(str);
}
// 深拷贝
export function deepClone(obj) {
  //判断传入对象为数组或者对象
  let result = Array.isArray(obj) ? [] : {};
  // for in遍历
  for (let key in obj) {
    // 判断是否为自身的属性值（排除原型链干扰）
    if (obj.hasOwnProperty(key)) {
      // 判断对象的属性值中存储的数据类型是否为对象
      if (typeof obj[key] === 'object') {
        // 有可能等于null
        if (obj[key] === null) {
          result[key] = null;
          continue;
        }
        // 递归调用
        result[key] = deepClone(obj[key]); //递归复制
      }
      // 不是的话直接赋值
      else {
        result[key] = obj[key];
      }
    }
  }
  // 返回新的对象
  return result;
}