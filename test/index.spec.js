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
    console.info(Object.keys(camelcase({ hello_world: 'case' }))[0]);
    expect(console.info.calledOnce).to.be.true;
    expect(console.info.calledWith('helloWorld')).to.be.true;
    done();
  });

  it('exclude options should run correctly', done => {
    const transformedObj = camelcase(
      {
        hello_world: {
          camel_case: {
            some_key: 123,
          },
        },
      },
      {
        exclude: [/case/],
      }
    );
    console.info(Object.keys(transformedObj)[0]);
    expect(console.info.calledWith('helloWorld')).to.be.true;
    console.info(Object.keys(transformedObj.helloWorld)[0]);
    expect(console.info.calledWith('camel_case')).to.be.true;
    expect(console.info.calledTwice).to.be.true;
    done();
  });

  it('exclude option could accept a single regex', done => {
    console.info(Object.keys(camelcase({ hello_world: 'case' }, { exclude: /hello/ }))[0]);
    expect(console.info.calledOnce).to.be.true;
    expect(console.info.calledWith('hello_world')).to.be.true;
    done();
  });

  it('strict key should run correctly', done => {
    console.info(Object.keys(camelcase({ 'hello.world': 'case' }))[0]);
    expect(console.info.calledWith('hello.world')).to.be.true;
    console.info(Object.keys(camelcase({ 'hello.world': 'case' }, { strictKey: false }))[0]);
    expect(console.info.calledWith('helloWorld')).to.be.true;
    console.info(Object.keys(camelcase({ 'hello.world': 'case' }, { strictKey: true }))[0]);
    expect(console.info.calledWith('hello.world')).to.be.true;
    expect(console.info.calledThrice).to.be.true;
    done();
  });
});
