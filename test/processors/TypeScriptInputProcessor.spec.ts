import * as fs from 'fs';
import * as path from 'path';
import { CommonModel } from '../../src/models';
import { TypeScriptInputProcessor } from '../../src/processors';

const baseFile = fs.readFileSync(path.resolve(__dirname, './TypeScriptInputProcessor/index.ts'), 'utf8');

jest.mock('../../src/interpreter/Interpreter');
jest.mock('../../src/interpreter/PostInterpreter');
jest.mock('../../src/utils/LoggingInterface');

const mockedReturnModels = [new CommonModel()];
jest.mock('../../src/interpreter/Interpreter', () => {
  return {
    Interpreter: jest.fn().mockImplementation(() => {
      return {
        interpret: jest.fn().mockImplementation(() => {return mockedReturnModels[0];})
      };
    })
  };
});
jest.mock('../../src/interpreter/PostInterpreter', () => {
  return {
    postInterpretModel: jest.fn().mockImplementation(() => {return mockedReturnModels;})
  };
});

describe('TypeScriptInputProcessor', () => {
  describe('shouldProcess()', () => {
    test('should throw error for empty input', async () => {
      const processsor = new TypeScriptInputProcessor();
      await expect(processsor.process({})).rejects.toThrow('Input is not of the valid file format');
    });

    test('should process input', async () => {
      const processsor = new TypeScriptInputProcessor();
      const commonModel = await processsor.process({ baseFile });
      expect(commonModel).toMatchSnapshot();
    });
  });
  describe('process()', () => {
    test('should throw error when trying to process wrong input format', async () => {
      const processor = new TypeScriptInputProcessor();
      await expect(processor.process({}))
        .rejects
        .toThrowError('Input is not of the valid file format');
    });
    test('should be able to process input', async () => {
      const processsor = new TypeScriptInputProcessor();
      const commonModel = await processsor.process({ baseFile });
      expect(commonModel).toMatchSnapshot();
    });
  });
});

