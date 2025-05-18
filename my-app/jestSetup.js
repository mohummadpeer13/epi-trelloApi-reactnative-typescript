import '@testing-library/jest-native/extend-expect';
import { expect } from '@jest/globals';

jest.mock('@react-native-async-storage/async-storage', () => require('./__mocks__/AsyncStorage'));
