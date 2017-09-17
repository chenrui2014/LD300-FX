import { englishMessages } from '../lib';

import customChineseMessages from './zh';
import customEnglishMessages from './en';

export default {
    zh: { ...englishMessages, ...customChineseMessages },
    en: { ...englishMessages, ...customEnglishMessages },
};
