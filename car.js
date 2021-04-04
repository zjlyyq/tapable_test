const {
    SyncHook,
    AsyncSeriesHook   // 异步串行钩子
} = require('tapable')

class Car {
    constructor() {
        this.hooks = {
            accelerate: new SyncHook(['newSpeed']),
            brake: new SyncHook(),
            calculateRouter: new AsyncSeriesHook(['source', 'target', 'routerList'])
        }
    }
}

const car = new Car();
car.hooks.brake.tap('WarningLampPlugin', () => console.log('WarningLampPlugin'))
car.hooks.accelerate.tap('LoggerPlugin', newspeed => console.log(`Accelerate to ${newspeed}`))
car.hooks.calculateRouter.tapPromise('calculateRouter promise', (source, target, routetList) => {
    console.log('source', source)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`tappromise to ${source}${target}${routetList}`)
            resolve()
        }, 1000)
    })
})

car.hooks.brake.call()
car.hooks.accelerate.call(10)
console.time('cost')
car.hooks.calculateRouter.promise('Async', 'hook', 'demo').then(() => {
    console.timeEnd('cost')
}).catch(error => {
    console.error(error)
    console.timeEnd('cost')
})