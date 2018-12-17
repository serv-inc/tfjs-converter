/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as tf from '@tensorflow/tfjs-core';
import {expectArraysClose} from '@tensorflow/tfjs-core/dist/test_util';
import {murmur3} from 'murmurhash-js';

import {StringProjectionOp} from './string_projection_op';

let op: StringProjectionOp;
describe('StringProjectionOp', () => {
  beforeEach(() => {
    op = new StringProjectionOp();
  });
  it('should initialize', () => {
    console.log(new Int32Array([murmur3('this is a test')])[0]);
    console.log(new Int32Array([murmur3('not really a test')])[0]);
    expect(op).toBeDefined();
  });

  it('should generate dense projection', () => {
    const hash = tf.tensor2d(
        [0.123, 0.456, -0.321, 1.234, 5.678, -4.321], [3, 2], 'float32');
    const input = tf.tensor1d(
        ['hello world abc def ghi', 'hello world abc def ghi1'], 'string');
    const output =
        op.compute(input, hash, 'dense', 2, 1, true, true, false, true);

    // First checks dimensions.
    expect(output.rank).toEqual(2);
    expect(output.shape).toEqual([2, 6]);
    console.log(output.dataSync());
    expectArraysClose(output, [0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1]);
  });

  it('should generate sparse projection', () => {
    const hash = tf.tensor2d(
        [0.123, 0.456, -0.321, 1.234, 5.678, -4.321], [3, 2], 'float32');
    const input = tf.tensor1d(
        ['hello world abc def ghi', 'hello world abc def ghi1'], 'string');
    const output =
        op.compute(input, hash, 'sparse', 2, 1, true, true, false, true);

    // First checks dimensions.
    expect(output.rank).toEqual(2);
    expect(output.shape).toEqual([2, 3]);
    console.log(output.dataSync());
    expectArraysClose(output, [0, 7, 9, 0, 7, 9]);
  });

  it('should generate sparseDense projection', () => {
    const hash = tf.tensor2d(
        [0.123, 0.456, -0.321, 1.234, 5.678, -4.321], [3, 2], 'float32');
    const input = tf.tensor1d(
        ['hello world abc def ghi', 'hello world abc def ghi1'], 'string');
    const output =
        op.compute(input, hash, 'sparse_dense', 2, 1, true, true, false, true);

    // First checks dimensions.
    expect(output.rank).toEqual(2);
    expect(output.shape).toEqual([2, 6]);
    console.log(output.dataSync());
    expectArraysClose(output, [1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0]);
  });
});
