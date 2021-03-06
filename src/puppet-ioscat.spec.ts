#!/usr/bin/env ts-node

// tslint:disable:no-shadowed-variable
import test  from 'blue-tape'
import sinon from 'sinon'

import { IosCatManager }  from './ioscat-manager'
import { PuppetIoscat }   from './puppet-ioscat'

class PuppetMockTest extends PuppetIoscat {
}

test('PuppetMock restart without problem', async (t) => {
  const puppet = new PuppetMockTest({
    token: 'wxid_tdax1huk5hgs12',
  })

  const sandbox                      = sinon.createSandbox()
  const iosCatManager: IosCatManager = (puppet as any).iosCatManager
  sandbox.stub(iosCatManager, 'syncContactsAndRooms').resolves()

  try {
    for (let i = 0; i < 3; i++) {
      await puppet.start()
      await puppet.stop()
      t.pass('start/stop-ed at #' + i)
    }
    t.pass('PuppetMock() start/restart successed.')
  } catch (e) {
    // tslint:disable:no-console
    console.error(e)
    t.fail(e)
  } finally {
    sandbox.restore()
  }
})
