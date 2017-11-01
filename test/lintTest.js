'use strict';

const fs = require('fs');
const path = require('path');
const File = require('vinyl');
const {expect} = require('chai');
const gulpPug = require('..');

function loadFile(filename) {
    const resolved = path.resolve(__dirname, filename);
    return new File({
        contents: fs.readFileSync(resolved),
        path: resolved
    });
}

describe('buffer mode tests', () => {
    it('should pass a file', done => {
        const file = loadFile('./fixtures/pass.pug');
        const transform = gulpPug();
        transform.write(file);
        transform.end();

        transform.once('data', file => {
            expect(file.isBuffer()).to.be.true;
            done();
        });
    });

    it('should fail a file', done => {
        const file = loadFile('./fixtures/fail.pug');
        const transform = gulpPug();
        transform.write(file);
        transform.end();

        transform.once('error', err => {
            expect(err.message).to.equal('Failed with 1 errors');
            done();
        });
    });

    it('should pass a failing file with failOnError: false', done => {
        const file = loadFile('./fixtures/fail.pug');
        const transform = gulpPug({failOnError: false});

        let sawData = false;

        transform.write(file);
        transform.end();

        transform.once('error', err => {
            expect(err).to.not.exist;
            done(err);
        });

        transform.once('data', file => {
            expect(file.isBuffer()).to.be.true;
            sawData = true;
        });

        transform.once('end', () => {
            expect(sawData).to.be.true;
            done();
        });
    });
});
