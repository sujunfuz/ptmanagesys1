import { ref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
const { t } = useI18n()

// 获取当前时间（day日期  second具体到时分秒）
export function getRightNowTime(format: String, timeStamp = null as any) {
  const now = timeStamp ? new Date(timeStamp) : new Date()
  const year = ref()
  const month = ref()
  const date = ref()
  const day = ref()
  const hour = ref()
  const minu = ref()
  const sec = ref()
  year.value = now.getFullYear() //得到年份
  month.value = now.getMonth() //得到月份
  date.value = now.getDate()
  day.value = now.getDay() //得到周几
  hour.value = now.getHours() //得到小时
  minu.value = now.getMinutes() //得到分钟
  sec.value = now.getSeconds() //得到秒
  month.value = month.value + 1
  if (month.value < 10) month.value = '0' + month.value
  if (date.value < 10) date.value = '0' + date.value
  if (hour.value < 10) hour.value = '0' + hour.value
  if (minu.value < 10) minu.value = '0' + minu.value
  if (sec.value < 10) sec.value = '0' + sec.value
  const time = ref('')
  //精确到天
  if (format == 'day') {
    time.value = year.value + '-' + month.value + '-' + date.value
  }
  //精确到分
  else if (format == 'second') {
    time.value =
      year.value +
      '-' +
      month.value +
      '-' +
      date.value +
      ' ' +
      hour.value +
      ':' +
      minu.value +
      ':' +
      sec.value
  }
  return time.value
}

// 今年、去年、明年的开始、结束日期
// getYear(type,dates)  //type为字符串类型，有两种选择，
// 's'代表开始,'e'代表结束，dates为数字类型，不传或0代表今年，-1代表去年，1代表明年
// getYear('s',1)  //得到明年第一天的yyyy-mm-dd格式日期
// getYear('e',1)  //得到明年最后一天的yyyy-mm-dd格式日期
export function getYear(type: String, dates: Number) {
  const dd = new Date()
  const n = dates || 0
  const day_getYear = ref()
  const year = dd.getFullYear() + Number(n)
  if (type == 's') {
    day_getYear.value = year + '-01-01'
  }
  if (type == 'e') {
    day_getYear.value = year + '-12-31'
  }
  if (!type) {
    day_getYear.value = year + '-01-01/' + year + '-12-31'
  }
  return day_getYear.value
}

// 得到本月、上月、下月的起始、结束日期
// getMonth(type,months)  //type为字符串类型，有两种选择，'s'代表开始,'e'代表结束，months为数字类型，不传或0代表本月，-1代表上月，1代表下月
// getMonth('s',1)  //得到下月第一天的yyyy-mm-dd格式日期
// getMonth('e',1)  //得到下月最后一天的yyyy-mm-dd格式日期
export function getMonth(type: String, months: number) {
  const d = new Date()
  let year = d.getFullYear()
  let month = d.getMonth() + 1
  if (Math.abs(months) > 12) {
    months = months % 12
  }
  if (months != 0) {
    if (month + months > 12) {
      year++
      month = (month + months) % 12
    } else if (month + months < 1) {
      year--
      month = 12 + month + months
    } else {
      month = month + months
    }
  }
  const temp = ref('')
  temp.value = month < 10 ? '0' + month : month + ''

  const firstday = year + '-' + temp.value + '-' + '01'
  let lastday = ''
  if (
    temp.value == '01' ||
    temp.value == '03' ||
    temp.value == '05' ||
    temp.value == '07' ||
    temp.value == '08' ||
    temp.value == '10' ||
    temp.value == '12'
  ) {
    lastday = year + '-' + temp.value + '-' + 31
  } else if (temp.value == '02') {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
      lastday = year + '-' + temp.value + '-' + 29
    } else {
      lastday = year + '-' + temp.value + '-' + 28
    }
  } else {
    lastday = year + '-' + temp.value + '-' + 30
  }
  let day = ''
  if (type == 's') {
    day = firstday
  } else {
    day = lastday
  }
  return day
}

