export async function poll (fn, fnCondition, ms) {
    let result = await fn()
    while (fnCondition(result)) {
      await wait(ms)
      result = await fn()
    }
    return result
  }
  
  export function wait (ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }