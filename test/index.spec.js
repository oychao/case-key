import { expect } from 'chai';
import 'mocha-sinon';

import { camelcase, snakecase } from '../bin';

describe('case-key', () => {
  beforeEach(function () {
    this.sinon.stub(console, 'info');
  });

  it('should run correctly', done => {
    console.info('hello test');
    expect(console.info.calledOnce).to.be.true;
    expect(console.info.calledWith('hello test')).to.be.true;
    done();
  });

  it('snakecase should run correctly', done => {
    console.info(Object.keys(snakecase({ helloWorld: 'case' }))[0]);
    expect(console.info.calledOnce).to.be.true;
    expect(console.info.calledWith('hello_world')).to.be.true;
    done();
  });

  it('camelcase should run correctly', done => {
    console.info(Object.keys(camelcase({ 'hello_world': 'case' }))[0]);
    expect(console.info.calledOnce).to.be.true;
    expect(console.info.calledWith('helloWorld')).to.be.true;
    done();
  });
});