// 本周、上周、下周的起始、结束日期
// getMonday(type,dates)  //type为字符串类型，有两种选择，'s'代表开始,'e'代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
// getMonday('s',1)  //得到下周一的yyyy-mm-dd格式日期
// getMonday('e',1)  //得到下周日的yyyy-mm-dd格式日期
export function getMonday(type: String, dates: number) {
  const now = new Date()
  const nowTime = now.getTime()
  const day = now.getDay()
  const longTime = 24 * 60 * 60 * 1000
  const n = longTime * 7 * (dates || 0)
  const dd_getMonday = ref()
  if (type == 's') {
    dd_getMonday.value = nowTime - (day - 1) * longTime + n
  }
  if (type == 'e') {
    dd_getMonday.value = nowTime + (7 - day) * longTime + n
  }
  dd_getMonday.value = new Date(dd_getMonday.value)
  const y = dd_getMonday.value.getFullYear()
  let m = dd_getMonday.value.getMonth() + 1
  let d = dd_getMonday.value.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  const result = y + '-' + m + '-' + d
  return result
}

// 得到n前后的日期
// getDate(dates)
//dates为数字类型，0代表今日,-1代表昨日，1代表明日，返回yyyy-mm-dd格式字符串，dates不传默认代表今日。
export function getDate(dates: number) {
  const dd = new Date()
  const n = dates || 0
  dd.setDate(dd.getDate() + n)
  const y = dd.getFullYear()
  const m = dd.getMonth() + 1
  const d = dd.getDate()
  let re1 = ''
  let re2 = ''
  re1 = m < 10 ? '0' + m : m + ''
  re2 = d < 10 ? '0' + d : d + ''
  const day = y + '-' + re1 + '-' + re2
  return day
}

// 获取全年时间
export function getRightNowYearDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getYear('s', 0)
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getYear('s', 0) + ' 00:00:00'
    const endTime = getRightNowTime('second')
    return [startTime, endTime]
  }
}

// 获取本周时间
export function getRightNowWeekDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getMonday('s', 0)
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const a = getMonday('s', 0)
    const endTime = getRightNowTime('second') + ''
    const b = endTime.split(' ')[1]
    const startTime = a + ' 00:00:00'
    return [startTime, endTime]
  }
}

// 获取上周时间
export function getLastWeekDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getMonday('s', -1)
    const endTime = getMonday('e', -1)
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getMonday('s', -1) + ' 00:00:00'
    const endTime = getMonday('e', -1) + ' 23:59:59'
    return [startTime, endTime]
  }
}

// 获取本月第一天
export function getOneDay() {
  const date = new Date()
  //获取第一天
  date.setDate(1)
  const y = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const re1_getOneDay = m < 10 ? '0' + m : m + ''
  const re2_getOneDay = d < 10 ? '0' + d : d + ''
  const monthOneDay = y + '-' + re1_getOneDay + '-' + re2_getOneDay
  return monthOneDay
}

// 获取本月时间
export function getMonthDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getOneDay()
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getOneDay() + ' 00:00:00'
    const endTime = getRightNowTime('second')
    return [startTime, endTime]
  }
}

// 获取近30天时间
export function getThirtyDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getDate(-30)
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getDate(-30) + ' 00:00:00'
    const endTime = getRightNowTime('second')
    return [startTime, endTime]
  }
}

//获取近7天时间
export function getSevenDaysRange(type: String) {
  if (type == 'day') {
    const startTime = getDate(-7)
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getDate(-7) + ' 00:00:00'
    const endTime = getRightNowTime('second')
    return [startTime, endTime]
  }
}

// 获取今日时间
export function getRightNowRange(type: String) {
  if (type == 'day') {
    const startTime = getRightNowTime('day')
    const endTime = getRightNowTime('day')
    return [startTime, endTime]
  }
  if (type == 'second') {
    const startTime = getRightNowTime('day') + ' 00:00:00'
    const endTime = getRightNowTime('second')
    return [startTime, endTime]
  }
}

export function dateTimeRange() {
  const result = {
    valueFormat: 'YYYY-MM-DD HH:mm:ss',
    type: 'datetimerange',
    shortcuts: [
      {
        text: t('timeWords.today'),
        value: getRightNowRange('second')
      },
      {
        text: t('timeWords.yesterday'),
        value: [getDate(-1) + ' 00:00:00', getDate(-1) + ' 23:59:59']
      },
      {
        text: t('timeWords.week'),
        value: getRightNowWeekDaysRange('second')
      },
      {
        text: t('timeWords.month'),
        value: getMonthDaysRange('second')
      },
      {
        text: t('timeWords.lastMonth'),
        value: [getMonth('s', -1) + ' 00:00:00', getMonth('e', -1) + '23:59:59']
      }
    ]
  }
  return result
}
